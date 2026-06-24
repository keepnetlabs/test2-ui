/**
 * Helpers for the preview-side "fix domain" action (the wand shown next to the
 * blocklist warning on the Scenarios / Campaign scenarios previews).
 *
 * The domain of a phishing landing page lives on the landing page TEMPLATE, so the
 * only way to change it from a preview — without a backend change — is to update the
 * template itself via `updateLandingPage()`. That endpoint expects the full entity,
 * and `NewLandingPage.vue` reshapes the fetched entity into that payload as part of a
 * large, stateful editor flow. We can't reuse that flow from a preview, so this module
 * reproduces the *minimal* part of it needed for a domain-only change, as pure,
 * unit-testable functions.
 *
 * IMPORTANT: this swaps the domain and writes every other field back verbatim
 * (faithful round-trip). Whether the backend accepts its own GET shape on PUT must be
 * verified against a running environment before relying on it.
 */
import { getAvailableForValues, getAvailableForValueFromList } from '@/utils/helperFunctions'

/**
 * Map the raw `domainRecords` from `getLandingPageFormDetails()` into the
 * `{ value, text, extraDatas }` shape the ranking brain and selects expect.
 * Mirrors the mapping in LandingPageList.vue so the candidate pool is identical.
 * @param {Array<Object>} rawDomainRecords
 * @returns {Array<{ value: string, text: string, extraDatas: Array }>}
 */
export function mapDomainFormRecords(rawDomainRecords = []) {
  if (!Array.isArray(rawDomainRecords)) return []
  return rawDomainRecords.map((item) => ({
    text: item.domain,
    value: item.id != null ? item.id.toString() : '',
    extraDatas: [
      {
        text: item.urlSchemaType,
        value: item.urlSchemaTypeId != null ? item.urlSchemaTypeId.toString() : ''
      },
      { text: item.isStopBotActivity, value: item.isStopBotActivity }
    ]
  }))
}

/**
 * Build the `updateLandingPage()` payload from a freshly fetched landing page template
 * entity, changing ONLY the domain. Mirrors NewLandingPage's save transform:
 *  - flattens the nested `phishingLink` object up to top level (PUT uses flat fields);
 *  - sets the top-level `domainRecordId` to the chosen clean domain;
 *  - aligns `urlSchemaTypeId` to the chosen domain's own schema when it is single-protocol
 *    (so the rebuilt urlTemplate stays valid), otherwise keeps the template's schema;
 *  - re-derives `availableForRequests` from `availableForList` via the shared helpers
 *    (so the "available for" setting is preserved, not wiped);
 *  - keeps `landingPages` and every other field exactly as the backend returned them.
 *
 * Pure and side-effect free.
 *
 * @param {Object} entity  `response.data.data` from `getLandingPageTemplate(id)`
 * @param {string|number} newDomainRecordId  chosen clean domain's value (id)
 * @param {{ value?: string|number, text?: string }} [domainSchema]  chosen domain's
 *   schema descriptor (the record's `extraDatas[0]`)
 * @returns {Object} payload for `updateLandingPage(payload, id)`
 */
export function buildDomainChangePayload(entity, newDomainRecordId, domainSchema = {}) {
  // Spread the nested phishingLink AFTER the base entity so its values win — matching
  // NewLandingPage, which prefers `data.phishingLink.*` over the top-level fields.
  const nested =
    entity && entity.phishingLink && typeof entity.phishingLink === 'object'
      ? entity.phishingLink
      : {}
  const payload = { ...(entity || {}), ...nested }
  delete payload.phishingLink

  payload.domainRecordId = String(newDomainRecordId)

  const schemaValue = domainSchema && domainSchema.value
  const schemaText =
    domainSchema && domainSchema.text ? String(domainSchema.text).toLowerCase() : ''
  if (schemaValue && schemaText && schemaText !== 'both') {
    payload.urlSchemaTypeId = String(schemaValue)
  }

  if ('availableForList' in payload) {
    payload.availableForRequests = getAvailableForValues(
      getAvailableForValueFromList(payload.availableForList)
    )
    delete payload.availableForList
  }

  return payload
}
