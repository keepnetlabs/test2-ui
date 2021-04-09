import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getPermissionLogs(payload) {
  return testRequest.post('/roles/search', payload)
}
export function getPermissionAll(payload) {
  return testRequest.get('/permissions/all')
}
export function getPermissionData(id) {
  return testRequest.get(`/roles/${id}`)
}
export function deletePermission(id) {
  return testRequest.delete(`/roles/${id}`, {
    snackbar: COMMON_SNACKBAR,
    loading
  })
}
export function createPermissionRoles(payload) {
  return testRequest.post('/roles', payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function updatePermissionRoles(payload, id) {
  return testRequest.put(`/roles/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
