import testRequest from '../utils/testRequest'

export function searchPlaybook(payload) {
  return testRequest.post(`/playbooks/search`, payload)
}
