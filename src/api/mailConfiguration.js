import testRequest from '../utils/testRequest'
const API_URL = 'analysis-engines'
export function getIntegrationList(payload) {
  return testRequest.post(`${API_URL}/search`, payload)
}

export function getMailConfigurationList() {
  return testRequest.get(`mail-configurations`)
}

export function deleteO365(url) {
  return testRequest.delete(`mail-configurations/o365/${url}`, { loading: true })
}

export function createO365(payload) {
  return testRequest.post('mail-configurations/o365', payload, { loading: true })
}
export function updateO365(payload, url) {
  return testRequest.put(`mail-configurations/o365/${url}`, payload, { loading: true })
}
