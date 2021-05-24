import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const URL = '/companies/proxy-settings'
export function searchProxySettings(payload = {}) {
  return testRequest.post(`${URL}/search`, payload)
}

export function deleteProxySettings(id) {
  return testRequest.delete(`${URL}/${id}`, { loading: true, snackbar: COMMON_SNACKBAR })
}

export function createProxySettings(payload) {
  return testRequest.post(`/companies/proxy-settings`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function getProxySettings(resourceId) {
  return testRequest.get(`/companies/proxy-settings/${resourceId}`)
}

export function updateProxySettings(payload) {
  return testRequest.put(`${URL}/${payload.resourceId}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function exportProxySettings(payload) {
  return testRequest.post(`${URL}/search/export`, payload, { responseType: 'blob' })
}

export function searchAvailableFor(payload = {}) {
  return testRequest.post('/available-for/search', payload)
}

export function testConnection(payload = {}) {
  return testRequest.post('/companies/proxy-settings/test', payload, {
    snackbar: COMMON_SNACKBAR
  })
}
