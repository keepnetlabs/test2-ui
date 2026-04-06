import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsRegion from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsRegion.vue'

describe('CampaignManagerStatisticsRegion.vue (extra branching)', () => {
  const mountWidget = (propsData = {}) =>
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

  it('initializes tableData from data prop via data() (not empty stub)', () => {
    const rows = [{ name: 'EMEA', count: 4 }]
    const wrapper = mountWidget({ data: rows })
    expect(wrapper.vm.tableData).toEqual(rows)
  })

  it('syncs tableData when data prop is replaced', async () => {
    const wrapper = mountWidget()
    await wrapper.setProps({
      data: [
        { name: 'North America', count: 2 },
        { name: 'APAC', count: 7 }
      ]
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toHaveLength(2)
    expect(wrapper.vm.tableData[1].name).toBe('APAC')
  })

  it('clears tableData when data becomes empty', async () => {
    const wrapper = mountWidget({ data: [{ name: 'LATAM', count: 1 }] })
    expect(wrapper.vm.tableData).toHaveLength(1)

    await wrapper.setProps({ data: [] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([])
  })

  it('exposes stable title and subtitle', () => {
    const wrapper = mountWidget()
    expect(wrapper.vm.getTitle).toBe('Region')
    expect(wrapper.vm.getSubtitle).toBe('Number of phishing templates by region')
  })

  it('watch.data assigns prop array to tableData', () => {
    const next = [{ name: 'Test', count: 0 }]
    const ctx = { tableData: [] }
    CampaignManagerStatisticsRegion.watch.data.call(ctx, next)
    expect(ctx.tableData).toBe(next)
  })
})
