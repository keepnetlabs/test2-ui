/**
 * Smishing özet üst çubuğu: rapor indir ve yeniden gönder onayı
 * → `downloadSmishingReport` / `resendSmishingCampaignToUsers`.
 */
jest.mock('@/api/smishing', () => ({
  downloadSmishingReport: jest.fn(),
  resendSmishingCampaignToUsers: jest.fn(() => Promise.resolve({}))
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummaryHeader from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryHeader.vue'
import SmishingService from '@/api/smishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Smishing Report Summary header actions (integration)', () => {
  let vuetify
  let origCreateObjectURL
  let origRevokeObjectURL

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    origCreateObjectURL = globalThis.URL.createObjectURL
    origRevokeObjectURL = globalThis.URL.revokeObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock-smishing-summary')
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
        id: 'sm-sum-h-1',
        instanceGroup: 'sm-sum-ig-h-1',
        phishingScenarioName: 'Smish',
        resendDialogItems: { opened: 1, clicked: 0, noResponse: 0 }
      },
      stubs: {
        CampaignManagerReportSummaryResendDialog: true,
        CampaignManagerReportTrainingReportsDialog: true,
        VTooltip: {
          name: 'VTooltip',
          template: '<div><slot name="activator" :on="{}" /><slot /></div>'
        },
        VBtn: true
      },
      mocks: {
        $store: { dispatch: jest.fn() }
      }
    })

  it('handleDownloadReport calls downloadSmishingReport on HTTP 200 and resets disabled state', async () => {
    SmishingService.downloadSmishingReport.mockResolvedValue({
      status: 200,
      data: new Blob(['x'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    })
    const createElementSpy = jest.spyOn(document, 'createElement')

    const wrapper = mountHeader()
    wrapper.vm.handleDownloadReport()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(SmishingService.downloadSmishingReport).toHaveBeenCalledWith(
      'sm-sum-h-1',
      'sm-sum-ig-h-1'
    )
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(wrapper.vm.isDownloadReportDisabled).toBe(false)
    createElementSpy.mockRestore()
  })

  it('handleOnConfirmResend calls resendSmishingCampaignToUsers with Types payload', async () => {
    const wrapper = mountHeader()
    wrapper.vm.isShowResendDialog = true
    await wrapper.vm.$nextTick()
    wrapper.vm.handleOnConfirmResend([1, 2])
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(SmishingService.resendSmishingCampaignToUsers).toHaveBeenCalledWith(
      { Types: [1, 2] },
      'sm-sum-h-1',
      'sm-sum-ig-h-1'
    )
    expect(wrapper.vm.isShowResendDialog).toBe(false)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
