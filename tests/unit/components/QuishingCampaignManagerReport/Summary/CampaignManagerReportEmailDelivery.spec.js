import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportEmailDelivery from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportEmailDelivery.vue'

describe('QuishingCampaignManagerReport Summary CampaignManagerReportEmailDelivery.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportEmailDelivery, {
      propsData: {
        items: {},
        helperData: {},
        ...propsData
      },
      stubs: { CampaignManagerSummaryCard: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('isNotDelivered', () => {
    it('returns true when emailNotDeliveredUserCount > 0', () => {
      const wrapper = createWrapper({
        helperData: { emailNotDeliveredUserCount: 5 }
      })
      expect(wrapper.vm.isNotDelivered).toBe(true)
    })

    it('returns false when emailNotDeliveredUserCount is 0 or undefined', () => {
      const wrapper = createWrapper({ helperData: {} })
      expect(wrapper.vm.isNotDelivered).toBe(false)
    })
  })

  describe('getDeliveryValue', () => {
    it('returns formatted delivery string', () => {
      const wrapper = createWrapper({
        helperData: { emailDeliveredUserCount: 80, totalTargetUserCount: 100 }
      })
      expect(wrapper.vm.getDeliveryValue).toBe('80 / 100 sent')
    })

    it('handles missing values with defaults', () => {
      const wrapper = createWrapper({ helperData: {} })
      expect(wrapper.vm.getDeliveryValue).toBe('0 / 0 sent')
    })
  })

  describe('getNotDeliveredValue', () => {
    it('returns formatted not delivered string', () => {
      const wrapper = createWrapper({
        helperData: { emailNotDeliveredUserCount: 5 }
      })
      expect(wrapper.vm.getNotDeliveredValue).toBe('5 not delivered')
    })
  })
})
