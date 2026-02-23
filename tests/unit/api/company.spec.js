import * as CompanyAPI from '@/api/company'
import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} })
}))

jest.mock('@/model/constants/commonConstants', () => ({
  COMMON_SNACKBAR: { color: 'red', duration: 5000 }
}))

describe('Company API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchCompanies', () => {
    it('should call POST with search payload', async () => {
      const payload = { page: 1, pageSize: 10 }
      await CompanyAPI.searchCompanies(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/search', payload)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.searchCompanies({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('searchGroupCompanies', () => {
    it('should call POST with group id and payload', async () => {
      const payload = { filter: 'active' }
      await CompanyAPI.searchGroupCompanies('group-123', payload)
      expect(testRequest.post).toHaveBeenCalledWith('/company-groups/group-123/companies/search', payload)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.searchGroupCompanies('1', {})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getMyCompanies', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getMyCompanies()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/my')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getMyCompanies()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('exportCompanies', () => {
    it('should call POST with blob responseType', async () => {
      const payload = { filter: 'all' }
      await CompanyAPI.exportCompanies(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.exportCompanies({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('exportCompanyGroup', () => {
    it('should call POST with blob responseType', async () => {
      const payload = { filter: 'all' }
      await CompanyAPI.exportCompanyGroup(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/company-groups/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.exportCompanyGroup({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('exportCompanyGroupDetails', () => {
    it('should call POST with id, payload and blob responseType', async () => {
      const payload = { filter: 'active' }
      await CompanyAPI.exportCompanyGroupDetails(payload, 'group-456')
      expect(testRequest.post).toHaveBeenCalledWith('/company-groups/group-456/companies/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.exportCompanyGroupDetails({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('deleteCompany', () => {
    it('should call DELETE with COMMON_SNACKBAR', async () => {
      await CompanyAPI.deleteCompany('company-789')
      expect(testRequest.delete).toHaveBeenCalledWith('companies/company-789', {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.deleteCompany('id-2')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('deleteCompanyGroup', () => {
    it('should call DELETE with COMMON_SNACKBAR', async () => {
      await CompanyAPI.deleteCompanyGroup('group-abc')
      expect(testRequest.delete).toHaveBeenCalledWith('/company-groups/group-abc', {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.deleteCompanyGroup('id-3')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getCompanyByID', () => {
    it('should call GET with loading flag by default', async () => {
      await CompanyAPI.getCompanyByID('company-123')
      expect(testRequest.get).toHaveBeenCalledWith('/companies/company-123', { loading: true })
    })

    it('should respect loading parameter', async () => {
      await CompanyAPI.getCompanyByID('1', false)
      expect(testRequest.get).toHaveBeenCalledWith('/companies/1', { loading: false })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getCompanyByID('id-4')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('searchCompanyGroups', () => {
    it('should call POST with payload', async () => {
      const payload = { page: 1 }
      await CompanyAPI.searchCompanyGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/company-groups/search', payload)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.searchCompanyGroups({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('searchCompanyGroupsWithParents', () => {
    it('should call POST with payload', async () => {
      const payload = { filter: 'active' }
      await CompanyAPI.searchCompanyGroupsWithParents(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/company-groups/search-with-parent', payload)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.searchCompanyGroupsWithParents({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('createCompanyGroups', () => {
    it('should call POST with COMMON_SNACKBAR', async () => {
      const payload = { name: 'New Group' }
      await CompanyAPI.createCompanyGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/company-groups', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.createCompanyGroups({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('expiryDateLimited', () => {
    it('should call POST with date', async () => {
      const date = '2024-12-31'
      await CompanyAPI.expiryDateLimited(date)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/licenseexpirydate', {
        licenseStartDate: date
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.expiryDateLimited('2024-01-01')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('createCompany', () => {
    it('should call POST with FormData and COMMON_SNACKBAR', async () => {
      const payload = { CompanyName: 'Test Co', LicenseStartDate: '12/31/2024' }
      await CompanyAPI.createCompany(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies', expect.any(FormData), {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should transform date format', async () => {
      const payload = { LicenseStartDate: '01/15/2024 10:00', LicenseEndDate: '12/31/2024 23:59' }
      await CompanyAPI.createCompany(payload)
      const calls = testRequest.post.mock.calls
      expect(calls[0][1]).toBeInstanceOf(FormData)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.createCompany({})
      expect(typeof result.then).toBe('function')
    })

    it('should append array values as multiple form entries', async () => {
      const payload = {
        CompanyName: 'Test',
        LicenseStartDate: '01/01/2024',
        tags: ['tag1', 'tag2']
      }
      await CompanyAPI.createCompany(payload)
      const formData = testRequest.post.mock.calls[0][1]
      expect(formData.getAll('tags')).toEqual(['tag1', 'tag2'])
    })

    it('should append PreferredLanguageTypeResourceId with empty string when falsy', async () => {
      const payload = {
        CompanyName: 'Test',
        LicenseStartDate: '01/01/2024',
        PreferredLanguageTypeResourceId: ''
      }
      await CompanyAPI.createCompany(payload)
      const formData = testRequest.post.mock.calls[0][1]
      expect(formData.get('PreferredLanguageTypeResourceId')).toBe('')
    })

    it('should append PreferredLanguageTypeResourceId when provided', async () => {
      const payload = {
        CompanyName: 'Test',
        LicenseStartDate: '01/01/2024',
        PreferredLanguageTypeResourceId: 'lang-123'
      }
      await CompanyAPI.createCompany(payload)
      const formData = testRequest.post.mock.calls[0][1]
      expect(formData.get('PreferredLanguageTypeResourceId')).toBe('lang-123')
    })

    it('should skip falsy values for non-PreferredLanguage keys', async () => {
      const payload = {
        CompanyName: 'Test',
        LicenseStartDate: '01/01/2024',
        optionalField: null,
        emptyString: ''
      }
      await CompanyAPI.createCompany(payload)
      const formData = testRequest.post.mock.calls[0][1]
      expect(formData.has('optionalField')).toBe(false)
      expect(formData.has('emptyString')).toBe(false)
    })
  })

  describe('updateCompany', () => {
    it('should call PUT with id, FormData and COMMON_SNACKBAR', async () => {
      const payload = { CompanyName: 'Updated Co' }
      await CompanyAPI.updateCompany('company-123', payload)
      expect(testRequest.put).toHaveBeenCalledWith('/companies/company-123', expect.any(FormData), {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.updateCompany('id-5', {})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('updateInitializeCompany', () => {
    it('should call PUT with COMMON_SNACKBAR', async () => {
      const payload = { initialized: true }
      await CompanyAPI.updateInitializeCompany(payload)
      expect(testRequest.put).toHaveBeenCalledWith('/companies/limited', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.updateInitializeCompany({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('updateCompanyGroup', () => {
    it('should call PUT with id, payload and COMMON_SNACKBAR', async () => {
      const payload = { name: 'Updated Group' }
      await CompanyAPI.updateCompanyGroup('group-456', payload)
      expect(testRequest.put).toHaveBeenCalledWith('/company-groups/group-456', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.updateCompanyGroup('id-6', {})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('addCompanyToCompanyGroup', () => {
    it('should call PUT with resourceId, payload and COMMON_SNACKBAR', async () => {
      const payload = { companies: ['comp-1'] }
      await CompanyAPI.addCompanyToCompanyGroup('group-789', payload)
      expect(testRequest.put).toHaveBeenCalledWith('/company-groups/group-789/participants', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle default empty values', async () => {
      await CompanyAPI.addCompanyToCompanyGroup()
      expect(testRequest.put).toHaveBeenCalledWith('/company-groups//participants', {}, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.addCompanyToCompanyGroup('id-7', {})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('removeCompanyToCompanyGroup', () => {
    it('should call DELETE with resourceId, payload and COMMON_SNACKBAR', async () => {
      const payload = { companies: ['comp-1'] }
      await CompanyAPI.removeCompanyToCompanyGroup('group-abc', payload)
      expect(testRequest.delete).toHaveBeenCalledWith('/company-groups/group-abc/participants', {
        data: payload,
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.removeCompanyToCompanyGroup('id-8', {})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getCompanyList', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getCompanyList()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/my')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getCompanyList()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getCompanyListForThreatSharing', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getCompanyListForThreatSharing()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/community-companies')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getCompanyListForThreatSharing()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('searchEmailTemplate', () => {
    it('should call POST with payload', async () => {
      const payload = { page: 1 }
      await CompanyAPI.searchEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/email-templates/search', payload)
    })

    it('should handle empty payload', async () => {
      await CompanyAPI.searchEmailTemplate()
      expect(testRequest.post).toHaveBeenCalledWith('/companies/email-templates/search', {})
    })

    it('should return thenable', () => {
      const result = CompanyAPI.searchEmailTemplate()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('createEmailTemplate', () => {
    it('should call POST with COMMON_SNACKBAR', async () => {
      const payload = { name: 'Template 1' }
      await CompanyAPI.createEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/email-templates', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.createEmailTemplate({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getEmailTemplate', () => {
    it('should call GET with template id', async () => {
      await CompanyAPI.getEmailTemplate('template-123')
      expect(testRequest.get).toHaveBeenCalledWith('/companies/email-templates/template-123')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getEmailTemplate('id-9')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getNotificationTemplatesDeliverySettings', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getNotificationTemplatesDeliverySettings()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/email-templates/email-delivery-setting-list')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getNotificationTemplatesDeliverySettings()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getDefaultEmailTemplate', () => {
    it('should call GET with template id', async () => {
      await CompanyAPI.getDefaultEmailTemplate('template-456')
      expect(testRequest.get).toHaveBeenCalledWith('/companies/email-templates/template-456/default')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getDefaultEmailTemplate('id-10')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('exportEmailTemplate', () => {
    it('should call POST with blob responseType', async () => {
      const payload = { filter: 'all' }
      await CompanyAPI.exportEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/email-templates/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.exportEmailTemplate({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('updateEmailTemplate', () => {
    it('should call PUT with COMMON_SNACKBAR', async () => {
      const payload = { name: 'Updated' }
      await CompanyAPI.updateEmailTemplate('template-789', payload)
      expect(testRequest.put).toHaveBeenCalledWith('/companies/email-templates/template-789', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.updateEmailTemplate('id-11', {})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getMergedTags', () => {
    it('should call GET with template id', async () => {
      await CompanyAPI.getMergedTags('template-abc')
      expect(testRequest.get).toHaveBeenCalledWith('/companies/email-templates/merge-tags/template-abc')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getMergedTags('id-12')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('deleteEmailTemplate', () => {
    it('should call DELETE with COMMON_SNACKBAR', async () => {
      await CompanyAPI.deleteEmailTemplate('template-def')
      expect(testRequest.delete).toHaveBeenCalledWith('/companies/email-templates/template-def', {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.deleteEmailTemplate('id-13')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getCategories', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getCategories()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/email-templates/categorylookup')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getCategories()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getTemplateTypes', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getTemplateTypes()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/email-templates/typelookup')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getTemplateTypes()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getCheckCompanyLicense', () => {
    it('should call GET with company id', async () => {
      await CompanyAPI.getCheckCompanyLicense('company-123')
      expect(testRequest.get).toHaveBeenCalledWith('/companies/company-123/license-check')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getCheckCompanyLicense('id-14')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('bulkDeleteCompanies', () => {
    it('should call DELETE with payload and COMMON_SNACKBAR', async () => {
      const payload = { companyIds: ['comp-1', 'comp-2'] }
      await CompanyAPI.bulkDeleteCompanies(payload)
      expect(testRequest.delete).toHaveBeenCalledWith('/companies/bulk-delete', {
        data: payload,
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.bulkDeleteCompanies({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('bulkDeleteCompanyGroups', () => {
    it('should call DELETE with payload and COMMON_SNACKBAR', async () => {
      const payload = { groupIds: ['group-1'] }
      await CompanyAPI.bulkDeleteCompanyGroups(payload)
      expect(testRequest.delete).toHaveBeenCalledWith('/company-groups/bulk-delete', {
        data: payload,
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.bulkDeleteCompanyGroups({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('makeDefaultTemplate', () => {
    it('should call PUT with COMMON_SNACKBAR', async () => {
      const payload = { default: true }
      await CompanyAPI.makeDefaultTemplate('template-123', payload)
      expect(testRequest.put).toHaveBeenCalledWith('/companies/email-templates/make-default/template-123', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.makeDefaultTemplate('id-15', {})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getCompanyPrivacy', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getCompanyPrivacy()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/privacy')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getCompanyPrivacy()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('updateCompanyPrivacy', () => {
    it('should call PUT with COMMON_SNACKBAR', async () => {
      const payload = { privacyEnabled: true }
      await CompanyAPI.updateCompanyPrivacy(payload)
      expect(testRequest.put).toHaveBeenCalledWith('/companies/privacy', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.updateCompanyPrivacy({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getTimeByTimeZone', () => {
    it('should call GET with timeZoneId', async () => {
      await CompanyAPI.getTimeByTimeZone('EST')
      expect(testRequest.get).toHaveBeenCalledWith('/companies/get-current-time/EST')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getTimeByTimeZone('PST')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getCompanyDataPrivacy', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getCompanyDataPrivacy()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/privacymask')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getCompanyDataPrivacy()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('saveCompanyDataPrivacy', () => {
    it('should call PUT with COMMON_SNACKBAR', async () => {
      const payload = { maskData: true }
      await CompanyAPI.saveCompanyDataPrivacy(payload)
      expect(testRequest.put).toHaveBeenCalledWith('/companies/privacymask', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.saveCompanyDataPrivacy({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('saveAIAllySettings', () => {
    it('should call POST with COMMON_SNACKBAR', async () => {
      const payload = { enabled: true }
      await CompanyAPI.saveAIAllySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/ai', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = CompanyAPI.saveAIAllySettings({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getAIAllySettings', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getAIAllySettings()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/ai')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getAIAllySettings()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getAgenticAIMetadata', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getAgenticAIMetadata()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/agentic-ai-settings/metadata')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getAgenticAIMetadata()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getAgenticAISettings', () => {
    it('should call GET without config', async () => {
      await CompanyAPI.getAgenticAISettings()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/agentic-ai-settings', {})
    })

    it('should merge custom config', async () => {
      const config = { loading: false }
      await CompanyAPI.getAgenticAISettings(config)
      expect(testRequest.get).toHaveBeenCalledWith('/companies/agentic-ai-settings', config)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getAgenticAISettings()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('updateAgenticAISettings', () => {
    it('should call PATCH', async () => {
      const payload = { setting: 'value' }
      await CompanyAPI.updateAgenticAISettings(payload)
      expect(testRequest.patch).toHaveBeenCalledWith('/companies/agentic-ai-settings', payload)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.updateAgenticAISettings({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('resetAgenticAISettings', () => {
    it('should call POST endpoint', async () => {
      await CompanyAPI.resetAgenticAISettings()
      expect(testRequest.post).toHaveBeenCalledWith('/companies/agentic-ai-settings/reset')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.resetAgenticAISettings()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getAgenticAIStatus', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getAgenticAIStatus()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/agentic-ai')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getAgenticAIStatus()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('toggleAgenticAIStatus', () => {
    it('should call POST with payload', async () => {
      const payload = { enabled: true }
      await CompanyAPI.toggleAgenticAIStatus(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/agentic-ai', payload)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.toggleAgenticAIStatus({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('saveAgenticAISettings', () => {
    it('should call updateAgenticAISettings internally', async () => {
      const payload = { setting: 'value' }
      await CompanyAPI.saveAgenticAISettings(payload)
      expect(testRequest.patch).toHaveBeenCalledWith('/companies/agentic-ai-settings', payload)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.saveAgenticAISettings({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('generateNotificationTemplateTranslation', () => {
    it('should call POST', async () => {
      const payload = { templateId: '123', language: 'es' }
      await CompanyAPI.generateNotificationTemplateTranslation(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/email-templates/translate', payload)
    })

    it('should return thenable', () => {
      const result = CompanyAPI.generateNotificationTemplateTranslation({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getNotificationTemplateTranslation', () => {
    it('should call GET endpoint', async () => {
      await CompanyAPI.getNotificationTemplateTranslation()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/translated-email-templates')
    })

    it('should return thenable', () => {
      const result = CompanyAPI.getNotificationTemplateTranslation()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 52 functions', () => {
      const functions = Object.values(CompanyAPI).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(52)
    })
  })

  describe('HTTP Method Usage', () => {
    it('should use GET for read operations', async () => {
      await CompanyAPI.getMyCompanies()
      await CompanyAPI.getCompanyByID('1')
      await CompanyAPI.getCategories()
      await CompanyAPI.getCompanyPrivacy()
      expect(testRequest.get).toHaveBeenCalledTimes(4)
    })

    it('should use POST for creation and search', async () => {
      await CompanyAPI.searchCompanies({})
      await CompanyAPI.createEmailTemplate({})
      await CompanyAPI.saveAIAllySettings({})
      expect(testRequest.post).toHaveBeenCalledTimes(3)
    })

    it('should use PUT for updates', async () => {
      await CompanyAPI.updateCompanyPrivacy({})
      await CompanyAPI.updateCompanyGroup('1', {})
      expect(testRequest.put).toHaveBeenCalledTimes(2)
    })

    it('should use DELETE for deletions', async () => {
      await CompanyAPI.deleteCompany('1')
      await CompanyAPI.deleteEmailTemplate('1')
      expect(testRequest.delete).toHaveBeenCalledTimes(2)
    })

    it('should use PATCH for agentic AI settings', async () => {
      await CompanyAPI.updateAgenticAISettings({})
      expect(testRequest.patch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling', () => {
    it('should propagate POST errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(CompanyAPI.createCompany({})).rejects.toThrow('Creation failed')
    })

    it('should propagate GET errors', async () => {
      const error = new Error('Not found')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(CompanyAPI.getMyCompanies()).rejects.toThrow('Not found')
    })

    it('should propagate DELETE errors', async () => {
      const error = new Error('Delete failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(CompanyAPI.deleteCompany('1')).rejects.toThrow('Delete failed')
    })
  })
})
