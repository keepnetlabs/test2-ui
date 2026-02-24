import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsEmotionalTrigger from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsEmotionalTrigger.vue'

describe('CampaignManagerStatisticsEmotionalTrigger.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerStatisticsEmotionalTrigger, {
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

  it('getTitle returns Emotional Trigger', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getTitle).toBe('Emotional Trigger')
  })

  it('getSubtitle contains emotional trigger', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getSubtitle).toContain('emotional trigger')
  })

  it('watch data updates tableData', async () => {
    const wrapper = mountComponent()
    wrapper.setProps({ data: [{ name: 'Urgency', count: 4 }] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([{ name: 'Urgency', count: 4 }])
  })
})
