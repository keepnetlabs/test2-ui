import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportHeader from '@/components/QuishingCampaignManagerReport/CampaignManagerReportHeader.vue'

describe('QuishingCampaignManagerReport/CampaignManagerReportHeader.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportHeader, {
      propsData: {
        title: 'Quishing Header',
        subtitle: 'Quishing Subtitle',
        ...propsData
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('CampaignManagerReportHeader')
  })

  it('renders title and subtitle from props', () => {
    const wrapper = mountComponent({
      title: 'Custom Quishing Title',
      subtitle: 'Custom Quishing Subtitle'
    })

    expect(wrapper.find('.campaign-manager-report-header__title').text()).toBe('Custom Quishing Title')
    expect(wrapper.find('.campaign-manager-report-summary-header__subtitle').text()).toBe(
      'Custom Quishing Subtitle'
    )
  })
})

