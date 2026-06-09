import axios from 'axios'

/**
 * Client for the `domain-suggest-worker` (AI-assisted domain selection, gpt-oss-20b).
 * Mirrors `domainBlocklist.js`: a dedicated lightweight axios client to the Cloudflare
 * worker (no auth / no Vuex store / no global snackbars — it is not the main backend).
 */
const DOMAIN_SUGGEST_API_BASE =
  'https://domain-suggest-worker.keepnet-labs-ltd-business-profile4086.workers.dev'

// Short timeout: the wand must stay snappy; on any delay we fall back to rule-based ranking.
const suggestClient = axios.create({
  baseURL: DOMAIN_SUGGEST_API_BASE,
  timeout: 8000
})

/**
 * Ask the AI worker to pick the best-fitting domain id from `domains` for `signal`.
 * The worker only ever returns an id from the list we send (or null), so the result is
 * safe to use directly. Returns the chosen id as a string, or null on any failure —
 * callers MUST treat null as "fall back to rule-based ranking".
 *
 * @param {Object} args
 * @param {string} args.signal     Compact landing-page content summary (brand/industry/theme).
 * @param {Array<{id:string,name:string}>} args.domains  Non-blacklisted candidate pool.
 * @param {string} [args.language] Optional content language hint.
 * @returns {Promise<string|null>}
 */
export async function suggestDomainByContent({ signal, domains, language } = {}) {
  if (!Array.isArray(domains) || domains.length === 0) return null
  try {
    const res = await suggestClient.post('/suggest', {
      signal: signal || '',
      language: language || '',
      domains
    })
    const id = res?.data?.domainId
    return id != null ? String(id) : null
  } catch (e) {
    return null
  }
}
