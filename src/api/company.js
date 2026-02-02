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
  return testRequest.delete(`/company-groups/${id}`, {
    snackbar: COMMON_SNACKBAR
  })
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
  return testRequest.post('/company-groups', payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export function expiryDateLimited(date) {
  return testRequest.post('/companies/licenseexpirydate', {
    licenseStartDate: date
  })
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
    const value = payload[key]
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item))
      continue
    }
    if (key === 'PreferredLanguageTypeResourceId') {
      formData.append(key, value || '')
    } else if (value) {
      formData.append(key, value)
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
  return testRequest.put(`/company-groups/${id}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
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

export function getAgenticAIMetadata() {
  return testRequest.get('/companies/agentic-ai-settings/metadata')
}

export function getAgenticAISettings(config = {}) {
  // NOTE: no global loader here; use local skeleton loaders in UI
  return testRequest.get('/companies/agentic-ai-settings', { ...config })
}

export function updateAgenticAISettings(payload = {}) {
  return testRequest.patch('/companies/agentic-ai-settings', payload)
}

export function resetAgenticAISettings() {
  return testRequest.post('/companies/agentic-ai-settings/reset')
}

export function getAgenticAIStatus() {
  return testRequest.get('/companies/agentic-ai')
}

export function toggleAgenticAIStatus(payload = {}) {
  // Legacy/Alternate endpoint for master switch toggle
  return testRequest.post('/companies/agentic-ai', payload)
}

export function saveAgenticAISettings(payload = {}) {
  // Deprecated/Compatibility wrapper if needed, or mapped to update
  return updateAgenticAISettings(payload)
}
export function generateNotificationTemplateTranslation(payload = {}) {
  return testRequest.post('/companies/email-templates/translate', payload)
}
export function getNotificationTemplateTranslation() {
  return testRequest.get('/companies/translated-email-templates')
}
