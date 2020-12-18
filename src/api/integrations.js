import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const API_URL = 'analysis-engines'
export function getIntegrationList(payload) {
  return testRequest.post(`${API_URL}/search`, payload)
}

export function exportReportedEmails(payload) {
  return testRequest.post(`${API_URL}/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getIntegrationTypes() {
  return testRequest.get(`analysis-engines/types`)
}

export function getFileTypes() {
  return testRequest.get('lookups/8')
}

export function createIntegration(payload) {
  return testRequest.post(`${API_URL}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function disableIntegration(id) {
  return testRequest.put(`${API_URL}/${id}/disable`, null, {
    snackbar: COMMON_SNACKBAR
  })
}

export function enableIntegration(id) {
  return testRequest.put(`${API_URL}/${id}/enable`, null, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteIntegration(id) {
  return testRequest.delete(`${API_URL}/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getIntegrationDetails(id) {
  return testRequest.get(`${API_URL}/${id}`)
}

export function updateIntegration(id, payload) {
  return testRequest.put(`${API_URL}/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function testAnalysis(id, apiKey) {
  return testRequest.put(`/analysis-engines-types/${id}/test-connection/${apiKey}`)
}

export function searchNotifiedMail(payload) {
  return testRequest.post(`notified-emails/search`, payload)
}
