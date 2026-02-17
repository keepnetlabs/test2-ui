import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryCategory from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCategory'

describe('CampaignManagerReportSummaryCategory.vue', () => {
  it('renders category text when fetching is false', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryCategory, {
      propsData: {
        category: 'Credential Harvesting',
        isFetchingSummary: false
      }
    })

    expect(wrapper.text()).toContain('Category:')
    expect(wrapper.text()).toContain('Credential Harvesting')
  })

  it('does not render category body while fetching', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryCategory, {
      propsData: {
        category: 'X',
        isFetchingSummary: true
      }
    })

    expect(wrapper.text()).not.toContain('Category:')
  })

  it('passes loading prop to summary card container', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryCategory, {
      propsData: {
        category: 'Any',
        isFetchingSummary: true
      }
    })

    expect(wrapper.find('campaignmanagersummarycard-stub').attributes('isloading')).toBe('true')
  })

  it('renders category label even when category is empty', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryCategory, {
      propsData: {
        category: '',
        isFetchingSummary: false
      }
    })

    expect(wrapper.text()).toContain('Category:')
  })
})

