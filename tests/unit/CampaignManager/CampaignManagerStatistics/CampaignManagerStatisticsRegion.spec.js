import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsRegion from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsRegion.vue'

describe('CampaignManagerStatisticsRegion.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerStatisticsRegion, {
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

  it('getTitle returns Region', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getTitle).toBe('Region')
  })

  it('getSubtitle contains region', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getSubtitle).toContain('region')
  })

  it('watch data updates tableData', async () => {
    const wrapper = mountComponent()
    wrapper.setProps({ data: [{ name: 'Europe', count: 5 }] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([{ name: 'Europe', count: 5 }])
  })
})
