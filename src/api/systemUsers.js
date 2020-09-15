import testRequest from '../utils/testRequest'

export function getSystemUsers(payload) {
  return testRequest.post(`/system-users/search`, payload)
}

export function createSystemUser(payload) {
  return testRequest.post(`/system-users`, payload)
}

export function updateSystemUser(payload) {
  return testRequest.put(`/system-users/${payload.resourceId}`, payload)
}
