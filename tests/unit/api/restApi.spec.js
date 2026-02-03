jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
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
})
