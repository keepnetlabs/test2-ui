import CampaignManagerStatisticsRegion from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsRegion.vue'
import CampaignManagerStatisticsLanguage from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsLanguage.vue'
import CampaignManagerStatisticsIndustry from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsIndustry.vue'
import CampaignManagerStatisticsBrand from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsBrand.vue'
import CampaignManagerStatisticsEmotionalTrigger from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsEmotionalTrigger.vue'
import CampaignManagerStatisticsAttackType from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsAttackType.vue'

describe('CampaignManager statistics list widgets', () => {
  const commonRows = [{ name: 'A', count: 10, percentage: 40 }]

  const cases = [
    {
      component: CampaignManagerStatisticsRegion,
      title: 'Region',
      subtitle: 'Number of phishing templates by region',
      initialFromProp: true
    },
    {
      component: CampaignManagerStatisticsLanguage,
      title: 'Language',
      subtitle: 'Number of phishing templates by language',
      initialFromProp: false
    },
    {
      component: CampaignManagerStatisticsIndustry,
      title: 'Industry',
      subtitle: 'Number of phishing templates by industry',
      initialFromProp: false
    },
    {
      component: CampaignManagerStatisticsBrand,
      title: 'Brand',
      subtitle: 'Number of phishing templates by brand',
      initialFromProp: false
    },
    {
      component: CampaignManagerStatisticsEmotionalTrigger,
      title: 'Emotional Trigger',
      subtitle: 'Number of phishing templates by emotional trigger',
      initialFromProp: false
    },
    {
      component: CampaignManagerStatisticsAttackType,
      title: 'Attack Type',
      subtitle: 'Number of phishing templates by attack type',
      initialFromProp: false
    }
  ]

  it.each(cases)('$title widget has expected computed titles and watcher behavior', ({ component, title, subtitle, initialFromProp }) => {
    const ctx = {
      data: commonRows
    }

    const state = component.data.call(ctx)
    expect(component.computed.getTitle.call({})).toBe(title)
    expect(component.computed.getSubtitle.call({})).toBe(subtitle)
    expect(state.columns.length).toBe(2)
    expect(state.empty.message).toBeDefined()

    if (initialFromProp) {
      expect(state.tableData).toEqual(commonRows)
    } else {
      expect(state.tableData).toEqual([])
    }

    const watchCtx = { tableData: [] }
    component.watch.data.call(watchCtx, commonRows)
    expect(watchCtx.tableData).toEqual(commonRows)
  })
})
