import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function selectCompany() {
  return testRequest.get(`companies/${localStorage.getItem('companyId')}`, { loading: true })
}

export function logoutUser() {
  return testRequest.get('account/logout')
}

export function sendFeedback(payload) {
  return testRequest.post('feedback', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getNotifications(payload) {
  return testRequest.post('/system-users/notification-setting', payload)
}

export function getAuditLogs(payload) {
  return testRequest.post('/audit-logs/search', payload)
}

export function exportAuditLog(payload = {}) {
  return testRequest.post('/audit-logs/search/export', payload, {
    responseType: 'blob'
  })
}
