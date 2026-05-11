/**
 * Vishing özet `mounted` → `getVishingReportSummary(id)` (ilk yüklemede loading) + `getVishingTemplateLanguages()`.
 * Periyodik `setInterval` `beforeDestroy` / `wrapper.destroy()` ile temizlenir.
 */
jest.mock('@/api/vishing', () => ({
  getVishingReportSummary: jest.fn(),
  getVishingTemplateLanguages: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [{ resourceId: 'lang-1', name: 'Voice A', language: 'English' }]
      }
    })
  )
}))

import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VishingReportSummary from '@/components/VishingReport/VishingReportSummary.vue'
import { getVishingReportSummary, getVishingTemplateLanguages } from '@/api/vishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Vishing Report Summary mounted fetch (integration)', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    jest.spyOn(global, 'setInterval').mockReturnValue(999999)
    jest.spyOn(global, 'clearInterval').mockImplementation(() => {})
    getVishingReportSummary.mockResolvedValue({
      data: {
        data: {
          answeredCount: 2,
          answeredPercent: 40,
          vishedCount: 1,
          vishedPercent: 20,
          noResponseCount: 2,
          noResponsePercent: 40,
          targetUserCount: 5,
          campaignName: 'Camp X',
          vishingTemplateDto: {
            name: 'T1',
            vishingLanguage: 'English',
            vishingLanguageResourceId: 'lang-1',
            steps: []
          }
        }
      }
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('fetches summary and languages; summary state drives card counts', async () => {
    const wrapper = mount(VishingReportSummary, {
      vuetify,
      propsData: {
        id: 'vish-sum-1',
        vishingName: 'Camp X'
      },
      mocks: {
        $store: { dispatch: jest.fn() },
        $route: { params: { id: 'route-vish-1' } }
      },
      stubs: {
        VishingReportSummaryHeader: true,
        VishingReportSummaryCards: true,
        VishingReportCampaignInfo: true,
        VishingReportDelivery: true,
        DatatableLoading: true,
        VishingReportTemplate: true
      }
    })

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingReportSummary).toHaveBeenCalledWith('vish-sum-1')
    expect(getVishingTemplateLanguages).toHaveBeenCalled()
    expect(wrapper.vm.vishingSummary).toEqual(
      expect.objectContaining({
        answeredCount: 2,
        targetUserCount: 5
      })
    )
    expect(wrapper.vm.languageItems).toHaveLength(1)
    expect(wrapper.vm.getCardsData.answered.userCount).toBe(2)
    expect(wrapper.vm.getResendDialogItems.answered).toBe(2)

    await new Promise((r) => setTimeout(r, 350))
    await flushPromises()
    expect(wrapper.vm.isLoading).toBe(false)

    wrapper.destroy()
    expect(global.clearInterval).toHaveBeenCalled()
  })
})
