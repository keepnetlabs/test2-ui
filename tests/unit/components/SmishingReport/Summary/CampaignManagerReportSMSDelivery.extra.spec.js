import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSMSDelivery from '@/components/SmishingReport/Summary/CampaignManagerReportSMSDelivery.vue'

describe('CampaignManagerReportSMSDelivery.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportSMSDelivery, {
      propsData: {
        items: {},
        helperData: {},
        ...propsData
      },
      stubs: { Fragment: true, CampaignManagerSummaryCard: true, CampaignManagerSenderPhoneNumbersModal: true }
    })

  it('isNotDelivered handles undefined helperData', () => {
    const wrapper = mountComponent({ helperData: undefined })
    expect(wrapper.vm.isNotDelivered).toBe(false)
  })

  it('getDeliveryValue uses defaults when helperData empty', () => {
    const wrapper = mountComponent({ helperData: {} })
    expect(wrapper.vm.getDeliveryValue).toBe('0 / 0 sent')
  })

  it('getNotDeliveredValue uses default when smsNotDeliveredUserCount missing', () => {
    const wrapper = mountComponent({ helperData: {} })
    expect(wrapper.vm.getNotDeliveredValue).toContain('not delivered')
  })
})
