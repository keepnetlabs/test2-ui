jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  patch: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as companyApi from '@/api/company'

describe('company API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('company search operations', () => {
    it('should call searchCompanies', async () => {
      const payload = { page: 1 }
      await companyApi.searchCompanies(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/search', payload)
    })

    it('should call searchGroupCompanies', async () => {
      const id = 'group-123'
      const payload = { page: 1 }
      await companyApi.searchGroupCompanies(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(`/company-groups/${id}/companies/search`, payload)
    })

    it('should call getMyCompanies', async () => {
      await companyApi.getMyCompanies()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/my')
    })

    it('should call getCompanyList', async () => {
      await companyApi.getCompanyList()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/my')
    })

    it('should call getCompanyListForThreatSharing', async () => {
      await companyApi.getCompanyListForThreatSharing()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/community-companies')
    })
  })

  describe('company management operations', () => {
    it('should call getCompanyByID', async () => {
      const id = 'company-123'
      await companyApi.getCompanyByID(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/companies/${id}`, { loading: true })
    })

    it('should call getCompanyByID with loading false', async () => {
      const id = 'company-123'
      await companyApi.getCompanyByID(id, false)
      expect(testRequest.get).toHaveBeenCalledWith(`/companies/${id}`, { loading: false })
    })

    it('should call createCompany', async () => {
      const payload = { name: 'New Company', LicenseStartDate: '01/01/2024' }
      await companyApi.createCompany(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies',
        expect.any(FormData),
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateCompany', async () => {
      const id = 'company-123'
      const payload = { name: 'Updated Company', LicenseEndDate: '12/31/2024' }
      await companyApi.updateCompany(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/companies/${id}`,
        expect.any(FormData),
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateInitializeCompany', async () => {
      const payload = { isInitialized: true }
      await companyApi.updateInitializeCompany(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/companies/limited',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteCompany', async () => {
      const id = 'company-123'
      await companyApi.deleteCompany(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `companies/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteCompanies', async () => {
      const payload = { companyIds: ['company-1', 'company-2'] }
      await companyApi.bulkDeleteCompanies(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/companies/bulk-delete',
        { data: payload, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getCheckCompanyLicense', async () => {
      const id = 'company-123'
      await companyApi.getCheckCompanyLicense(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/companies/${id}/license-check`)
    })

    it('should call expiryDateLimited', async () => {
      const date = '2024-01-01'
      await companyApi.expiryDateLimited(date)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/licenseexpirydate', {
        licenseStartDate: date
      })
    })
  })

  describe('company group operations', () => {
    it('should call searchCompanyGroups', async () => {
      const payload = { page: 1 }
      await companyApi.searchCompanyGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/company-groups/search', payload)
    })

    it('should call searchCompanyGroupsWithParents', async () => {
      const payload = { page: 1 }
      await companyApi.searchCompanyGroupsWithParents(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/company-groups/search-with-parent', payload)
    })

    it('should call createCompanyGroups', async () => {
      const payload = { name: 'New Group' }
      await companyApi.createCompanyGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/company-groups',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateCompanyGroup', async () => {
      const id = 'group-123'
      const payload = { name: 'Updated Group' }
      await companyApi.updateCompanyGroup(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/company-groups/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteCompanyGroup', async () => {
      const id = 'group-123'
      await companyApi.deleteCompanyGroup(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/company-groups/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteCompanyGroups', async () => {
      const payload = { groupIds: ['group-1', 'group-2'] }
      await companyApi.bulkDeleteCompanyGroups(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/company-groups/bulk-delete',
        { data: payload, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call addCompanyToCompanyGroup', async () => {
      const resourceId = 'group-123'
      const payload = { companyIds: ['company-1'] }
      await companyApi.addCompanyToCompanyGroup(resourceId, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/company-groups/${resourceId}/participants`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call addCompanyToCompanyGroup with defaults', async () => {
      await companyApi.addCompanyToCompanyGroup()
      expect(testRequest.put).toHaveBeenCalledWith(
        '/company-groups//participants',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call removeCompanyToCompanyGroup', async () => {
      const resourceId = 'group-123'
      const payload = { companyIds: ['company-1'] }
      await companyApi.removeCompanyToCompanyGroup(resourceId, payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/company-groups/${resourceId}/participants`,
        { data: payload, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call removeCompanyToCompanyGroup with defaults', async () => {
      await companyApi.removeCompanyToCompanyGroup()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/company-groups//participants',
        { data: {}, snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('email template operations', () => {
    it('should call searchEmailTemplate', async () => {
      const payload = { page: 1 }
      await companyApi.searchEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/email-templates/search', payload)
    })

    it('should call searchEmailTemplate with default payload', async () => {
      await companyApi.searchEmailTemplate()
      expect(testRequest.post).toHaveBeenCalledWith('/companies/email-templates/search', {})
    })

    it('should call createEmailTemplate', async () => {
      const payload = { name: 'New Template' }
      await companyApi.createEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/email-templates',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createEmailTemplate with default payload', async () => {
      await companyApi.createEmailTemplate()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/email-templates',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getEmailTemplate', async () => {
      const resourceId = 'template-123'
      await companyApi.getEmailTemplate(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`/companies/email-templates/${resourceId}`)
    })

    it('should call getDefaultEmailTemplate', async () => {
      const resourceId = 'template-123'
      await companyApi.getDefaultEmailTemplate(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`/companies/email-templates/${resourceId}/default`)
    })

    it('should call getNotificationTemplatesDeliverySettings', async () => {
      await companyApi.getNotificationTemplatesDeliverySettings()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/email-templates/email-delivery-setting-list')
    })

    it('should call updateEmailTemplate', async () => {
      const resourceId = 'template-123'
      const payload = { name: 'Updated Template' }
      await companyApi.updateEmailTemplate(resourceId, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/companies/email-templates/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteEmailTemplate', async () => {
      const resourceId = 'template-123'
      await companyApi.deleteEmailTemplate(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/companies/email-templates/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getMergedTags', async () => {
      const resourceId = 'template-123'
      await companyApi.getMergedTags(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`/companies/email-templates/merge-tags/${resourceId}`)
    })

    it('should call getCategories', async () => {
      await companyApi.getCategories()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/email-templates/categorylookup')
    })

    it('should call getTemplateTypes', async () => {
      await companyApi.getTemplateTypes()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/email-templates/typelookup')
    })

    it('should call makeDefaultTemplate', async () => {
      const resourceId = 'template-123'
      const payload = {}
      await companyApi.makeDefaultTemplate(resourceId, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/companies/email-templates/make-default/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportEmailTemplate', async () => {
      const payload = { filters: {} }
      await companyApi.exportEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/email-templates/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call generateNotificationTemplateTranslation', async () => {
      const payload = { templateId: 'template-123' }
      await companyApi.generateNotificationTemplateTranslation(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/email-templates/translate',
        payload
      )
    })

    it('should call getNotificationTemplateTranslation', async () => {
      await companyApi.getNotificationTemplateTranslation()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/translated-email-templates')
    })
  })

  describe('privacy and data operations', () => {
    it('should call getCompanyPrivacy', async () => {
      await companyApi.getCompanyPrivacy()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/privacy')
    })

    it('should call updateCompanyPrivacy', async () => {
      const payload = { privacySettings: {} }
      await companyApi.updateCompanyPrivacy(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/companies/privacy',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getCompanyDataPrivacy', async () => {
      await companyApi.getCompanyDataPrivacy()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/privacymask')
    })

    it('should call saveCompanyDataPrivacy', async () => {
      const payload = { maskingRules: {} }
      await companyApi.saveCompanyDataPrivacy(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/companies/privacymask',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('timezone operations', () => {
    it('should call getTimeByTimeZone', async () => {
      const timeZoneId = 'UTC'
      await companyApi.getTimeByTimeZone(timeZoneId)
      expect(testRequest.get).toHaveBeenCalledWith(`/companies/get-current-time/${timeZoneId}`)
    })
  })

  describe('AI settings operations', () => {
    it('should call saveAIAllySettings', async () => {
      const payload = { enabled: true }
      await companyApi.saveAIAllySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/ai',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getAIAllySettings', async () => {
      await companyApi.getAIAllySettings()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/ai')
    })

    it('should call getAgenticAIMetadata', async () => {
      await companyApi.getAgenticAIMetadata()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/agentic-ai-settings/metadata')
    })

    it('should call getAgenticAISettings', async () => {
      const config = { timeout: 5000 }
      await companyApi.getAgenticAISettings(config)
      expect(testRequest.get).toHaveBeenCalledWith('/companies/agentic-ai-settings', config)
    })

    it('should call getAgenticAISettings with default config', async () => {
      await companyApi.getAgenticAISettings()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/agentic-ai-settings', {})
    })

    it('should call updateAgenticAISettings', async () => {
      const payload = { settings: {} }
      await companyApi.updateAgenticAISettings(payload)
      expect(testRequest.patch).toHaveBeenCalledWith('/companies/agentic-ai-settings', payload)
    })

    it('should call resetAgenticAISettings', async () => {
      await companyApi.resetAgenticAISettings()
      expect(testRequest.post).toHaveBeenCalledWith('/companies/agentic-ai-settings/reset')
    })

    it('should call getAgenticAIStatus', async () => {
      await companyApi.getAgenticAIStatus()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/agentic-ai')
    })

    it('should call toggleAgenticAIStatus', async () => {
      const payload = { enabled: true }
      await companyApi.toggleAgenticAIStatus(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/agentic-ai', payload)
    })

    it('should call saveAgenticAISettings', async () => {
      const payload = { settings: {} }
      await companyApi.saveAgenticAISettings(payload)
      expect(testRequest.patch).toHaveBeenCalledWith('/companies/agentic-ai-settings', payload)
    })
  })

  describe('export operations', () => {
    it('should call exportCompanies', async () => {
      const payload = { filters: {} }
      await companyApi.exportCompanies(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCompanyGroup', async () => {
      const payload = { filters: {} }
      await companyApi.exportCompanyGroup(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/company-groups/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportCompanyGroupDetails', async () => {
      const id = 'group-123'
      const payload = { filters: {} }
      await companyApi.exportCompanyGroupDetails(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/company-groups/${id}/companies/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await companyApi.getMyCompanies()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search operations', async () => {
      const payload = { page: 1 }
      await companyApi.searchCompanies(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for update operations', async () => {
      const id = 'company-123'
      const payload = { name: 'Updated' }
      await companyApi.updateCompany(id, payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for delete operations', async () => {
      await companyApi.deleteCompany('company-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should use PATCH for partial updates', async () => {
      const payload = { settings: {} }
      await companyApi.updateAgenticAISettings(payload)
      expect(testRequest.patch).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for mutations', async () => {
      const payload = { name: 'New Company' }
      await companyApi.createCompany(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for group operations', async () => {
      const payload = { name: 'New Group' }
      await companyApi.createCompanyGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type for exports', () => {
    it('should use blob responseType for company exports', async () => {
      const payload = { filters: {} }
      await companyApi.exportCompanies(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for template exports', async () => {
      const payload = { filters: {} }
      await companyApi.exportEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle company creation with license dates', async () => {
      const payload = {
        name: 'Company',
        LicenseStartDate: '01/01/2024 10:00:00',
        LicenseEndDate: '12/31/2024 23:59:59'
      }
      await companyApi.createCompany(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle bulk delete with multiple IDs', async () => {
      const payload = { companyIds: ['company-1', 'company-2', 'company-3'] }
      await companyApi.bulkDeleteCompanies(payload)
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle company group management with empty payload', async () => {
      await companyApi.addCompanyToCompanyGroup('group-123', {})
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle email template operations with special characters', async () => {
      const resourceId = 'template-123!@#'
      await companyApi.getEmailTemplate(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`/companies/email-templates/${resourceId}`)
    })

    it('should handle AI settings updates without snackbar', async () => {
      const payload = { settings: {} }
      await companyApi.updateAgenticAISettings(payload)
      expect(testRequest.patch).toHaveBeenCalledWith(
        '/companies/agentic-ai-settings',
        payload
      )
    })
  })
})
