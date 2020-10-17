import testRequest from '../utils/testRequest'
const URL = '/companies/smtp-settings'
export function searchSmtpSettings(payload = {}) {
  return testRequest.post(`${URL}/search`, payload)
}
