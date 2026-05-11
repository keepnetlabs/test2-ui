/**
 * Vishing özet üst çubuğu: rapor indir ve yeniden gönder onayı
 * → `exportVishingReportSummary` / `resendVishingReport`.
 */
jest.mock('@/api/vishing', () => ({
  exportVishingReportSummary: jest.fn(),
  resendVishingReport: jest.fn(() => Promise.resolve())
}))

import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VishingReportSummaryHeader from '@/components/VishingReport/VishingReportSummaryHeader.vue'
import { exportVishingReportSummary, resendVishingReport } from '@/api/vishing'

const localVue = createLocalVue()
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Vishing Report Summary header actions (integration)', () => {
  let vuetify
  let origCreateObjectURL
  let origRevokeObjectURL

  beforeEach(() => {
    vuetify = new Vuetify()
    jest.clearAllMocks()
    origCreateObjectURL = globalThis.URL.createObjectURL
    origRevokeObjectURL = globalThis.URL.revokeObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock-vishing-summary')
    globalThis.URL.revokeObjectURL = jest.fn()
  })

  afterEach(() => {
    globalThis.URL.createObjectURL = origCreateObjectURL
    globalThis.URL.revokeObjectURL = origRevokeObjectURL
  })

  const mountHeader = () =>
    mount(VishingReportSummaryHeader, {
      localVue,
      vuetify,
      propsData: {
        id: 'vish-sum-h-1',
        vishingName: 'Vish Header',
        vishingReportItems: { answered: 1, noResponse: 0, callingError: 0 }
      },
      stubs: {
        VishingReportResendDialog: true,
        VBtn: true
      }
    })

  it('handleDownloadReport calls exportVishingReportSummary and resets disabled state', async () => {
    exportVishingReportSummary.mockResolvedValue({
      data: new Blob(['x'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    })
    const createElementSpy = jest.spyOn(document, 'createElement')

    const wrapper = mountHeader()
    wrapper.vm.handleDownloadReport()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(exportVishingReportSummary).toHaveBeenCalledWith('vish-sum-h-1')
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(wrapper.vm.isDownloadReportDisabled).toBe(false)
    createElementSpy.mockRestore()
  })

  it('handleOnConfirmResend calls resendVishingReport with types payload', async () => {
    const wrapper = mountHeader()
    wrapper.vm.isShowResendDialog = true
    await wrapper.vm.$nextTick()
    wrapper.vm.handleOnConfirmResend([1, 2])
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(resendVishingReport).toHaveBeenCalledWith('vish-sum-h-1', { types: [1, 2] })
    expect(wrapper.emitted('on-resend')).toBeTruthy()
    expect(wrapper.emitted('on-resend')).toHaveLength(1)
    expect(wrapper.vm.isShowResendDialog).toBe(false)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
