import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
const ADVANCED_REPORT_URL = '/pbi/reports'

const getReports = () => {
  return testRequest.get(
    `${ADVANCED_REPORT_URL}/${
      localStorage.getItem('companyRequestId') || localStorage.getItem('companyResourceId')
    }`
  )
}

const getReportDetail = (resourceId = '') => {
  return testRequest.get(
    `${ADVANCED_REPORT_URL}/${
      localStorage.getItem('companyRequestId') || localStorage.getItem('companyResourceId')
    }/${resourceId}`
  )
}
const getExecutiveReports = (name) => {
  return testRequest.post('/executive-report/search', { name })
}
export const getExecutiveReportChartData = (payload) => {
  return testRequest.post('/executive-report/get-widget-datas', payload)
}
export const saveExecutiveReport = (payload) => {
  return testRequest.post('/executive-report', payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export const updateExecutiveReport = (payload, resourceId) => {
  return testRequest.put(`/executive-report/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export const getExecutiveReport = (resourceId, token, companyResourceId) => {
  const config = {}
  if (token) {
    config.overrideToken = true
    config.overrideCompanyId = true
    config.headers = { 'X-IR-COMPANY-ID': companyResourceId }
    config.customToken = token
  }
  return testRequest.get(`/executive-report/${resourceId}`, config)
}
export const deleteExecutiveReport = (resourceId) => {
  return testRequest.delete(`/executive-report/${resourceId}`, {
    snackbar: COMMON_SNACKBAR
  })
}
export const getExecutiveReportMetrics = () => {
  return testRequest.get('/executive-report/metrics')
}
export const createReportScheduling = (payload) => {
  return testRequest.post('/report-scheduling', payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export const updateReportScheduling = (payload, resourceId) => {
  return testRequest.put(`/report-scheduling/${resourceId}`, payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export const searchReportScheduling = (payload) => {
  return testRequest.post('/report-scheduling/search', payload)
}
export const deleteReportScheduling = (resourceId, reportType = 2) => {
  return testRequest.delete(`/report-scheduling/${resourceId}/${reportType}`, {
    snackbar: COMMON_SNACKBAR
  })
}
export const exportReportScheduling = (payload) => {
  return testRequest.post('/report-scheduling/search/export', payload, {
    responseType: 'blob'
  })
}
export const uploadExecutiveReportPdf = (formData, resourceId, token, companyResourceId) => {
  const config = {}
  if (token) {
    config.overrideToken = true
    config.overrideCompanyId = true
    config.headers = { 'X-IR-COMPANY-ID': companyResourceId }
    config.customToken = token
  }
  return testRequest.post(`/executive-report/${resourceId}/upload`, formData, config)
}
export const getReportScheduling = (resourceId) => {
  return testRequest.get(`/report-scheduling/${resourceId}`)
}
export const getReportSchedulingLogo = (resourceId) => {
  return testRequest.get(`/companies/${resourceId}/logo`, {
    responseType: 'blob'
  })
}
export const getExecutiveReportLogo = (resourceId, token, companyResourceId) => {
  const config = {
    responseType: 'blob'
  }
  if (token) {
    config.overrideToken = true
    config.overrideCompanyId = true
    config.headers = { 'X-IR-COMPANY-ID': companyResourceId }
    config.customToken = token
  }
  return testRequest.get(`/executive-report/${resourceId}/logo`, config)
}
export const setSchedulingReportStatus = (resourceId, status) => {
  return testRequest.put(
    `/report-scheduling/${resourceId}/status/${status}`,
    {},
    {
      snackbar: COMMON_SNACKBAR
    }
  )
}
export const getSchedulingReportTargetGroups = () => {
  return testRequest.get('/report-scheduling/target-groups')
}
export const getSchedulingReportManagers = () => {
  return testRequest.get('/report-scheduling/managers')
}

// Manager Metrics - Activity Users Search
export const searchPhishingActivityUsers = (payload) => {
  return testRequest.post(
    '/phishing-simulator/phishing-campaign-job-report/activity-users/search',
    payload
  )
}

export const searchTrainingActivityUsers = (payload) => {
  return testRequest.post('/training-reports/activity-users/search', payload)
}

export const getLeaderboardData = (payload) => {
  return testRequest.post('/leaderboard/get-all', payload)
}

export const getTopPerformersData = (payload) => {
  return testRequest.post('/leaderboard/get-top-performers', payload)
}

export const exportLeaderboardData = (payload) => {
  return testRequest.post('/leaderboard/get-all/export', payload, {
    responseType: 'blob'
  })
}

export const getLeaderboardFormDetails = () => {
  return testRequest.get('/leaderboard/form-details')
}

export const getUserPerformanceRates = (payload) => {
  return testRequest.post('/leaderboard/user-performance', payload)
}

export const getUserTimeline = (payload) => {
  return testRequest.post('/leaderboard/get-user-timeline', payload)
}

export const exportUserActivityDetails = (payload) => {
  return testRequest.post('/leaderboard/get-user-timeline/export', payload, {
    responseType: 'blob'
  })
}

export const calculateGamificationBadges = (payload) => {
  return testRequest.post('/gamificationreport/calculate-badges', payload)
}

export const getGamificationBadgesCached = (targetUserResourceId) => {
  return testRequest.get(`/gamificationreport/badges-cached/${targetUserResourceId}`)
}

export const getLearningEnrollments = (targetUserResourceId, payload) => {
  return testRequest.post(`/gamificationReport/learning/${targetUserResourceId}`, payload)
}

export const getGamificationPhishingResult = (targetUserResourceId) => {
  return testRequest.get(`/gamificationReport/phishing-result/${targetUserResourceId}`)
}

export default {
  getReports,
  getReportDetail,
  getExecutiveReports,
  getExecutiveReportChartData,
  saveExecutiveReport,
  updateExecutiveReport,
  getExecutiveReport,
  deleteExecutiveReport,
  getExecutiveReportMetrics,
  uploadExecutiveReportPdf,
  getExecutiveReportLogo,
  getReportScheduling,
  createReportScheduling,
  updateReportScheduling,
  searchReportScheduling,
  deleteReportScheduling,
  exportReportScheduling,
  setSchedulingReportStatus,
  getSchedulingReportTargetGroups,
  getSchedulingReportManagers,
  getReportSchedulingLogo,
  searchPhishingActivityUsers,
  searchTrainingActivityUsers,
  getLeaderboardData,
  getTopPerformersData,
  exportLeaderboardData,
  getLeaderboardFormDetails,
  getUserPerformanceRates,
  getUserTimeline,
  exportUserActivityDetails,
  calculateGamificationBadges,
  getGamificationBadgesCached,
  getLearningEnrollments,
  getGamificationPhishingResult
}
