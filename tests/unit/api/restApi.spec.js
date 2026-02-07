jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as restApiApi from '@/api/restApi'

describe('restApi API', () => {
  const API_URL = '/companies/clients'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('REST API search and retrieval', () => {
    it('should call searchRestApi', async () => {
      const payload = { page: 1 }
      await restApiApi.searchRestApi(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}/search`, payload)
    })

    it('should call searchRestApi with empty payload', async () => {
      await restApiApi.searchRestApi()
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}/search`, {})
    })

    it('should call generateClientCredentials', async () => {
      await restApiApi.generateClientCredentials()
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/generate-client-credentials`)
    })

    it('should call getRestApi', async () => {
      const resourceId = 'api-123'
      await restApiApi.getRestApi(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/${resourceId}`)
    })
  })

  describe('REST API management', () => {
    it('should call createRestApi', async () => {
      const payload = { name: 'New API', description: 'Test API' }
      await restApiApi.createRestApi(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createRestApi with empty payload', async () => {
      await restApiApi.createRestApi()
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateRestApi', async () => {
      const resourceId = 'api-123'
      const payload = { name: 'Updated API' }
      await restApiApi.updateRestApi(resourceId, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${API_URL}/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteRestApi', async () => {
      const resourceId = 'api-123'
      await restApiApi.deleteRestApi(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `${API_URL}/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('REST API export operations', () => {
    it('should call exportRestApi', async () => {
      const payload = { filters: {} }
      await restApiApi.exportRestApi(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportRestApi with empty payload', async () => {
      await restApiApi.exportRestApi()
      expect(testRequest.post).toHaveBeenCalledWith(
        `${API_URL}/search/export`,
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const resourceId = 'api-123'
      await restApiApi.getRestApi(resourceId)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await restApiApi.searchRestApi(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await restApiApi.updateRestApi('api-123', payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await restApiApi.deleteRestApi('api-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for creation', async () => {
      const payload = { name: 'New API' }
      await restApiApi.createRestApi(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { name: 'Updated' }
      await restApiApi.updateRestApi('api-123', payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await restApiApi.deleteRestApi('api-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await restApiApi.exportRestApi(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle searchRestApi with complex filters', async () => {
      const payload = {
        page: 1,
        filters: {
          status: ['active', 'inactive'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await restApiApi.searchRestApi(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle REST API creation with all fields', async () => {
      const payload = {
        name: 'Complete API',
        description: 'Full API configuration',
        permissions: ['read', 'write'],
        rateLimit: 1000
      }
      await restApiApi.createRestApi(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle API update with partial fields', async () => {
      const payload = {
        description: 'Updated description'
      }
      await restApiApi.updateRestApi('api-123', payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle exportRestApi with date range filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          status: ['active']
        }
      }
      await restApiApi.exportRestApi(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('searchRestApi should return thenable', () => {
      const result = restApiApi.searchRestApi()
      expect(typeof result.then).toBe('function')
    })

    it('generateClientCredentials should return thenable', () => {
      const result = restApiApi.generateClientCredentials()
      expect(typeof result.then).toBe('function')
    })

    it('createRestApi should return thenable', () => {
      const result = restApiApi.createRestApi()
      expect(typeof result.then).toBe('function')
    })

    it('getRestApi should return thenable', () => {
      const result = restApiApi.getRestApi('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('updateRestApi should return thenable', () => {
      const result = restApiApi.updateRestApi('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('deleteRestApi should return thenable', () => {
      const result = restApiApi.deleteRestApi('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('exportRestApi should return thenable', () => {
      const result = restApiApi.exportRestApi()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 7 functions', () => {
      const functions = Object.values(restApiApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(7)
    })

    it('should have all REST API functions', () => {
      expect(typeof restApiApi.searchRestApi).toBe('function')
      expect(typeof restApiApi.generateClientCredentials).toBe('function')
      expect(typeof restApiApi.createRestApi).toBe('function')
      expect(typeof restApiApi.getRestApi).toBe('function')
      expect(typeof restApiApi.updateRestApi).toBe('function')
      expect(typeof restApiApi.deleteRestApi).toBe('function')
      expect(typeof restApiApi.exportRestApi).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle REST API CRUD workflow', async () => {
      // Search APIs
      await restApiApi.searchRestApi({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Create API
      testRequest.post.mockClear()
      await restApiApi.createRestApi({ name: 'New API' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get API details
      testRequest.get.mockClear()
      await restApiApi.getRestApi('api-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Update API
      testRequest.put.mockClear()
      await restApiApi.updateRestApi('api-1', { name: 'Updated' })
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Delete API
      testRequest.delete.mockClear()
      await restApiApi.deleteRestApi('api-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle credential generation workflow', async () => {
      // Generate credentials
      await restApiApi.generateClientCredentials()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Create API with credentials
      testRequest.post.mockClear()
      await restApiApi.createRestApi({ name: 'Secured API' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle search and export workflow', async () => {
      // Search APIs
      await restApiApi.searchRestApi({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Export results
      testRequest.post.mockClear()
      await restApiApi.exportRestApi({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel API retrieval', async () => {
      const results = await Promise.all([
        restApiApi.searchRestApi({}),
        restApiApi.getRestApi('api-1'),
        restApiApi.generateClientCredentials()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle default payload for searchRestApi', async () => {
      await restApiApi.searchRestApi()
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}/search`, {})
    })

    it('should handle complex search payload', async () => {
      const payload = {
        page: 2,
        pageSize: 50,
        filters: {
          status: ['active', 'suspended'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await restApiApi.searchRestApi(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}/search`, payload)
    })

    it('should handle default payload for createRestApi', async () => {
      await restApiApi.createRestApi()
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}`, {}, expect.any(Object))
    })

    it('should handle complex create payload', async () => {
      const payload = {
        name: 'Advanced API',
        description: 'Advanced configuration',
        permissions: ['read', 'write', 'delete', 'admin'],
        rateLimit: 5000,
        requestTimeout: 30
      }
      await restApiApi.createRestApi(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}`, payload, expect.any(Object))
    })

    it('should handle default resourceId for getRestApi', async () => {
      await restApiApi.getRestApi()
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/`)
    })

    it('should handle numeric and string IDs for getRestApi', async () => {
      await restApiApi.getRestApi(123)
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/123`)

      testRequest.get.mockClear()
      await restApiApi.getRestApi('api-abc')
      expect(testRequest.get).toHaveBeenCalledWith(`${API_URL}/api-abc`)
    })

    it('should handle update with default payload', async () => {
      await restApiApi.updateRestApi('api-1')
      expect(testRequest.put).toHaveBeenCalledWith(`${API_URL}/api-1`, {}, expect.any(Object))
    })

    it('should handle update with complex payload', async () => {
      const payload = {
        name: 'Updated API',
        description: 'New description',
        permissions: ['read', 'write'],
        rateLimit: 3000
      }
      await restApiApi.updateRestApi('api-1', payload)
      expect(testRequest.put).toHaveBeenCalledWith(`${API_URL}/api-1`, payload, expect.any(Object))
    })

    it('should handle deletion with numeric and string IDs', async () => {
      await restApiApi.deleteRestApi(456)
      expect(testRequest.delete).toHaveBeenCalledWith(`${API_URL}/456`, expect.any(Object))

      testRequest.delete.mockClear()
      await restApiApi.deleteRestApi('api-xyz')
      expect(testRequest.delete).toHaveBeenCalledWith(`${API_URL}/api-xyz`, expect.any(Object))
    })

    it('should handle export with default payload', async () => {
      await restApiApi.exportRestApi()
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}/search/export`, {}, expect.any(Object))
    })

    it('should handle export with complex payload', async () => {
      const payload = {
        filters: {
          status: ['active'],
          created: { start: '2024-06-01', end: '2024-12-31' }
        },
        format: 'csv'
      }
      await restApiApi.exportRestApi(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${API_URL}/search/export`, payload, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchRestApi errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(restApiApi.searchRestApi()).rejects.toThrow('Search failed')
    })

    it('should propagate generateClientCredentials errors', async () => {
      const error = new Error('Generation failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(restApiApi.generateClientCredentials()).rejects.toThrow('Generation failed')
    })

    it('should propagate createRestApi errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(restApiApi.createRestApi()).rejects.toThrow('Creation failed')
    })

    it('should propagate getRestApi errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(restApiApi.getRestApi('id-1')).rejects.toThrow('Fetch failed')
    })

    it('should propagate updateRestApi errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(restApiApi.updateRestApi('id-1')).rejects.toThrow('Update failed')
    })

    it('should propagate deleteRestApi errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(restApiApi.deleteRestApi('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate exportRestApi errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(restApiApi.exportRestApi()).rejects.toThrow('Export failed')
    })
  })
})
