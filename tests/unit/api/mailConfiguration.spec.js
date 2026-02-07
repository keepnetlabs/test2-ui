jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as mailConfigurationApi from '@/api/mailConfiguration'

describe('mailConfiguration API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('mail configuration search and retrieval', () => {
    it('should call getMailConfigurationList', async () => {
      const payload = { page: 1 }
      await mailConfigurationApi.getMailConfigurationList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/mail-configurations/search', payload)
    })

    it('should call getO365MailData', async () => {
      const id = 'config-123'
      await mailConfigurationApi.getO365MailData(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `mail-configurations/o365/${id}`,
        { loading: true }
      )
    })

    it('should call getEWSMailData', async () => {
      const id = 'config-123'
      await mailConfigurationApi.getEWSMailData(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `mail-configurations/exchange/${id}`,
        { loading: true }
      )
    })

    it('should call getGoogleWorkSpace', async () => {
      const resourceId = 'config-123'
      await mailConfigurationApi.getGoogleWorkSpace(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `mail-configurations/googleworkspace/${resourceId}`,
        { loading: true }
      )
    })
  })

  describe('O365 configuration operations', () => {
    it('should call createO365', async () => {
      const payload = { name: 'O365 Config' }
      await mailConfigurationApi.createO365(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365',
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateO365', async () => {
      const url = 'https://example.com'
      const payload = { name: 'Updated O365' }
      await mailConfigurationApi.updateO365(payload, url)
      expect(testRequest.put).toHaveBeenCalledWith(
        `mail-configurations/o365/${url}`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteO365', async () => {
      const url = 'https://example.com'
      await mailConfigurationApi.deleteO365(url)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `mail-configurations/o365/${url}`,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('EWS configuration operations', () => {
    it('should call createEWS', async () => {
      const payload = { name: 'EWS Config' }
      await mailConfigurationApi.createEWS(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/ews',
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateEWS', async () => {
      const url = 'https://example.com'
      const payload = { name: 'Updated EWS' }
      await mailConfigurationApi.updateEWS(payload, url)
      expect(testRequest.put).toHaveBeenCalledWith(
        `mail-configurations/ews/${url}`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteEWS', async () => {
      const url = 'https://example.com'
      await mailConfigurationApi.deleteEWS(url)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `mail-configurations/ews/${url}`,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('Google Workspace configuration operations', () => {
    it('should call createGoogleWorkSpace', async () => {
      const payload = { name: 'Google Config' }
      await mailConfigurationApi.createGoogleWorkSpace(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/googleworkspace',
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createGoogleWorkSpace with empty payload', async () => {
      await mailConfigurationApi.createGoogleWorkSpace()
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/googleworkspace',
        {},
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateGoogleWorkSpace', async () => {
      const payload = { name: 'Updated Google' }
      const resourceId = 'config-123'
      await mailConfigurationApi.updateGoogleWorkSpace(payload, resourceId)
      expect(testRequest.put).toHaveBeenCalledWith(
        `mail-configurations/googleworkspace/${resourceId}`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteGoogleWorkSpace', async () => {
      const resourceId = 'config-123'
      await mailConfigurationApi.deleteGoogleWorkSpace(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `mail-configurations/googleworkspace/${resourceId}`,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('O365 permission checks', () => {
    it('should call checkApiConnectivity', async () => {
      const payload = { tenantId: 'tenant-123' }
      await mailConfigurationApi.checkApiConnectivity(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365/check-api-connectivity',
        payload
      )
    })

    it('should call checkPrivileges', async () => {
      const payload = { tenantId: 'tenant-123' }
      await mailConfigurationApi.checkPrivileges(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365/check-privileges-access',
        payload
      )
    })

    it('should call checkAllUsersAccess', async () => {
      const payload = { tenantId: 'tenant-123' }
      await mailConfigurationApi.checkAllUsersAccess(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365/check-all-users-access',
        payload
      )
    })

    it('should call checkEmailAccess', async () => {
      const payload = { tenantId: 'tenant-123' }
      await mailConfigurationApi.checkEmailAccess(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365/check-email-access',
        payload
      )
    })

    it('should call checkCreateNewCategory', async () => {
      const payload = { tenantId: 'tenant-123' }
      await mailConfigurationApi.checkCreateNewCategory(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365/check-create-new-category',
        payload
      )
    })

    it('should call checkUpdateCategory', async () => {
      const payload = { tenantId: 'tenant-123' }
      await mailConfigurationApi.checkUpdateCategory(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365/check-update-category',
        payload
      )
    })

    it('should call checkDeleteEmail', async () => {
      const payload = { tenantId: 'tenant-123' }
      await mailConfigurationApi.checkDeleteEmail(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365/check-delete-email',
        payload
      )
    })

    it('should call checkInboxAccess', async () => {
      const payload = { tenantId: 'tenant-123' }
      await mailConfigurationApi.checkInboxAccess(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365/check-inbox-access',
        payload
      )
    })
  })

  describe('Google Workspace permission checks', () => {
    it('should call checkApiConnectivityGoogleWorkspace', async () => {
      const payload = { customerId: 'customer-123' }
      await mailConfigurationApi.checkApiConnectivityGoogleWorkspace(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/gsuite/check-api-connectivity',
        payload
      )
    })

    it('should call checkPrivilegesGoogleWorkspace', async () => {
      const payload = { customerId: 'customer-123' }
      await mailConfigurationApi.checkPrivilegesGoogleWorkspace(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/gsuite/check-privileges-access',
        payload
      )
    })

    it('should call checkAllUsersAccessGoogleWorkspace', async () => {
      const payload = { customerId: 'customer-123' }
      await mailConfigurationApi.checkAllUsersAccessGoogleWorkspace(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/gsuite/check-all-users-access',
        payload
      )
    })

    it('should call checkEmailAccessGoogleWorkspace', async () => {
      const payload = { customerId: 'customer-123' }
      await mailConfigurationApi.checkEmailAccessGoogleWorkspace(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/gsuite/check-email-access',
        payload
      )
    })

    it('should call checkCreateNewCategoryGoogleWorkspace', async () => {
      const payload = { customerId: 'customer-123' }
      await mailConfigurationApi.checkCreateNewCategoryGoogleWorkspace(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/gsuite/check-create-new-category',
        payload
      )
    })

    it('should call checkUpdateCategoryGoogleWorkspace', async () => {
      const payload = { customerId: 'customer-123' }
      await mailConfigurationApi.checkUpdateCategoryGoogleWorkspace(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/gsuite/check-update-category',
        payload
      )
    })

    it('should call checkDeleteEmailGoogleWorkspace', async () => {
      const payload = { customerId: 'customer-123' }
      await mailConfigurationApi.checkDeleteEmailGoogleWorkspace(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/gsuite/check-delete-email',
        payload
      )
    })

    it('should call checkInboxAccessGoogleWorkspace', async () => {
      const payload = { customerId: 'customer-123' }
      await mailConfigurationApi.checkInboxAccessGoogleWorkspace(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/gsuite/check-inbox-access',
        payload
      )
    })
  })

  describe('EWS permission checks', () => {
    it('should call checkApiConnectivityEWS', async () => {
      const payload = { exchangeUrl: 'https://exchange.example.com' }
      await mailConfigurationApi.checkApiConnectivityEWS(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/ews/check-api-connectivity',
        payload
      )
    })

    it('should call checkPrivilegesEWS', async () => {
      const payload = { exchangeUrl: 'https://exchange.example.com' }
      await mailConfigurationApi.checkPrivilegesEWS(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/ews/check-privileges-access',
        payload
      )
    })

    it('should call checkInboxAccessEWS', async () => {
      const payload = { exchangeUrl: 'https://exchange.example.com' }
      await mailConfigurationApi.checkInboxAccessEWS(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/ews/check-inbox-access',
        payload
      )
    })

    it('should call checkEmailBodyAccessEWS', async () => {
      const payload = { exchangeUrl: 'https://exchange.example.com' }
      await mailConfigurationApi.checkEmailBodyAccessEWS(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/ews/check-email-body-access',
        payload
      )
    })

    it('should call checkEmailHeaderAccessEWS', async () => {
      const payload = { exchangeUrl: 'https://exchange.example.com' }
      await mailConfigurationApi.checkEmailHeaderAccessEWS(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/ews/check-email-header-access',
        payload
      )
    })

    it('should call checkEmailMailFilterEWS', async () => {
      const payload = { exchangeUrl: 'https://exchange.example.com' }
      await mailConfigurationApi.checkEmailMailFilterEWS(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/ews/check-mail-filter',
        payload
      )
    })
  })

  describe('domain and configuration operations', () => {
    it('should call getDomainList', async () => {
      const payload = { tenantId: 'tenant-123' }
      await mailConfigurationApi.getDomainList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'mail-configurations/o365/list-related-domains',
        payload,
        { loading: true }
      )
    })

    it('should call getExchangeVersions', async () => {
      const payload = { typeName: 'Exchange Versions', typeidlist: [] }
      await mailConfigurationApi.getExchangeVersions(payload)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', payload)
    })

    it('should call getExchangeVersions with default payload', async () => {
      await mailConfigurationApi.getExchangeVersions()
      expect(testRequest.post).toHaveBeenCalledWith('lookups', {
        typeName: 'Exchange Versions',
        typeidlist: []
      })
    })
  })

  describe('export operations', () => {
    it('should call exportMailConfiguration', async () => {
      const payload = { filters: {} }
      await mailConfigurationApi.exportMailConfiguration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/mail-configurations/search/export',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const id = 'config-123'
      await mailConfigurationApi.getO365MailData(id)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and checks', async () => {
      const payload = { page: 1 }
      await mailConfigurationApi.getMailConfigurationList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await mailConfigurationApi.updateO365(payload, 'https://example.com')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await mailConfigurationApi.deleteO365('https://example.com')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar and loading consistency', () => {
    it('should include loading for O365 creation', async () => {
      const payload = { name: 'O365' }
      await mailConfigurationApi.createO365(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ loading: true })
      )
    })

    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { name: 'Updated' }
      await mailConfigurationApi.updateO365(payload, 'https://example.com')
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await mailConfigurationApi.exportMailConfiguration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle O365 configuration with complex payload', async () => {
      const payload = {
        name: 'Exchange Online',
        tenantId: 'tenant-123',
        applicationId: 'app-456',
        directoryId: 'dir-789'
      }
      await mailConfigurationApi.createO365(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle multiple mail configurations listing', async () => {
      const payload = {
        page: 1,
        filters: { type: ['o365', 'ews', 'google'] }
      }
      await mailConfigurationApi.getMailConfigurationList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle domain list retrieval with filters', async () => {
      const payload = {
        tenantId: 'tenant-123',
        filter: 'verified'
      }
      await mailConfigurationApi.getDomainList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle numeric and string configuration IDs', async () => {
      await mailConfigurationApi.getO365MailData(123)
      expect(testRequest.get).toHaveBeenCalled()

      testRequest.get.mockClear()
      await mailConfigurationApi.getO365MailData('config-abc')
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle URLs with special characters', async () => {
      const url = 'https://tenant@company.onmicrosoft.com'
      await mailConfigurationApi.deleteO365(url)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `mail-configurations/o365/${url}`,
        expect.any(Object)
      )
    })

    it('should handle Google Workspace configuration with custom domain', async () => {
      const payload = {
        name: 'Google Workspace',
        customerId: 'customer-123',
        domain: 'company.com'
      }
      await mailConfigurationApi.createGoogleWorkSpace(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        mailConfigurationApi.getMailConfigurationList({}),
        mailConfigurationApi.getO365MailData('id'),
        mailConfigurationApi.getEWSMailData('id'),
        mailConfigurationApi.getGoogleWorkSpace('id'),
        mailConfigurationApi.createO365({}),
        mailConfigurationApi.updateO365({}, 'url'),
        mailConfigurationApi.deleteO365('url'),
        mailConfigurationApi.createEWS({}),
        mailConfigurationApi.updateEWS({}, 'url'),
        mailConfigurationApi.deleteEWS('url'),
        mailConfigurationApi.createGoogleWorkSpace({}),
        mailConfigurationApi.updateGoogleWorkSpace({}, 'id'),
        mailConfigurationApi.deleteGoogleWorkSpace('id'),
        mailConfigurationApi.getDomainList({}),
        mailConfigurationApi.exportMailConfiguration({})
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof mailConfigurationApi.getMailConfigurationList).toBe('function')
      expect(typeof mailConfigurationApi.getO365MailData).toBe('function')
      expect(typeof mailConfigurationApi.getEWSMailData).toBe('function')
      expect(typeof mailConfigurationApi.getGoogleWorkSpace).toBe('function')
      expect(typeof mailConfigurationApi.createO365).toBe('function')
      expect(typeof mailConfigurationApi.updateO365).toBe('function')
      expect(typeof mailConfigurationApi.deleteO365).toBe('function')
      expect(typeof mailConfigurationApi.createEWS).toBe('function')
      expect(typeof mailConfigurationApi.updateEWS).toBe('function')
      expect(typeof mailConfigurationApi.deleteEWS).toBe('function')
      expect(typeof mailConfigurationApi.createGoogleWorkSpace).toBe('function')
      expect(typeof mailConfigurationApi.updateGoogleWorkSpace).toBe('function')
      expect(typeof mailConfigurationApi.deleteGoogleWorkSpace).toBe('function')
      expect(typeof mailConfigurationApi.getDomainList).toBe('function')
      expect(typeof mailConfigurationApi.exportMailConfiguration).toBe('function')
    })

    it('should export at least 15 functions', () => {
      const functions = Object.values(mailConfigurationApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(15)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle O365 configuration full workflow', async () => {
      await mailConfigurationApi.getMailConfigurationList({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await mailConfigurationApi.createO365({ name: 'O365' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await mailConfigurationApi.getO365MailData('config-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await mailConfigurationApi.updateO365({ name: 'Updated' }, 'https://example.com')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await mailConfigurationApi.deleteO365('https://example.com')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle EWS configuration workflow', async () => {
      await mailConfigurationApi.createEWS({ name: 'EWS' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await mailConfigurationApi.getEWSMailData('config-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle Google Workspace configuration workflow', async () => {
      await mailConfigurationApi.createGoogleWorkSpace({ name: 'Google' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await mailConfigurationApi.getGoogleWorkSpace('config-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel mail configuration operations', async () => {
      const results = await Promise.all([
        mailConfigurationApi.getMailConfigurationList({}),
        mailConfigurationApi.getO365MailData('id'),
        mailConfigurationApi.getEWSMailData('id')
      ])

      expect(results).toHaveLength(3)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle mail configuration search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await mailConfigurationApi.getMailConfigurationList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/mail-configurations/search', payload)
    })

    it('should handle O365 creation with various configurations', async () => {
      const configs = [
        { name: 'O365 1', tenantId: 'tenant-1' },
        { name: 'O365 2', applicationId: 'app-2' },
        { name: 'O365 3', directoryId: 'dir-3' }
      ]

      for (const config of configs) {
        testRequest.post.mockClear()
        await mailConfigurationApi.createO365(config)
        expect(testRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle update with different URL formats', async () => {
      const urls = [
        'https://outlook.office365.com',
        'https://tenant.onmicrosoft.com',
        'https://exchange.example.com'
      ]

      for (const url of urls) {
        testRequest.put.mockClear()
        await mailConfigurationApi.updateO365({ name: 'Updated' }, url)
        expect(testRequest.put).toHaveBeenCalledWith(
          `mail-configurations/o365/${url}`,
          expect.any(Object),
          expect.any(Object)
        )
      }
    })

    it('should handle domain list with complex filters', async () => {
      const payload = {
        tenantId: 'tenant-123',
        filter: 'verified',
        limit: 100
      }
      await mailConfigurationApi.getDomainList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle export with various filter combinations', async () => {
      const payloads = [
        { filters: { type: 'o365' } },
        { filters: { type: 'ews' } },
        { filters: { type: 'google' } },
        { filters: { status: 'active' } }
      ]

      for (const payload of payloads) {
        testRequest.post.mockClear()
        await mailConfigurationApi.exportMailConfiguration(payload)
        expect(testRequest.post).toHaveBeenCalled()
      }
    })
  })

  describe('Error Handling', () => {
    it('should propagate getMailConfigurationList errors', async () => {
      const error = new Error('List fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.getMailConfigurationList({})).rejects.toThrow('List fetch failed')
    })

    it('should propagate getO365MailData errors', async () => {
      const error = new Error('O365 data fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.getO365MailData('id')).rejects.toThrow('O365 data fetch failed')
    })

    it('should propagate getEWSMailData errors', async () => {
      const error = new Error('EWS data fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.getEWSMailData('id')).rejects.toThrow('EWS data fetch failed')
    })

    it('should propagate createO365 errors', async () => {
      const error = new Error('O365 creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.createO365({})).rejects.toThrow('O365 creation failed')
    })

    it('should propagate updateO365 errors', async () => {
      const error = new Error('O365 update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.updateO365({}, 'url')).rejects.toThrow('O365 update failed')
    })

    it('should propagate deleteO365 errors', async () => {
      const error = new Error('O365 deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.deleteO365('url')).rejects.toThrow('O365 deletion failed')
    })

    it('should propagate createEWS errors', async () => {
      const error = new Error('EWS creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.createEWS({})).rejects.toThrow('EWS creation failed')
    })

    it('should propagate createGoogleWorkSpace errors', async () => {
      const error = new Error('Google Workspace creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.createGoogleWorkSpace({})).rejects.toThrow('Google Workspace creation failed')
    })

    it('should propagate getDomainList errors', async () => {
      const error = new Error('Domain list fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.getDomainList({})).rejects.toThrow('Domain list fetch failed')
    })

    it('should propagate exportMailConfiguration errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(mailConfigurationApi.exportMailConfiguration({})).rejects.toThrow('Export failed')
    })
  })
})
