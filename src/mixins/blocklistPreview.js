import { getDomainBlocklistStatus } from '@/api/domainBlocklist'

/**
 * Shared "is this landing-page domain blacklisted?" check for the read-only PREVIEW surfaces
 * (Scenarios / Campaign scenarios / scenario wizard) across all simulators.
 *
 * Extracts the duplicated logic that used to live inline in each phishing preview component:
 * the `blocklistWarning` state, the domain parse, the worker call, and the warning text. The
 * host calls `checkBlocklist(url)` on mount and whenever its displayed URL changes; the URL
 * source differs per surface (`phishingUrl` prop / `templateURL` / `landingPageParams.urlTemplate`),
 * so it is passed in rather than read here.
 *
 * Pairs with the `domainTemplateFix` mixin, which renders the "Suggest clean domain" wand in
 * the warning bar and clears `blocklistWarning` after a successful fix.
 */
export default {
  data() {
    return {
      blocklistWarning: null
    }
  },
  computed: {
    blocklistWarningText() {
      if (!this.blocklistWarning) return ''
      // The worker may omit `reason` for some verdicts — don't render the literal "undefined".
      const reason = this.blocklistWarning.reason
      const prefix = reason ? `${reason} ` : ''
      return `${prefix}Please use a clean domain before sending.`
    }
  },
  methods: {
    extractBlocklistDomain(url) {
      if (!url) return null
      try {
        const fullUrl = url.startsWith('http') ? url : 'https://' + url
        return new URL(fullUrl).hostname.replace(/^www\./, '')
      } catch {
        return null
      }
    },
    /**
     * Re-run the blocklist check for `url`. Clears any prior warning first, then flags the
     * domain only when the worker reports it malicious/suspicious. Network/parse failures are
     * swallowed (no warning) — the check is advisory, never blocking.
     */
    checkBlocklist(url) {
      this.blocklistWarning = null
      const domain = this.extractBlocklistDomain(url)
      if (!domain) return Promise.resolve()
      // Returned (not awaited by callers) so it stays fire-and-forget in components yet
      // remains awaitable in tests.
      return getDomainBlocklistStatus(domain)
        .then((response) => {
          const data = response && response.data
          if (data && (data.status === 'malicious' || data.status === 'suspicious')) {
            this.blocklistWarning = { status: data.status, reason: data.reason }
          }
        })
        .catch(() => {})
    }
  }
}
