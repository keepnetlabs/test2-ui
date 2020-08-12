import testRequest from '../utils/testRequest'

export function searchCompanies(payload) {
  return testRequest.post('/companies/search', payload)
}
