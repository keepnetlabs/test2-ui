import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsLanguage from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsLanguage.vue'

describe('CampaignManagerStatisticsLanguage.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerStatisticsLanguage, {
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

  it('getTitle returns Language', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getTitle).toBe('Language')
  })

  it('getSubtitle contains language', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getSubtitle).toContain('language')
  })

  it('watch data updates tableData', async () => {
    const wrapper = mountComponent()
    wrapper.setProps({ data: [{ name: 'English', count: 8 }] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([{ name: 'English', count: 8 }])
  })
})
