import testRequest from '../utils/testRequest'
const URL = '/scim'
export function exportSCIMSettings(payload) {
  return testRequest.post(`${URL}/search/export`, payload, { responseType: 'blob' })
}

export function searchSCIMSettings(payload) {
  return testRequest.post(`${URL}/search`, payload)
}
