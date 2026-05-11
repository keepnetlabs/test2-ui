/**
 * Vishing raporu özet `mounted`
 * → `getVishingReportSummary(id)` (ilk yüklemede loading + 300ms gecikme) ve `getVishingTemplateLanguages()`.
 */
jest.mock('@/api/vishing', () => ({
  getVishingReportSummary: jest.fn(),
  getVishingTemplateLanguages: jest.fn()
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VishingReportSummary from '@/components/VishingReport/VishingReportSummary.vue'
import { getVishingReportSummary, getVishingTemplateLanguages } from '@/api/vishing'

const localVue = createLocalVue()

const flushMicrotasks = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('Vishing Report Summary mounted fetch (integration)', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    jest.useFakeTimers()
    getVishingReportSummary.mockResolvedValue({
      data: {
        data: {
          targetUserCount: 4,
          answeredCount: 1,
          answeredPercent: 25,
          vishedCount: 2,
          vishedPercent: 50,
          noResponseCount: 1,
          noResponsePercent: 25,
          targetGroupNames: ['G1'],
          vishingTemplateDto: {
            vishingLanguage: 'en-US',
            vishingVoice: 'VoiceA',
            vishingLanguageResourceId: 'lang-1',
            name: 'T1',
            description: '',
            difficulty: '',
            createTime: '',
            tags: [],
            steps: []
          },
          campaignName: 'Camp V'
        }
      }
    })
    getVishingTemplateLanguages.mockResolvedValue({
      data: {
        data: [{ resourceId: 'lang-1', name: 'English US', voiceProviderTypeId: 9 }]
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
      wrapper = null
    }
    jest.useRealTimers()
  })

  it('loads summary and languages; clears loading after delay', async () => {
    const store = { dispatch: jest.fn() }

    wrapper = mount(VishingReportSummary, {
      localVue,
      vuetify,
      propsData: { id: 'vish-sum-1', vishingName: 'Vish Camp' },
      mocks: {
        $store: store,
        $route: { params: { id: 'vish-sum-1' } }
      },
      stubs: {
        VishingReportSummaryHeader: true,
        VishingReportSummaryCards: true,
        VishingReportCampaignInfo: true,
        VishingReportDelivery: true,
        VishingReportTemplate: true,
        DatatableLoading: true
      }
    })

    await flushMicrotasks()
    await wrapper.vm.$nextTick()

    expect(getVishingReportSummary).toHaveBeenCalledWith('vish-sum-1')
    expect(getVishingTemplateLanguages).toHaveBeenCalled()
    expect(wrapper.vm.vishingSummary.targetUserCount).toBe(4)
    expect(wrapper.vm.languageItems).toHaveLength(1)

    expect(wrapper.vm.isLoading).toBe(true)
    jest.advanceTimersByTime(300)
    await flushMicrotasks()

    expect(wrapper.vm.isLoading).toBe(false)
    expect(store.dispatch).toHaveBeenCalledWith('common/setActivePageRouterName', 'Camp V')
  })
})
