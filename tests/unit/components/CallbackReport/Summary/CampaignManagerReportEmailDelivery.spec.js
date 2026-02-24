import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportEmailDelivery from '@/components/CallbackReport/Summary/CampaignManagerReportEmailDelivery.vue'

describe('CampaignManagerReportEmailDelivery.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportEmailDelivery, {
      propsData: {
        items: { 'Delivery Status': 'Sent' },
        helperData: {
          emailDeliveredUserCount: 20,
          totalTargetUserCount: 25,
          emailNotDeliveredUserCount: 5
        },
        ...propsData
      },
      stubs: { CampaignManagerSummaryCard: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('isNotDelivered returns true when emailNotDeliveredUserCount > 0', () => {
    const wrapper = mountComponent({
      helperData: { emailNotDeliveredUserCount: 3, emailDeliveredUserCount: 10, totalTargetUserCount: 13 }
    })
    expect(wrapper.vm.isNotDelivered).toBe(true)
  })

  it('isNotDelivered returns false when emailNotDeliveredUserCount is 0', () => {
    const wrapper = mountComponent({
      helperData: { emailNotDeliveredUserCount: 0, emailDeliveredUserCount: 25, totalTargetUserCount: 25 }
    })
    expect(wrapper.vm.isNotDelivered).toBe(false)
  })

  it('getDeliveryValue returns formatted sent count', () => {
    const wrapper = mountComponent({
      helperData: { emailDeliveredUserCount: 20, totalTargetUserCount: 25 }
    })
    expect(wrapper.vm.getDeliveryValue).toBe('20 / 25 sent')
  })

  it('getNotDeliveredValue returns formatted not delivered count', () => {
    const wrapper = mountComponent({
      helperData: { emailNotDeliveredUserCount: 5 }
    })
    expect(wrapper.vm.getNotDeliveredValue).toBe('5 not delivered')
  })
})
