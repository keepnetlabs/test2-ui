import { getAllDomainBlocklistStatuses } from '@/api/domainBlocklist'
import { rankDomains, buildBlocklistStatusMap } from '@/utils/randomDomain'

/**
 * "Suggest domain" behavior for the phishing-link inputs.
 *
 * Drives a single in-field icon (rendered via the domain select's `append-outer-icon`):
 * one click auto-selects the best content-matching, non-blacklisted domain; each further
 * click cycles to the next-best option. A short reason note ("matched: …" / "N risky skipped")
 * keeps the choice transparent without any popup — the full pool stays in the native dropdown.
 *
 * Host component requirements: a `domainRecords` array, a `contentText` string, and a
 * `handleChangeDomainRecord(value)` method (the same handler a manual dropdown pick calls).
 */
export default {
  data() {
    return {
      domainSuggest: {
        statusMap: null, // cached blocklist statuses (fetched once per pool)
        candidates: [],
        excludedCount: 0,
        appliedValue: null,
        cursor: -1,
        message: '',
        isLoading: false
      }
    }
  },
  computed: {
    isDomainSuggestDisabled() {
      return !this.domainRecords || !this.domainRecords.length
    },
    domainSuggestIcon() {
      if (this.isDomainSuggestDisabled) return ''
      return this.domainSuggest.isLoading ? 'mdi-loading' : 'mdi-auto-fix'
    },
    domainSuggestNote() {
      return this.domainSuggest.message
    }
  },
  watch: {
    domainRecords() {
      // New pool → drop cached statuses and any prior suggestion.
      this.resetDomainSuggest(true)
    },
    contentText() {
      // Content changed → next click should re-rank from the best match again.
      this.domainSuggest.cursor = -1
    }
  },
  methods: {
    resetDomainSuggest(dropStatus = false) {
      const s = this.domainSuggest
      if (dropStatus) s.statusMap = null
      s.candidates = []
      s.excludedCount = 0
      s.appliedValue = null
      s.cursor = -1
      s.message = ''
    },
    async suggestDomain() {
      const s = this.domainSuggest
      if (this.isDomainSuggestDisabled || s.isLoading) return
      s.isLoading = true
      try {
        if (s.statusMap == null) {
          try {
            const response = await getAllDomainBlocklistStatuses()
            s.statusMap = buildBlocklistStatusMap(response?.data?.domains)
          } catch (e) {
            // Blocklist service unreachable — rank without exclusions; the per-domain check
            // on selection still flags a risky pick, so nothing slips through unannounced.
            s.statusMap = {}
          }
        }
        const { candidates, excludedCount } = rankDomains({
          domainRecords: this.domainRecords,
          contentText: this.contentText,
          statusMap: s.statusMap
        })
        s.candidates = candidates
        s.excludedCount = excludedCount

        if (!candidates.length) {
          s.appliedValue = null
          s.cursor = -1
          s.message = 'No eligible (non-blacklisted) domain available'
          return
        }

        s.cursor = (s.cursor + 1) % candidates.length
        let pick = candidates[s.cursor]

        // No content match → it's a "give me a (different) clean domain" action: if we'd land on
        // the already-selected domain and alternatives exist, step once more so the click visibly
        // does something. (For a real content match we keep the best, even if already selected.)
        const noContentMatch = candidates[0].score === 0
        const current = this.value && this.value.domainRecordId
        if (noContentMatch && candidates.length > 1 && String(pick.value) === String(current)) {
          s.cursor = (s.cursor + 1) % candidates.length
          pick = candidates[s.cursor]
        }

        s.appliedValue = pick.value
        s.message = this.buildDomainSuggestMessage(pick)
        this.handleChangeDomainRecord(pick.value)
      } finally {
        s.isLoading = false
      }
    },
    buildDomainSuggestMessage(pick) {
      // Always give a short confirmation so a click never feels like a no-op, plus the
      // trust signal of how many risky domains were skipped.
      const parts = []
      parts.push(
        pick.matchedKeywords.length
          ? `matched: ${pick.matchedKeywords.slice(0, 3).join(', ')}`
          : 'random clean domain'
      )
      if (this.domainSuggest.excludedCount) {
        parts.push(`${this.domainSuggest.excludedCount} risky skipped`)
      }
      return parts.join(' · ')
    }
  }
}
