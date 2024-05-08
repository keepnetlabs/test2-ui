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
  console.log('layout', layout)
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
export const getExecutiveReportMetrics = () => {
  return Promise.resolve({
    data: {
      metrics: [
        {
          name: 'Phishing Metrics',
          charts: [
            {
              name: 'Phishing Overview',
              src: '/phishing-overview.svg',
              chartType: 'line',
              key: 'PhishingOverview'
            },
            {
              name: 'Phishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'stackedBar',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Threats (Phishing)',
              src: '/reported-email-threats.svg',
              key: 'ReportedEmailThreats(Phishing)',
              chartType: 'bar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: '/recently-posted-threats.svg',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            },
            {
              name: 'Consolidated Phishing Simulation Metrics',
              src: '/recently-posted-threats.svg',
              key: 'ConsolidatedPhishingSimulationMetrics',
              chartType: 'bar'
            },
            {
              name: 'Count Of Phished Campaigns',
              src: '/count-of-phished-campaigns.svg',
              key: 'CountOfPhishedCampaigns',
              chartType: 'area'
            }
          ]
        },
        {
          name: 'Training Metrics',
          charts: [
            {
              name: 'Training Completion',
              src: '/training-completion.svg',
              chartType: 'doughnut',
              key: 'TrainingCompletion'
            },
            {
              name: 'Training Enrollments',
              src: '/training-enrollments.svg',
              key: 'TrainingEnrollments',
              chartType: 'line'
            },
            {
              name: 'Top Riskiest Users',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'table',
              key: 'TopRiskiestUsers'
            }
          ]
        },
        {
          name: 'Vishing Metrics',
          charts: [
            {
              name: 'Vishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'VishingCampaignTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'VishingMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Quishing Metrics',
          charts: [
            {
              name: 'Quishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'QuishingCampaignTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'QuishingMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Callback Metrics',
          charts: [
            {
              name: 'Callback Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'CallbackCampaignTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'CallbackMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Smishing Metrics',
          charts: [
            {
              name: 'Smishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'SmishingCampaignTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'SmishingMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Phishing Reporter Metrics',
          charts: [
            {
              name: 'Phishing Reporter Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'PhishingReporterTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'PhishingReporterMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Incident Response Metrics',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'IncidentResponderPhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: '/reported-email-trends.svg',
              key: 'IncidentResponderReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'IncidentResponderMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Risk Score Trend',
          charts: [
            {
              name: 'Company Risk Score',
              src: '/company-risk-score.svg',
              chartType: 'gauge',
              key: 'RiskScore'
            }
          ]
        },
        {
          name: 'Other',
          charts: []
        }
      ]
    }
  })
}

export default {
  getReports,
  getReportDetail,
  getExecutiveReports
}
