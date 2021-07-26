import testRequest from '../utils/testRequest'

export function getSandboxSummaryData(payload) {
  return testRequest.post(`is/dashboard/summary`, payload)
}

export function getSandboxLog(payload) {
  return testRequest.post(`is/dashboard/search-log`, payload)
}

export function getSandboxStats(payload) {
  return testRequest.post(`is/dashboard/search-stats`, payload)
}
