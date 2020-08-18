import testRequest from '../utils/testRequest'

export function searchCompanies(payload) {
  return testRequest.post('/companies/search', payload)
}
export function exportCompanies(payload) {
  return testRequest.post('/companies/search/export', payload, {
    responseType: 'blob'
  })
}
export function deleteCompany(id) {
  return testRequest.delete(`companies/${id}`)
}
export function getCompanyByID(id) {
  return testRequest.get(`/companies/${id}`)
}
export function getCompanyGroups() {
  return testRequest.get(`/company-groups`)
}
export function createCompany(payload) {
  const formData = new FormData()

  for (const key in payload) {
    console.log(key)
    formData.append(key, payload[key])
  }

  return testRequest.post(`/companies`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    responseType: 'blob'
  })
}
