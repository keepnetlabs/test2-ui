import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsIndustry from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsIndustry.vue'

describe('CampaignManagerStatisticsIndustry.vue (extra branching)', () => {
  const mountWidget = (propsData = {}) =>
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

  it('syncs tableData after setProps with multiple rows', async () => {
    const wrapper = mountWidget()
    await wrapper.setProps({
      data: [
        { name: 'Finance', count: 8 },
        { name: 'Healthcare', count: 2 }
      ]
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toHaveLength(2)
    expect(wrapper.vm.tableData[1].name).toBe('Healthcare')
  })

  it('clears tableData when data becomes empty', async () => {
    const wrapper = mountWidget()
    await wrapper.setProps({ data: [{ name: 'Retail', count: 4 }] })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ data: [] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([])
  })

  it('exposes stable title and subtitle', () => {
    const wrapper = mountWidget()
    expect(wrapper.vm.getTitle).toBe('Industry')
    expect(wrapper.vm.getSubtitle).toBe('Number of phishing templates by industry')
  })

  it('watch.data assigns array to tableData', () => {
    const next = [{ name: 'Tech', count: 1 }]
    const ctx = { tableData: [] }
    CampaignManagerStatisticsIndustry.watch.data.call(ctx, next)
    expect(ctx.tableData).toBe(next)
  })
})
