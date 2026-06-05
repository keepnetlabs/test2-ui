import { getAllDomainBlocklistStatuses, getDomainBlocklistStatus } from '@/api/domainBlocklist'
import { rankDomains, buildBlocklistStatusMap } from '@/utils/randomDomain'
import { mapDomainFormRecords, buildDomainChangePayload } from '@/utils/landingPageDomainPayload'

const RISKY_STATUSES = ['malicious', 'suspicious']
const SUCCESS_NOTE = 'clean domain selected'

/**
 * "Fix domain" wand for the Scenarios / Campaign scenarios previews.
 *
 * Unlike `domainSuggest` (which drives an in-form domain <select>), here the domain is
 * read-only preview text baked into the selected landing page TEMPLATE. So one click:
 *   1. loads the domain pool (Settings > Domains) via form-details,
 *   2. ranks it for the page content and skips blacklisted domains (shared brain),
 *   3. fetches the template entity, swaps in the clean domain, and PUTs it back
 *      (`updateLandingPage`) — a GLOBAL change that fixes the domain everywhere the
 *      template is used,
 *   4. asks the host to refresh its preview + blocklist check.
 *
 * Host component contract (override these):
 *   - `domainFixResourceId` (computed): the landing page template resourceId to fix.
 *   - `domainFixContentText` (computed, optional): content for semantic ranking.
 *   - `refreshAfterDomainFix()` (method): re-fetch preview / re-run the blocklist check.
 */
export default {
  data() {
    return {
      domainFix: {
        domainRecords: null, // cached pool (fetched once)
        statusMap: null, // cached blocklist statuses (fetched once)
        cursor: -1,
        message: '',
        isLoading: false
      }
    }
  },
  computed: {
    // Host MUST override with the template resourceId; null disables the wand.
    domainFixResourceId() {
      return null
    },
    // Host MAY override with free-form content used to rank domains by semantic fit.
    domainFixContentText() {
      return ''
    },
    isDomainFixDisabled() {
      return !this.domainFixResourceId
    },
    domainFixIcon() {
      if (this.isDomainFixDisabled) return ''
      return this.domainFix.isLoading ? 'mdi-loading' : 'mdi-auto-fix'
    },
    domainFixNote() {
      // A prior fix's "clean domain selected" confirmation is only valid while the domain
      // is actually clean. If the preview currently shows a blocklist warning (e.g. the user
      // re-edited the template back to a malicious domain), the note is stale/contradictory —
      // hide it reactively. `blocklistWarning` is the shared host data for these surfaces.
      if (this.blocklistWarning) return ''
      return this.domainFix.message
    },
    // A green check on the success/confirmation line only — the wand stays on the
    // clickable action link; error/empty notes get no icon.
    domainFixNoteIcon() {
      if (this.blocklistWarning) return ''
      return this.domainFix.message === SUCCESS_NOTE ? 'mdi-check-circle' : ''
    }
  },
  watch: {
    domainFixResourceId() {
      // Previewing a different template → restart the cycle and drop any stale note.
      // The pool / blocklist caches are global and intentionally kept.
      this.domainFix.cursor = -1
      this.domainFix.message = ''
    }
  },
  methods: {
    // Host MAY override to refresh preview + re-run blocklist check after a fix.
    refreshAfterDomainFix() {},
    async fixDomain() {
      const s = this.domainFix
      if (this.isDomainFixDisabled || s.isLoading) return
      s.isLoading = true
      try {
        // Lazy-loaded so this mixin's module graph stays free of the Vuex store
        // (landingPage API → testRequest → store), which keeps it light to import in tests.
        const {
          getLandingPageFormDetails,
          getLandingPageTemplate,
          updateLandingPage
        } = await import('@/api/landingPage')

        if (s.domainRecords == null) {
          try {
            const res = await getLandingPageFormDetails()
            s.domainRecords = mapDomainFormRecords(res?.data?.data?.domainRecords)
          } catch (e) {
            s.domainRecords = []
          }
        }
        if (!s.domainRecords.length) {
          s.message = 'No domain available'
          return
        }

        if (s.statusMap == null) {
          try {
            const res = await getAllDomainBlocklistStatuses()
            s.statusMap = buildBlocklistStatusMap(res?.data?.domains)
          } catch (e) {
            // Blocklist service down → rank without bulk exclusions; the per-domain
            // verify below still skips anything risky.
            s.statusMap = {}
          }
        }

        const pick = await this.resolveSafeDomainFixPick()
        if (!pick) {
          s.message = 'No eligible (non-blacklisted) domain available'
          return
        }

        const id = this.domainFixResourceId
        const entityRes = await getLandingPageTemplate(id)
        const entity = entityRes && entityRes.data && entityRes.data.data
        const schema = pick.extraDatas && pick.extraDatas[0]
        const payload = buildDomainChangePayload(entity, pick.value, schema)
        // silent: our inline "clean domain selected" note is the confirmation; the global
        // success snackbar would otherwise stack behind the preview drawer.
        const updRes = await updateLandingPage(payload, id, { silent: true })

        // Read the rebuilt urlTemplate so the preview can refresh immediately. Prefer the
        // PUT response; fall back to a fresh GET if it didn't echo the updated entity.
        let newUrlTemplate = (updRes && updRes.data && updRes.data.data && updRes.data.data.urlTemplate) || ''
        if (!newUrlTemplate) {
          try {
            const fresh = await getLandingPageTemplate(id)
            newUrlTemplate = (fresh && fresh.data && fresh.data.data && fresh.data.data.urlTemplate) || ''
          } catch (e) {
            newUrlTemplate = ''
          }
        }

        s.message = SUCCESS_NOTE
        this.refreshAfterDomainFix({ urlTemplate: newUrlTemplate, pick })
      } catch (e) {
        // updateLandingPage surfaces its own error snackbar; just clear the note.
        s.message = ''
      } finally {
        s.isLoading = false
      }
    },
    /**
     * Rank → pick by cursor → verify the pick against the authoritative per-domain check.
     * Mirrors domainSuggest.resolveSafePick so a risky domain missing from the bulk list
     * is recorded and skipped. Returns the candidate enriched with its pool `extraDatas`
     * (schema) so the payload can align urlSchemaTypeId, or null when nothing is eligible.
     */
    async resolveSafeDomainFixPick() {
      const s = this.domainFix
      for (let attempt = 0; attempt < s.domainRecords.length; attempt++) {
        const { candidates } = rankDomains({
          domainRecords: s.domainRecords,
          contentText: this.domainFixContentText,
          statusMap: s.statusMap
        })
        if (!candidates.length) return null

        s.cursor = (s.cursor + 1) % candidates.length
        const candidate = candidates[s.cursor]

        const key = String(candidate.text).toLowerCase()
        if (s.statusMap[key] === undefined) {
          s.statusMap[key] = await this.verifyDomainFixStatus(candidate.text)
          if (RISKY_STATUSES.includes(s.statusMap[key])) {
            s.cursor = -1 // excluded now → re-rank and try the next best
            continue
          }
        }

        const record = s.domainRecords.find((d) => String(d.value) === String(candidate.value))
        return { ...candidate, extraDatas: record && record.extraDatas }
      }
      return null
    },
    async verifyDomainFixStatus(domainName) {
      try {
        const res = await getDomainBlocklistStatus(domainName)
        return (res && res.data && res.data.status) || 'clean'
      } catch (e) {
        return 'clean'
      }
    }
  }
}
