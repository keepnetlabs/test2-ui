import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const API_URL = '/companies/clients'

export function searchRestApi(payload = {}) {
  return testRequest.post(`${API_URL}/search`, payload)
}

export function generateClientCredentials() {
  return testRequest.get(`${API_URL}/generate-client-credentials`)
}

export function createRestApi(payload = {}) {
  return testRequest.post(`${API_URL}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getRestApi(resourceId = {}) {
  return testRequest.get(`${API_URL}/${resourceId}`)
}

export function updateRestApi(resourceId = {}, payload) {
  return testRequest.put(`${API_URL}/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteRestApi(resourceId = {}) {
  return testRequest.delete(`${API_URL}/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function exportRestApi(payload = {}) {
  return testRequest.post(`${API_URL}/search/export`, payload, { responseType: 'blob' })
}
