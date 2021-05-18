import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const BASE_URL = '/companies/saml-settings'

export function searchSamlSettings(payload = {}) {
  return testRequest.post(`${BASE_URL}/search`, payload)
}

export function getDefaultSamlSettings() {
  return testRequest.get(`${BASE_URL}/default`)
}

export function getSamlSetting(resourceId = '') {
  return testRequest.get(`${BASE_URL}/${resourceId}`)
}

export function createSamlSetting(payload = {}) {
  return testRequest.post(`${BASE_URL}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateSamlSetting(payload = {}, resourceId = '') {
  return testRequest.put(`${BASE_URL}/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteSamlSettings(resourceId = '') {
  return testRequest.delete(`${BASE_URL}/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function exportSamlSettings(payload = {}) {
  return testRequest.post(`${BASE_URL}/search/export`, payload, {
    responseType: 'blob'
  })
}
