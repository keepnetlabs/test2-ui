import * as phishingReporterApi from '@/api/phishingReporter'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('phishingReporter API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPhishingReporter', () => {
    it('calls GET /phishing-reporter', async () => {
      await phishingReporterApi.getPhishingReporter()
      expect(testRequest.get).toHaveBeenCalledWith('/phishing-reporter')
    })
  })

  describe('getPhishingReportSummary', () => {
    it('calls GET with date params', async () => {
      await phishingReporterApi.getPhishingReportSummary({
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      })
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-reporter/summary?startDate=2024-01-01&endDate=2024-01-31'
      )
    })
  })

  describe('generateOutlookAddIn', () => {
    it('calls GET generate endpoint', async () => {
      await phishingReporterApi.generateOutlookAddIn()
      expect(testRequest.get).toHaveBeenCalledWith('/phishing-reporter/generate/outlook-addin')
    })
  })

  describe('searchPhishingReporterUser', () => {
    it('calls POST search', async () => {
      await phishingReporterApi.searchPhishingReporterUser({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/phishing-reporter/search', { page: 1 })
    })
  })

  describe('createPhishingReporter', () => {
    it('calls POST with snackbar', async () => {
      await phishingReporterApi.createPhishingReporter({ name: 'Test' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-reporter',
        { name: 'Test' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('deletePhishingReporterUser', () => {
    it('calls DELETE with id', async () => {
      await phishingReporterApi.deletePhishingReporterUser('user-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/phishing-reporter-users/user-1',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getPhishingReporterImg', () => {
    it('calls GET img with blob', async () => {
      await phishingReporterApi.getPhishingReporterImg()
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.stringMatching(/\/phishing-reporter\/img\?time=\d+/),
        { responseType: 'blob' }
      )
    })
  })

  describe('generateGoogleWorkSpaceAddIn', () => {
    it('calls GET gsuite-addin with blob', async () => {
      await phishingReporterApi.generateGoogleWorkSpaceAddIn()
      expect(testRequest.get).toHaveBeenCalledWith('/phishing-reporter/generate/gsuite-addin', {
        responseType: 'blob'
      })
    })
  })

  describe('generateDiagnosticTool', () => {
    it('calls GET diagnostic-tool', async () => {
      await phishingReporterApi.generateDiagnosticTool()
      expect(testRequest.get).toHaveBeenCalledWith('/phishing-reporter/generate/diagnostic-tool')
    })
  })

  describe('searchGeneratedApplicationHistory', () => {
    it('calls POST history/search', async () => {
      await phishingReporterApi.searchGeneratedApplicationHistory({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/phishing-reporter/history/search', { page: 1 })
    })
  })

  describe('bulkDeletePhishingUsers', () => {
    it('calls DELETE bulk-delete', async () => {
      await phishingReporterApi.bulkDeletePhishingUsers({ ids: ['a', 'b'] })
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/phishing-reporter-users/bulk-delete',
        expect.objectContaining({ data: { ids: ['a', 'b'] } })
      )
    })
  })
})
