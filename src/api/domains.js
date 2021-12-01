import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getDomainsList(payload) {
  return testRequest.post(`phishing-simulator/domain-records/search`, payload)
}

export function createDomain(payload) {
  return testRequest.post(`phishing-simulator/domain-records`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateDomain(payload, id) {
  return testRequest.put(`phishing-simulator/domain-records/${id}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function deleteEmailTemplate(id) {
  return testRequest.delete(`phishing-simulator/domain-records/${id}`, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function exportDnsService(payload) {
  return testRequest.post(`phishing-simulator/domain-records/search/export`, payload, {
    responseType: 'blob'
  })
}

export function getDomainData() {
  return testRequest.get(`phishing-simulator/domain-records/form-details`)
}

export function getDomainEditData(resId) {
  return testRequest.get(`phishing-simulator/domain-records/${resId}`, {
    loading: true
  })
}
export function testDomainConnection(payload) {
  return testRequest.post(`phishing-simulator/domain-records/test`, payload)
}
