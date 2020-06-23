import testRequest from '../utils/testRequest'
const API_URL = 'clients'
export function getClientList(payload) {
  return testRequest.post(`${API_URL}/search`, payload)
}

export function exportClientList(payload) {
  return testRequest.post(`${API_URL}`, payload)
}

export function generateApiKey(id) {
  return testRequest.post(`${API_URL}/${id}`)
}

export function createClient(payload) {
  return testRequest.post(`${API_URL}`, payload)
}

export function updateClient(id, payload) {
  return testRequest.put(`${API_URL}/${id}`, payload)
}

export function deleteClient(id) {
  return testRequest.delete(`${API_URL}/${id}`)
}

export function getClientDetails(id) {
  return testRequest.get(`${API_URL}/${id}`)
}
