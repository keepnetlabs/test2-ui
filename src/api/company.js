import testRequest from '../utils/testRequest'

export function searchCompanies(payload) {
  return testRequest.post('/companies/search', payload)
}
export function searchGroupCompanies(id, payload) {
  return testRequest.post(`/company-groups/${id}/companies/search`, payload)
}
export function exportCompanies(payload) {
  return testRequest.post('/companies/search/export', payload, {
    responseType: 'blob'
  })
}
export function deleteCompany(id) {
  return testRequest.delete(`companies/${id}`)
}
export function deleteCompanyGroup(id) {
  return testRequest.delete(`/company-groups/${id}`)
}
export function getCompanyByID(id) {
  return testRequest.get(`/companies/${id}`)
}
export function getCompanyGroups() {
  return testRequest.get(`/company-groups`)
}
export function getCompanyGroupsById(id) {
  return testRequest.get(`/company-groups/${id}`)
}
export function createCompanyGroups(payload) {
  return testRequest.post('/company-groups', payload)
}
export function createCompany(payload) {
  const formData = new FormData()

  for (const key in payload) {
    if (Array.isArray(payload[key])) {
      payload[key].forEach((x) => formData.append(key, x))
    } else {
      payload[key] && formData.append(key, payload[key])
    }
  }

  return testRequest.post(`/companies`, formData)
}
export function updateCompany(id, payload) {
  const formData = new FormData()

  for (const key in payload) {
    if (Array.isArray(payload[key])) {
      payload[key].forEach((x) => formData.append(key, x))
    } else {
      payload[key] && formData.append(key, payload[key])
    }
  }

  return testRequest.put(`/companies/${id}`, formData)
}
export function updateCompanyGroup(id, payload) {
  return testRequest.put(`/company-groups/${id}`, payload)
}
