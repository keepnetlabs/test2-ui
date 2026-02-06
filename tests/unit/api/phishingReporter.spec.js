jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as phishingReporterApi from '@/api/phishingReporter'

describe('phishingReporter API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('phishing report operations', () => {
    it('should call getPhishingReportSummary', async () => {
      const payload = { startDate: '2024-01-01', endDate: '2024-12-31' }
      await phishingReporterApi.getPhishingReportSummary(payload)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-reporter/summary?startDate=${payload.startDate}&endDate=${payload.endDate}`
      )
    })

    it('should call getPhishingReporter', async () => {
      await phishingReporterApi.getPhishingReporter()
      expect(testRequest.get).toHaveBeenCalledWith('/phishing-reporter')
    })

    it('should call getPhishingReporterImg', async () => {
      await phishingReporterApi.getPhishingReporterImg()
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.stringContaining('/phishing-reporter/img?time='),
        { responseType: 'blob' }
      )
    })
  })

  describe('phishing reporter user operations', () => {
    it('should call searchPhishingReporterUser', async () => {
      const payload = { page: 1 }
      await phishingReporterApi.searchPhishingReporterUser(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/phishing-reporter/search', payload)
    })

    it('should call deletePhishingReporterUser', async () => {
      const id = 'user-123'
      await phishingReporterApi.deletePhishingReporterUser(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/phishing-reporter-users/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeletePhishingUsers', async () => {
      const payload = { userIds: ['user-1', 'user-2'] }
      await phishingReporterApi.bulkDeletePhishingUsers(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/phishing-reporter-users/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call bulkDeletePhishingUsers with default payload', async () => {
      await phishingReporterApi.bulkDeletePhishingUsers()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/phishing-reporter-users/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: {} }
      )
    })
  })

  describe('configuration operations', () => {
    it('should call createPhishingReporter', async () => {
      const payload = { enabled: true }
      await phishingReporterApi.createPhishingReporter(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-reporter',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getDefaultSettingsForLanguage', async () => {
      const payload = { language: 'en' }
      await phishingReporterApi.getDefaultSettingsForLanguage(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-reporter/translate-addin-settings',
        payload
      )
    })
  })

  describe('export operations', () => {
    it('should call exportPhishingReporterUserList', async () => {
      const payload = { filters: {} }
      await phishingReporterApi.exportPhishingReporterUserList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-reporter/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportPhishingReporterDownloadHistory', async () => {
      const payload = { filters: {} }
      await phishingReporterApi.exportPhishingReporterDownloadHistory(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-reporter/history/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call searchGeneratedApplicationHistory', async () => {
      const payload = { page: 1 }
      await phishingReporterApi.searchGeneratedApplicationHistory(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-reporter/history/search',
        payload
      )
    })
  })

  describe('add-in generation and download', () => {
    it('should call generateOutlookAddIn', async () => {
      await phishingReporterApi.generateOutlookAddIn()
      expect(testRequest.get).toHaveBeenCalledWith('/phishing-reporter/generate/outlook-addin')
    })

    it('should call downloadOutlookAddIn', async () => {
      const id = 'addin-123'
      await phishingReporterApi.downloadOutlookAddIn(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-reporter/download/outlook-addin/${id}`,
        { responseType: 'blob' }
      )
    })

    it('should call generateGoogleWorkSpaceAddIn', async () => {
      await phishingReporterApi.generateGoogleWorkSpaceAddIn()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-reporter/generate/gsuite-addin',
        { responseType: 'blob' }
      )
    })

    it('should call generateO365AddIn', async () => {
      await phishingReporterApi.generateO365AddIn()
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-reporter/generate/microsoft365-addin',
        { responseType: 'blob' }
      )
    })

    it('should call downloadSpamReport', async () => {
      const payload = {}
      await phishingReporterApi.downloadSpamReport(payload)
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-reporter/generate/microsoft365-spam-reporting-addin',
        { responseType: 'blob' }
      )
    })
  })

  describe('diagnostic tool operations', () => {
    it('should call generateDiagnosticTool', async () => {
      await phishingReporterApi.generateDiagnosticTool()
      expect(testRequest.get).toHaveBeenCalledWith('/phishing-reporter/generate/diagnostic-tool')
    })

    it('should call downloadDiagnosticTool', async () => {
      const id = 'tool-123'
      await phishingReporterApi.downloadDiagnosticTool(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-reporter/download/diagnostic-tool/${id}`,
        { responseType: 'blob' }
      )
    })
  })

  describe('graph account operations', () => {
    it('should call createGraphAccount', async () => {
      const payload = { accountId: 'account-123' }
      await phishingReporterApi.createGraphAccount(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-reporter/link-graph-account',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call connectGraphAccount', async () => {
      const payload = { settings: {} }
      await phishingReporterApi.connectGraphAccount(payload)
      expect(testRequest.get).toHaveBeenCalledWith(
        '/phishing-reporter/o365-spam-reporting/settings',
        payload
      )
    })

    it('should call updateApplicationLevelAccount', async () => {
      const isGranted = true
      await phishingReporterApi.updateApplicationLevelAccount(isGranted)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/phishing-reporter/app-permission-access/${isGranted}`,
        { isGranted },
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteGraphAccount', async () => {
      await phishingReporterApi.deleteGraphAccount()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/phishing-reporter/unlink-graph-account',
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await phishingReporterApi.getPhishingReporter()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create operations', async () => {
      const payload = { page: 1 }
      await phishingReporterApi.searchPhishingReporterUser(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for update operations', async () => {
      await phishingReporterApi.updateApplicationLevelAccount(true)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for delete operations', async () => {
      await phishingReporterApi.deletePhishingReporterUser('user-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for mutations', async () => {
      const payload = { enabled: true }
      await phishingReporterApi.createPhishingReporter(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for user deletion', async () => {
      await phishingReporterApi.deletePhishingReporterUser('user-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for graph operations', async () => {
      const payload = { accountId: 'account-123' }
      await phishingReporterApi.createGraphAccount(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type for exports and downloads', () => {
    it('should use blob responseType for image retrieval', async () => {
      await phishingReporterApi.getPhishingReporterImg()
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for user list export', async () => {
      const payload = { filters: {} }
      await phishingReporterApi.exportPhishingReporterUserList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for add-in downloads', async () => {
      const id = 'addin-123'
      await phishingReporterApi.downloadOutlookAddIn(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('date range operations', () => {
    it('should handle date range with ISO format dates', async () => {
      const payload = { startDate: '2024-01-01', endDate: '2024-12-31' }
      await phishingReporterApi.getPhishingReportSummary(payload)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle date range with custom format dates', async () => {
      const payload = { startDate: '01/01/2024', endDate: '12/31/2024' }
      await phishingReporterApi.getPhishingReportSummary(payload)
      expect(testRequest.get).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle bulk delete with multiple user IDs', async () => {
      const payload = { userIds: ['user-1', 'user-2', 'user-3'] }
      await phishingReporterApi.bulkDeletePhishingUsers(payload)
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle graph account operations with special characters in ID', async () => {
      const id = 'account-123!@#'
      await phishingReporterApi.createGraphAccount({ accountId: id })
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle timestamp in image retrieval', async () => {
      await phishingReporterApi.getPhishingReporterImg()
      const callArgs = testRequest.get.mock.calls[0][0]
      expect(callArgs).toMatch(/\/phishing-reporter\/img\?time=\d+/)
    })

    it('should handle diagnostic tool download with custom ID', async () => {
      const id = 'diagnostic-456'
      await phishingReporterApi.downloadDiagnosticTool(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-reporter/download/diagnostic-tool/${id}`,
        { responseType: 'blob' }
      )
    })
  })
})
