import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const API_URL = 'ir/dashboard'
export function getTopRules() {
  return testRequest.get(`${API_URL}/top-rules`)
}

export function getRunningInvestigations() {
  return testRequest.get(`${API_URL}/running-investigations`)
}

export function exportInvestigationList(payload) {
  return testRequest.post(`investigations/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getMatchingIncidents(payload, id) {
  return testRequest.post(`notified-emails/matching-playbooks/${id}/search`, payload)
}

export function exportInvestigationEmailList(payload, id) {
  return testRequest.post(`investigations/${id}/search-email/export`, payload, {
    responseType: 'blob'
  })
}

export function exportInvestigationUserList(payload, id) {
  return testRequest.post(`investigations/${id}/search-user/export`, payload, {
    responseType: 'blob'
  })
}

export function searchNotifiedMail(payload) {
  return testRequest.post(`notified-emails/search`, payload)
}

export function updateNotifiedEmail(id, payload) {
  return testRequest.put(`/notified-emails/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateNotifiedEmailBulk(payload) {
  return testRequest.put(`/notified-emails/bulk-update`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getRoiSettings() {
  return testRequest.get('/companies/roi-settings')
}

export function updateRoiSettings(payload) {
  return testRequest.put('/companies/roi-settings', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function reAnalyzeEmail(resourceId = '') {
  return testRequest.get(`/notified-emails/${resourceId}/reanalyze`, {
    snackbar: COMMON_SNACKBAR
  })
}
