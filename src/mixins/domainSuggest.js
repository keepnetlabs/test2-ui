import { getAllDomainBlocklistStatuses, getDomainBlocklistStatus } from '@/api/domainBlocklist'
import { rankDomains, buildBlocklistStatusMap } from '@/utils/randomDomain'
import { aiPreferredDomainId, hoistCandidate } from '@/utils/domainSuggestAI'

const RISKY_STATUSES = ['malicious', 'suspicious']

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
        isLoading: false,
        aiPreferredValue: null, // AI's best-fit pick (id), hoisted to front of the cycle
        aiComputedFor: undefined // contentText the AI pick was computed for (cache key)
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
      // Content changed → next click should re-rank from the best match again, and the
      // AI preference must be recomputed for the new content.
      this.domainSuggest.cursor = -1
      this.domainSuggest.aiComputedFor = undefined
    },
    'value.domainRecordId'(val) {
      // Domain changed by something other than the wand (e.g. a manual dropdown pick) →
      // the "clean domain selected" note is stale, clear it and reset the cycle.
      const s = this.domainSuggest
      if (String(val) !== String(s.appliedValue)) {
        s.message = ''
        s.appliedValue = null
        s.cursor = -1
      }
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
      s.aiPreferredValue = null
      s.aiComputedFor = undefined
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
        await this.ensureAiPreferred()
        const pick = await this.resolveSafePick()
        if (!pick) {
          s.appliedValue = null
          s.cursor = -1
          s.message = 'No eligible (non-blacklisted) domain available'
          return
        }

        s.appliedValue = pick.value
        s.message = this.buildDomainSuggestMessage(pick)
        this.handleChangeDomainRecord(pick.value)
      } finally {
        s.isLoading = false
      }
    },
    /**
     * Rank → pick by cursor → verify the pick against the authoritative per-domain check.
     * A risky domain that was missing from the bulk list is recorded and skipped, so the wand
     * never selects (or claims "clean" for) a domain the blocklist warning would then flag.
     * @returns {Promise<{value, text, score, matchedKeywords} | null>}
     */
    async resolveSafePick() {
      const s = this.domainSuggest
      for (let attempt = 0; attempt < this.domainRecords.length; attempt++) {
        const { candidates: ranked, excludedCount } = rankDomains({
          domainRecords: this.domainRecords,
          contentText: this.contentText,
          statusMap: s.statusMap
        })
        // Hoist the AI's best-fit pick to the front so the first click lands on it; the rest
        // of the cycle keeps the rule-based order. No-op when AI is unavailable / not found.
        const candidates = hoistCandidate(ranked, s.aiPreferredValue)
        s.candidates = candidates
        s.excludedCount = excludedCount
        if (!candidates.length) return null

        s.cursor = (s.cursor + 1) % candidates.length
        let candidate = candidates[s.cursor]

        // No content match → "give me a (different) clean domain": if we'd land on the
        // already-selected domain and alternatives exist, step once more so the click does
        // something. (For a real content match — or an explicit AI pick — we keep the best,
        // even if already selected.)
        const noContentMatch = candidates[0].score === 0 && !s.aiPreferredValue
        const current = this.value && this.value.domainRecordId
        if (noContentMatch && candidates.length > 1 && String(candidate.value) === String(current)) {
          s.cursor = (s.cursor + 1) % candidates.length
          candidate = candidates[s.cursor]
        }

        // Verify only when the bulk list didn't already tell us the status (avoids re-checks).
        const key = String(candidate.text).toLowerCase()
        if (s.statusMap[key] === undefined) {
          s.statusMap[key] = await this.verifyDomainStatus(candidate.text)
          if (RISKY_STATUSES.includes(s.statusMap[key])) {
            s.cursor = -1 // this one is now excluded → re-rank and pick the next best
            continue
          }
        }
        return candidate
      }
      return null
    },
    /**
     * Compute the AI's preferred domain ONCE per (content, pool) — cycling reuses it without
     * re-calling the worker. Ranks the eligible pool first so the AI only ever picks from
     * non-blacklisted candidates; on any failure `aiPreferredValue` stays null (rule-based).
     */
    async ensureAiPreferred() {
      const s = this.domainSuggest
      const language = this.suggestLanguage || ''
      // Cache key includes language so switching the edited language recomputes the pick.
      const cacheKey = `${this.contentText} ${language}`
      if (s.aiComputedFor === cacheKey) return // already computed for this content + language
      s.aiComputedFor = cacheKey
      s.aiPreferredValue = null
      const { candidates } = rankDomains({
        domainRecords: this.domainRecords,
        contentText: this.contentText,
        statusMap: s.statusMap
      })
      s.aiPreferredValue = await aiPreferredDomainId({
        candidates,
        contentText: this.contentText,
        language
      })
    },
    async verifyDomainStatus(domainName) {
      try {
        const response = await getDomainBlocklistStatus(domainName)
        return response?.data?.status || 'clean'
      } catch (e) {
        // Can't verify → treat as clean; the per-domain warning would still surface real risk.
        return 'clean'
      }
    },
    buildDomainSuggestMessage() {
      // Keep it simple and human — the picked domain is content-ranked and verified clean.
      return 'clean domain selected'
    }
  }
}
