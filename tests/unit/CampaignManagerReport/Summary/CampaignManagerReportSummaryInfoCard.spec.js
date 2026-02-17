import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryInfoCard from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryInfoCard'

describe('CampaignManagerReportSummaryInfoCard.vue', () => {
  it('renders provided props in skeleton content', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryInfoCard, {
      propsData: {
        isLoading: false,
        title: 'Clicked Users',
        userCount: 25,
        userPercent: '12.5',
        backgroundColor: '#2196f3',
        iconSrc: '/icon.svg'
      },
      stubs: {
        CardLoading: {
          props: ['loading'],
          template: '<div class="card-loading-stub"><slot name="skeleton-content" /></div>'
        }
      }
    })

    expect(wrapper.text()).toContain('Clicked Users')
    expect(wrapper.text()).toContain('25')
    expect(wrapper.text()).toContain('12.5%')
    expect(wrapper.find('img').attributes('src')).toBe('/icon.svg')
  })

  it('uses slot icon content when provided', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryInfoCard, {
      propsData: {
        title: 'Reported',
        userCount: 3,
        userPercent: '1'
      },
      stubs: {
        CardLoading: {
          props: ['loading'],
          template: '<div class="card-loading-stub"><slot name="skeleton-content" /></div>'
        }
      },
      slots: {
        icon: '<span class="custom-icon">custom-icon</span>'
      }
    })

    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('passes loading and background style to card container', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryInfoCard, {
      propsData: {
        isLoading: true,
        backgroundColor: '#111111'
      },
      stubs: {
        CardLoading: true
      }
    })

    expect(wrapper.find('cardloading-stub').attributes('loading')).toBe('true')
    expect(wrapper.attributes('style')).toContain('background-color: rgb(17, 17, 17)')
  })
})
