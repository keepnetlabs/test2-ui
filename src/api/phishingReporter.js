import testRequest from '../utils/testRequest'

export function getPhishingReportSummary({ startDate, endDate }) {
  return testRequest.get(`/phishing-reporter/summary?startDate=${startDate}&endDate=${endDate}`)
}

export function createPhishingReporter(payload) {
  return testRequest.post('/phishing-reporter', payload)
}

export function getPhishingReporter() {
  return testRequest.get('/phishing-reporter')
}

export function getPhishingReporterImg() {
  return testRequest.get('/phishing-reporter/img', {
    responseType: 'blob'
  })
}
export function getReporters() {
  return testRequest.get('/dashboard/reporters')
}

export function deletePhishingReporterUser(id) {
  return testRequest.delete(`/phishing-reporter-users/${id}`)
}

export function searchPhishingReporterUser(payload) {
  return testRequest.post('/phishing-reporter/search', payload)
}

export function exportPhishingReporterUserList(payload) {
  return testRequest.post('/phishing-reporter/search/export', payload, {
    responseType: 'blob'
  })
}

export function generateOutlookAddIn() {
  return testRequest.get('/phishing-reporter/generate/outlook-addin')
}

export function downloadOutlookAddIn(id) {
  return testRequest.get(`/phishing-reporter/download/outlook-addin/${id}`, {
    responseType: 'blob'
  })
}

export function generateDiagnosticTool() {
  return testRequest.get('/phishing-reporter/generate/diagnostic-tool')
}

export function downloadDiagnosticTool(id) {
  return testRequest.get(`/phishing-reporter/download/diagnostic-tool/${id}`, {
    responseType: 'blob'
  })
}

export function searchGeneratedApplicationHistory(payload) {
  return testRequest.post(`/phishing-reporter/history/search`, payload)
}
