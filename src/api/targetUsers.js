import testRequest from '../utils/testRequest'
import uploadRequest from '../utils/uploadRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getTargetUsers(payload) {
  return testRequest.post(`/target-users/search`, payload)
}

export function getTargetUser(resourceId) {
  return testRequest.get(`/target-users/${resourceId}`)
}

export function getTargetUsersByEmail(payload) {
  return testRequest.post('/target-users/search-email', payload)
}

export function deleteTargetUser(resourceId) {
  return testRequest.delete(`/target-users/${resourceId}`, { snackbar: COMMON_SNACKBAR })
}

export function updateTargetUser(payload) {
  return testRequest.put(`/target-users/${payload.resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function createTargetUser(payload) {
  return testRequest.post('/target-users', payload, { snackbar: COMMON_SNACKBAR })
}

export function getTargetGroups(config = {}) {
  return testRequest.get(`/target-groups`, { ...config })
}

export function searchTargetGroups(payload) {
  return testRequest.post('/target-groups/search', payload)
}

export function getTargetGroupsByName(payload) {
  return testRequest.post('/target-groups/search-name', payload)
}

export function getTargetGroup(id) {
  return testRequest.get(`/target-groups/${id}`)
}

export function createTargetGroup(payload) {
  return testRequest.post('/target-groups', payload, { snackbar: COMMON_SNACKBAR })
}

export function updateTargetGroup(payload) {
  return testRequest.put(`/target-groups/${payload.resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteTargetGroup(resourceId) {
  return testRequest.delete(`/target-groups/${resourceId}`, { snackbar: COMMON_SNACKBAR })
}

export function getTargetUserCustomFieldsByCompanyId() {
  return testRequest.get(`/custom-fields/company`)
}

export function bulkUpdateOfCustomFields(payload) {
  return testRequest.post('/custom-fields/bulk-update', payload, { snackbar: COMMON_SNACKBAR })
}

export function createTargetUserCustomField(payload) {
  return testRequest.post(`/custom-fields`, payload)
}

export function updateTargetUserCustomField(payload) {
  return testRequest.put(`/custom-fields/${payload.resourceId}`, payload)
}

export function uploadExcelOrCsvForTargetUsers(file, onUploadProgress) {
  const formData = new FormData()
  formData.append('File', file)
  return uploadRequest.post(`/target-users/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  })
}

export function downloadExampleTargetUserFile(payload) {
  return testRequest.post(`/target-users/example-file`, payload, {
    responseType: 'blob'
  })
}

export function exportTargetUserBulk(id, payload) {
  return testRequest.post(`/target-users/${id}/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getUploadedFileData(id) {
  return testRequest.get(`/target-users/upload/${id}`)
}

export function createMapping(payload) {
  return testRequest.post(`/target-users/create-mapping`, payload)
}

export function searchTmp(payload, id) {
  return testRequest.post(`/target-users/${id}/search`, payload)
}

export function searchTargetGroupUsers(id = '', payload = {}) {
  return testRequest.post(`/target-groups/${id}/users`, payload)
}

export function createTargetGroupUsers(id = '', payload = {}, showSnackbar = true) {
  const config = showSnackbar
    ? {
        snackbar: COMMON_SNACKBAR
      }
    : {}
  return testRequest.put(`/target-groups/${id}/users`, payload, config)
}

export function exportTargetGroupUsers(id = '', payload = {}) {
  return testRequest.post(`/target-groups/${id}/users/export`, payload, {
    responseType: 'blob'
  })
}

export function exportTargetUsers(payload = {}) {
  return testRequest.post('/target-users/search/export', payload, {
    responseType: 'blob'
  })
}
export function exportTargetGroups(payload = {}) {
  return testRequest.post('/target-groups/search/export', payload, {
    responseType: 'blob'
  })
}

export function deleteTargetGroupUsers(id = '', payload = {}) {
  return testRequest.delete(`/target-groups/${id}/users`, {
    data: payload,
    snackbar: COMMON_SNACKBAR
  })
}

export function getMappingStatus(id) {
  return testRequest.get(`target-users/mapping-job/${id}`)
}

export function importTmpUsers(payload, id) {
  return testRequest.post(`/target-users/${id}/import`, payload)
}

export function getTargetUserViewUserGroups(resourceId = '', payload) {
  return testRequest.post(`target-users/${resourceId}/groups`, payload)
}
