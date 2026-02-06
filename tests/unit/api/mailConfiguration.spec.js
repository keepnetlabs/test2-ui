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
  })
})
