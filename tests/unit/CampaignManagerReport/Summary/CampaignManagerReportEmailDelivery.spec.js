import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportEmailDelivery from '@/components/CampaignManagerReport/Summary/CampaignManagerReportEmailDelivery'

describe('CampaignManagerReportEmailDelivery.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportEmailDelivery, {
      propsData: {
        items: {},
        helperData: {
          emailDeliveredUserCount: 80,
          emailNotDeliveredUserCount: 20,
          totalTargetUserCount: 100
        },
        ...propsData
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        VIcon: true
      }
    })

  it('computes delivery values and not-delivered flag', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.isNotDelivered).toBe(true)
    expect(wrapper.vm.getDeliveryValue).toBe('80 / 100 sent')
    expect(wrapper.vm.getNotDeliveredValue).toBe('20 not delivered')
  })

  it('returns non-warning state when not delivered count is zero', () => {
    const wrapper = createWrapper({
      helperData: {
        emailDeliveredUserCount: 100,
        emailNotDeliveredUserCount: 0,
        totalTargetUserCount: 100
      }
    })

    expect(wrapper.vm.isNotDelivered).toBe(false)
    expect(wrapper.vm.getNotDeliveredValue).toBe('0 not delivered')
  })
})
