import testRequest from '../utils/testRequest'

export function getTargetUsers(payload) {
  return testRequest.post(`/target-users/search`, payload)
}

export function getTargetUser(resourceId) {
  return testRequest.get(`/target-users/${resourceId}`)
}

export function getTargetUsersByEmail(payload) {
  return testRequest.post('/target-users/search-email', payload)
}

export function deleteTargetUser(resourceId) {
  return testRequest.delete(`/target-users/${resourceId}`)
}

export function updateTargetUser(payload) {
  return testRequest.put(`/target-users/${payload.resourceId}`, payload)
}

export function createTargetUser(payload) {
  return testRequest.post('/target-users', payload)
}

export function getTargetGroups() {
  return testRequest.get(`/target-groups`)
}

export function getTargetGroupsByName(payload) {
  return testRequest.post('/target-groups/search-name', payload)
}

export function getTargetGroup(id) {
  return testRequest.get(`/target-groups/${id}`)
}

export function createTargetGroup(payload) {
  return testRequest.post('/target-groups', payload)
}

export function updateTargetGroup(payload) {
  return testRequest.put(`/target-groups/${payload.resourceId}`, payload)
}

export function deleteTargetGroup(resourceId) {
  return testRequest.delete(`/target-groups/${resourceId}`)
}

export function getTargetUserCustomFieldsByCompanyId() {
  return testRequest.get(`/custom-fields/company`)
}

export function createTargetUserCustomField(payload) {
  return testRequest.post(`/custom-fields`, payload)
}

export function updateTargetUserCustomField(payload) {
  return testRequest.put(`/custom-fields/${payload.resourceId}`, payload)
}
