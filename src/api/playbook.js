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

export function deletePlaybookRule(id) {
  return testRequest.delete(`playbooks/${id}`)
}

export function getAnalysisEngine(payload) {
  return testRequest.post('analysis-engines/search', payload)
}

export function getTargetUsers(payload) {
  return testRequest.post('target-users/search', payload)
}
