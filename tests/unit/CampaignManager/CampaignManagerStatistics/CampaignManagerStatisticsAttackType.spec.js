import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsAttackType from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsAttackType.vue'

describe('CampaignManagerStatisticsAttackType.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerStatisticsAttackType, {
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

  it('getTitle returns Attack Type', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getTitle).toBe('Attack Type')
  })

  it('getSubtitle returns expected text', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getSubtitle).toContain('attack type')
  })

  it('watch data updates tableData', async () => {
    const wrapper = mountComponent()
    wrapper.setProps({ data: [{ name: 'Phishing', count: 5 }] })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.tableData).toEqual([{ name: 'Phishing', count: 5 }])
  })
})
