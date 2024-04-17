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
const getExecutiveReports = () => {
  return Promise.resolve({
    data: {
      data: [
        { name: 'Executive Summary Report' },
        { name: 'CISO Report' },
        { name: 'Team Manager Report' },
        { name: 'SOC Summary Report' }
      ]
    }
  })
}

export default {
  getReports,
  getReportDetail,
  getExecutiveReports
}
