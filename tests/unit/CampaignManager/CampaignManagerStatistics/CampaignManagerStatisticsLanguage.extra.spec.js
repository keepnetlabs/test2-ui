import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsLanguage from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsLanguage.vue'

describe('CampaignManagerStatisticsLanguage.vue (extra branching)', () => {
  const mountWidget = (propsData = {}) =>
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

  it('syncs tableData after setProps with multiple rows', async () => {
    const wrapper = mountWidget()
    await wrapper.setProps({
      data: [
        { name: 'English', count: 12 },
        { name: 'Turkish', count: 3 }
      ]
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toHaveLength(2)
    expect(wrapper.vm.tableData[0].name).toBe('English')
  })

  it('clears tableData when data becomes empty', async () => {
    const wrapper = mountWidget()
    await wrapper.setProps({ data: [{ name: 'German', count: 1 }] })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ data: [] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([])
  })

  it('exposes stable title and subtitle', () => {
    const wrapper = mountWidget()
    expect(wrapper.vm.getTitle).toBe('Language')
    expect(wrapper.vm.getSubtitle).toBe('Number of phishing templates by language')
  })

  it('watch.data assigns array to tableData', () => {
    const next = [{ name: 'French', count: 0 }]
    const ctx = { tableData: [] }
    CampaignManagerStatisticsLanguage.watch.data.call(ctx, next)
    expect(ctx.tableData).toBe(next)
  })
})
