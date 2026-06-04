/**
 * Callback kampanya özeti `created`
 * → `LookupLocalStorage.getSingle(21)` (diller)
 * + `apiResponse` boşken yalnızca `getCampaignSummaryTargetGroups`;
 * + `apiResponse` doluyken `getCampaignSummary` + hedef gruplar.
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

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCampaignSummary: jest.fn(),
    getCampaignSummaryTargetGroups: jest.fn(() =>
      Promise.resolve({ data: { data: [{ resourceId: 'tg-1', name: 'Group A' }] } })
    ),
    getCallbackTemplatePreview: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            vishingLanguageResourceId: 'lang-1',
            steps: [{ step: 1 }, { step: 2 }, { step: 3 }]
          }
        }
      })
    )
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummary from '@/components/CallbackReport/Summary/CampaignManagerReportSummary.vue'
import CallbackService from '@/api/callback'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const summaryStubs = {
  CampaignManagerReportSummaryHeader: true,
  CampaignManagerReportSummaryCards: true,
  CampaignManagerReportSummaryCampaignInfo: true,
  CampaignManagerReportEmailDelivery: true,
  CampaignManagerReportSummaryEmail: true,
  CallbackCampaignModalSummaryCallbackTemplate: true,
  ElTabs: true,
  ElTabPane: true,
  VTooltip: true
}

describe('Callback Report Summary created fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    CallbackService.getCampaignSummaryTargetGroups.mockResolvedValue({
      data: { data: [{ resourceId: 'tg-1', name: 'Group A' }] }
    })
  })

  it('with empty apiResponse loads languages and target groups only (no getCampaignSummary)', async () => {
    const wrapper = mount(CampaignManagerReportSummary, {
      localVue,
      vuetify,
      propsData: {
        id: 'cb-summary-camp-1',
        instanceGroup: 'cb-summary-ig-1',
        phishingScenarioName: 'Callback scenario',
        apiResponse: {},
        languageItems: []
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
    expect(CallbackService.getCampaignSummaryTargetGroups).toHaveBeenCalledWith(
      'cb-summary-camp-1',
      'cb-summary-ig-1'
    )
    expect(CallbackService.getCampaignSummary).not.toHaveBeenCalled()
    expect(wrapper.vm.targetGroups).toEqual([{ resourceId: 'tg-1', name: 'Group A' }])
  })

  it('with non-empty apiResponse calls getCampaignSummary and merges target groups', async () => {
    CallbackService.getCampaignSummary.mockResolvedValue({
      data: {
        data: {
          campaignName: 'CB Campaign',
          campaignInfo: {
            totalTargetUserCount: 10,
            endDate: '2026-12-31',
            emailDeliveryDuration: 1
          },
          settings: { duration: 7, excludeFromReports: false },
          stats: {
            openedEmail: 2,
            calledBack: 0,
            enteredDigits: 0,
            reportedEmail: 0,
            noResponseEmail: 0,
            notDelivered: 0,
            failedToSend: 0
          },
          scenarios: [
            {
              name: 'Scenario 1',
              callbackTemplateResourceId: 'ct-res-1',
              difficultyTypeId: 1,
              emailTemplateResourceId: 'em-tpl-1',
              languageShortCode: 'en',
              callbackNumber: '+1000'
            }
          ]
        }
      }
    })

    const wrapper = mount(CampaignManagerReportSummary, {
      localVue,
      vuetify,
      propsData: {
        id: 'cb-summary-camp-2',
        instanceGroup: 'cb-summary-ig-2',
        phishingScenarioName: 'Callback scenario',
        apiResponse: { seeded: true },
        languageItems: [{ resourceId: 'lang-1', language: 'English', name: 'EN' }]
      },
      stubs: summaryStubs,
      mocks: {
        $store: { dispatch: jest.fn() }
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(CallbackService.getCampaignSummary).toHaveBeenCalledWith(
      'cb-summary-camp-2',
      'cb-summary-ig-2'
    )
    expect(CallbackService.getCampaignSummaryTargetGroups).toHaveBeenCalledWith(
      'cb-summary-camp-2',
      'cb-summary-ig-2'
    )
    expect(wrapper.vm.campaignSummary?.campaignName).toBe('CB Campaign')
    expect(wrapper.vm.targetGroups).toEqual([{ resourceId: 'tg-1', name: 'Group A' }])
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/setActivePageRouterName',
      'CB Campaign'
    )
  })
})
