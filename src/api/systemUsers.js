import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getSystemUsers(payload) {
  return testRequest.post(`/system-users/search`, payload)
}

export function createSystemUser(payload) {
  return testRequest.post(`/system-users`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateSystemUser(payload) {
  return testRequest.put(`/system-users/${payload.resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteSystemUser(resourceId = '') {
  return testRequest.delete(`/system-users/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function sendInformationEmail(resourceId = '') {
  return testRequest.post(`/system-users/${resourceId}/send-information-email`)
}

export function getUserRoles(payload) {
  return testRequest.post(`/roles/search`, payload, { loading: true })
}
export function getSystemUsersRole() {
  return testRequest.get(`/roles`)
}
