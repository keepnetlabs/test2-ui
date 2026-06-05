/**
 * Random Domain selector — the shared "brain" behind the "Random Domain" feature
 * on landing pages (Phishing / Smishing / Quishing).
 *
 * Responsibilities (pure, no network calls):
 *  - Exclude blacklisted / reputation-risk domains (status `malicious` or `suspicious`).
 *  - Score the remaining domains for semantic fit against the landing page content
 *    (brand / industry / login theme keywords extracted from name, description, tags, HTML).
 *  - Pick the best fit; ties are broken randomly so repeated clicks feel "random"
 *    yet stay content-aware. With no content, falls back to a pure random clean pick.
 *
 * The blocklist status data is fetched by the caller (component) via
 * `getAllDomainBlocklistStatuses()` and passed in as a status map, keeping this
 * module side-effect free and unit-testable.
 *
 * NOTE (v1): selection is rule-based, not LLM-backed. The semantic step can later be
 * swapped for an `agentic-ally-agent` tool behind the same `rankDomains` API
 * without touching the components.
 */

// Domain statuses that must never be auto-selected (AC: blacklist / reputation risk).
export const EXCLUDED_BLOCKLIST_STATUSES = ['malicious', 'suspicious']

// Common TLDs / second-level suffixes dropped from domain tokens so they don't pollute scoring.
const TLD_STOPWORDS = new Set([
  'com', 'net', 'org', 'io', 'co', 'me', 'info', 'biz', 'app', 'dev', 'online',
  'site', 'xyz', 'tech', 'cloud', 'live', 'us', 'uk', 'eu', 'de', 'fr', 'tr',
  'gov', 'edu', 'www'
])

// Low-signal words (EN + TR) excluded from content keywords.
const CONTENT_STOPWORDS = new Set([
  // English
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'your', 'with', 'this', 'that',
  'from', 'have', 'has', 'was', 'will', 'can', 'all', 'our', 'their', 'his', 'her',
  'please', 'here', 'click', 'login', 'log', 'page', 'email', 'mail', 'account',
  'user', 'name', 'password', 'sign', 'href', 'http', 'https', 'www', 'html', 'body',
  'div', 'span', 'style', 'class', 'src', 'img', 'link', 'button', 'submit', 'form',
  // Turkish
  've', 'ile', 'bir', 'bu', 'için', 'icin', 'gibi', 'daha', 'çok', 'cok', 'ama',
  'veya', 'ya', 'da', 'de', 'mi', 'sayfa', 'giriş', 'giris', 'tıkla', 'tikla',
  'hesap', 'parola', 'şifre', 'sifre', 'kullanıcı', 'kullanici', 'eposta'
])

const MIN_TOKEN_LENGTH = 3

/**
 * Build a `{ domainName: status }` lookup from the blocklist worker response payload.
 * @param {Array<{domain: string, status: string}>} domains
 * @returns {Record<string, string>}
 */
export function buildBlocklistStatusMap(domains) {
  const map = {}
  if (!Array.isArray(domains)) return map
  for (const entry of domains) {
    if (entry && typeof entry.domain === 'string') {
      map[entry.domain.toLowerCase()] = entry.status
    }
  }
  return map
}

/**
 * Extract lowercase keyword tokens from free-form landing page content.
 * Strips HTML tags/entities, splits on non-letter characters, drops stopwords and short tokens.
 * @param {string} text
 * @returns {string[]} unique keywords
 */
export function extractKeywords(text) {
  if (!text || typeof text !== 'string') return []
  const stripped = text
    .replace(/<[^>]*>/g, ' ') // remove HTML tags
    .replace(/&[a-z]+;/gi, ' ') // remove HTML entities (&nbsp; etc.)
    .toLowerCase()

  const seen = new Set()
  const keywords = []
  // Unicode-aware split: keep letters (incl. Turkish), digits separate them out.
  for (const raw of stripped.split(/[^a-zçğıöşü0-9]+/i)) {
    const token = raw.trim()
    if (token.length < MIN_TOKEN_LENGTH) continue
    if (/^\d+$/.test(token)) continue // skip pure numbers
    if (CONTENT_STOPWORDS.has(token)) continue
    if (seen.has(token)) continue
    seen.add(token)
    keywords.push(token)
  }
  return keywords
}

/**
 * Tokenize a domain name into meaningful parts (drops protocol, TLD, separators).
 * "secure-login.acme-bank.com" -> ["secure", "login", "acme", "bank"]
 * @param {string} domainName
 * @returns {string[]}
 */
export function tokenizeDomain(domainName) {
  if (!domainName || typeof domainName !== 'string') return []
  return domainName
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '') // strip protocol if present
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length >= 2 && !TLD_STOPWORDS.has(token))
}

/**
 * Semantic-fit score between a domain and a set of content keywords.
 * Exact token match weighs more than a partial (substring) match.
 * @param {string} domainName
 * @param {string[]} keywords
 * @returns {{ score: number, matched: string[] }}
 */
export function scoreDomain(domainName, keywords) {
  const tokens = tokenizeDomain(domainName)
  if (!tokens.length || !keywords.length) return { score: 0, matched: [] }

  let score = 0
  const matched = []
  for (const keyword of keywords) {
    let best = 0
    for (const token of tokens) {
      if (token === keyword) {
        best = Math.max(best, 3)
      } else if (token.includes(keyword) || keyword.includes(token)) {
        best = Math.max(best, 1)
      }
    }
    if (best > 0) score += best
    // Only surface whole-word matches as "matched" — loose substring hits ("line", "ine")
    // still help ranking but are too noisy to show the user.
    if (best === 3) matched.push(keyword)
  }
  return { score, matched }
}

/**
 * Whether a domain record is eligible for auto-selection given the blocklist status map.
 * Unknown status (domain not in map) is treated as eligible — the component's existing
 * per-domain blocklist check still warns the user after selection.
 * @param {{ text?: string }} domainRecord
 * @param {Record<string, string>} statusMap
 * @returns {boolean}
 */
export function isDomainEligible(domainRecord, statusMap = {}) {
  const name = domainRecord?.text
  if (!name) return false
  const status = statusMap[String(name).toLowerCase()]
  return !EXCLUDED_BLOCKLIST_STATUSES.includes(status)
}

/**
 * Build the free-form content string fed to `rankDomains` from landing page fields.
 * Shared by the Phishing/Smishing/Quishing create-edit forms so the keyword source stays consistent.
 * @param {Object} fields
 * @param {string} [fields.name]
 * @param {string} [fields.description]
 * @param {string[]} [fields.tags]
 * @param {Array<{ content?: string }>} [fields.landingPages]
 * @returns {string}
 */
export function buildContentText({ name, description, tags, landingPages } = {}) {
  const pageContent = (landingPages || []).map((page) => page?.content || '').join(' ')
  return [name, description, (tags || []).join(' '), pageContent].filter(Boolean).join(' ')
}

/**
 * Rank the domain pool for semantic fit, after excluding blacklisted / reputation-risk domains.
 * Candidates are sorted best-fit first; equal-score order follows the input pool order (stable).
 *
 * @param {Object} params
 * @param {Array<{ value: string, text: string }>} params.domainRecords  Domain pool (Settings > Domains).
 * @param {string} [params.contentText]  Landing page content (name + description + tags + HTML).
 * @param {Record<string, string>} [params.statusMap]  domainName -> blocklist status.
 * @returns {{ candidates: Array<{ value: string, text: string, score: number, matchedKeywords: string[] }>, excludedCount: number }}
 */
export function rankDomains({ domainRecords = [], contentText = '', statusMap = {} } = {}) {
  const keywords = extractKeywords(contentText)
  const candidates = []
  let excludedCount = 0

  for (const record of domainRecords) {
    if (!isDomainEligible(record, statusMap)) {
      excludedCount++
      continue
    }
    const { score, matched } = scoreDomain(record.text, keywords)
    candidates.push({ value: record.value, text: record.text, score, matchedKeywords: matched })
  }

  // Stable sort by score desc; ties keep pool order (Array#sort is stable in supported engines).
  candidates.sort((a, b) => b.score - a.score)

  return { candidates, excludedCount }
}
