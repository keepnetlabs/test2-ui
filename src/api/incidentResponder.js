import testRequest from '../utils/testRequest'
const API_URL="ir/dashboard"
export function getTopRules() {
return testRequest.get(`${API_URL}/top-rules`)
}

export function getRunningInvestigations() {
  return testRequest.get(`${API_URL}/running-investigations`)
}
