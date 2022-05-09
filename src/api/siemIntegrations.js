import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function searchSIEMIntegrations(payload = {}) {
  return testRequest.post('/companies/siem-settings/search', payload)
}

export function exportSIEMIntegrations(payload = {}) {
  return testRequest.post('/companies/siem-settings/search/export', payload, {
    responseType: 'blob'
  })
}

export function testSIEMIntegration(payload = {}) {
  return testRequest.post('/companies/siem-settings/test', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getSIEMIntegration(resourceId = '') {
  return testRequest.get(`/companies/siem-settings/${resourceId}`)
}

export function createSIEMIntegration(payload = {}) {
  return testRequest.post('/companies/siem-settings', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateSIEMIntegration(resourceId = '', payload = {}) {
  return testRequest.put(`/companies/siem-settings/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteSIEMIntegration(resourceId = '') {
  return testRequest.delete(`/companies/siem-settings/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}
