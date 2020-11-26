import testRequest from '../utils/testRequest'
const URL = '/companies/smtp-settings'
export function searchSmtpSettings(payload = {}) {
  return testRequest.post(`${URL}/search`, payload)
}

export function deleteSmtpSettings(id) {
  return testRequest.delete(`${URL}/${id}`, { loading: true })
}

export function createSMTPSettings(payload) {
  return testRequest.post(`/companies/smtp-settings`, payload, { loading: true })
}

export function getSmtpSettings(resourceId) {
  return testRequest.get(`/companies/smtp-settings/${resourceId}`)
}

export function updateSmtpSettings(payload) {
  return testRequest.put(`${URL}/${payload.resourceId}`, payload, { loading: true })
}

export function exportSmtpSettings(payload) {
  return testRequest.post(`${URL}/search/export`, payload, { responseType: 'blob' })
}
