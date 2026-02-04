jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
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
})
