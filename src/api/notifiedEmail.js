import testRequest from '../utils/testRequest'
const API_URL = 'notified-emails'
export function getNotifiedEmail(id) {
  return testRequest.get(`${API_URL}/${id}`)
}

export function getAnalysisEngineTypes() {
  return testRequest.get(`analysis-engines/types`)
}

export function exportReportedEmails(payload) {
  return testRequest.post(`${API_URL}`, payload)
}
