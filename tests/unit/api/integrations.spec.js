import * as IntegrationsAPI from '@/api/integrations'
import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

jest.mock('@/model/constants/commonConstants', () => ({
  COMMON_SNACKBAR: { color: 'red', duration: 5000 }
}))

describe('Integrations API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getIntegrationList', () => {
    it('should call POST with payload', async () => {
      const payload = { page: 1, pageSize: 10 }
      await IntegrationsAPI.getIntegrationList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines/search', payload)
    })

    it('should handle search filters', async () => {
      const payload = { filter: { name: 'test' } }
      await IntegrationsAPI.getIntegrationList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines/search', payload)
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.getIntegrationList({})
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with list data', async () => {
      const mockData = { data: [{ id: '1', name: 'Integration 1' }] }
      testRequest.post.mockResolvedValueOnce(mockData)

      const result = await IntegrationsAPI.getIntegrationList({})
      expect(result).toEqual(mockData)
    })
  })

  describe('exportReportedEmails', () => {
    it('should call POST with blob responseType', async () => {
      const payload = { filter: 'all' }
      await IntegrationsAPI.exportReportedEmails(payload)
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should handle export with complex payload', async () => {
      const payload = {
        filter: { startDate: '2024-01-01', status: 'reported' }
      }
      await IntegrationsAPI.exportReportedEmails(payload)
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should always use blob responseType', async () => {
      await IntegrationsAPI.exportReportedEmails({})
      const calls = testRequest.post.mock.calls
      expect(calls[0][2]).toEqual({ responseType: 'blob' })
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.exportReportedEmails({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('createIntegration', () => {
    it('should call POST with COMMON_SNACKBAR', async () => {
      const payload = { name: 'New Integration', config: {} }
      await IntegrationsAPI.createIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should include snackbar config', async () => {
      await IntegrationsAPI.createIntegration({ name: 'Test' })
      const calls = testRequest.post.mock.calls
      expect(calls[0][2]).toHaveProperty('snackbar')
      expect(calls[0][2].snackbar).toEqual(COMMON_SNACKBAR)
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.createIntegration({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('disableIntegration', () => {
    it('should call PUT with id and COMMON_SNACKBAR', async () => {
      const id = 'integration-123'
      await IntegrationsAPI.disableIntegration(id)
      expect(testRequest.put).toHaveBeenCalledWith('analysis-engines/integration-123/disable', null, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle numeric id', async () => {
      const id = 123
      await IntegrationsAPI.disableIntegration(id)
      expect(testRequest.put).toHaveBeenCalledWith('analysis-engines/123/disable', null, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.disableIntegration('id-1')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('enableIntegration', () => {
    it('should call PUT with id and COMMON_SNACKBAR', async () => {
      const id = 'integration-456'
      await IntegrationsAPI.enableIntegration(id)
      expect(testRequest.put).toHaveBeenCalledWith('analysis-engines/integration-456/enable', null, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle numeric id', async () => {
      const id = 456
      await IntegrationsAPI.enableIntegration(id)
      expect(testRequest.put).toHaveBeenCalledWith('analysis-engines/456/enable', null, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.enableIntegration('id-2')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('deleteIntegration', () => {
    it('should call DELETE with id and COMMON_SNACKBAR', async () => {
      const id = 'integration-789'
      await IntegrationsAPI.deleteIntegration(id)
      expect(testRequest.delete).toHaveBeenCalledWith('analysis-engines/integration-789', {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle numeric id', async () => {
      const id = 789
      await IntegrationsAPI.deleteIntegration(id)
      expect(testRequest.delete).toHaveBeenCalledWith('analysis-engines/789', {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.deleteIntegration('id-3')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getIntegrationDetails', () => {
    it('should call GET with loading flag', async () => {
      const id = 'integration-detail-1'
      await IntegrationsAPI.getIntegrationDetails(id)
      expect(testRequest.get).toHaveBeenCalledWith('analysis-engines/integration-detail-1', { loading: true })
    })

    it('should handle numeric id', async () => {
      const id = 999
      await IntegrationsAPI.getIntegrationDetails(id)
      expect(testRequest.get).toHaveBeenCalledWith('analysis-engines/999', { loading: true })
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.getIntegrationDetails('id-4')
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with details', async () => {
      const mockDetails = { data: { id: '1', name: 'Integration', status: 'active' } }
      testRequest.get.mockResolvedValueOnce(mockDetails)

      const result = await IntegrationsAPI.getIntegrationDetails('1')
      expect(result).toEqual(mockDetails)
    })
  })

  describe('updateIntegration', () => {
    it('should call PUT with id, payload and COMMON_SNACKBAR', async () => {
      const id = 'integration-update-1'
      const payload = { name: 'Updated Name' }
      await IntegrationsAPI.updateIntegration(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith('analysis-engines/integration-update-1', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle complex update payload', async () => {
      const id = '1'
      const payload = {
        name: 'Integration',
        config: { apiKey: 'secret', endpoint: 'https://api.example.com' },
        enabled: true
      }
      await IntegrationsAPI.updateIntegration(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith('analysis-engines/1', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.updateIntegration('id-5', {})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('testAnalysis', () => {
    it('should call PUT with different endpoint and payload', async () => {
      const id = 'analysis-type-1'
      const payload = { testData: 'sample' }
      await IntegrationsAPI.testAnalysis(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith('/analysis-engines-types/analysis-type-1/test-connection', payload)
    })

    it('should handle test with complex payload', async () => {
      const id = '1'
      const payload = {
        credentials: { username: 'user', password: 'pass' },
        endpoint: 'https://test.example.com'
      }
      await IntegrationsAPI.testAnalysis(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith('/analysis-engines-types/1/test-connection', payload)
    })

    it('should not include snackbar config', async () => {
      await IntegrationsAPI.testAnalysis('1', {})
      const calls = testRequest.put.mock.calls
      expect(calls[0][2]).toBeUndefined()
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.testAnalysis('id-6', {})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getAnalysisExclusions', () => {
    it('should call GET endpoint', async () => {
      await IntegrationsAPI.getAnalysisExclusions()
      expect(testRequest.get).toHaveBeenCalledWith('analysis-engines/analysis-exclusions')
    })

    it('should not require parameters', async () => {
      await IntegrationsAPI.getAnalysisExclusions()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.getAnalysisExclusions()
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with exclusions data', async () => {
      const mockData = { data: { exclusions: [] } }
      testRequest.get.mockResolvedValueOnce(mockData)

      const result = await IntegrationsAPI.getAnalysisExclusions()
      expect(result).toEqual(mockData)
    })
  })

  describe('updateAnalysisExclusions', () => {
    it('should call PUT with COMMON_SNACKBAR', async () => {
      const payload = { exclusions: ['rule1', 'rule2'] }
      await IntegrationsAPI.updateAnalysisExclusions(payload)
      expect(testRequest.put).toHaveBeenCalledWith('analysis-engines/analysis-exclusions', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should use default empty object when no payload', async () => {
      await IntegrationsAPI.updateAnalysisExclusions()
      expect(testRequest.put).toHaveBeenCalledWith('analysis-engines/analysis-exclusions', {}, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle complex exclusion payload', async () => {
      const payload = {
        exclusions: [
          { rule: 'rule1', type: 'domain' },
          { rule: 'rule2', type: 'ip' }
        ]
      }
      await IntegrationsAPI.updateAnalysisExclusions(payload)
      expect(testRequest.put).toHaveBeenCalledWith('analysis-engines/analysis-exclusions', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.updateAnalysisExclusions({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getAnalysisEngineFormOptions', () => {
    it('should call GET endpoint', async () => {
      await IntegrationsAPI.getAnalysisEngineFormOptions()
      expect(testRequest.get).toHaveBeenCalledWith('analysis-engines/form-details')
    })

    it('should not require parameters', async () => {
      await IntegrationsAPI.getAnalysisEngineFormOptions()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should return thenable', () => {
      const result = IntegrationsAPI.getAnalysisEngineFormOptions()
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with form options', async () => {
      const mockData = { data: { fields: [], types: [] } }
      testRequest.get.mockResolvedValueOnce(mockData)

      const result = await IntegrationsAPI.getAnalysisEngineFormOptions()
      expect(result).toEqual(mockData)
    })
  })

  describe('HTTP Method Consistency', () => {
    it('should use POST for list and export operations', async () => {
      await IntegrationsAPI.getIntegrationList({})
      await IntegrationsAPI.exportReportedEmails({})
      expect(testRequest.post).toHaveBeenCalledTimes(2)
    })

    it('should use GET for read operations', async () => {
      await IntegrationsAPI.getIntegrationDetails('1')
      await IntegrationsAPI.getAnalysisExclusions()
      await IntegrationsAPI.getAnalysisEngineFormOptions()
      expect(testRequest.get).toHaveBeenCalledTimes(3)
    })

    it('should use PUT for mutations', async () => {
      await IntegrationsAPI.updateIntegration('1', {})
      await IntegrationsAPI.disableIntegration('1')
      await IntegrationsAPI.enableIntegration('1')
      await IntegrationsAPI.testAnalysis('1', {})
      await IntegrationsAPI.updateAnalysisExclusions({})
      expect(testRequest.put).toHaveBeenCalledTimes(5)
    })

    it('should use DELETE for deletion', async () => {
      await IntegrationsAPI.deleteIntegration('1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Snackbar Configuration', () => {
    it('should include snackbar for creation, mutation and deletion', async () => {
      testRequest.post.mockClear()
      testRequest.put.mockClear()
      testRequest.delete.mockClear()

      await IntegrationsAPI.createIntegration({})
      expect(testRequest.post.mock.calls[0][2]).toHaveProperty('snackbar')

      await IntegrationsAPI.updateIntegration('1', {})
      expect(testRequest.put.mock.calls[0][2]).toHaveProperty('snackbar')

      await IntegrationsAPI.disableIntegration('1')
      expect(testRequest.put.mock.calls[1][2]).toHaveProperty('snackbar')

      await IntegrationsAPI.deleteIntegration('1')
      expect(testRequest.delete.mock.calls[0][1]).toHaveProperty('snackbar')
    })

    it('should not include snackbar for test operations', async () => {
      testRequest.put.mockClear()
      await IntegrationsAPI.testAnalysis('1', {})
      expect(testRequest.put.mock.calls[0][2]).toBeUndefined()
    })

    it('should not include snackbar for export operations', async () => {
      testRequest.post.mockClear()
      await IntegrationsAPI.exportReportedEmails({})
      const calls = testRequest.post.mock.calls
      expect(calls[0][2]).toEqual({ responseType: 'blob' })
      expect(calls[0][2]).not.toHaveProperty('snackbar')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 12 functions', () => {
      const functions = Object.values(IntegrationsAPI).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(12)
    })

    it('should have all integration functions', () => {
      expect(typeof IntegrationsAPI.getIntegrationList).toBe('function')
      expect(typeof IntegrationsAPI.exportReportedEmails).toBe('function')
      expect(typeof IntegrationsAPI.createIntegration).toBe('function')
      expect(typeof IntegrationsAPI.disableIntegration).toBe('function')
      expect(typeof IntegrationsAPI.enableIntegration).toBe('function')
      expect(typeof IntegrationsAPI.deleteIntegration).toBe('function')
      expect(typeof IntegrationsAPI.getIntegrationDetails).toBe('function')
      expect(typeof IntegrationsAPI.updateIntegration).toBe('function')
      expect(typeof IntegrationsAPI.testAnalysis).toBe('function')
      expect(typeof IntegrationsAPI.getAnalysisExclusions).toBe('function')
      expect(typeof IntegrationsAPI.updateAnalysisExclusions).toBe('function')
      expect(typeof IntegrationsAPI.getAnalysisEngineFormOptions).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle integration lifecycle', async () => {
      // Create
      await IntegrationsAPI.createIntegration({ name: 'New' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Retrieve
      testRequest.get.mockClear()
      await IntegrationsAPI.getIntegrationDetails('1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Update
      testRequest.put.mockClear()
      await IntegrationsAPI.updateIntegration('1', { name: 'Updated' })
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Delete
      testRequest.delete.mockClear()
      await IntegrationsAPI.deleteIntegration('1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle enable/disable workflow', async () => {
      await IntegrationsAPI.disableIntegration('1')
      await IntegrationsAPI.enableIntegration('1')
      await IntegrationsAPI.disableIntegration('1')

      expect(testRequest.put).toHaveBeenCalledTimes(3)
    })

    it('should handle analysis exclusion management', async () => {
      await IntegrationsAPI.getAnalysisExclusions()
      await IntegrationsAPI.updateAnalysisExclusions({ exclusions: [] })

      expect(testRequest.get).toHaveBeenCalledTimes(1)
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel requests', async () => {
      const results = await Promise.all([
        IntegrationsAPI.getIntegrationList({}),
        IntegrationsAPI.getAnalysisExclusions(),
        IntegrationsAPI.getAnalysisEngineFormOptions()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('Error Handling', () => {
    it('should propagate POST errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(IntegrationsAPI.getIntegrationList({})).rejects.toThrow('Search failed')
    })

    it('should propagate GET errors', async () => {
      const error = new Error('Not found')
      testRequest.get.mockRejectedValueOnce(error)

      await expect(IntegrationsAPI.getIntegrationDetails('1')).rejects.toThrow('Not found')
    })

    it('should propagate PUT errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)

      await expect(IntegrationsAPI.updateIntegration('1', {})).rejects.toThrow('Update failed')
    })

    it('should propagate DELETE errors', async () => {
      const error = new Error('Delete failed')
      testRequest.delete.mockRejectedValueOnce(error)

      await expect(IntegrationsAPI.deleteIntegration('1')).rejects.toThrow('Delete failed')
    })
  })
})
