import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryInfoCard from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryInfoCard.vue'

describe('SmishingReport Summary CampaignManagerReportSummaryInfoCard.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSummaryInfoCard, {
      propsData: {
        title: 'Opened',
        userCount: 10,
        userPercent: '25',
        ...propsData
      },
      stubs: { CardLoading: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('passes loading prop to CardLoading', () => {
    const wrapper = createWrapper({
      isLoading: true,
      title: 'Clicked',
      userCount: 5,
      userPercent: '12'
    })
    const card = wrapper.findComponent({ name: 'CardLoading' })
    expect(card.exists()).toBe(true)
    expect(card.props('loading')).toBe(true)
  })

  it('applies loading class when isLoading', () => {
    const wrapper = createWrapper({ isLoading: true })
    expect(wrapper.classes()).toContain('campaign-manager-report-summary-info-card--loading')
  })
})
