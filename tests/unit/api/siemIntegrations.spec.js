jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as siemIntegrationsApi from '@/api/siemIntegrations'

describe('siemIntegrations API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('SIEM integration search and retrieval', () => {
    it('should call searchSIEMIntegrations', async () => {
      const payload = { page: 1 }
      await siemIntegrationsApi.searchSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/search',
        payload
      )
    })

    it('should call searchSIEMIntegrations with empty payload', async () => {
      await siemIntegrationsApi.searchSIEMIntegrations()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/search',
        {}
      )
    })

    it('should call getSIEMIntegration', async () => {
      const resourceId = 'siem-123'
      await siemIntegrationsApi.getSIEMIntegration(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/companies/siem-settings/${resourceId}`
      )
    })

    it('should call getSIEMIntegration with empty resourceId', async () => {
      await siemIntegrationsApi.getSIEMIntegration()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/siem-settings/')
    })
  })

  describe('SIEM integration management', () => {
    it('should call createSIEMIntegration', async () => {
      const payload = { name: 'SIEM Config' }
      await siemIntegrationsApi.createSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createSIEMIntegration with empty payload', async () => {
      await siemIntegrationsApi.createSIEMIntegration()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSIEMIntegration', async () => {
      const payload = { name: 'Updated SIEM' }
      const resourceId = 'siem-123'
      await siemIntegrationsApi.updateSIEMIntegration(resourceId, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/companies/siem-settings/${resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSIEMIntegration with empty resourceId', async () => {
      const payload = { name: 'Updated SIEM' }
      await siemIntegrationsApi.updateSIEMIntegration('', payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/companies/siem-settings/',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSIEMIntegration with default params', async () => {
      await siemIntegrationsApi.updateSIEMIntegration()
      expect(testRequest.put).toHaveBeenCalledWith(
        '/companies/siem-settings/',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSIEMIntegration', async () => {
      const resourceId = 'siem-123'
      await siemIntegrationsApi.deleteSIEMIntegration(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/companies/siem-settings/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSIEMIntegration with empty resourceId', async () => {
      await siemIntegrationsApi.deleteSIEMIntegration()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/companies/siem-settings/',
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('SIEM connection testing', () => {
    it('should call testSIEMIntegration', async () => {
      const payload = { endpoint: 'https://siem.example.com' }
      await siemIntegrationsApi.testSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/test',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call testSIEMIntegration with empty payload', async () => {
      await siemIntegrationsApi.testSIEMIntegration()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/test',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('SIEM export operations', () => {
    it('should call exportSIEMIntegrations', async () => {
      const payload = { filters: {} }
      await siemIntegrationsApi.exportSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportSIEMIntegrations with empty payload', async () => {
      await siemIntegrationsApi.exportSIEMIntegrations()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/search/export',
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const resourceId = 'siem-123'
      await siemIntegrationsApi.getSIEMIntegration(resourceId)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await siemIntegrationsApi.searchSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await siemIntegrationsApi.updateSIEMIntegration('siem-123', payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await siemIntegrationsApi.deleteSIEMIntegration('siem-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for creation', async () => {
      const payload = { name: 'SIEM Config' }
      await siemIntegrationsApi.createSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { name: 'Updated' }
      await siemIntegrationsApi.updateSIEMIntegration('siem-123', payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await siemIntegrationsApi.deleteSIEMIntegration('siem-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for test operations', async () => {
      const payload = { endpoint: 'https://siem.example.com' }
      await siemIntegrationsApi.testSIEMIntegration(payload)
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
      await siemIntegrationsApi.exportSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle searchSIEMIntegrations with complex filters', async () => {
      const payload = {
        page: 1,
        filters: {
          status: ['active', 'inactive'],
          type: ['splunk', 'elastic', 'qradar'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await siemIntegrationsApi.searchSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SIEM creation with Splunk configuration', async () => {
      const payload = {
        name: 'Splunk Integration',
        type: 'splunk',
        endpoint: 'https://splunk.example.com:8089',
        username: 'admin',
        password: 'splunk-password'
      }
      await siemIntegrationsApi.createSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SIEM creation with Elastic configuration', async () => {
      const payload = {
        name: 'Elastic Integration',
        type: 'elastic',
        endpoint: 'https://elastic.example.com:9200',
        username: 'elastic',
        password: 'elastic-password'
      }
      await siemIntegrationsApi.createSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SIEM update with partial fields', async () => {
      const payload = {
        name: 'Updated SIEM Name'
      }
      await siemIntegrationsApi.updateSIEMIntegration('siem-123', payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle SIEM connection test with credentials', async () => {
      const payload = {
        endpoint: 'https://qradar.example.com',
        apiKey: 'qradar-api-key-123',
        verifySSL: false
      }
      await siemIntegrationsApi.testSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle exportSIEMIntegrations with date range filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          status: ['active'],
          type: ['splunk']
        }
      }
      await siemIntegrationsApi.exportSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle SIEM deletion with confirmation', async () => {
      await siemIntegrationsApi.deleteSIEMIntegration('siem-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle pagination in SIEM search', async () => {
      const payload = {
        page: 2,
        pageSize: 50,
        sort: { field: 'name', direction: 'asc' }
      }
      await siemIntegrationsApi.searchSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle numeric and string resource IDs', async () => {
      await siemIntegrationsApi.getSIEMIntegration(123)
      expect(testRequest.get).toHaveBeenCalledWith('/companies/siem-settings/123')

      testRequest.get.mockClear()
      await siemIntegrationsApi.getSIEMIntegration('siem-abc')
      expect(testRequest.get).toHaveBeenCalledWith('/companies/siem-settings/siem-abc')
    })

    it('should handle special characters in SIEM names', async () => {
      const payload = { name: 'SIEM-@-#-2024' }
      await siemIntegrationsApi.createSIEMIntegration(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        siemIntegrationsApi.searchSIEMIntegrations({}),
        siemIntegrationsApi.getSIEMIntegration('id'),
        siemIntegrationsApi.createSIEMIntegration({}),
        siemIntegrationsApi.updateSIEMIntegration('id', {}),
        siemIntegrationsApi.deleteSIEMIntegration('id'),
        siemIntegrationsApi.testSIEMIntegration({}),
        siemIntegrationsApi.exportSIEMIntegrations({})
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof siemIntegrationsApi.searchSIEMIntegrations).toBe('function')
      expect(typeof siemIntegrationsApi.getSIEMIntegration).toBe('function')
      expect(typeof siemIntegrationsApi.createSIEMIntegration).toBe('function')
      expect(typeof siemIntegrationsApi.updateSIEMIntegration).toBe('function')
      expect(typeof siemIntegrationsApi.deleteSIEMIntegration).toBe('function')
      expect(typeof siemIntegrationsApi.testSIEMIntegration).toBe('function')
      expect(typeof siemIntegrationsApi.exportSIEMIntegrations).toBe('function')
    })

    it('should export at least 7 functions', () => {
      const functions = Object.values(siemIntegrationsApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(7)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle SIEM integration full CRUD workflow', async () => {
      await siemIntegrationsApi.searchSIEMIntegrations({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await siemIntegrationsApi.createSIEMIntegration({ name: 'New SIEM' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await siemIntegrationsApi.getSIEMIntegration('siem-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await siemIntegrationsApi.updateSIEMIntegration('siem-1', { name: 'Updated' })
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await siemIntegrationsApi.deleteSIEMIntegration('siem-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle connection test and creation workflow', async () => {
      const testPayload = { endpoint: 'https://siem.example.com', apiKey: 'key' }
      await siemIntegrationsApi.testSIEMIntegration(testPayload)
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      const createPayload = { name: 'SIEM', ...testPayload }
      await siemIntegrationsApi.createSIEMIntegration(createPayload)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel SIEM operations', async () => {
      const results = await Promise.all([
        siemIntegrationsApi.searchSIEMIntegrations({}),
        siemIntegrationsApi.getSIEMIntegration('siem-1')
      ])

      expect(results).toHaveLength(2)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle SIEM search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await siemIntegrationsApi.searchSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/companies/siem-settings/search', payload)
    })

    it('should handle SIEM creation with various integration types', async () => {
      const types = ['splunk', 'elastic', 'qradar', 'sumologic']
      for (const type of types) {
        testRequest.post.mockClear()
        await siemIntegrationsApi.createSIEMIntegration({ name: 'SIEM', type })
        expect(testRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle SIEM update with partial fields', async () => {
      const payload = { endpoint: 'https://newsiem.example.com' }
      await siemIntegrationsApi.updateSIEMIntegration('siem-1', payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/companies/siem-settings/siem-1',
        payload,
        expect.any(Object)
      )
    })

    it('should handle test with various authentication methods', async () => {
      const credentials = [
        { username: 'admin', password: 'pass' },
        { apiKey: 'api-key-123' },
        { bearerToken: 'token-abc' }
      ]

      for (const cred of credentials) {
        testRequest.post.mockClear()
        const payload = { endpoint: 'https://siem.example.com', ...cred }
        await siemIntegrationsApi.testSIEMIntegration(payload)
        expect(testRequest.post).toHaveBeenCalled()
      }
    })

    it('should handle export with complex filter payloads', async () => {
      const payload = {
        filters: {
          status: ['active', 'inactive'],
          type: ['splunk', 'elastic'],
          dateRange: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await siemIntegrationsApi.exportSIEMIntegrations(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/companies/siem-settings/search/export',
        payload,
        expect.any(Object)
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchSIEMIntegrations errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(siemIntegrationsApi.searchSIEMIntegrations({})).rejects.toThrow('Search failed')
    })

    it('should propagate getSIEMIntegration errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(siemIntegrationsApi.getSIEMIntegration('id')).rejects.toThrow('Fetch failed')
    })

    it('should propagate createSIEMIntegration errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(siemIntegrationsApi.createSIEMIntegration({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateSIEMIntegration errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(siemIntegrationsApi.updateSIEMIntegration('id', {})).rejects.toThrow('Update failed')
    })

    it('should propagate deleteSIEMIntegration errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(siemIntegrationsApi.deleteSIEMIntegration('id')).rejects.toThrow('Deletion failed')
    })

    it('should propagate testSIEMIntegration errors', async () => {
      const error = new Error('Connection test failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(siemIntegrationsApi.testSIEMIntegration({})).rejects.toThrow('Connection test failed')
    })

    it('should propagate exportSIEMIntegrations errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(siemIntegrationsApi.exportSIEMIntegrations({})).rejects.toThrow('Export failed')
    })

    it('should handle multiple sequential error scenarios', async () => {
      testRequest.post.mockRejectedValueOnce(new Error('Error 1'))
      testRequest.get.mockRejectedValueOnce(new Error('Error 2'))

      await expect(siemIntegrationsApi.searchSIEMIntegrations({})).rejects.toThrow('Error 1')
      await expect(siemIntegrationsApi.getSIEMIntegration('id')).rejects.toThrow('Error 2')
    })
  })
})
