import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsBrand from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsBrand.vue'

describe('CampaignManagerStatisticsBrand.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerStatisticsBrand, {
      propsData: { data: [], isLoading: false, ...propsData },
      stubs: {
        WidgetLoading: true,
        WidgetContainer: true,
        WidgetList: true,
        WidgetBody: true,
        WidgetHeader: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getTitle returns Brand', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getTitle).toBe('Brand')
  })

  it('getSubtitle contains expected text', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getSubtitle).toBeDefined()
    expect(typeof wrapper.vm.getSubtitle).toBe('string')
  })

  it('watch data updates tableData', async () => {
    const wrapper = mountComponent()
    wrapper.setProps({ data: [{ name: 'Microsoft', count: 3 }] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([{ name: 'Microsoft', count: 3 }])
  })
})
