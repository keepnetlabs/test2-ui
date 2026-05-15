import testRequest from '../utils/testRequest'

const API_URL = '/companies/ip-restrictions'

export function getCompanyIpRestrictions() {
  return testRequest.get(API_URL)
}

export function createCompanyIpRestrictions(payload = {}) {
  return testRequest.post(API_URL, payload, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json-patch+json'
    }
  })
}

export function deleteCompanyIpRestriction(resourceId = '') {
  return testRequest.delete(`${API_URL}/${resourceId}`)
}
