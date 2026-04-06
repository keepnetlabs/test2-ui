import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsBrand from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsBrand.vue'

describe('CampaignManagerStatisticsBrand.vue (extra branching)', () => {
  const mountWidget = (propsData = {}) =>
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

  it('syncs tableData after setProps with multiple rows', async () => {
    const wrapper = mountWidget()
    await wrapper.setProps({
      data: [
        { name: 'Brand A', count: 6 },
        { name: 'Brand B', count: 9 }
      ]
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toHaveLength(2)
  })

  it('clears tableData when data becomes empty', async () => {
    const wrapper = mountWidget()
    await wrapper.setProps({ data: [{ name: 'Solo', count: 2 }] })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ data: [] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([])
  })

  it('exposes stable title and subtitle', () => {
    const wrapper = mountWidget()
    expect(wrapper.vm.getTitle).toBe('Brand')
    expect(wrapper.vm.getSubtitle).toBe('Number of phishing templates by brand')
  })

  it('watch.data assigns array to tableData', () => {
    const next = [{ name: 'X', count: 0 }]
    const ctx = { tableData: [] }
    CampaignManagerStatisticsBrand.watch.data.call(ctx, next)
    expect(ctx.tableData).toBe(next)
  })
})
