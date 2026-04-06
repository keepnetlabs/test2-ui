import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsEmotionalTrigger from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsEmotionalTrigger.vue'

describe('CampaignManagerStatisticsEmotionalTrigger.vue (extra branching)', () => {
  const mountWidget = (propsData = {}) =>
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

  it('syncs tableData after setProps with multiple rows', async () => {
    const wrapper = mountWidget()
    await wrapper.setProps({
      data: [
        { name: 'Curiosity', count: 5 },
        { name: 'Fear', count: 3 }
      ]
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toHaveLength(2)
    expect(wrapper.vm.tableData[0].name).toBe('Curiosity')
  })

  it('clears tableData when data becomes empty', async () => {
    const wrapper = mountWidget()
    await wrapper.setProps({ data: [{ name: 'Greed', count: 1 }] })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ data: [] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([])
  })

  it('exposes stable title and subtitle', () => {
    const wrapper = mountWidget()
    expect(wrapper.vm.getTitle).toBe('Emotional Trigger')
    expect(wrapper.vm.getSubtitle).toBe('Number of phishing templates by emotional trigger')
  })

  it('watch.data assigns array to tableData', () => {
    const next = [{ name: 'Urgency', count: 0 }]
    const ctx = { tableData: [] }
    CampaignManagerStatisticsEmotionalTrigger.watch.data.call(ctx, next)
    expect(ctx.tableData).toBe(next)
  })
})
