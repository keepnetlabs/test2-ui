// Mock localStorage before importing modules that use it
const mockStorage = {
  data: { companyRequestId: 'company-123' },
  getItem(key) {
    return this.data[key] || null
  },
  setItem(key, value) {
    this.data[key] = value
  },
  removeItem(key) {
    delete this.data[key]
  },
  clear() {
    this.data = {}
  }
}

Object.defineProperty(global, 'localStorage', {
  value: mockStorage,
  writable: true,
  configurable: true
})

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import * as allowListApi from '@/api/allowList'

// Mock APP_CONFIG
global.APP_CONFIG = {
  VUE_APP_API_KEY: 'test-api-key'
}

describe('allowList API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
    mockStorage.setItem('companyRequestId', 'company-123')
  })

  describe('allow list operations', () => {
    it('should call getAllowListList', async () => {
      const payload = { page: 1 }
      await allowListApi.getAllowListList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/allow-list/search',
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-API-KEY': 'test-api-key',
            'X-IR-COMPANY-ID': 'company-123'
          })
        })
      )
    })

    it('should call createAllowListList', async () => {
      const payload = new FormData()
      await allowListApi.createAllowListList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/allow-list',
        payload,
        expect.objectContaining({
          headers: expect.any(Object),
          snackbar: { hideError: true }
        })
      )
    })

    it('should call deleteAllowListItems', async () => {
      const resourceIds = ['item-1', 'item-2']
      await allowListApi.deleteAllowListItems(resourceIds)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/allow-list',
        expect.objectContaining({
          headers: expect.any(Object),
          data: { resourceIds }
        })
      )
    })
  })

  describe('domain verification operations', () => {
    it('should call createTxtRecord', async () => {
      await allowListApi.createTxtRecord()
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should call getAllowListListVerify', async () => {
      const resourceId = 'item-123'
      await allowListApi.getAllowListListVerify(resourceId)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/allow-list/verify/${resourceId}`,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call markAsVerified', async () => {
      const resourceId = 'item-123'
      await allowListApi.markAsVerified(resourceId)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/allow-list/mark-as-verified/${resourceId}`,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getUnverifiedDomains', async () => {
      await allowListApi.getUnverifiedDomains()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/allow-list/search/unverified',
        expect.objectContaining({
          'X-IR-API-KEY': 'test-api-key',
          'X-IR-COMPANY-ID': 'company-123'
        })
      )
    })

    it('should call getVerifiedDomains', async () => {
      await allowListApi.getVerifiedDomains()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/allow-list/search/verified',
        expect.objectContaining({
          'X-IR-API-KEY': 'test-api-key',
          'X-IR-COMPANY-ID': 'company-123'
        })
      )
    })
  })

  describe('export operations', () => {
    it('should call exportAllowList', async () => {
      const payload = { filters: {} }
      await allowListApi.exportAllowList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/allow-list/search/export',
        payload,
        expect.objectContaining({
          responseType: 'blob'
        })
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await allowListApi.getUnverifiedDomains()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await allowListApi.getAllowListList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      await allowListApi.markAsVerified('item-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await allowListApi.deleteAllowListItems(['item-1'])
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('headers consistency', () => {
    it('should include API key and company ID in headers', async () => {
      const payload = { page: 1 }
      await allowListApi.getAllowListList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-API-KEY': expect.any(String),
            'X-IR-COMPANY-ID': 'company-123'
          })
        })
      )
    })
  })

  describe('localStorage integration', () => {
    it('should use companyRequestId from localStorage', async () => {
      localStorage.setItem('companyRequestId', 'company-456')
      const payload = { page: 1 }
      await allowListApi.getAllowListList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-COMPANY-ID': 'company-456'
          })
        })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle bulk delete with multiple items', async () => {
      const resourceIds = ['item-1', 'item-2', 'item-3', 'item-4']
      await allowListApi.deleteAllowListItems(resourceIds)
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle allow list creation with multipart data', async () => {
      const payload = new FormData()
      payload.append('domain', 'example.com')
      await allowListApi.createAllowListList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle verification with special domain names', async () => {
      const resourceId = 'subdomain.example.co.uk-123'
      await allowListApi.getAllowListListVerify(resourceId)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle export with complex filters', async () => {
      const payload = {
        filters: {
          status: ['verified', 'unverified'],
          dateRange: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await allowListApi.exportAllowList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })
})
