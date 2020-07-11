import testRequest from '../utils/testRequest'

export function searchPlaybook(payload) {
  return testRequest.post(`/playbooks/search`, payload)
}

export function exportPlaybookRules(payload) {
  return testRequest.post(`playbooks/search/export`, payload, {
    responseType: 'blob'
  })
}

export function deletePlaybookRule(id) {
  return testRequest.delete(`playbooks/${id}`)
}
