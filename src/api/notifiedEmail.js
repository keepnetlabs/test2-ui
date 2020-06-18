import testRequest from '../utils/testRequest'
const API_URL = 'notified-email'
export function getNotifiedEmail(id) {
  return testRequest.get(`${API_URL}/${id}`)
}

export function exportReportedEmails(payload) {
  return testRequest.post(`${API_URL}`, payload)
}
