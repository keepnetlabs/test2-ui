import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReport from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReport'

describe('CampaignManagerReportSendingReport.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportSendingReport, {
      localVue,
      propsData: {
        id: 'id-1',
        instanceGroup: 'group-1',
        customFields: [],
        ...propsData
      },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CampaignManagerReportSendingReportTable: true
      }
    })

  it('returns user statuses when formDetails has userStatuses', () => {
    const wrapper = mountComponent({
      formDetails: { userStatuses: [{ id: 1 }, { id: 2 }] }
    })
    expect(wrapper.vm.getLastSendingStatusItems).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('returns empty array when formDetails is missing or userStatuses is absent', () => {
    expect(mountComponent({ formDetails: undefined }).vm.getLastSendingStatusItems).toEqual([])
    expect(mountComponent({ formDetails: {} }).vm.getLastSendingStatusItems).toEqual([])
  })

  it('opens resend dialog and stores resend payload', async () => {
    const wrapper = mountComponent()
    const payload = [{ userId: 12 }]

    wrapper.vm.handleOnResend(payload)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.resendPayload).toEqual(payload)
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(4)
    expect(wrapper.vm.resendItemCount).toBe(4)
  })

  it('handleOnDetail sets selected row and calls toggleShowDetailDialog', () => {
    const wrapper = mountComponent()
    wrapper.vm.toggleShowDetailDialog = jest.fn()
    wrapper.vm.handleOnDetail({ id: 'detail-9' })
    expect(wrapper.vm.selectedRow).toEqual({ id: 'detail-9' })
    expect(wrapper.vm.toggleShowDetailDialog).toHaveBeenCalled()
  })

  it('handleOnDetail falls back to empty row when payload is missing', () => {
    const wrapper = mountComponent()
    wrapper.vm.toggleShowDetailDialog = jest.fn()
    wrapper.vm.handleOnDetail()
    expect(wrapper.vm.selectedRow).toEqual({})
    expect(wrapper.vm.toggleShowDetailDialog).toHaveBeenCalled()
  })
})
