jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as proxySettingsApi from '@/api/proxySettings'

describe('proxySettings API', () => {
  const URL = '/companies/proxy-settings'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('proxy settings search and retrieval', () => {
    it('should call searchProxySettings', async () => {
      const payload = { page: 1 }
      await proxySettingsApi.searchProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search`, payload)
    })

    it('should call searchProxySettings with empty payload', async () => {
      await proxySettingsApi.searchProxySettings()
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search`, {})
    })

    it('should call getProxySettings', async () => {
      const resourceId = 'proxy-123'
      await proxySettingsApi.getProxySettings(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(`${URL}/${resourceId}`)
    })
  })

  describe('proxy settings management', () => {
    it('should call createProxySettings', async () => {
      const payload = { host: 'proxy.example.com', port: 8080 }
      await proxySettingsApi.createProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/proxy-settings',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateProxySettings', async () => {
      const payload = { resourceId: 'proxy-123', host: 'proxy.example.com', port: 8080 }
      await proxySettingsApi.updateProxySettings(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `${URL}/proxy-123`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteProxySettings', async () => {
      const id = 'proxy-123'
      await proxySettingsApi.deleteProxySettings(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `${URL}/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('proxy connection operations', () => {
    it('should call testConnection', async () => {
      const payload = { host: 'proxy.example.com', port: 8080 }
      await proxySettingsApi.testConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/proxy-settings/test',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testConnection with empty payload', async () => {
      await proxySettingsApi.testConnection()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/proxy-settings/test',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('proxy settings export operations', () => {
    it('should call exportProxySettings', async () => {
      const payload = { filters: {} }
      await proxySettingsApi.exportProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `${URL}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const resourceId = 'proxy-123'
      await proxySettingsApi.getProxySettings(resourceId)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await proxySettingsApi.searchProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { resourceId: 'proxy-123', host: 'proxy.example.com' }
      await proxySettingsApi.updateProxySettings(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await proxySettingsApi.deleteProxySettings('proxy-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for creation', async () => {
      const payload = { host: 'proxy.example.com' }
      await proxySettingsApi.createProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { resourceId: 'proxy-123', host: 'updated.com' }
      await proxySettingsApi.updateProxySettings(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await proxySettingsApi.deleteProxySettings('proxy-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for connection testing', async () => {
      const payload = { host: 'proxy.example.com' }
      await proxySettingsApi.testConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await proxySettingsApi.exportProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle searchProxySettings with complex filters', async () => {
      const payload = {
        page: 1,
        filters: { status: ['active', 'inactive'] }
      }
      await proxySettingsApi.searchProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle proxy creation with authentication', async () => {
      const payload = {
        host: 'proxy.example.com',
        port: 8080,
        username: 'admin',
        password: 'secret'
      }
      await proxySettingsApi.createProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle proxy update with partial fields', async () => {
      const payload = {
        resourceId: 'proxy-123',
        port: 9090
      }
      await proxySettingsApi.updateProxySettings(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle testConnection with authentication credentials', async () => {
      const payload = {
        host: 'proxy.example.com',
        port: 8080,
        username: 'admin',
        password: 'secret'
      }
      await proxySettingsApi.testConnection(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle exportProxySettings with date filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          status: ['active']
        }
      }
      await proxySettingsApi.exportProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle special characters in host names', async () => {
      const payload = { host: 'proxy-server@123.example.com', port: 8080 }
      await proxySettingsApi.createProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle numeric and string IDs', async () => {
      await proxySettingsApi.getProxySettings(123)
      expect(testRequest.get).toHaveBeenCalledWith(`${URL}/123`)

      testRequest.get.mockClear()
      await proxySettingsApi.getProxySettings('proxy-abc')
      expect(testRequest.get).toHaveBeenCalledWith(`${URL}/proxy-abc`)
    })
  })

  describe('return values', () => {
    it('searchProxySettings should return thenable', () => {
      const result = proxySettingsApi.searchProxySettings({})
      expect(typeof result.then).toBe('function')
    })

    it('getProxySettings should return thenable', () => {
      const result = proxySettingsApi.getProxySettings('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('createProxySettings should return thenable', () => {
      const result = proxySettingsApi.createProxySettings({})
      expect(typeof result.then).toBe('function')
    })

    it('updateProxySettings should return thenable', () => {
      const result = proxySettingsApi.updateProxySettings({})
      expect(typeof result.then).toBe('function')
    })

    it('deleteProxySettings should return thenable', () => {
      const result = proxySettingsApi.deleteProxySettings('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('testConnection should return thenable', () => {
      const result = proxySettingsApi.testConnection({})
      expect(typeof result.then).toBe('function')
    })

    it('exportProxySettings should return thenable', () => {
      const result = proxySettingsApi.exportProxySettings({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof proxySettingsApi.searchProxySettings).toBe('function')
      expect(typeof proxySettingsApi.getProxySettings).toBe('function')
      expect(typeof proxySettingsApi.createProxySettings).toBe('function')
      expect(typeof proxySettingsApi.updateProxySettings).toBe('function')
      expect(typeof proxySettingsApi.deleteProxySettings).toBe('function')
      expect(typeof proxySettingsApi.testConnection).toBe('function')
      expect(typeof proxySettingsApi.exportProxySettings).toBe('function')
    })

    it('should export at least 7 functions', () => {
      const functions = Object.values(proxySettingsApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(7)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle proxy settings CRUD workflow', async () => {
      await proxySettingsApi.searchProxySettings({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await proxySettingsApi.createProxySettings({ host: 'proxy.example.com', port: 8080 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await proxySettingsApi.getProxySettings('proxy-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await proxySettingsApi.updateProxySettings({ resourceId: 'proxy-1', port: 9090 })
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await proxySettingsApi.deleteProxySettings('proxy-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle connection test workflow', async () => {
      const testPayload = { host: 'proxy.example.com', port: 8080 }
      await proxySettingsApi.testConnection(testPayload)
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await proxySettingsApi.createProxySettings(testPayload)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel proxy operations', async () => {
      const results = await Promise.all([
        proxySettingsApi.searchProxySettings({}),
        proxySettingsApi.getProxySettings('proxy-1')
      ])

      expect(results).toHaveLength(2)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle proxy creation with full configuration', async () => {
      const payload = {
        host: 'proxy.example.com',
        port: 8080,
        username: 'admin',
        password: 'secret123'
      }
      await proxySettingsApi.createProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/proxy-settings', payload, expect.any(Object))
    })

    it('should handle proxy update with resourceId', async () => {
      const payload = {
        resourceId: 'proxy-123',
        host: 'newproxy.example.com',
        port: 8888
      }
      await proxySettingsApi.updateProxySettings(payload)
      expect(testRequest.put).toHaveBeenCalledWith(`${URL}/proxy-123`, payload, expect.any(Object))
    })

    it('should handle search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await proxySettingsApi.searchProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search`, payload)
    })

    it('should handle export with complex filters', async () => {
      const payload = {
        filters: {
          host: 'proxy.example.com',
          status: ['active'],
          dateRange: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await proxySettingsApi.exportProxySettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(`${URL}/search/export`, payload, expect.any(Object))
    })

    it('should handle testConnection without authentication', async () => {
      const payload = { host: 'proxy.example.com', port: 8080 }
      await proxySettingsApi.testConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/proxy-settings/test', payload, expect.any(Object))
    })

    it('should handle delete by ID', async () => {
      const id = 'proxy-456'
      await proxySettingsApi.deleteProxySettings(id)
      expect(testRequest.delete).toHaveBeenCalledWith(`${URL}/${id}`, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchProxySettings errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(proxySettingsApi.searchProxySettings({})).rejects.toThrow('Search failed')
    })

    it('should propagate getProxySettings errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(proxySettingsApi.getProxySettings('id-1')).rejects.toThrow('Fetch failed')
    })

    it('should propagate createProxySettings errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(proxySettingsApi.createProxySettings({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateProxySettings errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(proxySettingsApi.updateProxySettings({})).rejects.toThrow('Update failed')
    })

    it('should propagate deleteProxySettings errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(proxySettingsApi.deleteProxySettings('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate testConnection errors', async () => {
      const error = new Error('Connection test failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(proxySettingsApi.testConnection({})).rejects.toThrow('Connection test failed')
    })

    it('should propagate exportProxySettings errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(proxySettingsApi.exportProxySettings({})).rejects.toThrow('Export failed')
    })
  })
})
