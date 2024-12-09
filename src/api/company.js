import testRequest from '../utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

export function searchCompanies(payload) {
  return testRequest.post('/companies/search', payload)
}
export function searchGroupCompanies(id, payload) {
  return testRequest.post(`/company-groups/${id}/companies/search`, payload)
}

export function getMyCompanies() {
  return testRequest.get('/companies/my')
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
export function searchCompanyGroupsWithParents(payload) {
  return testRequest.post(`/company-groups/search-with-parent`, payload)
}
export function createCompanyGroups(payload) {
  return testRequest.post('/company-groups', payload, { snackbar: COMMON_SNACKBAR })
}

function createCompanyPayload(payload) {
  const parsedStartDatePart = payload.LicenseStartDate?.split(' ')?.[0]
  const parsedStartDate = parsedStartDatePart?.split('/')?.reverse()?.join('-')
  const parsedEndDatePart = payload.LicenseEndDate?.split(' ')?.[0]
  const parsedEndDate = parsedEndDatePart?.split('/')?.reverse()?.join('-')
  payload.LicenseStartDate = parsedStartDate
  payload.LicenseEndDate = parsedEndDate

  const formData = new FormData()

  for (const key in payload) {
    if (Array.isArray(payload[key])) {
      payload[key].forEach((x) => formData.append(key, x))
    } else {
      if (key === 'PreferredLanguageTypeResourceId') {
        formData.append(key, payload[key] || '')
      } else {
        payload[key] && formData.append(key, payload[key])
      }
    }
  }
  return formData
}

export function createCompany(payload) {
  return testRequest.post(`/companies`, createCompanyPayload(payload), {
    snackbar: COMMON_SNACKBAR
  })
}
export function updateCompany(id, payload) {
  return testRequest.put(`/companies/${id}`, createCompanyPayload(payload), {
    snackbar: COMMON_SNACKBAR
  })
}

export function updateInitializeCompany(payload) {
  return testRequest.put(`/companies/limited`, payload, {
    snackbar: COMMON_SNACKBAR
  })
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
export function getNotificationTemplatesDeliverySettings() {
  return testRequest.get(`/companies/email-templates/email-delivery-setting-list`)
}
export function getDefaultEmailTemplate(resourceId = '') {
  return testRequest.get(`/companies/email-templates/${resourceId}/default`)
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
  return testRequest.get('/companies/email-templates/categorylookup')
}

export function getTemplateTypes() {
  return testRequest.get('/companies/email-templates/typelookup')
}

export function getCheckCompanyLicense(resourceId = '') {
  return testRequest.get(`/companies/${resourceId}/license-check`)
}

export function bulkDeleteCompanies(payload = {}) {
  return testRequest.delete(`/companies/bulk-delete`, {
    data: payload,
    snackbar: COMMON_SNACKBAR
  })
}

export function bulkDeleteCompanyGroups(payload = {}) {
  return testRequest.delete(`/company-groups/bulk-delete`, {
    data: payload,
    snackbar: COMMON_SNACKBAR
  })
}

export function makeDefaultTemplate(resourceId = '', payload = {}) {
  return testRequest.put(`/companies/email-templates/make-default/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getCompanyPrivacy() {
  return testRequest.get(`/companies/privacy`)
}

export function updateCompanyPrivacy(payload = {}) {
  return testRequest.put(`/companies/privacy`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}

export function getTimeByTimeZone(timeZoneId = '') {
  return testRequest.get(`/companies/get-current-time/${timeZoneId}`)
}

export function getCompanyDataPrivacy() {
  return testRequest.get('/companies/privacymask')
}
export function saveCompanyDataPrivacy(payload = {}) {
  return testRequest.put('/companies/privacymask', payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function saveAIAllySettings(payload = {}) {
  return testRequest.post('/companies/ai', payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function getAIAllySettings() {
  return testRequest.get('/companies/ai')
}
