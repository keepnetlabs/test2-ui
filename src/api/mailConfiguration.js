import testRequest from '../utils/testRequest'
const API_URL = 'analysis-engines'
export function getIntegrationList(payload) {
  return testRequest.post(`${API_URL}/search`, payload)
}

export function getMailConfigurationList() {
  return testRequest.get(`mail-configurations`)
}

export function deleteO365(url) {
  return testRequest.delete(`mail-configurations/o365/${url}`, { loading: true })
}

export function createO365(payload) {
  return testRequest.post('mail-configurations/o365', payload, { loading: true })
}

export function updateO365(payload, url) {
  return testRequest.put(`mail-configurations/o365/${url}`, payload, { loading: true })
}

export function checkApiConnectivity(payload) {
  return testRequest.post(`mail-configurations/o365/check-api-connectivity`, payload)
}

export function checkPrivileges(payload) {
  return testRequest.post(`mail-configurations/o365/check-privileges-access`, payload)
}

export function checkAllUsersAccess(payload) {
  return testRequest.post(`mail-configurations/o365/check-all-users-access`, payload)
}

export function checkEmailAccess(payload) {
  return testRequest.post(`mail-configurations/o365/check-email-access`, payload)
}

export function checkCreateNewCategory(payload) {
  return testRequest.post(`mail-configurations/o365/check-create-new-category`, payload)
}

export function checkUpdateCategory(payload) {
  return testRequest.post(`mail-configurations/o365/check-update-category`, payload)
}

export function checkDeleteEmail(payload) {
  return testRequest.post(`mail-configurations/o365/check-delete-email`, payload)
}

export function checkInboxAccess(payload) {
  return testRequest.post(`mail-configurations/o365/check-inbox-access`, payload)
}
