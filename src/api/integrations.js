import testRequest from '../utils/testRequest'
const API_URL = 'analysis-engines'
export function getIntegrationList(payload) {
  return testRequest.post(`${API_URL}/search`, payload)
}

export function getRunningInvestigations() {
  return testRequest.get(`${API_URL}/running-investigations`)
}

export function exportInvestigationList(payload) {
  return testRequest.post(`investigations/search/export`, payload, {
    responseType: 'blob'
  })
}

export function searchNotifiedMail(payload) {
  return testRequest.post(`notified-email/search`, payload)
}
