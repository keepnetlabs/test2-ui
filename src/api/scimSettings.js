import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const URL = '/scim'
export function exportSCIMSettings(payload) {
  return testRequest.post(`${URL}/search/export`, payload, { responseType: 'blob' })
}

export function searchSCIMSettings(payload) {
  return testRequest.post(`${URL}/search`, payload)
}

export function getSCIMSetting(resourceId = '') {
  return testRequest.get(`${URL}/${resourceId}`)
}

export function deleteSCIMSetting(resourceId = '') {
  return testRequest.delete(`${URL}/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function revokeSCIMSetting(resourceId = '') {
  return testRequest.post(`${URL}/${resourceId}/revoke`, {
    snackbar: COMMON_SNACKBAR
  })
}
