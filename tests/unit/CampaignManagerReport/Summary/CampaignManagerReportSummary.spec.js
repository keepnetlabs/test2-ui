import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummary from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummary'

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignJobSummary: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          phishingCampaignName: 'Campaign Z',
          campaignInfo: {
            totalTargetUserCount: 100,
            categoryDistributionType: 'Random',
            sendUserPreferredLanguage: 1,
            trackingReplyInfo: 'Enabled'
          },
          settings: { duration: 7, excludeFromReports: false },
          scenarioStats: {
            openedEmail: 50,
            clickedEmail: 20,
            submittedEmail: 10,
            noResponseEmail: 15,
            notDelivered: 5,
            attachmentOpenedEmail: 2,
            reportedEmail: 1,
            mfa: 3
          },
          scenariosGeneralInfo: {
            categories: ['Finance', 'HR'],
            methodTypeId: 1,
            languageShortCodes: ['en'],
            difficultyTypeIds: [1]
          },
          scenarios: [
            {
              scenarioInfo: { name: 'Scenario A', methodTypeId: 1, languageShortCode: 'en' },
              emailTemplateInfo: {
                resourceId: 'tmpl-1',
                name: 'Template 1',
                phishingFileName: 'test.pdf'
              },
              landingPageTemplateInfo: {
                resourceId: 'lp-1',
                name: 'Landing 1'
              },
              trainingInfo: {
                trainingId: 'tr-1',
                name: 'Training A',
                languageList: [{ languageShortCode: 'en', languageId: 'lang-1' }]
              },
              enrollmentInfo: {
                enrollmentId: 'enr-1'
              }
            }
          ]
        }
      }
    })
  ),
  getCampaignJobSummaryTargetGroups: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          groups: [{ name: 'Group A' }]
        }
      }
    })
  )
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([
      {
        isoFriendlyName: 'English',
        name: 'English',
        description: 'en',
        resourceId: 'lang-1'
      }
    ])
  )
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    createRandomCryptStringNumber: jest.fn(() => '12345')
  }
})

const { getCampaignJobSummary, getCampaignJobSummaryTargetGroups } = require('@/api/phishingsimulator')

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSummary.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummary, {
      propsData: {
        id: 'campaign-1',
        instanceGroup: 'ig-1',
        phishingScenarioName: 'Scenario X',
        multipleType: [],
        apiResponse: {},
        formDetails: {
          methodTypes: [{ value: '1', text: 'Click-Only' }],
          difficultyTypes: [{ value: '1', text: 'Easy' }]
        },
        ...propsData
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      },
      stubs: {
        CampaignManagerReportSummaryHeader: true,
        CampaignManagerReportSummaryCards: true,
        CampaignManagerReportSummaryCampaignInfo: true,
        CampaignManagerReportEmailDelivery: true,
        CampaignManagerReportSummaryScenarioInfo: true,
        CampaignManagerReportSummaryCategory: true,
        CampaignManagerReportSummaryPhishingEmail: true,
        CampaignManagerReportSummaryLandingPage: true,
        CampaignManagerReportSummaryTraining: true,
        ElTabs: true,
        ElTabPane: true,
        VTooltip: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads summary/target groups and maps key computed fields', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getCampaignJobSummaryTargetGroups).toHaveBeenCalledWith('campaign-1', 'ig-1')

    wrapper.vm.callApis(true)
    await flushPromises()

    expect(getCampaignJobSummary).toHaveBeenCalledWith('campaign-1', 'ig-1')
    expect(wrapper.vm.getCampaignName).toBe('Campaign Z')
    expect(wrapper.vm.getTotalUsers).toBe(100)
    expect(wrapper.vm.getChartData).toEqual([50, 20, 10, 15, 5, 2, 1, 3])
    expect(wrapper.vm.trainingReportDialogItems).toHaveLength(1)
  })

  it('builds email and landing page template payloads from active scenario', async () => {
    const wrapper = createWrapper()
    wrapper.vm.setCampaignSummary({
      data: {
        data: {
          scenarios: [
            {
              scenarioInfo: { name: 'Scenario A', methodTypeId: 1, languageShortCode: 'en' },
              emailTemplateInfo: {
                resourceId: 'tmpl-1',
                name: 'Template 1',
                phishingFileName: 'test.pdf'
              },
              landingPageTemplateInfo: {
                resourceId: 'lp-1',
                name: 'Landing 1'
              }
            }
          ],
          campaignInfo: { totalTargetUserCount: 100 },
          settings: {}
        }
      }
    })
    await wrapper.vm.$nextTick()

    const emailPayload = wrapper.vm.getEmailTemplateData
    const landingPayload = wrapper.vm.getLandingPageTemplateData

    expect(emailPayload.resourceId).toBe('tmpl-1')
    expect(emailPayload.campaignResourceId).toBe('campaign-1')
    expect(emailPayload.instanceGroup).toBe('ig-1')
    expect(landingPayload.resourceId).toBe('lp-1')
    expect(landingPayload.jobResourceId).toBe('campaign-1')
  })

  it('updates active scenario index on tab click handler', () => {
    const wrapper = createWrapper()
    wrapper.vm.setScenarioDetail({ index: 3 })
    expect(wrapper.vm.activeScenarioIndex).toBe(3)
  })
})
