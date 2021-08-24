import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getWhiteLabel(config = {}) {
  return testRequest.get('/whitelabeling', config)
}

export function resolveWhiteLabel(config = {}) {
  return testRequest.get('/whitelabeling/resolve-whitelabeling', config)
}

export function getWhiteLabelByUrl(payload = {}) {
  return testRequest.post('/whitelabeling/by-url', payload, {
    loading: true
  })
}

export function updateWhiteLabel(payload = {}, id = '', config = {}) {
  return testRequest.put(`/whitelabeling/${id}`, payload, {
    ...config,
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
