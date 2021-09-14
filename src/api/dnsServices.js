import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function getDnsServiceList(payload) {
  return testRequest.post(`phishing-simulator/dns-services/search`, payload)
}

export function createDnsServiceList(payload) {
  return testRequest.post(`phishing-simulator/dns-services`, payload, { snackbar: COMMON_SNACKBAR })
}

export function testConnection(payload, id) {
  return testRequest.post(`phishing-simulator/dns-services/${id}/test`, payload)
}

export function updateDnsServiceList(payload, id) {
  return testRequest.put(`phishing-simulator/dns-services/${id}`, payload, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function getDnsService(id) {
  return testRequest.get(`phishing-simulator/dns-services/${id}`, { loading: true })
}

export function deleteEmailTemplate(id) {
  return testRequest.delete(`phishing-simulator/dns-services/${id}`, {
    loading: true,
    snackbar: COMMON_SNACKBAR
  })
}

export function exportDnsService(payload) {
  return testRequest.post(`phishing-simulator/dns-services/search/export`, payload, {
    responseType: 'blob'
  })
}
