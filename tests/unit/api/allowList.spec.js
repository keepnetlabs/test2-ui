import * as AllowListAPI from '@/api/allowList'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

// Mock global APP_CONFIG and localStorage
global.APP_CONFIG = {
  VUE_APP_API_KEY: 'test-api-key'
}

describe('AllowList API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('companyRequestId', 'test-company-id')
  })

  describe('getAllowListList', () => {
    it('should call POST with search payload and custom headers', async () => {
      const payload = { page: 1, pageSize: 10 }
      await AllowListAPI.getAllowListList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/allow-list/search', payload, {
        headers: {
          'X-IR-API-KEY': 'test-api-key',
          'X-IR-COMPANY-ID': 'test-company-id'
        }
      })
    })

    it('should return thenable', () => {
      const result = AllowListAPI.getAllowListList({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('createAllowListList', () => {
    it('should call POST with custom headers and snackbar', async () => {
      const payload = { data: 'test' }
      await AllowListAPI.createAllowListList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/allow-list', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-IR-API-KEY': 'test-api-key',
          'X-IR-COMPANY-ID': 'test-company-id'
        },
        snackbar: {
          hideError: true
        }
      })
    })

    it('should return thenable', () => {
      const result = AllowListAPI.createAllowListList({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('createTxtRecord', () => {
    it('should call POST with API credentials', async () => {
      await AllowListAPI.createTxtRecord()
      expect(testRequest.post).toHaveBeenCalledWith('/allow-list/txt-record', {
        'X-IR-API-KEY': 'test-api-key',
        'X-IR-COMPANY-ID': 'test-company-id'
      })
    })

    it('should return thenable', () => {
      const result = AllowListAPI.createTxtRecord()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getAllowListListVerify', () => {
    it('should call POST with resourceId and headers', async () => {
      await AllowListAPI.getAllowListListVerify('resource-123')
      expect(testRequest.post).toHaveBeenCalledWith('/allow-list/verify/resource-123', {
        headers: {
          'X-IR-API-KEY': 'test-api-key',
          'X-IR-COMPANY-ID': 'test-company-id'
        }
      })
    })

    it('should return thenable', () => {
      const result = AllowListAPI.getAllowListListVerify('id-1')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('markAsVerified', () => {
    it('should call PUT with resourceId and headers', async () => {
      await AllowListAPI.markAsVerified('resource-456')
      expect(testRequest.put).toHaveBeenCalledWith('/allow-list/mark-as-verified/resource-456', {
        headers: {
          'X-IR-API-KEY': 'test-api-key',
          'X-IR-COMPANY-ID': 'test-company-id'
        }
      })
    })

    it('should return thenable', () => {
      const result = AllowListAPI.markAsVerified('id-2')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('deleteAllowListItems', () => {
    it('should call DELETE with resourceIds and headers', async () => {
      const resourceIds = ['item-1', 'item-2']
      await AllowListAPI.deleteAllowListItems(resourceIds)
      expect(testRequest.delete).toHaveBeenCalledWith('/allow-list', {
        headers: {
          'X-IR-API-KEY': 'test-api-key',
          'X-IR-COMPANY-ID': 'test-company-id'
        },
        data: {
          resourceIds
        }
      })
    })

    it('should return thenable', () => {
      const result = AllowListAPI.deleteAllowListItems(['id-3'])
      expect(typeof result.then).toBe('function')
    })
  })

  describe('exportAllowList', () => {
    it('should call POST with blob responseType and headers', async () => {
      const payload = { filter: 'all' }
      await AllowListAPI.exportAllowList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/allow-list/search/export', payload, {
        responseType: 'blob',
        'X-IR-API-KEY': 'test-api-key',
        'X-IR-COMPANY-ID': 'test-company-id'
      })
    })

    it('should return thenable', () => {
      const result = AllowListAPI.exportAllowList({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getUnverifiedDomains', () => {
    it('should call GET with headers', async () => {
      await AllowListAPI.getUnverifiedDomains()
      expect(testRequest.get).toHaveBeenCalledWith('/allow-list/search/unverified', {
        'X-IR-API-KEY': 'test-api-key',
        'X-IR-COMPANY-ID': 'test-company-id'
      })
    })

    it('should return thenable', () => {
      const result = AllowListAPI.getUnverifiedDomains()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getVerifiedDomains', () => {
    it('should call GET with headers', async () => {
      await AllowListAPI.getVerifiedDomains()
      expect(testRequest.get).toHaveBeenCalledWith('/allow-list/search/verified', {
        'X-IR-API-KEY': 'test-api-key',
        'X-IR-COMPANY-ID': 'test-company-id'
      })
    })

    it('should return thenable', () => {
      const result = AllowListAPI.getVerifiedDomains()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('HTTP Method Consistency', () => {
    it('should use POST for search and creation', async () => {
      await AllowListAPI.getAllowListList({})
      await AllowListAPI.createAllowListList({})
      await AllowListAPI.createTxtRecord()
      expect(testRequest.post).toHaveBeenCalledTimes(3)
    })

    it('should use GET for read operations', async () => {
      await AllowListAPI.getUnverifiedDomains()
      await AllowListAPI.getVerifiedDomains()
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })

    it('should use PUT for verification', async () => {
      await AllowListAPI.markAsVerified('1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should use DELETE for deletions', async () => {
      await AllowListAPI.deleteAllowListItems(['1'])
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Custom Headers', () => {
    it('should include API key in all requests', async () => {
      await AllowListAPI.getAllowListList({})
      const calls = testRequest.post.mock.calls
      expect(calls[0][2].headers['X-IR-API-KEY']).toBe('test-api-key')
    })

    it('should include company ID from localStorage', async () => {
      localStorage.setItem('companyRequestId', 'custom-company-id')
      testRequest.post.mockClear()
      await AllowListAPI.getAllowListList({})
      const calls = testRequest.post.mock.calls
      expect(calls[0][2].headers['X-IR-COMPANY-ID']).toBe('custom-company-id')
    })

    it('should handle missing companyRequestId gracefully', async () => {
      localStorage.removeItem('companyRequestId')
      await AllowListAPI.getAllowListList({})
      const calls = testRequest.post.mock.calls
      expect(calls[0][2].headers['X-IR-COMPANY-ID']).toBe(null)
    })
  })

  describe('All Exported Functions', () => {
    it('should export 9 functions', () => {
      const functions = Object.values(AllowListAPI).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(9)
    })

    it('should have all expected functions', () => {
      expect(typeof AllowListAPI.getAllowListList).toBe('function')
      expect(typeof AllowListAPI.createAllowListList).toBe('function')
      expect(typeof AllowListAPI.createTxtRecord).toBe('function')
      expect(typeof AllowListAPI.getAllowListListVerify).toBe('function')
      expect(typeof AllowListAPI.markAsVerified).toBe('function')
      expect(typeof AllowListAPI.deleteAllowListItems).toBe('function')
      expect(typeof AllowListAPI.exportAllowList).toBe('function')
      expect(typeof AllowListAPI.getUnverifiedDomains).toBe('function')
      expect(typeof AllowListAPI.getVerifiedDomains).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle domain verification workflow', async () => {
      // Get unverified domains
      await AllowListAPI.getUnverifiedDomains()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Verify domain
      testRequest.post.mockClear()
      await AllowListAPI.getAllowListListVerify('domain-1')
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Mark as verified
      testRequest.put.mockClear()
      await AllowListAPI.markAsVerified('domain-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Get verified domains
      testRequest.get.mockClear()
      await AllowListAPI.getVerifiedDomains()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle domain creation workflow', async () => {
      // Create list entry
      await AllowListAPI.createAllowListList({ domain: 'example.com' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Create TXT record
      testRequest.post.mockClear()
      await AllowListAPI.createTxtRecord()
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel requests with headers', async () => {
      const results = await Promise.all([
        AllowListAPI.getAllowListList({}),
        AllowListAPI.getUnverifiedDomains(),
        AllowListAPI.getVerifiedDomains()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('Error Handling', () => {
    it('should propagate POST errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(AllowListAPI.createAllowListList({})).rejects.toThrow('Creation failed')
    })

    it('should propagate GET errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)

      await expect(AllowListAPI.getUnverifiedDomains()).rejects.toThrow('Fetch failed')
    })

    it('should propagate PUT errors', async () => {
      const error = new Error('Verification failed')
      testRequest.put.mockRejectedValueOnce(error)

      await expect(AllowListAPI.markAsVerified('1')).rejects.toThrow('Verification failed')
    })

    it('should propagate DELETE errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)

      await expect(AllowListAPI.deleteAllowListItems(['1'])).rejects.toThrow('Deletion failed')
    })
  })
})
