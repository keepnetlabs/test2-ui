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
export function getCompanyByID(id, loading = true) {
  return testRequest.get(`/companies/${id}`, { loading: loading })
}
export function searchCompanyGroups(payload) {
  return testRequest.post(`/company-groups/search`, payload)
}
export function getCompanyGroups() {
  return testRequest.get(`/company-groups/search`)
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

  return testRequest.post(`/companies`, formData, { loading: true })
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
export function getCompanyList() {
  return testRequest.get('/companies/my')
}
export function getCompanyListForThreatSharing() {
  return testRequest.get('/companies/community-companies')
}

export function searchEmailTemplate(payload = {}) {
  return testRequest.post('/companies/email-templates/search', payload)
}

export function createEmailTemplate(payload = {}) {
  return testRequest.post('/companies/email-templates', payload)
}

export function getEmailTemplate(resourceId = '') {
  return testRequest.get(`/companies/email-templates/${resourceId}`)
}

export function updateEmailTemplate(resourceId = '', payload = {}) {
  return testRequest.put(`/companies/email-templates/${resourceId}`, payload)
}

export function getCategories() {
  return testRequest.get('/lookups/10')
}
