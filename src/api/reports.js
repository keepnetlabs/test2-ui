import testRequest from '@/utils/testRequest'
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

export default {
  getReports,
  getReportDetail
}
