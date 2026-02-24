import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryInfoCard from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryInfoCard.vue'

describe('CampaignManagerReportSummaryInfoCard.vue (extra branch coverage)', () => {
  it('uses default props when not provided', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryInfoCard, {
      stubs: { CardLoading: true }
    })
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.title).toBe('')
    expect(wrapper.vm.userCount).toBe(0)
    expect(wrapper.vm.userPercent).toBe('0')
    expect(wrapper.vm.backgroundColor).toBe('#43A047')
    expect(wrapper.vm.iconSrc).toBe('')
  })

  it('passes loading true to CardLoading when isLoading is true', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryInfoCard, {
      propsData: { isLoading: true, title: 'Clicked' },
      stubs: {
        CardLoading: {
          props: ['loading'],
          template: '<div class="card-loading" :data-loading="loading" />'
        }
      }
    })
    const card = wrapper.findComponent({ name: 'CardLoading' })
    expect(card.props('loading')).toBe(true)
  })

  it('uses default icon slot when iconSrc is provided', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryInfoCard, {
      propsData: { iconSrc: '/icon.svg', title: 'Test' },
      stubs: {
        CardLoading: {
          template: '<div><slot name="skeleton-content" /></div>'
        }
      }
    })
    expect(wrapper.find('img').attributes('src')).toBe('/icon.svg')
  })
})
