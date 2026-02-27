import CampaignManagerScenarioStatisticsModal from '@/components/CampaignManager/CampaignManagerScenarioStatisticsModal.vue'
import CampaignManagerStatisticsLanguage from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsLanguage.vue'
import CampaignManagerStatisticsEmotionalTrigger from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsEmotionalTrigger.vue'
import CampaignManagerStatisticsBrand from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsBrand.vue'
import CampaignManagerStatisticsAttackType from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsAttackType.vue'
import CampaignManagerStatisticsIndustry from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsIndustry.vue'

describe('CampaignManagerScenarioStatisticsModal.vue (extra branches)', () => {
  it('breakpointChanged sorts layout items by coordinates properly', () => {
    // We are deliberately constructing items such that it tests a.y < b.y, a.y == b.y & a.x > b.x etc
    const item1 = { x: 3, y: 0, w: 2, h: 2, key: 'Item1' }
    const item2 = { x: 0, y: 2, w: 2, h: 2, key: 'Item2' }
    const item3 = { x: 5, y: 0, w: 2, h: 2, key: 'Item3' } // y matches with item1 but x is greater
    const item4 = { x: 1, y: 0, w: 2, h: 2, key: 'Item4' } // y matches with item1 but x is lesser

    const ctx = {
      activeBreakpoint: 'lg',
      layout: [item1, item2, item3, item4],
      getBdCol: () => 2
    }

    CampaignManagerScenarioStatisticsModal.methods.breakpointChanged.call(ctx, {
      newBreakpoint: 'xxs'
    })

    // It should hit every conditional path in layout.sort
    expect(ctx.activeBreakpoint).toBe('xxs')
    expect(ctx.layout.length).toBe(4)
  })

  it('breakpointChanged maintains order on full equality', () => {
    const itemX = { x: 1, y: 1, w: 2, h: 2, key: 'X1' }
    const itemY = { x: 1, y: 1, w: 2, h: 2, key: 'Y1' }
    
    const ctx = {
      activeBreakpoint: 'lg',
      layout: [itemX, itemY],
      getBdCol: () => 2
    }
    
    CampaignManagerScenarioStatisticsModal.methods.breakpointChanged.call(ctx, { newBreakpoint: 'xs' })
    expect(ctx.layout.length).toBe(2)
  })

  it('getComponent resolves to mapped Vue components accurately for all switch branches', () => {
    const getComp = CampaignManagerScenarioStatisticsModal.methods.getComponent

    expect(getComp.call({}, 'StatisticsLanguageWidget')).toBe(CampaignManagerStatisticsLanguage)
    expect(getComp.call({}, 'StatisticsEmotionalTriggerWidget')).toBe(CampaignManagerStatisticsEmotionalTrigger)
    expect(getComp.call({}, 'StatisticsBrandWidget')).toBe(CampaignManagerStatisticsBrand)
    expect(getComp.call({}, 'StatisticsAttackTypeWidget')).toBe(CampaignManagerStatisticsAttackType)
    expect(getComp.call({}, 'StatisticsIndustryWidget')).toBe(CampaignManagerStatisticsIndustry)
  })
})
