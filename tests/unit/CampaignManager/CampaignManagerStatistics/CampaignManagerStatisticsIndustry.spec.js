import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsIndustry from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsIndustry.vue'

describe('CampaignManagerStatisticsIndustry.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerStatisticsIndustry, {
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

  it('getTitle returns Industry', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getTitle).toBe('Industry')
  })

  it('getSubtitle contains industry', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getSubtitle).toContain('industry')
  })

  it('watch data updates tableData', async () => {
    const wrapper = mountComponent()
    wrapper.setProps({ data: [{ name: 'Finance', count: 6 }] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([{ name: 'Finance', count: 6 }])
  })
})
