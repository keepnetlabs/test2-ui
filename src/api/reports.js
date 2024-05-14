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
  //localStorage.setItem('executiveReport', JSON.stringify(layout))
  return testRequest.post('/executive-report', payload, {
    snackbar: COMMON_SNACKBAR
  })
}
export const getExecutiveReport = (resourceId) => {
  console.log('resourceId', resourceId)
  return testRequest.get(`/executive-report/${resourceId}`)
}
export const getExecutiveReportMetrics = () => {
  return testRequest.get('/executive-report/metrics')
}

export default {
  getReports,
  getReportDetail,
  getExecutiveReports
}
