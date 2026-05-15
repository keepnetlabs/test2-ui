jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn(() =>
      Promise.resolve([
        {
          isoFriendlyName: 'English',
          name: 'English',
          description: 'en',
          resourceId: 'lang-en'
        },
        {
          isoFriendlyName: 'Turkish',
          name: 'Turkish',
          description: 'tr',
          resourceId: 'lang-tr'
        }
      ])
    )
  }
}))

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignJobSummary: jest.fn(),
  getCampaignJobSummaryTargetGroups: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummary from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummary.vue'
import {
  getCampaignJobSummary,
  getCampaignJobSummaryTargetGroups
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSummary mounted fetch (integration)', () => {
  let vuetify
  let wrapper

  const summaryStubs = {
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

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    getCampaignJobSummary.mockResolvedValue({
      data: {
        data: {
          phishingCampaignName: 'Phish Camp',
          campaignInfo: {
            totalTargetUserCount: 1,
            categoryDistributionType: 'Manually',
            sendUserPreferredLanguage: 0
          },
          settings: { duration: 30 },
          scenariosGeneralInfo: {
            categories: ['General'],
            methodTypeId: 1,
            difficultyTypeIds: [2],
            languageShortCodes: ['tr']
          },
          scenarios: [
            {
              scenarioInfo: {
                name: 'Scenario 1',
                category: 'General',
                methodTypeId: 1,
                difficultyTypeId: 2,
                languageShortCode: 'tr'
              },
              trainingInfo: {
                trainingId: 'training-1',
                name: 'Training 1',
                languageList: [{ languageShortCode: 'tr', languageId: 'lang-tr' }]
              },
              emailTemplateInfo: {
                resourceId: 'email-1',
                name: 'Email 1',
                languageShortCode: 'tr'
              },
              landingPageTemplateInfo: {
                resourceId: 'landing-1',
                name: 'Landing 1',
                languageShortCode: 'tr'
              },
              sendTemplatesInPreferredLanguage: true,
              enrollmentInfo: {
                enrollmentId: 'enrollment-1'
              }
            }
          ]
        }
      }
    })
    getCampaignJobSummaryTargetGroups.mockResolvedValue({
      data: { data: { groups: [{ resourceId: 'tg-1', name: 'Group 1' }] } }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
      wrapper = null
    }
  })

  it('loads report summary and maps scenario notification language from root scenario field', async () => {
    wrapper = mount(CampaignManagerReportSummary, {
      localVue,
      vuetify,
      propsData: {
        id: 'campaign-1',
        instanceGroup: 1,
        phishingScenarioName: 'Scenario 1',
        multipleType: [],
        apiResponse: { data: true },
        formDetails: {
          methodTypes: [{ value: '1', text: 'Click-Only' }],
          difficultyTypes: [{ value: '2', text: 'Medium' }]
        }
      },
      stubs: summaryStubs,
      mocks: {
        $store: { dispatch: jest.fn() }
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(getCampaignJobSummary).toHaveBeenCalledWith('campaign-1', 1)
    expect(getCampaignJobSummaryTargetGroups).toHaveBeenCalledWith('campaign-1', 1)
    expect(wrapper.vm.campaignSummary.scenarios[0].trainingInfo.sendTemplatesInPreferredLanguage).toBe(
      true
    )
    expect(wrapper.vm.getScenarioInfoItems['Enrollment Notification Language']).toBe(
      'Preferred Language'
    )
    expect(wrapper.vm.targetGroups).toEqual([{ resourceId: 'tg-1', name: 'Group 1' }])
  })
})
