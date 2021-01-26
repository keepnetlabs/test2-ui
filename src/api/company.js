import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

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
export function exportCompanyGroup(payload) {
  return testRequest.post('/company-groups/search/export', payload, {
    responseType: 'blob'
  })
}
export function exportCompanyGroupDetails(payload, id) {
  return testRequest.post(`/company-groups/${id}/companies/search/export`, payload, {
    responseType: 'blob'
  })
}
export function deleteCompany(id) {
  return testRequest.delete(`companies/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
}
export function deleteCompanyGroup(id) {
  return testRequest.delete(`/company-groups/${id}`, { snackbar: COMMON_SNACKBAR })
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
  return testRequest.post('/company-groups', payload, { snackbar: COMMON_SNACKBAR })
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

  return testRequest.post(`/companies`, formData, { loading: true, snackbar: COMMON_SNACKBAR })
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

  return testRequest.put(`/companies/${id}`, formData, { snackbar: COMMON_SNACKBAR })
}
export function updateCompanyGroup(id, payload) {
  return testRequest.put(`/company-groups/${id}`, payload, { snackbar: COMMON_SNACKBAR })
}

export function addCompanyToCompanyGroup(resourceId = '', payload = {}) {
  return testRequest.put(`/company-groups/${resourceId}/participants`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function removeCompanyToCompanyGroup(resourceId = '', payload = {}) {
  return testRequest.delete(`/company-groups/${resourceId}/participants`, {
    data: payload,
    snackbar: COMMON_SNACKBAR
  })
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
  return testRequest.post('/companies/email-templates', payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getEmailTemplate(resourceId = '') {
  return testRequest.get(`/companies/email-templates/${resourceId}`)
}

export function exportEmailTemplate(payload = {}) {
  return testRequest.post('/companies/email-templates/search/export', payload, {
    responseType: 'blob'
  })
}

export function updateEmailTemplate(resourceId = '', payload = {}) {
  return testRequest.put(`/companies/email-templates/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getMergedTags(resourceId = '') {
  return testRequest.get(`/companies/email-templates/merge-tags/${resourceId}`)
}

export function deleteEmailTemplate(resourceId = '') {
  return testRequest.delete(`/companies/email-templates/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getCategories() {
  return testRequest.get('/lookups/10')
}

export function getCheckCompanyLicense(resourceId = '') {
  return testRequest.get(`/companies/${resourceId}/license-check`)
}
