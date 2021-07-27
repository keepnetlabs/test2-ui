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

export function exportSandboxLog(payload = {}) {
  return testRequest.post('/is/dashboard/search-log/export', payload, {
    responseType: 'blob'
  })
}

export function exportSandboxStats(payload = {}) {
  return testRequest.post('/is/dashboard/search-stats/export', payload, {
    responseType: 'blob'
  })
}
