import testRequest from '../utils/testRequest'
const URL = '/companies/smtp-settings'
export function searchSmtpSettings(payload = {}) {
  return testRequest.post(`${URL}/search`, payload)
}

export function deleteSmtpSettings(id) {
  return testRequest.delete(`${URL}/${id}`)
}
