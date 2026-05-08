import { shallowMount } from '@vue/test-utils'
import VishingReportSummaryHeader from '@/components/VishingReport/VishingReportSummaryHeader.vue'
import { exportVishingReportSummary, resendVishingReport } from '@/api/vishing'

jest.mock('@/api/vishing', () => ({
  exportVishingReportSummary: jest.fn(() => Promise.resolve({ data: {} })),
  resendVishingReport: jest.fn(() => Promise.resolve())
}))

if (!globalThis.URL) globalThis.URL = {}
if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock')

describe('VishingReportSummaryHeader.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportSummaryHeader, {
      propsData: {
        id: 'v1',
        vishingName: 'Test Campaign',
        vishingReportItems: { answered: 5, noResponse: 2 },
        ...propsData
      },
      stubs: { VishingReportResendDialog: true, VBtn: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('has correct component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('VishingReportSummaryHeader')
  })

  it('toggleShowResendDialog toggles isShowResendDialog', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.isShowResendDialog).toBe(false)
    wrapper.vm.toggleShowResendDialog()
    expect(wrapper.vm.isShowResendDialog).toBe(true)
    wrapper.vm.toggleShowResendDialog()
    expect(wrapper.vm.isShowResendDialog).toBe(false)
  })

  it('handleOnConfirmResend calls API and emits on-resend', async () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnConfirmResend([1, 2])
    await wrapper.vm.$nextTick()
    expect(resendVishingReport).toHaveBeenCalledWith('v1', { types: [1, 2] })
    await Promise.resolve()
    expect(wrapper.emitted('on-resend')).toBeTruthy()
  })

  it('handleOnConfirmResend uses id prop for resend request', async () => {
    const wrapper = mountComponent({ id: 'report-id-xyz' })
    wrapper.vm.handleOnConfirmResend([9])
    await Promise.resolve()
    expect(resendVishingReport).toHaveBeenCalledWith('report-id-xyz', { types: [9] })
  })

  it('handleDownloadReport calls export and creates download link', async () => {
    const wrapper = mountComponent()
    wrapper.vm.handleDownloadReport()
    await wrapper.vm.$nextTick()
    expect(exportVishingReportSummary).toHaveBeenCalledWith('v1')
  })

  it('handleDownloadReport uses id prop for export request', async () => {
    const wrapper = mountComponent({ id: 'export-campaign-7' })
    wrapper.vm.handleDownloadReport()
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    expect(exportVishingReportSummary).toHaveBeenCalledWith('export-campaign-7')
  })
})
