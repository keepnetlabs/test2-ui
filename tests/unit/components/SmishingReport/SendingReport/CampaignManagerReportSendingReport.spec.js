import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReport from '@/components/SmishingReport/SendingReport/CampaignManagerReportSendingReport.vue'

describe('SmishingReport CampaignManagerReportSendingReport.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportSendingReport, {
      propsData: {
        id: 's1',
        instanceGroup: 'g1',
        customFields: [],
        formDetails: {},
        ...propsData
      },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CampaignManagerReportSendingReportTable: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getLastSendingStatusItems returns userStatuses from formDetails', () => {
    const wrapper = mountComponent({
      formDetails: { userStatuses: [{ id: 1, name: 'Sent' }] }
    })
    expect(wrapper.vm.getLastSendingStatusItems).toEqual([{ id: 1, name: 'Sent' }])
  })

  it('getLastSendingStatusItems returns empty array when formDetails missing', () => {
    const wrapper = mountComponent({ formDetails: undefined })
    expect(wrapper.vm.getLastSendingStatusItems).toEqual([])
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(3)
    expect(wrapper.vm.resendItemCount).toBe(3)
  })

  it('handleOnResend sets resendPayload and opens dialog', () => {
    const wrapper = mountComponent()
    const payload = { items: ['u1'] }
    wrapper.vm.handleOnResend(payload)
    expect(wrapper.vm.resendPayload).toEqual(payload)
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleOnDetail sets selectedRow', () => {
    const wrapper = mountComponent()
    wrapper.vm.toggleShowDetailDialog = jest.fn()
    wrapper.vm.handleOnDetail({ resourceId: 'r1' })
    expect(wrapper.vm.selectedRow).toEqual({ resourceId: 'r1' })
    expect(wrapper.vm.toggleShowDetailDialog).toHaveBeenCalled()
  })
})
