import { suggestDomainByContent } from '@/api/domainSuggest'
import { htmlToText } from '@/utils/randomDomain'

// The worker should receive a compact, readable signal — not raw landing-page HTML (which it
// would just truncate to boilerplate). Strip tags/entities, collapse whitespace, cap length.
const MAX_SIGNAL_CHARS = 600
function distillSignal(contentText) {
  return htmlToText(contentText).replace(/\s+/g, ' ').trim().slice(0, MAX_SIGNAL_CHARS)
}

/**
 * AI-assisted ordering helpers, layered on top of the rule-based `rankDomains` brain.
 *
 * The AI worker only chooses the single best-fitting domain; the existing cursor cycling
 * and per-domain blocklist verification stay rule-based. So the integration is minimal:
 *   1. rule-rank the eligible (non-blacklisted) pool as today,
 *   2. ask the worker which of those fits the content best (`aiPreferredDomainId`),
 *   3. hoist that one to the front (`hoistCandidate`) so the wand's first pick is the AI's.
 * Any worker failure returns null / leaves the order untouched → pure rule-based fallback.
 */

/**
 * Ask the worker which candidate fits `contentText` best and return a VALIDATED id that is
 * present in `candidates`, or null to fall back to rule-based order. The worker already
 * validates its pick against the list we send; we re-check here too (defense in depth).
 *
 * @param {Object} args
 * @param {Array<{value:string|number, text:string}>} args.candidates  rule-ranked eligible pool
 * @param {string} args.contentText
 * @param {string} [args.language]
 * @returns {Promise<string|null>}
 */
export async function aiPreferredDomainId({ candidates, contentText, language } = {}) {
  if (!Array.isArray(candidates) || candidates.length <= 1) return null
  if (!contentText) return null
  const domains = candidates.map((c) => ({ id: String(c.value), name: c.text }))
  const aiId = await suggestDomainByContent({ signal: distillSignal(contentText), domains, language })
  if (!aiId) return null
  return candidates.some((c) => String(c.value) === String(aiId)) ? String(aiId) : null
}

/**
 * Return a copy of `candidates` with the entry whose value === `value` moved to the front.
 * No-op (returns the input) when value is null or already first / not found. Pure.
 *
 * @param {Array<{value:string|number}>} candidates
 * @param {string|number|null} value
 * @returns {Array}
 */
export function hoistCandidate(candidates, value) {
  if (!Array.isArray(candidates) || value == null) return candidates
  const idx = candidates.findIndex((c) => String(c.value) === String(value))
  if (idx <= 0) return candidates
  const copy = candidates.slice()
  const [pick] = copy.splice(idx, 1)
  copy.unshift(pick)
  return copy
}
