import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReport from '@/components/CallbackReport/SendingReport/CampaignManagerReportSendingReport.vue'

describe('CallbackReport CampaignManagerReportSendingReport.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportSendingReport, {
      propsData: {
        id: 'cb1',
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

  it('getLastSendingStatusItems returns empty when formDetails null', () => {
    const wrapper = mountComponent({ formDetails: null })
    expect(wrapper.vm.getLastSendingStatusItems).toEqual([])
  })

  it('handleOnDetail with empty object', () => {
    const wrapper = mountComponent()
    wrapper.vm.toggleShowDetailDialog = jest.fn()
    wrapper.vm.handleOnDetail()
    expect(wrapper.vm.selectedRow).toEqual({})
    expect(wrapper.vm.toggleShowDetailDialog).toHaveBeenCalled()
  })
})
