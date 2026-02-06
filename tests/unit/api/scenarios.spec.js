jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as scenariosApi from '@/api/scenarios'

describe('scenarios API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('scenario search and retrieval', () => {
    it('should call getScenariosList', async () => {
      const payload = { page: 1 }
      await scenariosApi.getScenariosList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/search', payload)
    })

    it('should call getScenario', async () => {
      const id = 'scenario-123'
      await scenariosApi.getScenario(id)
      expect(testRequest.get).toHaveBeenCalledWith(`phishing-simulator/phishing-scenario/${id}`)
    })

    it('should call getScenarioDataDetails', async () => {
      await scenariosApi.getScenarioDataDetails()
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/form-details')
    })

    it('should call getSummaryOfScenario', async () => {
      const templateId = 'template-123'
      const landingPageId = 'landing-123'
      await scenariosApi.getSummaryOfScenario(templateId, landingPageId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/phishing-scenario/preview/${templateId}/${landingPageId}`
      )
    })
  })

  describe('scenario management operations', () => {
    it('should call createScenario', async () => {
      const payload = { name: 'New Scenario' }
      await scenariosApi.createScenario(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/phishing-scenario',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateScenario', async () => {
      const id = 'scenario-123'
      const payload = { name: 'Updated Scenario' }
      await scenariosApi.updateScenario(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `phishing-simulator/phishing-scenario/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteScenario', async () => {
      const id = 'scenario-123'
      await scenariosApi.deleteScenario(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `phishing-simulator/phishing-scenario/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteScenarios', async () => {
      const payload = { scenarioIds: ['scenario-1', 'scenario-2'] }
      await scenariosApi.bulkDeleteScenarios(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/phishing-scenario/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })
  })

  describe('scenario export operations', () => {
    it('should call exportScenarios', async () => {
      const payload = { filters: {} }
      await scenariosApi.exportScenarios(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/phishing-scenario/search/export',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTML utility operations', () => {
    it('should call minifyHTML with content', async () => {
      const htmlContent = '<div>Test</div>'
      await scenariosApi.minifyHTML(htmlContent)
      expect(testRequest.post).toHaveBeenCalledWith(
        'file/compress-html',
        { htmlContent },
        { snackbar: { hideError: true } }
      )
    })

    it('should call minifyHTML with default empty content', async () => {
      await scenariosApi.minifyHTML()
      expect(testRequest.post).toHaveBeenCalledWith(
        'file/compress-html',
        { htmlContent: '' },
        { snackbar: { hideError: true } }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const id = 'scenario-123'
      await scenariosApi.getScenario(id)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create operations', async () => {
      const payload = { page: 1 }
      await scenariosApi.getScenariosList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for update operations', async () => {
      const payload = { name: 'Updated' }
      await scenariosApi.updateScenario(payload, 'scenario-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for delete operations', async () => {
      await scenariosApi.deleteScenario('scenario-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for scenario mutations', async () => {
      const payload = { name: 'New Scenario' }
      await scenariosApi.createScenario(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for scenario updates', async () => {
      const payload = { name: 'Updated' }
      await scenariosApi.updateScenario(payload, 'scenario-123')
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use custom snackbar for HTML minification', async () => {
      const htmlContent = '<div>Test</div>'
      await scenariosApi.minifyHTML(htmlContent)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: { hideError: true } })
      )
    })
  })

  describe('blob response type for exports', () => {
    it('should use blob responseType for scenario exports', async () => {
      const payload = { filters: {} }
      await scenariosApi.exportScenarios(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle scenario creation with complex payload', async () => {
      const payload = {
        name: 'Complex Scenario',
        templateIds: ['template-1', 'template-2'],
        landingPageIds: ['landing-1', 'landing-2']
      }
      await scenariosApi.createScenario(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle bulk delete with multiple scenario IDs', async () => {
      const payload = { scenarioIds: ['scenario-1', 'scenario-2', 'scenario-3'] }
      await scenariosApi.bulkDeleteScenarios(payload)
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle HTML minification with large content', async () => {
      const htmlContent = '<div>' + 'Test'.repeat(1000) + '</div>'
      await scenariosApi.minifyHTML(htmlContent)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle scenario preview with special characters in IDs', async () => {
      const templateId = 'template-123!@#'
      const landingPageId = 'landing-456!@#'
      await scenariosApi.getSummaryOfScenario(templateId, landingPageId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/phishing-scenario/preview/${templateId}/${landingPageId}`
      )
    })
  })

  describe('return values', () => {
    it('getScenariosList should return thenable', () => {
      const result = scenariosApi.getScenariosList({})
      expect(typeof result.then).toBe('function')
    })

    it('createScenario should return thenable', () => {
      const result = scenariosApi.createScenario({})
      expect(typeof result.then).toBe('function')
    })

    it('updateScenario should return thenable', () => {
      const result = scenariosApi.updateScenario({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })

    it('getScenario should return thenable', () => {
      const result = scenariosApi.getScenario('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('exportScenarios should return thenable', () => {
      const result = scenariosApi.exportScenarios({})
      expect(typeof result.then).toBe('function')
    })

    it('getScenarioDataDetails should return thenable', () => {
      const result = scenariosApi.getScenarioDataDetails()
      expect(typeof result.then).toBe('function')
    })

    it('deleteScenario should return thenable', () => {
      const result = scenariosApi.deleteScenario('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('bulkDeleteScenarios should return thenable', () => {
      const result = scenariosApi.bulkDeleteScenarios({})
      expect(typeof result.then).toBe('function')
    })

    it('getSummaryOfScenario should return thenable', () => {
      const result = scenariosApi.getSummaryOfScenario('template-1', 'landing-1')
      expect(typeof result.then).toBe('function')
    })

    it('minifyHTML should return thenable', () => {
      const result = scenariosApi.minifyHTML()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 10 functions', () => {
      const functions = Object.values(scenariosApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(10)
    })

    it('should have all scenario functions', () => {
      expect(typeof scenariosApi.getScenariosList).toBe('function')
      expect(typeof scenariosApi.createScenario).toBe('function')
      expect(typeof scenariosApi.updateScenario).toBe('function')
      expect(typeof scenariosApi.getScenario).toBe('function')
      expect(typeof scenariosApi.exportScenarios).toBe('function')
      expect(typeof scenariosApi.getScenarioDataDetails).toBe('function')
      expect(typeof scenariosApi.deleteScenario).toBe('function')
      expect(typeof scenariosApi.bulkDeleteScenarios).toBe('function')
      expect(typeof scenariosApi.getSummaryOfScenario).toBe('function')
      expect(typeof scenariosApi.minifyHTML).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle scenario CRUD workflow', async () => {
      // Get list
      await scenariosApi.getScenariosList({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Create scenario
      testRequest.post.mockClear()
      await scenariosApi.createScenario({ name: 'Test Scenario' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get scenario details
      testRequest.get.mockClear()
      await scenariosApi.getScenario('scenario-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Update scenario
      testRequest.put.mockClear()
      await scenariosApi.updateScenario({ name: 'Updated' }, 'scenario-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Delete scenario
      testRequest.delete.mockClear()
      await scenariosApi.deleteScenario('scenario-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle scenario preview and export workflow', async () => {
      // Get form details
      await scenariosApi.getScenarioDataDetails()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Get preview
      testRequest.get.mockClear()
      await scenariosApi.getSummaryOfScenario('template-1', 'landing-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Export scenarios
      testRequest.post.mockClear()
      await scenariosApi.exportScenarios({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle bulk delete workflow', async () => {
      // Bulk delete scenarios
      await scenariosApi.bulkDeleteScenarios({ scenarioIds: ['scenario-1', 'scenario-2'] })
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel scenario operations', async () => {
      const results = await Promise.all([
        scenariosApi.getScenariosList({}),
        scenariosApi.getScenarioDataDetails(),
        scenariosApi.getScenario('scenario-1')
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })

    it('should handle HTML minification workflow', async () => {
      // Create scenario
      await scenariosApi.createScenario({ name: 'HTML Scenario' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Minify HTML
      testRequest.post.mockClear()
      await scenariosApi.minifyHTML('<div>Content</div>')
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle empty search payload', async () => {
      await scenariosApi.getScenariosList({})
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/search', {})
    })

    it('should handle complex search payload', async () => {
      const payload = {
        page: 2,
        pageSize: 50,
        filters: {
          status: ['draft', 'published'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await scenariosApi.getScenariosList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/search', payload)
    })

    it('should handle scenario creation with minimal payload', async () => {
      const payload = { name: 'Basic Scenario' }
      await scenariosApi.createScenario(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/phishing-scenario', payload, expect.any(Object))
    })

    it('should handle scenario creation with complex payload', async () => {
      const payload = {
        name: 'Advanced Scenario',
        description: 'Advanced setup',
        templateIds: ['template-1', 'template-2'],
        landingPageIds: ['landing-1', 'landing-2'],
        sendingProfile: 'profile-1'
      }
      await scenariosApi.createScenario(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/phishing-scenario', payload, expect.any(Object))
    })

    it('should handle numeric and string IDs for getScenario', async () => {
      await scenariosApi.getScenario(123)
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/123')

      testRequest.get.mockClear()
      await scenariosApi.getScenario('scenario-abc')
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/scenario-abc')
    })

    it('should handle update with minimal payload', async () => {
      await scenariosApi.updateScenario({ name: 'Updated' }, 'scenario-1')
      expect(testRequest.put).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/scenario-1', expect.any(Object), expect.any(Object))
    })

    it('should handle update with complex payload', async () => {
      const payload = {
        name: 'Updated Scenario',
        description: 'New description',
        status: 'active'
      }
      await scenariosApi.updateScenario(payload, 'scenario-1')
      expect(testRequest.put).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/scenario-1', payload, expect.any(Object))
    })

    it('should handle getSummaryOfScenario with IDs', async () => {
      await scenariosApi.getSummaryOfScenario('template-1', 'landing-1')
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/preview/template-1/landing-1')
    })

    it('should handle export with empty payload', async () => {
      await scenariosApi.exportScenarios({})
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/search/export', {}, expect.any(Object))
    })

    it('should handle export with complex payload', async () => {
      const payload = {
        filters: {
          status: ['active'],
          created: { start: '2024-06-01', end: '2024-12-31' }
        }
      }
      await scenariosApi.exportScenarios(payload)
      expect(testRequest.post).toHaveBeenCalledWith('phishing-simulator/phishing-scenario/search/export', payload, expect.any(Object))
    })

    it('should handle bulk delete with scenario IDs', async () => {
      const payload = { scenarioIds: ['scenario-1', 'scenario-2', 'scenario-3'] }
      await scenariosApi.bulkDeleteScenarios(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/phishing-scenario/bulk-delete',
        expect.objectContaining({ data: payload })
      )
    })

    it('should handle minifyHTML with default empty content', async () => {
      await scenariosApi.minifyHTML()
      expect(testRequest.post).toHaveBeenCalledWith('file/compress-html', { htmlContent: '' }, expect.any(Object))
    })

    it('should handle minifyHTML with content', async () => {
      const htmlContent = '<html><body><div>Test</div></body></html>'
      await scenariosApi.minifyHTML(htmlContent)
      expect(testRequest.post).toHaveBeenCalledWith('file/compress-html', { htmlContent }, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate getScenariosList errors', async () => {
      const error = new Error('List fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(scenariosApi.getScenariosList({})).rejects.toThrow('List fetch failed')
    })

    it('should propagate createScenario errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(scenariosApi.createScenario({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateScenario errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(scenariosApi.updateScenario({}, 'id-1')).rejects.toThrow('Update failed')
    })

    it('should propagate getScenario errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(scenariosApi.getScenario('id-1')).rejects.toThrow('Fetch failed')
    })

    it('should propagate exportScenarios errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(scenariosApi.exportScenarios({})).rejects.toThrow('Export failed')
    })

    it('should propagate getScenarioDataDetails errors', async () => {
      const error = new Error('Form details fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(scenariosApi.getScenarioDataDetails()).rejects.toThrow('Form details fetch failed')
    })

    it('should propagate deleteScenario errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(scenariosApi.deleteScenario('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate bulkDeleteScenarios errors', async () => {
      const error = new Error('Bulk delete failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(scenariosApi.bulkDeleteScenarios({})).rejects.toThrow('Bulk delete failed')
    })

    it('should propagate getSummaryOfScenario errors', async () => {
      const error = new Error('Summary fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(scenariosApi.getSummaryOfScenario('t-1', 'l-1')).rejects.toThrow('Summary fetch failed')
    })

    it('should propagate minifyHTML errors', async () => {
      const error = new Error('Minification failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(scenariosApi.minifyHTML()).rejects.toThrow('Minification failed')
    })
  })
})
