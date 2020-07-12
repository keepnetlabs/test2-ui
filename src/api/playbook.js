import testRequest from '../utils/testRequest'

export function searchPlaybook(payload) {
  return testRequest.post(`/playbooks/search`, payload)
}

export function exportPlaybookRules(payload) {
  return testRequest.post(`playbooks/search/export`, payload, {
    responseType: 'blob'
  })
}

export function createPlaybook(payload) {
  return testRequest.post('/playbooks', payload)
}

export function getPlaybook(id) {
  return testRequest.get(`/playbooks/${id}`)
}

export function updatePlaybook(payload) {
  return testRequest.put(`/playbooks/${payload.resourceId}`, payload)
}

export function deletePlaybookRule(id) {
  return testRequest.delete(`playbooks/${id}`)
}
