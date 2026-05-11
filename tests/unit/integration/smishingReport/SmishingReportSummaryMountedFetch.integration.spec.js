/**
 * Smishing kampanya özeti `mounted`
 * → `LookupLocalStorage.getSingle(21)` + `getCampaignJobSummaryTargetGroups`;
 * `apiResponse` dolu iken ayrıca `getCampaignJobSummary`.
 * Boş `apiResponse` ile ilk yüklemede yalnızca hedef gruplar (özet API interval’a bırakılır).
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

jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    getCampaignJobSummary: jest.fn(),
    getCampaignJobSummaryTargetGroups: jest.fn()
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummary from '@/components/SmishingReport/Summary/CampaignManagerReportSummary.vue'
import SmishingService from '@/api/smishing'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const summaryStubs = {
  CampaignManagerReportSummaryHeader: true,
  CampaignManagerReportSummaryCards: true,
  CampaignManagerReportSummaryCampaignInfo: true,
  CampaignManagerReportSMSDelivery: true,
  CampaignManagerReportSummaryTextTemplate: true,
  CampaignManagerReportSummaryLandingPage: true,
  CampaignManagerReportSummaryTraining: true,
  ElTabs: true,
  ElTabPane: true,
  VTooltip: true
}

describe('Smishing Report Summary mounted fetch (integration)', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    SmishingService.getCampaignJobSummary.mockResolvedValue({
      data: {
        data: {
          smishingCampaignName: 'Smish Camp',
          campaignInfo: { totalTargetUserCount: 3, endDate: '2026-12-31' },
          settings: { duration: 14 },
          scenarios: [
            {
              scenarioInfo: { name: 'Scenario A', methodTypeId: 1 },
              landingPageTemplateInfo: {
                methodTypeId: 1,
                difficultyTypeId: 1,
                resourceId: 'lp-sm-1',
                languageShortCode: 'en',
                name: 'Landing'
              }
            }
          ]
        }
      }
    })
    SmishingService.getCampaignJobSummaryTargetGroups.mockResolvedValue({
      data: { data: { groups: [{ resourceId: 'tg-sm-1', name: 'Group A' }] } }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
      wrapper = null
    }
  })

  it('loads languages, summary, target groups when apiResponse is pre-seeded', async () => {
    const dispatch = jest.fn()

    wrapper = mount(CampaignManagerReportSummary, {
      localVue,
      vuetify,
      propsData: {
        id: 'sm-sum-camp-1',
        instanceGroup: 'sm-sum-ig-1',
        phishingScenarioName: 'Smish scenario',
        apiResponse: { preloadedFromParent: true }
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
    expect(SmishingService.getCampaignJobSummary).toHaveBeenCalledWith(
      'sm-sum-camp-1',
      'sm-sum-ig-1'
    )
    expect(SmishingService.getCampaignJobSummaryTargetGroups).toHaveBeenCalledWith(
      'sm-sum-camp-1',
      'sm-sum-ig-1'
    )
    expect(wrapper.vm.campaignSummary.smishingCampaignName).toBe('Smish Camp')
    expect(wrapper.vm.targetGroups).toHaveLength(1)
    expect(dispatch).toHaveBeenCalledWith('common/setActivePageRouterName', 'Smish Camp')
  })

  it('with empty apiResponse loads languages and target groups only (no immediate summary)', async () => {
    wrapper = mount(CampaignManagerReportSummary, {
      localVue,
      vuetify,
      propsData: {
        id: 'sm-sum-empty-1',
        instanceGroup: 'sm-sum-ig-empty-1',
        phishingScenarioName: 'Smish',
        apiResponse: {}
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
    expect(SmishingService.getCampaignJobSummaryTargetGroups).toHaveBeenCalledWith(
      'sm-sum-empty-1',
      'sm-sum-ig-empty-1'
    )
    expect(SmishingService.getCampaignJobSummary).not.toHaveBeenCalled()
    expect(wrapper.vm.targetGroups).toHaveLength(1)
  })
})
