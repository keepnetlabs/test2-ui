import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getWhiteLabel() {
  return testRequest.get('/whitelabeling')
}

export function getWhiteLabelByUrl(payload = {}) {
  return testRequest.post('/whitelabeling/by-url', payload, {
    loading: true
  })
}

export function updateWhiteLabel(payload = {}, id = '') {
  return testRequest.put(`/whitelabeling/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteWhiteLabel(resourceId = '') {
  return testRequest.delete(`/whitelabeling/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getSystemVersion() {
  return testRequest.get('/system-info/version')
}
