import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader.vue'

describe('CampaignManagerReportHeader.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportHeader, {
      propsData: {
        title: 'Report Title',
        subtitle: 'Report subtitle',
        ...propsData
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays title prop', () => {
    const wrapper = createWrapper({ title: 'Training Report' })
    expect(wrapper.text()).toContain('Training Report')
  })

  it('displays subtitle prop', () => {
    const wrapper = createWrapper({ subtitle: 'Users who completed' })
    expect(wrapper.text()).toContain('Users who completed')
  })
})
