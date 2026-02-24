import * as integrationsApi from '@/api/integrations'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('integrations API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getIntegrationList', () => {
    it('calls POST analysis-engines/search', async () => {
      await integrationsApi.getIntegrationList({})
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines/search', {})
    })
  })

  describe('getIntegrationDetails', () => {
    it('calls GET with loading', async () => {
      await integrationsApi.getIntegrationDetails('id-1')
      expect(testRequest.get).toHaveBeenCalledWith('analysis-engines/id-1', { loading: true })
    })
  })

  describe('disableIntegration', () => {
    it('calls PUT disable endpoint', async () => {
      await integrationsApi.disableIntegration('id-1')
      expect(testRequest.put).toHaveBeenCalledWith(
        'analysis-engines/id-1/disable',
        null,
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('enableIntegration', () => {
    it('calls PUT enable endpoint', async () => {
      await integrationsApi.enableIntegration('id-1')
      expect(testRequest.put).toHaveBeenCalledWith(
        'analysis-engines/id-1/enable',
        null,
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getAnalysisExclusions', () => {
    it('calls GET analysis-exclusions', async () => {
      await integrationsApi.getAnalysisExclusions()
      expect(testRequest.get).toHaveBeenCalledWith('analysis-engines/analysis-exclusions')
    })
  })
})
