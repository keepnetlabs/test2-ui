import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function updateLandingPage(payload, id) {
  return testRequest.put(`phishing-simulator/landing-page-template/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
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

export function getCampaignManagerLandingPageTemplatePreviewContent(id, jobResourceId) {
  return testRequest.get(
    `phishing-simulator/phishing-campaign-job-report/summary/${jobResourceId}/landing-page-template/${id}`
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

export function getLandingPageTemplate(id) {
  return testRequest.get(`phishing-simulator/landing-page-template/${id}`)
}
