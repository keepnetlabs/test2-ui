jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import directCreationApi from '@/api/direct-creation'

describe('direct-creation API', () => {
  const API_URL = '/companies/direct-email-settings'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('direct email creation search and retrieval', () => {
    it('should call searchEmailCreations', async () => {
      const payload = { page: 1 }
      await directCreationApi.searchEmailCreations(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}/search`, payload)
    })

    it('should call getDirectEmailCreation', async () => {
      const resourceId = 'email-123'
      await directCreationApi.getDirectEmailCreation(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/${resourceId}`)
    })

    it('should call getDirectEmailCreation with empty resourceId', async () => {
      await directCreationApi.getDirectEmailCreation()
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/`)
    })

    it('should call getApplicationId', async () => {
      await directCreationApi.getApplicationId()
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/application-id`)
    })

    it('should call getDirectEmailSettings', async () => {
      await directCreationApi.getDirectEmailSettings()
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/settings`)
    })

    it('should call getGoogleWorkspaceClientId', async () => {
      await directCreationApi.getGoogleWorkspaceClientId()
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/google-client`)
    })
  })

  describe('direct email creation management', () => {
    it('should call createDirectEmailCreation', async () => {
      const payload = { name: 'New Email' }
      await directCreationApi.createDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createDirectEmailCreation with empty payload', async () => {
      await directCreationApi.createDirectEmailCreation()
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateDirectEmailCreation', async () => {
      const payload = { name: 'Updated Email' }
      const resourceId = 'email-123'
      await directCreationApi.updateDirectEmailCreation(resourceId, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${API_URL}/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteEmailCreation', async () => {
      const resourceId = 'email-123'
      await directCreationApi.deleteEmailCreation(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `${API_URL}/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call makeDefault', async () => {
      const resourceId = 'email-123'
      const payload = {}
      await directCreationApi.makeDefault(resourceId, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${API_URL}/make-default/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call removeDefault', async () => {
      const resourceId = 'email-123'
      const payload = {}
      await directCreationApi.removeDefault(resourceId, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${API_URL}/remove-default/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('direct email testing operations', () => {
    it('should call testDirectEmailCreation', async () => {
      const payload = { email: 'test@example.com' }
      await directCreationApi.testDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}/test`,
        payload,
        expect.objectContaining({
          snackbar: expect.objectContaining({
            hideError: true
          })
        })
      )
    })
  })

  describe('direct email domain operations', () => {
    it('should call getDomains', async () => {
      const payload = { type: 'o365' }
      await directCreationApi.getDomains(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}/domain-list`,
        payload,
        { snackbar: { hideError: true } }
      )
    })

    it('should call getDomains with empty payload', async () => {
      await directCreationApi.getDomains()
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}/domain-list`,
        {},
        { snackbar: { hideError: true } }
      )
    })
  })

  describe('direct email export operations', () => {
    it('should call exportDirectEmailCreation', async () => {
      const payload = { filters: {} }
      await directCreationApi.exportDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportDirectEmailCreation with empty payload', async () => {
      await directCreationApi.exportDirectEmailCreation()
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}/search/export`,
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const resourceId = 'email-123'
      await directCreationApi.getDirectEmailCreation(resourceId)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await directCreationApi.searchEmailCreations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await directCreationApi.updateDirectEmailCreation('email-123', payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await directCreationApi.deleteEmailCreation('email-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for creation', async () => {
      const payload = { name: 'New Email' }
      await directCreationApi.createDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { name: 'Updated' }
      await directCreationApi.updateDirectEmailCreation('email-123', payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await directCreationApi.deleteEmailCreation('email-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use hideError snackbar for domain retrieval', async () => {
      const payload = { type: 'o365' }
      await directCreationApi.getDomains(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        { snackbar: { hideError: true } }
      )
    })

    it('should use hideError snackbar for testing', async () => {
      const payload = { email: 'test@example.com' }
      await directCreationApi.testDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          snackbar: expect.objectContaining({ hideError: true })
        })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await directCreationApi.exportDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle searchEmailCreations with complex filters', async () => {
      const payload = {
        page: 1,
        filters: {
          status: ['active', 'inactive'],
          type: ['o365', 'google']
        }
      }
      await directCreationApi.searchEmailCreations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle direct email creation with O365 credentials', async () => {
      const payload = {
        name: 'O365 Direct Email',
        type: 'o365',
        tenantId: 'tenant-123',
        applicationId: 'app-456'
      }
      await directCreationApi.createDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle direct email creation with Google Workspace credentials', async () => {
      const payload = {
        name: 'Google Workspace Direct Email',
        type: 'google',
        customerId: 'customer-123'
      }
      await directCreationApi.createDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle setting email as default', async () => {
      await directCreationApi.makeDefault('email-123', {})
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle removing email from default', async () => {
      await directCreationApi.removeDefault('email-123', {})
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle domain list with type filter', async () => {
      const payload = { type: 'verified_domains' }
      await directCreationApi.getDomains(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle exportDirectEmailCreation with date range', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          status: ['active']
        }
      }
      await directCreationApi.exportDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })
})
