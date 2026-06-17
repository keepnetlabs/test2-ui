import { isTestEnvironment } from '@/utils/isTestEnvironment'

/**
 * Tenants allowlisted to see Incident Responder AI analysis fields even without
 * the Agentic AI license.
 *
 * @deprecated Temporary fallback that predates the backend
 * `hasAgenticAILicense` flag. Once every AI-enabled tenant is provisioned with
 * the license, delete this list (and {@link isAllowedByLegacyFallback}) and
 * gate `showAIAnalyze` on the license alone.
 */
export const AI_ANALYZE_COMPANIES = [
  'Bolearis',
  'TIP Group',
  'Sunexpress',
  'ETİ',
  'Axa Sigorta',
  'Vodafone TR',
  'System',
  'Aksigorta',
  'Sahibinden',
  'BDO UK',
  'KITH',
  'Keepnet Labs LTS',
  'Binalyze'
]

/** @deprecated Part of the legacy allowlist fallback. See {@link AI_ANALYZE_COMPANIES}. */
const TURKEY_COUNTRY_NAMES = ['turkey', 'türkiye', 'turkiye']
/** @deprecated Part of the legacy allowlist fallback. See {@link AI_ANALYZE_COMPANIES}. */
const TURKEY_COUNTRY_CODES = ['tr', 'tur', 'tr-tr']

/**
 * Legacy, non-license-based gate for AI analysis fields. Kept until the
 * Agentic AI license fully covers every AI-enabled tenant.
 *
 * @deprecated See {@link AI_ANALYZE_COMPANIES}.
 * @param {object} store - Vuex store.
 * @returns {boolean}
 */
function isAllowedByLegacyFallback(store) {
  if (isTestEnvironment()) return true

  const companyName = store.state.auth.selectedCompanyName || ''
  const isAllowedCompany = AI_ANALYZE_COMPANIES.some(
    (name) => name.toLowerCase() === companyName.toLowerCase()
  )
  if (isAllowedCompany) return true

  const company = store.state.dashboard?.selectedCompanyObject || {}
  const countryName = (company.countryName || '').toLowerCase()
  const countryCode = (company.countryCode || '').toLowerCase()
  return (
    TURKEY_COUNTRY_NAMES.includes(countryName) ||
    TURKEY_COUNTRY_CODES.includes(countryCode)
  )
}

/**
 * Mixin exposing a single `showAIAnalyze` computed that gates every Incident
 * Responder AI analysis field — the email details AI tab and the reported
 * emails AI columns.
 *
 * AI fields are shown when the tenant holds the Agentic AI license. Until that
 * license is fully rolled out, a deprecated allowlist fallback
 * ({@link isAllowedByLegacyFallback}) keeps a fixed set of tenants enabled.
 */
export default {
  computed: {
    /**
     * Whether the tenant holds the Agentic AI settings permission. This is the
     * hard gate for every AI analysis surface: without it no AI tab, column, or
     * data-driven fallback may appear, because the backend returns
     * `{ status: "NotAnalyzed" }` and the user cannot run analysis anyway.
     */
    hasAgenticAIPermission() {
      return !!this.$store.getters[
        'permissions/getAgenticAISettingsGetPermissions'
      ]
    },
    showAIAnalyze() {
      const store = this.$store
      // Temporary permission gate: without the Agentic AI permission the backend
      // returns `{ status: "NotAnalyzed" }`, yet the legacy company/country
      // fallback below would still surface the AI tab and its "Run AI Analysis"
      // screen — a dead end for users who can't actually run it. Require the
      // permission first. Legacy license/allowlist logic is kept intact.
      if (!this.hasAgenticAIPermission) return false

      const hasAgenticAILicense = !!store.getters['login/getHasAgenticAILicense']
      // Authoritative gate; the rest is a deprecated fallback to be removed
      // once the license covers every AI-enabled tenant.
      return hasAgenticAILicense || isAllowedByLegacyFallback(store)
    }
  }
}
