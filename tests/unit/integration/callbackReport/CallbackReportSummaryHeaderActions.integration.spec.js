/**
 * Callback Summary üst çubuğu: indir ve toplu yeniden gönder aksiyonları
 * → `CallbackService.exportCampaignReport` / `resendCampaignToUsersList`.
 */
jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    exportCampaignReport: jest.fn(),
    resendCampaignToUsersList: jest.fn(() => Promise.resolve())
  }
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CampaignManagerReportSummaryHeader from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryHeader.vue'
import CallbackService from '@/api/callback'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Callback Report Summary header actions (integration)', () => {
  let vuetify
  let origCreateObjectURL
  let origRevokeObjectURL

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    origCreateObjectURL = globalThis.URL.createObjectURL
    origRevokeObjectURL = globalThis.URL.revokeObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock-callback-report')
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
        id: 'cb-sum-camp-1',
        instanceGroup: 'cb-sum-ig-1',
        phishingScenarioName: 'Scenario A',
        resendDialogItems: { foo: 'bar' }
      },
      stubs: {
        CampaignManagerReportSummaryResendDialog: true,
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

  it('handleDownloadReport calls exportCampaignReport and completes on HTTP 200', async () => {
    CallbackService.exportCampaignReport.mockResolvedValue({
      status: 200,
      data: new Blob(['x'], { type: 'application/vnd.ms-excel' })
    })
    const createElementSpy = jest.spyOn(document, 'createElement')

    const wrapper = mountHeader()
    wrapper.vm.handleDownloadReport()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(CallbackService.exportCampaignReport).toHaveBeenCalledWith(
      'cb-sum-camp-1',
      'cb-sum-ig-1'
    )
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(wrapper.vm.isDownloadReportDisabled).toBe(false)
    createElementSpy.mockRestore()
  })

  it('handleOnConfirmResend calls resendCampaignToUsersList with Types payload', async () => {
    const wrapper = mountHeader()
    wrapper.vm.isShowResendDialog = true
    await wrapper.vm.$nextTick()
    wrapper.vm.handleOnConfirmResend(['Email'])
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(CallbackService.resendCampaignToUsersList).toHaveBeenCalledWith(
      'cb-sum-camp-1',
      'cb-sum-ig-1',
      { Types: ['Email'] }
    )
    expect(wrapper.vm.isShowResendDialog).toBe(false)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
