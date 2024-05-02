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
        { name: 'Executive Summary Report', isEditable: false, isDeletable: false },
        { name: 'CISO Report', isEditable: false, isDeletable: true },
        { name: 'Team Manager Report', isEditable: true, isDeletable: true },
        { name: 'SOC Summary Report', isEditable: true, isDeletable: false }
      ]
    }
  })
}
export const getExecutiveReportChartData = (resourceId) => {
  return Promise.resolve({
    data: {
      data: {
        datasets: [
          {
            x: 1698786000000,
            y: 58,
            result: 'Open Attachment'
          },
          {
            x: 1698786000000,
            y: 28,
            result: 'Submitted Data'
          },
          {
            x: 1698786000000,
            y: 3,
            result: 'Clicked'
          },
          {
            x: 1701378000000,
            y: 18,
            result: 'Open Attachment'
          },
          {
            x: 1701378000000,
            y: 4,
            result: 'Submitted Data'
          },
          {
            x: 1701378000000,
            y: 9,
            result: 'Clicked'
          },
          {
            x: 1704056400000,
            y: 62,
            result: 'Open Attachment'
          },
          {
            x: 1704056400000,
            y: 71,
            result: 'Submitted Data'
          },
          {
            x: 1704056400000,
            y: 0,
            result: 'Clicked'
          }
        ],
        valueEnums: ['Open Attachment', 'Submitted Data', 'Clicked']
      }
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
