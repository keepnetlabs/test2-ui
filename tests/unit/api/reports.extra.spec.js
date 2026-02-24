import reports, {
  getExecutiveReportChartData,
  saveExecutiveReport,
  deleteExecutiveReport,
  updateExecutiveReport,
  getExecutiveReport,
  getExecutiveReportMetrics,
  createReportScheduling,
  updateReportScheduling,
  searchReportScheduling,
  deleteReportScheduling,
  getReportScheduling,
  setSchedulingReportStatus,
  getSchedulingReportTargetGroups,
  getSchedulingReportManagers,
  searchPhishingActivityUsers,
  searchTrainingActivityUsers,
  getLeaderboardData,
  getLeaderboardFormDetails
} from '@/api/reports'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('reports API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem('companyRequestId', 'req-1')
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('getExecutiveReports', () => {
    it('calls POST with name', async () => {
      await reports.getExecutiveReports('Report1')
      expect(testRequest.post).toHaveBeenCalledWith('/executive-report/search', { name: 'Report1' })
    })
  })

  describe('getExecutiveReportChartData', () => {
    it('calls POST get-widget-datas', async () => {
      await getExecutiveReportChartData({ reportId: 'r1' })
      expect(testRequest.post).toHaveBeenCalledWith('/executive-report/get-widget-datas', {
        reportId: 'r1'
      })
    })
  })

  describe('saveExecutiveReport', () => {
    it('calls POST with snackbar', async () => {
      await saveExecutiveReport({ name: 'New Report' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/executive-report',
        { name: 'New Report' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('updateExecutiveReport', () => {
    it('calls PUT with resourceId', async () => {
      await updateExecutiveReport({ name: 'Updated' }, 'res-1')
      expect(testRequest.put).toHaveBeenCalledWith(
        '/executive-report/res-1',
        { name: 'Updated' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('deleteExecutiveReport', () => {
    it('calls DELETE with resourceId', async () => {
      await deleteExecutiveReport('res-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/executive-report/res-123',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getExecutiveReport', () => {
    it('calls GET without token', async () => {
      await getExecutiveReport('res-1')
      expect(testRequest.get).toHaveBeenCalledWith('/executive-report/res-1', {})
    })

    it('calls GET with token and companyResourceId', async () => {
      await getExecutiveReport('res-1', 'token-1', 'comp-1')
      expect(testRequest.get).toHaveBeenCalledWith('/executive-report/res-1', {
        overrideToken: true,
        overrideCompanyId: true,
        headers: { 'X-IR-COMPANY-ID': 'comp-1' },
        customToken: 'token-1'
      })
    })
  })

  describe('getExecutiveReportMetrics', () => {
    it('calls GET metrics', async () => {
      await getExecutiveReportMetrics()
      expect(testRequest.get).toHaveBeenCalledWith('/executive-report/metrics')
    })
  })

  describe('createReportScheduling', () => {
    it('calls POST with snackbar', async () => {
      await createReportScheduling({ name: 'Schedule' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/report-scheduling',
        { name: 'Schedule' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('updateReportScheduling', () => {
    it('calls PUT with resourceId', async () => {
      await updateReportScheduling({ name: 'Updated' }, 'sched-1')
      expect(testRequest.put).toHaveBeenCalledWith(
        '/report-scheduling/sched-1',
        { name: 'Updated' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('searchReportScheduling', () => {
    it('calls POST search', async () => {
      await searchReportScheduling({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/report-scheduling/search', { page: 1 })
    })
  })

  describe('deleteReportScheduling', () => {
    it('calls DELETE with resourceId and reportType', async () => {
      await deleteReportScheduling('sched-1', 2)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/report-scheduling/sched-1/2',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })

    it('defaults reportType to 2', async () => {
      await deleteReportScheduling('sched-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/report-scheduling/sched-1/2',
        expect.anything()
      )
    })
  })

  describe('getReportScheduling', () => {
    it('calls GET with resourceId', async () => {
      await getReportScheduling('sched-1')
      expect(testRequest.get).toHaveBeenCalledWith('/report-scheduling/sched-1')
    })
  })

  describe('setSchedulingReportStatus', () => {
    it('calls PUT status', async () => {
      await setSchedulingReportStatus('sched-1', 'active')
      expect(testRequest.put).toHaveBeenCalledWith(
        '/report-scheduling/sched-1/status/active',
        {},
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getSchedulingReportTargetGroups', () => {
    it('calls GET target-groups', async () => {
      await getSchedulingReportTargetGroups()
      expect(testRequest.get).toHaveBeenCalledWith('/report-scheduling/target-groups')
    })
  })

  describe('getSchedulingReportManagers', () => {
    it('calls GET managers', async () => {
      await getSchedulingReportManagers()
      expect(testRequest.get).toHaveBeenCalledWith('/report-scheduling/managers')
    })
  })

  describe('searchPhishingActivityUsers', () => {
    it('calls POST activity-users/search', async () => {
      await searchPhishingActivityUsers({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/phishing-simulator/phishing-campaign-job-report/activity-users/search',
        { page: 1 }
      )
    })
  })

  describe('searchTrainingActivityUsers', () => {
    it('calls POST training activity-users/search', async () => {
      await searchTrainingActivityUsers({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/training-reports/activity-users/search',
        { page: 1 }
      )
    })
  })

  describe('getLeaderboardData', () => {
    it('calls POST leaderboard get-all', async () => {
      await getLeaderboardData({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/leaderboard/get-all', { page: 1 })
    })
  })

  describe('getLeaderboardFormDetails', () => {
    it('calls GET form-details', async () => {
      await getLeaderboardFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith('/leaderboard/form-details')
    })
  })
})
