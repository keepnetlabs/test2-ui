jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as dnsServicesApi from '@/api/dnsServices'

describe('dnsServices API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('DNS service operations', () => {
    it('should call getDnsServiceList', async () => {
      const payload = { page: 1 }
      await dnsServicesApi.getDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services/search', payload)
    })

    it('should call createDnsServiceList', async () => {
      const payload = { name: 'DNS Service', provider: 'Route53' }
      await dnsServicesApi.createDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/dns-services',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getDnsService', async () => {
      const id = 'dns-123'
      await dnsServicesApi.getDnsService(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/dns-services/${id}`,
        { loading: true }
      )
    })

    it('should call updateDnsServiceList', async () => {
      const id = 'dns-123'
      const payload = { name: 'Updated Service' }
      await dnsServicesApi.updateDnsServiceList(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `phishing-simulator/dns-services/${id}`,
        payload,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteEmailTemplate', async () => {
      const id = 'dns-123'
      await dnsServicesApi.deleteEmailTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `phishing-simulator/dns-services/${id}`,
        { loading: true, snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('DNS connection testing', () => {
    it('should call testConnection', async () => {
      const id = 'dns-123'
      const payload = { testData: 'test' }
      await dnsServicesApi.testConnection(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `phishing-simulator/dns-services/${id}/test`,
        payload
      )
    })
  })

  describe('export operations', () => {
    it('should call exportDnsService', async () => {
      const payload = { filters: {} }
      await dnsServicesApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/dns-services/search/export',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const id = 'dns-123'
      await dnsServicesApi.getDnsService(id)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await dnsServicesApi.getDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await dnsServicesApi.updateDnsServiceList(payload, 'dns-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await dnsServicesApi.deleteEmailTemplate('dns-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar and loading consistency', () => {
    it('should include loading flag for read operations', async () => {
      const id = 'dns-123'
      await dnsServicesApi.getDnsService(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ loading: true })
      )
    })

    it('should use COMMON_SNACKBAR for mutations', async () => {
      const payload = { name: 'New Service' }
      await dnsServicesApi.createDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should include loading and snackbar for updates', async () => {
      const payload = { name: 'Updated' }
      await dnsServicesApi.updateDnsServiceList(payload, 'dns-123')
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          loading: true,
          snackbar: COMMON_SNACKBAR
        })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for DNS service export', async () => {
      const payload = { filters: {} }
      await dnsServicesApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle DNS service creation with API credentials', async () => {
      const payload = {
        name: 'AWS Route53',
        provider: 'Route53',
        apiKey: 'key-123',
        apiSecret: 'secret-456'
      }
      await dnsServicesApi.createDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle DNS service update with new configuration', async () => {
      const payload = {
        name: 'Updated Service',
        configuration: { timeout: 30, retries: 3 }
      }
      await dnsServicesApi.updateDnsServiceList(payload, 'dns-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle connection test with DNS parameters', async () => {
      const payload = {
        hostname: 'example.com',
        recordType: 'A',
        expectedValue: '192.168.1.1'
      }
      await dnsServicesApi.testConnection(payload, 'dns-123')
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle DNS service deletion with confirmation', async () => {
      const id = 'dns-123'
      await dnsServicesApi.deleteEmailTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          loading: true,
          snackbar: COMMON_SNACKBAR
        })
      )
    })
  })

  describe('return values', () => {
    it('getDnsServiceList should return thenable', () => {
      const result = dnsServicesApi.getDnsServiceList({})
      expect(typeof result.then).toBe('function')
    })

    it('createDnsServiceList should return thenable', () => {
      const result = dnsServicesApi.createDnsServiceList({})
      expect(typeof result.then).toBe('function')
    })

    it('getDnsService should return thenable', () => {
      const result = dnsServicesApi.getDnsService('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('updateDnsServiceList should return thenable', () => {
      const result = dnsServicesApi.updateDnsServiceList({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })

    it('deleteEmailTemplate should return thenable', () => {
      const result = dnsServicesApi.deleteEmailTemplate('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('exportDnsService should return thenable', () => {
      const result = dnsServicesApi.exportDnsService({})
      expect(typeof result.then).toBe('function')
    })

    it('testConnection should return thenable', () => {
      const result = dnsServicesApi.testConnection({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 7 functions', () => {
      const functions = Object.values(dnsServicesApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(7)
    })

    it('should have all DNS service functions', () => {
      expect(typeof dnsServicesApi.getDnsServiceList).toBe('function')
      expect(typeof dnsServicesApi.createDnsServiceList).toBe('function')
      expect(typeof dnsServicesApi.getDnsService).toBe('function')
      expect(typeof dnsServicesApi.updateDnsServiceList).toBe('function')
      expect(typeof dnsServicesApi.deleteEmailTemplate).toBe('function')
      expect(typeof dnsServicesApi.exportDnsService).toBe('function')
      expect(typeof dnsServicesApi.testConnection).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle DNS service CRUD workflow', async () => {
      // Get list
      await dnsServicesApi.getDnsServiceList({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Create service
      testRequest.post.mockClear()
      await dnsServicesApi.createDnsServiceList({ name: 'Test Service' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get service details
      testRequest.get.mockClear()
      await dnsServicesApi.getDnsService('dns-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Update service
      testRequest.put.mockClear()
      await dnsServicesApi.updateDnsServiceList({ name: 'Updated' }, 'dns-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Delete service
      testRequest.delete.mockClear()
      await dnsServicesApi.deleteEmailTemplate('dns-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle DNS service testing workflow', async () => {
      // Create service
      await dnsServicesApi.createDnsServiceList({ name: 'Test Service' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Test connection
      testRequest.post.mockClear()
      await dnsServicesApi.testConnection({ hostname: 'example.com' }, 'dns-1')
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle DNS service search and export workflow', async () => {
      // Search services
      await dnsServicesApi.getDnsServiceList({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Export results
      testRequest.post.mockClear()
      await dnsServicesApi.exportDnsService({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel service retrieval', async () => {
      const results = await Promise.all([
        dnsServicesApi.getDnsServiceList({}),
        dnsServicesApi.getDnsService('dns-1'),
        dnsServicesApi.getDnsService('dns-2')
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle empty search payload', async () => {
      await dnsServicesApi.getDnsServiceList({})
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services/search', {})
    })

    it('should handle complex search payload', async () => {
      const payload = {
        page: 1,
        pageSize: 50,
        filters: { provider: 'Route53', status: 'active' }
      }
      await dnsServicesApi.getDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services/search', payload)
    })

    it('should handle DNS service creation with minimal payload', async () => {
      const payload = { name: 'Service', provider: 'Route53' }
      await dnsServicesApi.createDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services', payload, expect.any(Object))
    })

    it('should handle DNS service creation with complex payload', async () => {
      const payload = {
        name: 'Complex Service',
        provider: 'CloudFlare',
        apiKey: 'key',
        apiSecret: 'secret',
        configuration: { timeout: 30, retries: 3 }
      }
      await dnsServicesApi.createDnsServiceList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services', payload, expect.any(Object))
    })

    it('should handle numeric and string IDs for getDnsService', async () => {
      await dnsServicesApi.getDnsService(123)
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/dns-services/123', expect.any(Object))

      testRequest.get.mockClear()
      await dnsServicesApi.getDnsService('dns-abc')
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/dns-services/dns-abc', expect.any(Object))
    })

    it('should handle update with minimal payload', async () => {
      await dnsServicesApi.updateDnsServiceList({ name: 'Updated' }, 'dns-1')
      expect(testRequest.put).toHaveBeenCalledWith('phishing-simulator/dns-services/dns-1', expect.any(Object), expect.any(Object))
    })

    it('should handle update with complex payload', async () => {
      const payload = {
        name: 'Updated Service',
        provider: 'AWS',
        configuration: { timeout: 60, retries: 5 }
      }
      await dnsServicesApi.updateDnsServiceList(payload, 'dns-1')
      expect(testRequest.put).toHaveBeenCalledWith('phishing-simulator/dns-services/dns-1', payload, expect.any(Object))
    })

    it('should handle deletion with numeric and string IDs', async () => {
      await dnsServicesApi.deleteEmailTemplate(456)
      expect(testRequest.delete).toHaveBeenCalledWith('phishing-simulator/dns-services/456', expect.any(Object))

      testRequest.delete.mockClear()
      await dnsServicesApi.deleteEmailTemplate('dns-xyz')
      expect(testRequest.delete).toHaveBeenCalledWith('phishing-simulator/dns-services/dns-xyz', expect.any(Object))
    })

    it('should handle export with empty payload', async () => {
      await dnsServicesApi.exportDnsService({})
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services/search/export', {}, expect.any(Object))
    })

    it('should handle export with complex payload', async () => {
      const payload = {
        filters: {
          provider: ['Route53', 'CloudFlare'],
          status: 'active',
          dateRange: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await dnsServicesApi.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services/search/export', payload, expect.any(Object))
    })

    it('should handle connection test with minimal payload', async () => {
      await dnsServicesApi.testConnection({}, 'dns-1')
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services/dns-1/test', {})
    })

    it('should handle connection test with complex payload', async () => {
      const payload = {
        hostname: 'example.com',
        recordType: 'A',
        expectedValue: '192.168.1.1',
        timeout: 10
      }
      await dnsServicesApi.testConnection(payload, 'dns-1')
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/dns-services/dns-1/test', payload)
    })
  })

  describe('Error Handling', () => {
    it('should propagate getDnsServiceList errors', async () => {
      const error = new Error('List fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(dnsServicesApi.getDnsServiceList({})).rejects.toThrow('List fetch failed')
    })

    it('should propagate createDnsServiceList errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(dnsServicesApi.createDnsServiceList({})).rejects.toThrow('Creation failed')
    })

    it('should propagate getDnsService errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(dnsServicesApi.getDnsService('id-1')).rejects.toThrow('Fetch failed')
    })

    it('should propagate updateDnsServiceList errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(dnsServicesApi.updateDnsServiceList({}, 'id-1')).rejects.toThrow('Update failed')
    })

    it('should propagate deleteEmailTemplate errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(dnsServicesApi.deleteEmailTemplate('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate exportDnsService errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(dnsServicesApi.exportDnsService({})).rejects.toThrow('Export failed')
    })

    it('should propagate testConnection errors', async () => {
      const error = new Error('Connection test failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(dnsServicesApi.testConnection({}, 'id-1')).rejects.toThrow('Connection test failed')
    })
  })
})
