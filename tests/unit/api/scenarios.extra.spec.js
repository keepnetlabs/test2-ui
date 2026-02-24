import {
  getScenariosList,
  createScenario,
  getScenario,
  deleteScenario,
  getScenarioDataDetails,
  minifyHTML
} from '@/api/scenarios'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('scenarios API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getScenariosList', () => {
    it('calls POST search', async () => {
      await getScenariosList({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/phishing-scenario/search',
        { page: 1 }
      )
    })
  })

  describe('createScenario', () => {
    it('calls POST with snackbar', async () => {
      await createScenario({ name: 'Scenario1' })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/phishing-scenario',
        { name: 'Scenario1' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getScenario', () => {
    it('calls GET by id', async () => {
      await getScenario('scn-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-simulator/phishing-scenario/scn-1'
      )
    })
  })

  describe('deleteScenario', () => {
    it('calls DELETE with snackbar', async () => {
      await deleteScenario('scn-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/phishing-scenario/scn-1',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getScenarioDataDetails', () => {
    it('calls GET form-details', async () => {
      await getScenarioDataDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-simulator/phishing-scenario/form-details'
      )
    })
  })

  describe('minifyHTML', () => {
    it('calls POST compress-html with hideError', async () => {
      await minifyHTML('<html>test</html>')
      expect(testRequest.post).toHaveBeenCalledWith(
        'file/compress-html',
        { htmlContent: '<html>test</html>' },
        expect.objectContaining({ snackbar: expect.objectContaining({ hideError: true }) })
      )
    })
    it('defaults to empty string', async () => {
      await minifyHTML()
      expect(testRequest.post).toHaveBeenCalledWith(
        'file/compress-html',
        { htmlContent: '' },
        expect.anything()
      )
    })
  })
})
