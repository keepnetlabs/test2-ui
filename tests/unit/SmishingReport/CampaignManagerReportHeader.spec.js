import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportHeader from '@/components/SmishingReport/CampaignManagerReportHeader.vue'

describe('SmishingReport/CampaignManagerReportHeader.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportHeader, {
      propsData: {
        title: 'Smishing Header',
        subtitle: 'Smishing Subtitle',
        ...propsData
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('CampaignManagerReportHeader')
  })

  it('renders title and subtitle text from props', () => {
    const wrapper = mountComponent({
      title: 'Custom Title',
      subtitle: 'Custom Subtitle'
    })

    expect(wrapper.find('.campaign-manager-report-header__title').text()).toBe('Custom Title')
    expect(wrapper.find('.campaign-manager-report-summary-header__subtitle').text()).toBe('Custom Subtitle')
  })
})

