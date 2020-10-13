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

export function checkApiConnectivity() {
  return testRequest.get(`mail-configurations/o365/KAXxwyzFCXga/check-api-connectivity`)
}

export function checkPrivileges() {
  return testRequest.get(`mail-configurations/o365/check-privileges-access`)
}

export function checkAllUsersAccess() {
  return testRequest.get(`mail-configurations/o365/check-all-users-access`)
}

export function checkEmailAccess() {
  return testRequest.get(`mail-configurations/o365/check-email-access`)
}

export function checkCreateNewCategory() {
  return testRequest.get(`mail-configurations/o365/check-create-new-category`)
}

export function checkUpdateCategory() {
  return testRequest.get(`mail-configurations/o365/check-update-category`)
}

export function checkDeleteEmail() {
  return testRequest.get(`mail-configurations/o365/check-delete-email`)
}
