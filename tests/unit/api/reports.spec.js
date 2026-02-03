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
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
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
  })
})
