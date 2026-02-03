jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
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
  })
})
