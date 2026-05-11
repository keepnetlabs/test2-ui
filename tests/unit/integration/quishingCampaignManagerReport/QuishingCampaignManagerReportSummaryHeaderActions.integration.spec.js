/**
 * Quishing özet üst çubuğu: rapor indir ve yeniden gönder onayı
 * → `exportQuishingCampaignJob` / `resendQuishingCampaignToUsers`.
 */
jest.mock('@/api/quishing', () => ({
  exportQuishingCampaignJob: jest.fn(),
  resendQuishingCampaignToUsers: jest.fn(() => Promise.resolve({}))
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummaryHeader from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryHeader.vue'
import QuishingService from '@/api/quishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Quishing Campaign Manager Report Summary header actions (integration)', () => {
  let vuetify
  let origCreateObjectURL
  let origRevokeObjectURL

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    origCreateObjectURL = globalThis.URL.createObjectURL
    origRevokeObjectURL = globalThis.URL.revokeObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock-quishing-summary')
    globalThis.URL.revokeObjectURL = jest.fn()
  })

  afterEach(() => {
    globalThis.URL.createObjectURL = origCreateObjectURL
    globalThis.URL.revokeObjectURL = origRevokeObjectURL
  })

  const mountHeader = () =>
    mount(CampaignManagerReportSummaryHeader, {
      localVue,
      vuetify,
      provide: {
        campaignDurationExpired: () => false
      },
      propsData: {
        id: 'qu-sum-h-1',
        instanceGroup: 'qu-sum-ig-h-1',
        phishingScenarioName: 'Quish',
        resendDialogItems: { opened: 1, clicked: 0, noResponse: 0 },
        isShowResendDialogButton: true
      },
      stubs: {
        CampaignManagerReportSummaryResendDialog: true,
        CampaignManagerReportTrainingReportsDialog: true,
        VTooltip: {
          name: 'VTooltip',
          template: '<div><slot name="activator" :on="{}" /><slot /></div>'
        },
        VBtn: true,
        VIcon: true
      },
      mocks: {
        $store: { dispatch: jest.fn() }
      }
    })

  it('handleDownloadReport calls exportQuishingCampaignJob on HTTP 200 and resets disabled state', async () => {
    QuishingService.exportQuishingCampaignJob.mockResolvedValue({
      status: 200,
      data: new Blob(['x'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    })
    const createElementSpy = jest.spyOn(document, 'createElement')

    const wrapper = mountHeader()
    wrapper.vm.handleDownloadReport()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(QuishingService.exportQuishingCampaignJob).toHaveBeenCalledWith(
      'qu-sum-h-1',
      'qu-sum-ig-h-1'
    )
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(wrapper.vm.isDownloadReportDisabled).toBe(false)
    createElementSpy.mockRestore()
  })

  it('handleOnConfirmResend calls resendQuishingCampaignToUsers with Types payload', async () => {
    const wrapper = mountHeader()
    wrapper.vm.isShowResendDialog = true
    await wrapper.vm.$nextTick()
    wrapper.vm.handleOnConfirmResend([1, 3])
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(QuishingService.resendQuishingCampaignToUsers).toHaveBeenCalledWith(
      { Types: [1, 3] },
      'qu-sum-h-1',
      'qu-sum-ig-h-1'
    )
    expect(wrapper.vm.isShowResendDialog).toBe(false)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
