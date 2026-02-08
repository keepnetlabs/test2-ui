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

    it('should handle numeric and string resource IDs', async () => {
      await directCreationApi.getDirectEmailCreation(123)
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/123`)

      testRequest.get.mockClear()
      await directCreationApi.getDirectEmailCreation('email-abc')
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/email-abc`)
    })

    it('should handle special characters in email names', async () => {
      const payload = { name: 'Direct-Email-@-#-2024' }
      await directCreationApi.createDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        directCreationApi.searchEmailCreations({}),
        directCreationApi.getDirectEmailCreation('id'),
        directCreationApi.getApplicationId(),
        directCreationApi.getDirectEmailSettings(),
        directCreationApi.getGoogleWorkspaceClientId(),
        directCreationApi.createDirectEmailCreation({}),
        directCreationApi.updateDirectEmailCreation('id', {}),
        directCreationApi.deleteEmailCreation('id'),
        directCreationApi.makeDefault('id', {}),
        directCreationApi.removeDefault('id', {}),
        directCreationApi.testDirectEmailCreation({}),
        directCreationApi.getDomains({}),
        directCreationApi.exportDirectEmailCreation({})
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof directCreationApi.searchEmailCreations).toBe('function')
      expect(typeof directCreationApi.getDirectEmailCreation).toBe('function')
      expect(typeof directCreationApi.getApplicationId).toBe('function')
      expect(typeof directCreationApi.getDirectEmailSettings).toBe('function')
      expect(typeof directCreationApi.getGoogleWorkspaceClientId).toBe('function')
      expect(typeof directCreationApi.createDirectEmailCreation).toBe('function')
      expect(typeof directCreationApi.updateDirectEmailCreation).toBe('function')
      expect(typeof directCreationApi.deleteEmailCreation).toBe('function')
      expect(typeof directCreationApi.makeDefault).toBe('function')
      expect(typeof directCreationApi.removeDefault).toBe('function')
      expect(typeof directCreationApi.testDirectEmailCreation).toBe('function')
      expect(typeof directCreationApi.getDomains).toBe('function')
      expect(typeof directCreationApi.exportDirectEmailCreation).toBe('function')
    })

    it('should export at least 13 functions', () => {
      const functions = Object.values(directCreationApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(13)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle direct email creation full CRUD workflow', async () => {
      await directCreationApi.searchEmailCreations({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await directCreationApi.createDirectEmailCreation({ name: 'New Email' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await directCreationApi.getDirectEmailCreation('email-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await directCreationApi.updateDirectEmailCreation('email-1', { name: 'Updated' })
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await directCreationApi.deleteEmailCreation('email-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle domain retrieval and testing workflow', async () => {
      await directCreationApi.getDomains({ type: 'o365' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await directCreationApi.testDirectEmailCreation({ email: 'test@example.com' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle default email management workflow', async () => {
      const id = 'email-1'
      await directCreationApi.makeDefault(id, {})
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await directCreationApi.removeDefault(id, {})
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel direct email operations', async () => {
      const results = await Promise.all([
        directCreationApi.getApplicationId(),
        directCreationApi.getDirectEmailSettings(),
        directCreationApi.getGoogleWorkspaceClientId()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.get).toHaveBeenCalledTimes(3)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle direct email search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await directCreationApi.searchEmailCreations(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}/search`, payload)
    })

    it('should handle direct email creation with various email types', async () => {
      const types = ['o365', 'google', 'custom']
      for (const type of types) {
        testRequest.post.mockClear()
        await directCreationApi.createDirectEmailCreation({ name: 'Email', type })
        expect(testRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle update with partial fields', async () => {
      const payload = { name: 'Updated Name' }
      await directCreationApi.updateDirectEmailCreation('email-1', payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${API_URL}/email-1`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle domain retrieval with different type filters', async () => {
      const types = ['o365', 'google', 'verified_domains', 'all']
      for (const type of types) {
        testRequest.post.mockClear()
        await directCreationApi.getDomains({ type })
        expect(testRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle test with various email addresses', async () => {
      const emails = ['test@example.com', 'admin@company.org', 'user+tag@domain.co.uk']
      for (const email of emails) {
        testRequest.post.mockClear()
        await directCreationApi.testDirectEmailCreation({ email })
        expect(testRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle export with complex filter payloads', async () => {
      const payload = {
        filters: {
          status: ['active'],
          type: ['o365', 'google'],
          dateRange: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await directCreationApi.exportDirectEmailCreation(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}/search/export`,
        payload,
        expect.any(Object)
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchEmailCreations errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(directCreationApi.searchEmailCreations({})).rejects.toThrow('Search failed')
    })

    it('should propagate getDirectEmailCreation errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(directCreationApi.getDirectEmailCreation('id')).rejects.toThrow('Fetch failed')
    })

    it('should propagate createDirectEmailCreation errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(directCreationApi.createDirectEmailCreation({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateDirectEmailCreation errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(directCreationApi.updateDirectEmailCreation('id', {})).rejects.toThrow('Update failed')
    })

    it('should propagate deleteEmailCreation errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(directCreationApi.deleteEmailCreation('id')).rejects.toThrow('Deletion failed')
    })

    it('should propagate testDirectEmailCreation errors', async () => {
      const error = new Error('Test failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(directCreationApi.testDirectEmailCreation({})).rejects.toThrow('Test failed')
    })

    it('should propagate getDomains errors', async () => {
      const error = new Error('Domain retrieval failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(directCreationApi.getDomains({})).rejects.toThrow('Domain retrieval failed')
    })

    it('should propagate exportDirectEmailCreation errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(directCreationApi.exportDirectEmailCreation({})).rejects.toThrow('Export failed')
    })

    it('should propagate makeDefault errors', async () => {
      const error = new Error('Make default failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(directCreationApi.makeDefault('id', {})).rejects.toThrow('Make default failed')
    })

    it('should propagate removeDefault errors', async () => {
      const error = new Error('Remove default failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(directCreationApi.removeDefault('id', {})).rejects.toThrow('Remove default failed')
    })
  })
})
