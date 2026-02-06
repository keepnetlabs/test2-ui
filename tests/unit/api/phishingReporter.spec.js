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

    it('should handle numeric and string IDs', async () => {
      await phishingReporterApi.deletePhishingReporterUser(123)
      expect(testRequest.delete).toHaveBeenCalled()

      testRequest.delete.mockClear()
      await phishingReporterApi.deletePhishingReporterUser('user-abc')
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle large bulk delete operations', async () => {
      const userIds = Array.from({ length: 100 }, (_, i) => `user-${i}`)
      const payload = { userIds }
      await phishingReporterApi.bulkDeletePhishingUsers(payload)
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        phishingReporterApi.getPhishingReportSummary({}),
        phishingReporterApi.getPhishingReporter(),
        phishingReporterApi.getPhishingReporterImg(),
        phishingReporterApi.searchPhishingReporterUser({}),
        phishingReporterApi.deletePhishingReporterUser('id'),
        phishingReporterApi.bulkDeletePhishingUsers({}),
        phishingReporterApi.createPhishingReporter({}),
        phishingReporterApi.getDefaultSettingsForLanguage({}),
        phishingReporterApi.exportPhishingReporterUserList({}),
        phishingReporterApi.exportPhishingReporterDownloadHistory({}),
        phishingReporterApi.searchGeneratedApplicationHistory({}),
        phishingReporterApi.generateOutlookAddIn(),
        phishingReporterApi.downloadOutlookAddIn('id'),
        phishingReporterApi.generateGoogleWorkSpaceAddIn(),
        phishingReporterApi.generateO365AddIn(),
        phishingReporterApi.downloadSpamReport({}),
        phishingReporterApi.generateDiagnosticTool(),
        phishingReporterApi.downloadDiagnosticTool('id'),
        phishingReporterApi.createGraphAccount({}),
        phishingReporterApi.connectGraphAccount({}),
        phishingReporterApi.updateApplicationLevelAccount(true),
        phishingReporterApi.deleteGraphAccount()
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof phishingReporterApi.getPhishingReportSummary).toBe('function')
      expect(typeof phishingReporterApi.getPhishingReporter).toBe('function')
      expect(typeof phishingReporterApi.getPhishingReporterImg).toBe('function')
      expect(typeof phishingReporterApi.searchPhishingReporterUser).toBe('function')
      expect(typeof phishingReporterApi.deletePhishingReporterUser).toBe('function')
      expect(typeof phishingReporterApi.bulkDeletePhishingUsers).toBe('function')
      expect(typeof phishingReporterApi.createPhishingReporter).toBe('function')
      expect(typeof phishingReporterApi.getDefaultSettingsForLanguage).toBe('function')
      expect(typeof phishingReporterApi.exportPhishingReporterUserList).toBe('function')
      expect(typeof phishingReporterApi.exportPhishingReporterDownloadHistory).toBe('function')
      expect(typeof phishingReporterApi.searchGeneratedApplicationHistory).toBe('function')
      expect(typeof phishingReporterApi.generateOutlookAddIn).toBe('function')
      expect(typeof phishingReporterApi.downloadOutlookAddIn).toBe('function')
      expect(typeof phishingReporterApi.generateGoogleWorkSpaceAddIn).toBe('function')
      expect(typeof phishingReporterApi.generateO365AddIn).toBe('function')
      expect(typeof phishingReporterApi.downloadSpamReport).toBe('function')
      expect(typeof phishingReporterApi.generateDiagnosticTool).toBe('function')
      expect(typeof phishingReporterApi.downloadDiagnosticTool).toBe('function')
      expect(typeof phishingReporterApi.createGraphAccount).toBe('function')
      expect(typeof phishingReporterApi.connectGraphAccount).toBe('function')
      expect(typeof phishingReporterApi.updateApplicationLevelAccount).toBe('function')
      expect(typeof phishingReporterApi.deleteGraphAccount).toBe('function')
    })

    it('should export at least 22 functions', () => {
      const functions = Object.values(phishingReporterApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(22)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle phishing reporter setup workflow', async () => {
      await phishingReporterApi.getPhishingReporter()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await phishingReporterApi.createPhishingReporter({ enabled: true })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle user search and deletion workflow', async () => {
      await phishingReporterApi.searchPhishingReporterUser({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await phishingReporterApi.deletePhishingReporterUser('user-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle add-in generation and download workflow', async () => {
      await phishingReporterApi.generateOutlookAddIn()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await phishingReporterApi.downloadOutlookAddIn('addin-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle graph account setup workflow', async () => {
      await phishingReporterApi.createGraphAccount({ accountId: 'account-1' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await phishingReporterApi.updateApplicationLevelAccount(true)
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await phishingReporterApi.deleteGraphAccount()
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel reporter operations', async () => {
      const results = await Promise.all([
        phishingReporterApi.getPhishingReporter(),
        phishingReporterApi.getPhishingReporterImg(),
        phishingReporterApi.searchPhishingReporterUser({})
      ])

      expect(results).toHaveLength(3)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle report summary with date range', async () => {
      const payload = { startDate: '2024-01-01', endDate: '2024-12-31' }
      await phishingReporterApi.getPhishingReportSummary(payload)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle user search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await phishingReporterApi.searchPhishingReporterUser(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/phishing-reporter/search', payload)
    })

    it('should handle bulk delete with multiple IDs', async () => {
      const payload = { userIds: ['user-1', 'user-2', 'user-3'] }
      await phishingReporterApi.bulkDeletePhishingUsers(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/phishing-reporter-users/bulk-delete',
        expect.objectContaining({ data: payload })
      )
    })

    it('should handle add-in download with ID parameter', async () => {
      const id = 'addin-123'
      await phishingReporterApi.downloadOutlookAddIn(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/phishing-reporter/download/outlook-addin/${id}`,
        expect.any(Object)
      )
    })

    it('should handle graph account with account ID', async () => {
      const payload = { accountId: 'graph-account-1' }
      await phishingReporterApi.createGraphAccount(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-reporter/link-graph-account',
        payload,
        expect.any(Object)
      )
    })

    it('should handle application level account with boolean flag', async () => {
      const isGranted = true
      await phishingReporterApi.updateApplicationLevelAccount(isGranted)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/phishing-reporter/app-permission-access/${isGranted}`,
        { isGranted },
        expect.any(Object)
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate report summary errors', async () => {
      const error = new Error('Report fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(phishingReporterApi.getPhishingReportSummary({})).rejects.toThrow('Report fetch failed')
    })

    it('should propagate user search errors', async () => {
      const error = new Error('User search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(phishingReporterApi.searchPhishingReporterUser({})).rejects.toThrow('User search failed')
    })

    it('should propagate deletion errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(phishingReporterApi.deletePhishingReporterUser('id')).rejects.toThrow('Deletion failed')
    })

    it('should propagate add-in generation errors', async () => {
      const error = new Error('Add-in generation failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(phishingReporterApi.generateOutlookAddIn()).rejects.toThrow('Add-in generation failed')
    })

    it('should propagate add-in download errors', async () => {
      const error = new Error('Add-in download failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(phishingReporterApi.downloadOutlookAddIn('id')).rejects.toThrow('Add-in download failed')
    })

    it('should propagate graph account errors', async () => {
      const error = new Error('Graph account operation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(phishingReporterApi.createGraphAccount({})).rejects.toThrow('Graph account operation failed')
    })

    it('should propagate export errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(phishingReporterApi.exportPhishingReporterUserList({})).rejects.toThrow('Export failed')
    })
  })
})
