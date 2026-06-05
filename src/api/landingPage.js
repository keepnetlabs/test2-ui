import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function updateLandingPage(payload, id, { silent = false } = {}) {
  // `silent` omits the global success snackbar (e.g. the preview "fix domain" wand, which
  // shows its own inline note and would otherwise stack a snackbar under the drawer).
  // Error snackbars still surface regardless.
  return testRequest.put(`phishing-simulator/landing-page-template/${id}`, payload, {
    snackbar: silent ? undefined : COMMON_SNACKBAR
  })
}

export function createLandingPage(payload) {
  return testRequest.post(`phishing-simulator/landing-page-template`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getLandingPageTemplatePreviewContent(id) {
  return testRequest.get(`phishing-simulator/landing-page-template/${id}`)
}

export function getCampaignManagerLandingPageTemplatePreviewContent(
  id = '',
  campaignResourceId = '',
  instanceGroup = ''
) {
  return testRequest.get(
    `phishing-simulator/phishing-campaign-job-report/summary/${campaignResourceId}/${instanceGroup}/landing-page-template/${id}`
  )
}

export function getLandingPageFormDetails() {
  return testRequest.get(`phishing-simulator/landing-page-template/form-details`)
}

export function getLandingPageList(payload) {
  return testRequest.post(`phishing-simulator/landing-page-template/search`, payload)
}

export function exportLandingPage(payload) {
  return testRequest.post(`phishing-simulator/landing-page-template/search/export`, payload, {
    responseType: 'blob'
  })
}

export function deleteLandingPage(id) {
  return testRequest.delete(`phishing-simulator/landing-page-template/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function bulkDeleteLandingPages(payload) {
  return testRequest.delete(`phishing-simulator/landing-page-template/bulk-delete`, {
    snackbar: COMMON_SNACKBAR,
    data: payload
  })
}

export function getLandingPageTemplate(id) {
  return testRequest.get(`phishing-simulator/landing-page-template/${id}`)
}

export function generateLandingPageTranslation(payload) {
  return testRequest.post(`phishing-simulator/landing-page-template/translate-content`, payload)
}

export function getLandingPageTranslation(temporaryKey) {
  return testRequest.get(
    `phishing-simulator/landing-page-template/translated-content/${temporaryKey}`
  )
}
