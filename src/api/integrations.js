import testRequest from '../utils/testRequest'
const API_URL = 'analysis-engines'
export function getIntegrationList(payload) {
  return testRequest.post(`${API_URL}/search`, payload)
}

export function exportReportedEmails(payload) {
  return testRequest.post(`${API_URL}`, payload)
}

export function getIntegrationTypes() {
  return testRequest.get(`analysis-engines/types`)
}

export function getFileTypes() {
  return testRequest.get('lookups/8')
}

export function createIntegration(payload) {
  return testRequest.post(`${API_URL}`, payload)
}

export function disableIntegration(id) {
  return testRequest.put(`${API_URL}/${id}/disable`)
}

export function deleteIntegration(id) {
  return testRequest.delete(`${API_URL}/${id}`)
}

export function getIntegrationDetails(id) {
  return testRequest.get(`${API_URL}/${id}`)
}

export function updateIntegration(id, payload) {
  return testRequest.put(`${API_URL}/${id}`, payload)
}

export function searchNotifiedMail(payload) {
  return testRequest.post(`notified-email/search`, payload)
}
