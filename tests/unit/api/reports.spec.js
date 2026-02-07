// Mock localStorage before importing modules
const mockStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null
  },
  setItem(key, value) {
    this.data[key] = value
  },
  removeItem(key) {
    delete this.data[key]
  },
  clear() {
    this.data = {}
  }
}

Object.defineProperty(global, 'localStorage', {
  value: mockStorage,
  writable: true,
  configurable: true
})

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import reportsApi from '@/api/reports'

describe('reports API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
  })

  describe('executive report operations', () => {
    it('should call getExecutiveReports', async () => {
      const name = 'Report 1'
      await reportsApi.getExecutiveReports(name)
      expect(testRequest.post).toHaveBeenCalledWith('/executive-report/search', { name })
    })

    it('should call getExecutiveReport without token', async () => {
      const id = 'report-123'
      await reportsApi.getExecutiveReport(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/executive-report/${id}`, {})
    })

    it('should call getExecutiveReport with token', async () => {
      const id = 'report-123'
      const token = 'token-abc'
      const companyId = 'company-123'
      await reportsApi.getExecutiveReport(id, token, companyId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/executive-report/${id}`,
        expect.objectContaining({
          overrideToken: true,
          overrideCompanyId: true,
          customToken: token,
          headers: { 'X-IR-COMPANY-ID': companyId }
        })
      )
    })

    it('should call saveExecutiveReport', async () => {
      const payload = { name: 'New Report' }
      await reportsApi.saveExecutiveReport(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/executive-report',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateExecutiveReport', async () => {
      const payload = { name: 'Updated' }
      const id = 'report-123'
      await reportsApi.updateExecutiveReport(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/executive-report/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteExecutiveReport', async () => {
      const id = 'report-123'
      await reportsApi.deleteExecutiveReport(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/executive-report/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getExecutiveReportChartData', async () => {
      const payload = { chartId: 'chart-1' }
      await reportsApi.getExecutiveReportChartData(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/executive-report/get-widget-datas',
        payload
      )
    })

    it('should call getExecutiveReportMetrics', async () => {
      await reportsApi.getExecutiveReportMetrics()
      expect(testRequest.get).toHaveBeenCalledWith('/executive-report/metrics')
    })

    it('should call uploadExecutiveReportPdf without token', async () => {
      const formData = new FormData()
      const id = 'report-123'
      await reportsApi.uploadExecutiveReportPdf(formData, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/executive-report/${id}/upload`,
        formData,
        {}
      )
    })

    it('should call uploadExecutiveReportPdf with token', async () => {
      const formData = new FormData()
      const id = 'report-123'
      const token = 'token-abc'
      const companyId = 'company-123'
      await reportsApi.uploadExecutiveReportPdf(formData, id, token, companyId)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/executive-report/${id}/upload`,
        formData,
        expect.objectContaining({
          overrideToken: true,
          customToken: token
        })
      )
    })

    it('should call getExecutiveReportLogo without token', async () => {
      const id = 'report-123'
      await reportsApi.getExecutiveReportLogo(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/executive-report/${id}/logo`,
        { responseType: 'blob' }
      )
    })

    it('should call getExecutiveReportLogo with token', async () => {
      const id = 'report-123'
      const token = 'token-abc'
      const companyId = 'company-123'
      await reportsApi.getExecutiveReportLogo(id, token, companyId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/executive-report/${id}/logo`,
        expect.objectContaining({
          responseType: 'blob',
          overrideToken: true,
          customToken: token
        })
      )
    })
  })

  describe('report scheduling operations', () => {
    it('should call searchReportScheduling', async () => {
      const payload = { page: 1 }
      await reportsApi.searchReportScheduling(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/report-scheduling/search', payload)
    })

    it('should call getReportScheduling', async () => {
      const id = 'scheduling-123'
      await reportsApi.getReportScheduling(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/report-scheduling/${id}`)
    })

    it('should call createReportScheduling', async () => {
      const payload = { reportId: 'report-1' }
      await reportsApi.createReportScheduling(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/report-scheduling',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateReportScheduling', async () => {
      const payload = { reportId: 'report-2' }
      const id = 'scheduling-123'
      await reportsApi.updateReportScheduling(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/report-scheduling/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteReportScheduling with default type', async () => {
      const id = 'scheduling-123'
      await reportsApi.deleteReportScheduling(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/report-scheduling/${id}/2`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteReportScheduling with custom type', async () => {
      const id = 'scheduling-123'
      const type = 3
      await reportsApi.deleteReportScheduling(id, type)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/report-scheduling/${id}/${type}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportReportScheduling', async () => {
      const payload = { filters: {} }
      await reportsApi.exportReportScheduling(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/report-scheduling/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call setSchedulingReportStatus', async () => {
      const id = 'scheduling-123'
      const status = 'active'
      await reportsApi.setSchedulingReportStatus(id, status)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/report-scheduling/${id}/status/${status}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getSchedulingReportTargetGroups', async () => {
      await reportsApi.getSchedulingReportTargetGroups()
      expect(testRequest.get).toHaveBeenCalledWith('/report-scheduling/target-groups')
    })

    it('should call getSchedulingReportManagers', async () => {
      await reportsApi.getSchedulingReportManagers()
      expect(testRequest.get).toHaveBeenCalledWith('/report-scheduling/managers')
    })

    it('should call getReportSchedulingLogo', async () => {
      const id = 'company-123'
      await reportsApi.getReportSchedulingLogo(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/companies/${id}/logo`,
        { responseType: 'blob' }
      )
    })
  })

  describe('activity and leaderboard operations', () => {
    it('should call searchPhishingActivityUsers', async () => {
      const payload = { page: 1 }
      await reportsApi.searchPhishingActivityUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/activity-users/search',
        payload
      )
    })

    it('should call searchTrainingActivityUsers', async () => {
      const payload = { page: 1 }
      await reportsApi.searchTrainingActivityUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/training-reports/activity-users/search', payload)
    })

    it('should call getLeaderboardData', async () => {
      const payload = { filters: {} }
      await reportsApi.getLeaderboardData(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/leaderboard/get-all', payload)
    })

    it('should call getTopPerformersData', async () => {
      const payload = { limit: 10 }
      await reportsApi.getTopPerformersData(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/leaderboard/get-top-performers', payload)
    })

    it('should call exportLeaderboardData', async () => {
      const payload = { filters: {} }
      await reportsApi.exportLeaderboardData(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/leaderboard/get-all/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getLeaderboardFormDetails', async () => {
      await reportsApi.getLeaderboardFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith('/leaderboard/form-details')
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await reportsApi.getExecutiveReportMetrics()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      await reportsApi.getExecutiveReports('name')
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      await reportsApi.updateExecutiveReport({}, 'id')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await reportsApi.deleteExecutiveReport('id')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for mutations', async () => {
      await reportsApi.saveExecutiveReport({})
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob for export operations', async () => {
      const payload = { filters: {} }
      await reportsApi.exportReportScheduling(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle default report type', async () => {
      const id = 'scheduling-123'
      await reportsApi.deleteReportScheduling(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/report-scheduling/${id}/2`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should handle empty token and company ID', async () => {
      const id = 'report-123'
      await reportsApi.getExecutiveReport(id, '', '')
      expect(testRequest.get).toHaveBeenCalledWith(`/executive-report/${id}`, {})
    })

    it('should handle numeric and string IDs', async () => {
      await reportsApi.getExecutiveReport(123)
      expect(testRequest.get).toHaveBeenCalledWith(`/executive-report/123`, {})

      testRequest.get.mockClear()
      await reportsApi.getExecutiveReport('report-abc')
      expect(testRequest.get).toHaveBeenCalledWith(`/executive-report/report-abc`, {})
    })

    it('should handle special characters in report names', async () => {
      const payload = { name: 'Report-@-#-$-2024' }
      await reportsApi.getExecutiveReports(payload.name)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle complex report payload', async () => {
      const payload = {
        reportId: 'report-1',
        scheduling: 'daily',
        recipients: ['user1', 'user2'],
        dateRange: { start: '2024-01-01', end: '2024-12-31' }
      }
      await reportsApi.createReportScheduling(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/report-scheduling', payload, expect.any(Object))
    })

    it('should handle FormData in PDF upload', async () => {
      const formData = new FormData()
      formData.append('file', new Blob(['content']))
      const id = 'report-123'
      await reportsApi.uploadExecutiveReportPdf(formData, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/executive-report/${id}/upload`,
        expect.any(FormData),
        expect.any(Object)
      )
    })

    it('should handle various status values', async () => {
      const statusValues = ['active', 'inactive', 'pending']
      for (const status of statusValues) {
        testRequest.put.mockClear()
        await reportsApi.setSchedulingReportStatus('scheduling-1', status)
        expect(testRequest.put).toHaveBeenCalledWith(
          `/report-scheduling/scheduling-1/status/${status}`,
          {},
          expect.any(Object)
        )
      }
    })
  })

  describe('return values', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        reportsApi.getExecutiveReports('name'),
        reportsApi.getExecutiveReport('id'),
        reportsApi.saveExecutiveReport({}),
        reportsApi.updateExecutiveReport({}, 'id'),
        reportsApi.deleteExecutiveReport('id'),
        reportsApi.getExecutiveReportChartData({}),
        reportsApi.getExecutiveReportMetrics(),
        reportsApi.uploadExecutiveReportPdf(new FormData(), 'id'),
        reportsApi.getExecutiveReportLogo('id'),
        reportsApi.searchReportScheduling({}),
        reportsApi.getReportScheduling('id'),
        reportsApi.createReportScheduling({}),
        reportsApi.updateReportScheduling({}, 'id'),
        reportsApi.deleteReportScheduling('id'),
        reportsApi.exportReportScheduling({}),
        reportsApi.setSchedulingReportStatus('id', 'active'),
        reportsApi.getSchedulingReportTargetGroups(),
        reportsApi.getSchedulingReportManagers(),
        reportsApi.getReportSchedulingLogo('id'),
        reportsApi.searchPhishingActivityUsers({}),
        reportsApi.searchTrainingActivityUsers({}),
        reportsApi.getLeaderboardData({}),
        reportsApi.getTopPerformersData({}),
        reportsApi.exportLeaderboardData({}),
        reportsApi.getLeaderboardFormDetails()
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof reportsApi.getExecutiveReports).toBe('function')
      expect(typeof reportsApi.getExecutiveReport).toBe('function')
      expect(typeof reportsApi.saveExecutiveReport).toBe('function')
      expect(typeof reportsApi.updateExecutiveReport).toBe('function')
      expect(typeof reportsApi.deleteExecutiveReport).toBe('function')
      expect(typeof reportsApi.getExecutiveReportChartData).toBe('function')
      expect(typeof reportsApi.getExecutiveReportMetrics).toBe('function')
      expect(typeof reportsApi.uploadExecutiveReportPdf).toBe('function')
      expect(typeof reportsApi.getExecutiveReportLogo).toBe('function')
      expect(typeof reportsApi.searchReportScheduling).toBe('function')
      expect(typeof reportsApi.getReportScheduling).toBe('function')
      expect(typeof reportsApi.createReportScheduling).toBe('function')
      expect(typeof reportsApi.updateReportScheduling).toBe('function')
      expect(typeof reportsApi.deleteReportScheduling).toBe('function')
      expect(typeof reportsApi.exportReportScheduling).toBe('function')
      expect(typeof reportsApi.setSchedulingReportStatus).toBe('function')
      expect(typeof reportsApi.getSchedulingReportTargetGroups).toBe('function')
      expect(typeof reportsApi.getSchedulingReportManagers).toBe('function')
      expect(typeof reportsApi.getReportSchedulingLogo).toBe('function')
      expect(typeof reportsApi.searchPhishingActivityUsers).toBe('function')
      expect(typeof reportsApi.searchTrainingActivityUsers).toBe('function')
      expect(typeof reportsApi.getLeaderboardData).toBe('function')
      expect(typeof reportsApi.getTopPerformersData).toBe('function')
      expect(typeof reportsApi.exportLeaderboardData).toBe('function')
      expect(typeof reportsApi.getLeaderboardFormDetails).toBe('function')
    })

    it('should export at least 25 functions', () => {
      const functions = Object.values(reportsApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(25)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle executive report full workflow', async () => {
      await reportsApi.getExecutiveReports('test')
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await reportsApi.saveExecutiveReport({ name: 'Report' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await reportsApi.getExecutiveReport('report-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await reportsApi.updateExecutiveReport({ name: 'Updated' }, 'report-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await reportsApi.deleteExecutiveReport('report-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle scheduling full workflow', async () => {
      await reportsApi.searchReportScheduling({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await reportsApi.createReportScheduling({ reportId: 'report-1' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await reportsApi.getReportScheduling('scheduling-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await reportsApi.updateReportScheduling({ reportId: 'report-2' }, 'scheduling-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await reportsApi.deleteReportScheduling('scheduling-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle leaderboard data workflow', async () => {
      const results = await Promise.all([
        reportsApi.getLeaderboardData({}),
        reportsApi.getTopPerformersData({ limit: 10 }),
        reportsApi.getLeaderboardFormDetails()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel report operations', async () => {
      const results = await Promise.all([
        reportsApi.searchPhishingActivityUsers({}),
        reportsApi.searchTrainingActivityUsers({}),
        reportsApi.getExecutiveReportMetrics()
      ])

      expect(results).toHaveLength(3)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle executive report with custom token and company ID', async () => {
      const id = 'report-123'
      const token = 'custom-token-abc'
      const companyId = 'company-789'
      await reportsApi.getExecutiveReport(id, token, companyId)

      expect(testRequest.get).toHaveBeenCalledWith(
        `/executive-report/${id}`,
        expect.objectContaining({
          overrideToken: true,
          overrideCompanyId: true,
          customToken: token,
          headers: { 'X-IR-COMPANY-ID': companyId }
        })
      )
    })

    it('should handle scheduling with different report types', async () => {
      const reportTypes = [1, 2, 3, 4]
      for (const type of reportTypes) {
        testRequest.delete.mockClear()
        await reportsApi.deleteReportScheduling('scheduling-1', type)
        expect(testRequest.delete).toHaveBeenCalledWith(
          `/report-scheduling/scheduling-1/${type}`,
          expect.any(Object)
        )
      }
    })

    it('should handle PDF upload with all parameters', async () => {
      const formData = new FormData()
      const id = 'report-456'
      const token = 'upload-token'
      const companyId = 'company-456'

      await reportsApi.uploadExecutiveReportPdf(formData, id, token, companyId)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/executive-report/${id}/upload`,
        expect.any(FormData),
        expect.objectContaining({
          overrideToken: true,
          customToken: token
        })
      )
    })

    it('should handle leaderboard data with complex filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          departments: ['IT', 'HR', 'Finance'],
          status: ['active']
        }
      }
      await reportsApi.getLeaderboardData(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/leaderboard/get-all', payload)
    })

    it('should handle report scheduling search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await reportsApi.searchReportScheduling(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/report-scheduling/search', payload)
    })

    it('should handle various report scheduling status values', async () => {
      const statuses = ['active', 'inactive', 'paused', 'archived']
      for (const status of statuses) {
        testRequest.put.mockClear()
        await reportsApi.setSchedulingReportStatus('scheduling-1', status)
        expect(testRequest.put).toHaveBeenCalled()
      }
    })
  })

  describe('Error Handling', () => {
    it('should propagate getExecutiveReports errors', async () => {
      const error = new Error('Executive reports fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(reportsApi.getExecutiveReports('name')).rejects.toThrow('Executive reports fetch failed')
    })

    it('should propagate getExecutiveReport errors', async () => {
      const error = new Error('Executive report fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(reportsApi.getExecutiveReport('id')).rejects.toThrow('Executive report fetch failed')
    })

    it('should propagate saveExecutiveReport errors', async () => {
      const error = new Error('Executive report save failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(reportsApi.saveExecutiveReport({})).rejects.toThrow('Executive report save failed')
    })

    it('should propagate updateExecutiveReport errors', async () => {
      const error = new Error('Executive report update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(reportsApi.updateExecutiveReport({}, 'id')).rejects.toThrow('Executive report update failed')
    })

    it('should propagate deleteExecutiveReport errors', async () => {
      const error = new Error('Executive report delete failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(reportsApi.deleteExecutiveReport('id')).rejects.toThrow('Executive report delete failed')
    })

    it('should propagate searchReportScheduling errors', async () => {
      const error = new Error('Scheduling search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(reportsApi.searchReportScheduling({})).rejects.toThrow('Scheduling search failed')
    })

    it('should propagate createReportScheduling errors', async () => {
      const error = new Error('Scheduling creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(reportsApi.createReportScheduling({})).rejects.toThrow('Scheduling creation failed')
    })

    it('should propagate updateReportScheduling errors', async () => {
      const error = new Error('Scheduling update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(reportsApi.updateReportScheduling({}, 'id')).rejects.toThrow('Scheduling update failed')
    })

    it('should propagate deleteReportScheduling errors', async () => {
      const error = new Error('Scheduling deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(reportsApi.deleteReportScheduling('id')).rejects.toThrow('Scheduling deletion failed')
    })

    it('should propagate exportReportScheduling errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(reportsApi.exportReportScheduling({})).rejects.toThrow('Export failed')
    })

    it('should propagate leaderboard data errors', async () => {
      const error = new Error('Leaderboard fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(reportsApi.getLeaderboardData({})).rejects.toThrow('Leaderboard fetch failed')
    })
  })
})
