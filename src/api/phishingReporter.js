import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getPhishingReportSummary({ startDate, endDate }) {
  return testRequest.get(`/phishing-reporter/summary?startDate=${startDate}&endDate=${endDate}`)
}

export function createPhishingReporter(payload) {
  return testRequest.post('/phishing-reporter', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getDefaultSettingsForLanguage(payload) {
  return testRequest.post('/phishing-reporter/translate-addin-settings', payload)
}

export function getPhishingReporter() {
  return testRequest.get('/phishing-reporter')
}

export function getPhishingReporterImg() {
  const time = Date.now()
  return testRequest.get(`/phishing-reporter/img?time=${time}`, {
    responseType: 'blob'
  })
}

export function deletePhishingReporterUser(id) {
  return testRequest.delete(`/phishing-reporter-users/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function searchPhishingReporterUser(payload) {
  return testRequest.post('/phishing-reporter/search', payload)
}

export function exportPhishingReporterUserList(payload) {
  return testRequest.post('/phishing-reporter/search/export', payload, {
    responseType: 'blob'
  })
}

export function exportPhishingReporterDownloadHistory(payload) {
  return testRequest.post('/phishing-reporter/history/search/export', payload, {
    responseType: 'blob'
  })
}

export function generateOutlookAddIn() {
  return testRequest.get('/phishing-reporter/generate/outlook-addin')
}
export function generateGoogleWorkSpaceAddIn() {
  return testRequest.get('/phishing-reporter/generate/gsuite-addin', {
    responseType: 'blob'
  })
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

export function generateO365AddIn() {
  return testRequest.get(`phishing-reporter/generate/microsoft365-addin`, {
    responseType: 'blob'
  })
}

export function searchGeneratedApplicationHistory(payload) {
  return testRequest.post(`/phishing-reporter/history/search`, payload)
}

export function bulkDeletePhishingUsers(payload = {}) {
  return testRequest.delete('/phishing-reporter-users/bulk-delete', {
    snackbar: COMMON_SNACKBAR,
    data: payload
  })
}
