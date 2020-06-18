import testRequest from '../utils/testRequest'

export function getTargetUsers() {
  return testRequest.get(`/target-users`)
}

export function getTargetUser(resourceId) {
  return testRequest.get(`/target-users/${resourceId}`)
}

export function deleteTargetUser(resourceId) {
  return testRequest.delete(`/target-users/${resourceId}`)
}

export function updateTargetUser(payload) {
  return testRequest.put('/target-users/djZZejbRbh6l', payload)
}

export function createTargetUser(payload) {
  return testRequest.post('/target-users', payload)
}

export function getTargetGroups() {
  return testRequest.get(`/target-groups`)
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

export function deleteTargetGroup(payload) {
  return testRequest.delete('/target-groups/n2sdsbsPU4Yt')
}
