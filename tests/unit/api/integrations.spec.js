jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as integrationsApi from '@/api/integrations'

describe('integrations API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('integration management', () => {
    it('should call getIntegrationList', async () => {
      const payload = { page: 1 }
      await integrationsApi.getIntegrationList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines/search', payload)
    })

    it('should call getIntegrationDetails', async () => {
      const id = 'integration-123'
      await integrationsApi.getIntegrationDetails(id)
      expect(testRequest.get).toHaveBeenCalledWith(`analysis-engines/${id}`, { loading: true })
    })

    it('should call createIntegration', async () => {
      const payload = { name: 'New Integration' }
      await integrationsApi.createIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'analysis-engines',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateIntegration', async () => {
      const id = 'integration-123'
      const payload = { name: 'Updated Integration' }
      await integrationsApi.updateIntegration(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `analysis-engines/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteIntegration', async () => {
      const id = 'integration-123'
      await integrationsApi.deleteIntegration(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `analysis-engines/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call enableIntegration', async () => {
      const id = 'integration-123'
      await integrationsApi.enableIntegration(id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `analysis-engines/${id}/enable`,
        null,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call disableIntegration', async () => {
      const id = 'integration-123'
      await integrationsApi.disableIntegration(id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `analysis-engines/${id}/disable`,
        null,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('integration testing and exclusions', () => {
    it('should call testAnalysis', async () => {
      const id = 'integration-123'
      const payload = { testData: 'test' }
      await integrationsApi.testAnalysis(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/analysis-engines-types/${id}/test-connection`,
        payload
      )
    })

    it('should call getAnalysisExclusions', async () => {
      await integrationsApi.getAnalysisExclusions()
      expect(testRequest.get).toHaveBeenCalledWith('analysis-engines/analysis-exclusions')
    })

    it('should call updateAnalysisExclusions', async () => {
      const payload = { exclusions: [] }
      await integrationsApi.updateAnalysisExclusions(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        'analysis-engines/analysis-exclusions',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateAnalysisExclusions with default payload', async () => {
      await integrationsApi.updateAnalysisExclusions()
      expect(testRequest.put).toHaveBeenCalledWith(
        'analysis-engines/analysis-exclusions',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('form and configuration', () => {
    it('should call getAnalysisEngineFormOptions', async () => {
      await integrationsApi.getAnalysisEngineFormOptions()
      expect(testRequest.get).toHaveBeenCalledWith('analysis-engines/form-details')
    })
  })

  describe('export operations', () => {
    it('should call exportReportedEmails', async () => {
      const payload = { filters: {} }
      await integrationsApi.exportReportedEmails(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'analysis-engines/search/export',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await integrationsApi.getAnalysisExclusions()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await integrationsApi.getIntegrationList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const id = 'integration-123'
      const payload = { name: 'Updated' }
      await integrationsApi.updateIntegration(id, payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await integrationsApi.deleteIntegration('integration-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for mutations', async () => {
      const payload = { name: 'New Integration' }
      await integrationsApi.createIntegration(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for enable/disable', async () => {
      const id = 'integration-123'
      await integrationsApi.enableIntegration(id)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        null,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await integrationsApi.exportReportedEmails(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle integration creation with configuration', async () => {
      const payload = { name: 'Integration', config: { apiKey: 'key-123' } }
      await integrationsApi.createIntegration(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle integration test with payload', async () => {
      const id = 'integration-123'
      const payload = { testData: 'data' }
      await integrationsApi.testAnalysis(id, payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle integration details with loading state', async () => {
      const id = 'integration-123'
      await integrationsApi.getIntegrationDetails(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ loading: true })
      )
    })

    it('should handle bulk update of analysis exclusions', async () => {
      const payload = { exclusions: ['item-1', 'item-2', 'item-3'] }
      await integrationsApi.updateAnalysisExclusions(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })
  })
})
