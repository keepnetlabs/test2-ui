import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryCards from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryCards.vue'

describe('SmishingReport Summary CampaignManagerReportSummaryCards.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSummaryCards, {
      propsData: {
        items: {},
        multipleType: [],
        ...propsData
      },
      stubs: { CampaignManagerReportSummaryInfoCard: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getFirstCardTitle', () => {
    it('returns NoResponse label', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getFirstCardTitle).toBeTruthy()
    })
  })

  describe('getFirstCardProps', () => {
    it('returns noResponse data from items', () => {
      const wrapper = createWrapper({ items: { noResponse: { userCount: 5 } } })
      expect(wrapper.vm.getFirstCardProps).toEqual({ userCount: 5 })
    })
  })
})
