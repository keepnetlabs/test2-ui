/**
 * Quishing kampanya özeti `mounted`
 * → `LookupLocalStorage.getSingle(21)` + `getCampaignJobSummary` + `getCampaignJobSummaryTargetGroups`
 * (Quishing özet her zaman `callApis(true)` ile özeti çeker).
 */
jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn(() =>
      Promise.resolve([
        {
          isoFriendlyName: 'English (US)',
          name: 'English',
          description: 'en',
          resourceId: 'lang-1'
        }
      ])
    )
  }
}))

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getCampaignJobSummary: jest.fn(),
    getCampaignJobSummaryTargetGroups: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummary from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummary.vue'
import QuishingService from '@/api/quishing'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const summaryStubs = {
  CampaignManagerReportSummaryHeader: true,
  CampaignManagerReportSummaryCards: true,
  CampaignManagerPrintoutReportSummaryCards: true,
  CampaignManagerReportSummaryCampaignInfo: true,
  CampaignManagerReportEmailDelivery: true,
  CampaignManagerReportSummaryEmail: true,
  CampaignManagerReportSummaryLandingPage: true,
  CampaignManagerReportSummaryTraining: true,
  ElTabs: true,
  ElTabPane: true,
  VTooltip: true
}

describe('Quishing Campaign Manager Report Summary mounted fetch (integration)', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    QuishingService.getCampaignJobSummary.mockResolvedValue({
      data: {
        data: {
          quishingCampaignName: 'Quish Camp',
          campaignInfo: { totalTargetUserCount: 5, endDate: '2026-11-30' },
          settings: { duration: 7 },
          scenarios: [
            {
              scenarioInfo: {
                name: 'Q Scenario',
                methodTypeId: 1,
                templateType: 'standard'
              },
              landingPageTemplateInfo: {
                methodTypeId: 1,
                difficultyTypeId: 1,
                resourceId: 'lp-q-1',
                languageShortCode: 'en',
                name: 'LP'
              }
            }
          ]
        }
      }
    })
    QuishingService.getCampaignJobSummaryTargetGroups.mockResolvedValue({
      data: { data: { groups: [{ resourceId: 'tg-q-1', name: 'Q Group' }] } }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
      wrapper = null
    }
  })

  it('loads languages, summary, and target groups on mount', async () => {
    const dispatch = jest.fn()

    wrapper = mount(CampaignManagerReportSummary, {
      localVue,
      vuetify,
      propsData: {
        id: 'qu-sum-camp-1',
        instanceGroup: 'qu-sum-ig-1',
        phishingScenarioName: 'Quish scenario',
        multipleType: [true, false, false],
        apiResponse: {}
      },
      stubs: summaryStubs,
      mocks: {
        $store: { dispatch }
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(QuishingService.getCampaignJobSummary).toHaveBeenCalledWith(
      'qu-sum-camp-1',
      'qu-sum-ig-1'
    )
    expect(QuishingService.getCampaignJobSummaryTargetGroups).toHaveBeenCalledWith(
      'qu-sum-camp-1',
      'qu-sum-ig-1'
    )
    expect(wrapper.vm.campaignSummary.quishingCampaignName).toBe('Quish Camp')
    expect(wrapper.vm.targetGroups).toHaveLength(1)
    expect(dispatch).toHaveBeenCalledWith('common/setActivePageRouterName', 'Quish Camp')
  })
})
