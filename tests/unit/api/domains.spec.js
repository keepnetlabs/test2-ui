import * as DomainsAPI from '@/api/domains'
import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

jest.mock('@/model/constants/commonConstants', () => ({
  COMMON_SNACKBAR: { color: 'red', duration: 5000 }
}))

describe('Domains API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDomainsList', () => {
    it('should call POST with search payload', async () => {
      const payload = { page: 1, pageSize: 10 }
      await DomainsAPI.getDomainsList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/domain-records/search', payload)
    })

    it('should return thenable', () => {
      const result = DomainsAPI.getDomainsList({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('createDomain', () => {
    it('should call POST with COMMON_SNACKBAR', async () => {
      const payload = { domain: 'example.com' }
      await DomainsAPI.createDomain(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/domain-records', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = DomainsAPI.createDomain({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('updateDomain', () => {
    it('should call PUT with id, payload, loading and COMMON_SNACKBAR', async () => {
      const payload = { domain: 'updated.com' }
      await DomainsAPI.updateDomain(payload, 'domain-123')
      expect(testRequest.put).toHaveBeenCalledWith('phishing-simulator/domain-records/domain-123', payload, {
        loading: true,
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = DomainsAPI.updateDomain({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('deleteEmailTemplate', () => {
    it('should call DELETE with id, loading and COMMON_SNACKBAR', async () => {
      await DomainsAPI.deleteEmailTemplate('domain-456')
      expect(testRequest.delete).toHaveBeenCalledWith('phishing-simulator/domain-records/domain-456', {
        loading: true,
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = DomainsAPI.deleteEmailTemplate('id-2')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('exportDnsService', () => {
    it('should call POST with blob responseType', async () => {
      const payload = { filter: 'all' }
      await DomainsAPI.exportDnsService(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/domain-records/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should return thenable', () => {
      const result = DomainsAPI.exportDnsService({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getDomainData', () => {
    it('should call GET endpoint', async () => {
      await DomainsAPI.getDomainData()
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/domain-records/form-details')
    })

    it('should return thenable', () => {
      const result = DomainsAPI.getDomainData()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getDomainEditData', () => {
    it('should call GET with loading flag', async () => {
      await DomainsAPI.getDomainEditData('domain-789')
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/domain-records/domain-789', {
        loading: true
      })
    })

    it('should return thenable', () => {
      const result = DomainsAPI.getDomainEditData('id-3')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('testDomainConnection', () => {
    it('should call POST without snackbar', async () => {
      const payload = { testData: 'sample' }
      await DomainsAPI.testDomainConnection(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/domain-records/test', payload)
    })

    it('should return thenable', () => {
      const result = DomainsAPI.testDomainConnection({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('HTTP Method Consistency', () => {
    it('should use POST for search and mutations', async () => {
      await DomainsAPI.getDomainsList({})
      await DomainsAPI.createDomain({})
      await DomainsAPI.testDomainConnection({})
      expect(testRequest.post).toHaveBeenCalledTimes(3)
    })

    it('should use GET for read operations', async () => {
      await DomainsAPI.getDomainData()
      await DomainsAPI.getDomainEditData('1')
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })

    it('should use PUT for updates', async () => {
      await DomainsAPI.updateDomain({}, '1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should use DELETE for deletions', async () => {
      await DomainsAPI.deleteEmailTemplate('1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Snackbar Configuration', () => {
    it('should include snackbar for create and update', async () => {
      testRequest.post.mockClear()
      testRequest.put.mockClear()

      await DomainsAPI.createDomain({})
      expect(testRequest.post.mock.calls[0][2]).toHaveProperty('snackbar')

      await DomainsAPI.updateDomain({}, '1')
      expect(testRequest.put.mock.calls[0][2]).toHaveProperty('snackbar')
    })

    it('should not include snackbar for test operations', async () => {
      testRequest.post.mockClear()
      await DomainsAPI.testDomainConnection({})
      expect(testRequest.post.mock.calls[0][2]).toBeUndefined()
    })
  })

  describe('All Exported Functions', () => {
    it('should export 8 functions', () => {
      const functions = Object.values(DomainsAPI).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(8)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle domain CRUD workflow', async () => {
      // Get form data
      await DomainsAPI.getDomainData()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Create domain
      testRequest.post.mockClear()
      await DomainsAPI.createDomain({ domain: 'test.com' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get domain for edit
      testRequest.get.mockClear()
      await DomainsAPI.getDomainEditData('1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Update domain
      testRequest.put.mockClear()
      await DomainsAPI.updateDomain({ domain: 'updated.com' }, '1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Delete domain
      testRequest.delete.mockClear()
      await DomainsAPI.deleteEmailTemplate('1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel requests', async () => {
      const results = await Promise.all([
        DomainsAPI.getDomainsList({}),
        DomainsAPI.getDomainData(),
        DomainsAPI.testDomainConnection({})
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling', () => {
    it('should propagate POST errors', async () => {
      const error = new Error('Domain creation failed')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(DomainsAPI.createDomain({})).rejects.toThrow('Domain creation failed')
    })

    it('should propagate GET errors', async () => {
      const error = new Error('Form data not found')
      testRequest.get.mockRejectedValueOnce(error)

      await expect(DomainsAPI.getDomainData()).rejects.toThrow('Form data not found')
    })

    it('should propagate PUT errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)

      await expect(DomainsAPI.updateDomain({}, '1')).rejects.toThrow('Update failed')
    })

    it('should propagate DELETE errors', async () => {
      const error = new Error('Delete failed')
      testRequest.delete.mockRejectedValueOnce(error)

      await expect(DomainsAPI.deleteEmailTemplate('1')).rejects.toThrow('Delete failed')
    })
  })
})
