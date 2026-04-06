import { shallowMount } from '@vue/test-utils'
import CampaignManagerStatisticsAttackType from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsAttackType.vue'

describe('CampaignManagerStatisticsAttackType.vue (extra branching)', () => {
  const mountWidget = (propsData = {}) =>
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

  describe('watch data → tableData', () => {
    it('syncs tableData when data prop is replaced with a new list', async () => {
      const wrapper = mountWidget()
      await wrapper.setProps({
        data: [
          { name: 'Credential Harvesting', count: 3 },
          { name: 'Malware', count: 1 }
        ]
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tableData).toHaveLength(2)
      expect(wrapper.vm.tableData[0].name).toBe('Credential Harvesting')
    })

    it('clears tableData when data prop becomes empty', async () => {
      const wrapper = mountWidget()
      await wrapper.setProps({ data: [{ name: 'Phishing', count: 10 }] })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tableData).toHaveLength(1)

      await wrapper.setProps({ data: [] })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.tableData).toEqual([])
    })
  })

  describe('computed subtitles', () => {
    it('exposes stable title and subtitle strings', () => {
      const wrapper = mountWidget()
      expect(wrapper.vm.getTitle).toBe('Attack Type')
      expect(wrapper.vm.getSubtitle).toBe('Number of phishing templates by attack type')
    })
  })

  describe('watch handler direct', () => {
    it('assigns incoming data array to tableData', () => {
      const next = [{ name: 'Spear Phishing', count: 2 }]
      const ctx = { tableData: [] }
      CampaignManagerStatisticsAttackType.watch.data.call(ctx, next)
      expect(ctx.tableData).toBe(next)
    })
  })
})
