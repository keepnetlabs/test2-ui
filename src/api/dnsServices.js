import testRequest from '../utils/testRequest'

export function getDnsServiceList(payload) {
  return testRequest.post(`phishing-simulator/dns-services/search`, payload)
}

export function createDnsServiceList(payload) {
  return testRequest.post(`phishing-simulator/dns-services`, payload)
}

export function testConnection(payload, id) {
  return testRequest.post(`phishing-simulator/dns-services/${id}/test`, payload)
}

export function updateDnsServiceList(payload) {
  return testRequest.put(`phishing-simulator/dns-services/${id}`, payload, { loading: true })
}

export function getDnsService(id) {
  return testRequest.get(`phishing-simulator/dns-services/${id}`, { loading: true })
}

export function deleteEmailTemplate(id) {
  return testRequest.delete(`phishing-simulator/dns-services/${id}`, { loading: true })
}

export function exportDnsService(payload) {
  return testRequest.post(`phishing-simulator/dns-services/search/export`, payload, {
    responseType: 'blob'
  })
}
