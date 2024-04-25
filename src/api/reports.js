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
export const getExecutiveReportChartData = (resourceId) => {
  return Promise.resolve({
    data: {
      data: [
        {
          month: '2023-11',
          result: 'Opened Attachment',
          emailCount: 58
        },
        {
          month: '2023-11',
          result: 'Submitted',
          emailCount: 28
        },
        {
          month: '2023-11',
          result: 'Clicked',
          emailCount: 3
        },
        {
          month: '2023-12',
          result: 'Opened Attachment',
          emailCount: 18
        },
        {
          month: '2023-12',
          result: 'Submitted',
          emailCount: 4
        },
        {
          month: '2023-12',
          result: 'Clicked',
          emailCount: 9
        },
        {
          month: '2024-01',
          result: 'Opened Attachment',
          emailCount: 62
        },
        {
          month: '2024-01',
          result: 'Submitted',
          emailCount: 71
        },
        {
          month: '2024-01',
          result: 'Clicked',
          emailCount: 0
        }
      ]
    }
  })
}
export const saveExecutiveReport = (layout) => {
  localStorage.setItem('executiveReport', JSON.stringify(layout))
  return Promise.resolve({})
}
export const getExecutiveReport = () => {
  return Promise.resolve({
    data: {
      data: JSON.parse(localStorage.getItem('executiveReport'))
    }
  })
}

export default {
  getReports,
  getReportDetail,
  getExecutiveReports
}
