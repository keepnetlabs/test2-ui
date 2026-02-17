import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportHeader from '@/components/CallbackReport/CampaignManagerReportHeader.vue'

describe('CallbackReport/CampaignManagerReportHeader.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportHeader, {
      propsData: {
        title: 'Callback Header',
        subtitle: 'Callback Subtitle',
        ...propsData
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('CampaignManagerReportHeader')
  })

  it('renders title and subtitle from props', () => {
    const wrapper = mountComponent({
      title: 'Custom Callback Title',
      subtitle: 'Custom Callback Subtitle'
    })

    expect(wrapper.find('.campaign-manager-report-header__title').text()).toBe('Custom Callback Title')
    expect(wrapper.find('.campaign-manager-report-summary-header__subtitle').text()).toBe(
      'Custom Callback Subtitle'
    )
  })
})

