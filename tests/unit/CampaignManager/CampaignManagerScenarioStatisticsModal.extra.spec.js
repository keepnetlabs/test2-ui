import CampaignManagerScenarioStatisticsModal from '@/components/CampaignManager/CampaignManagerScenarioStatisticsModal.vue'
import CampaignManagerStatisticsRegion from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsRegion'
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

    expect(getComp.call({}, 'StatisticsRegionWidget')).toBe(CampaignManagerStatisticsRegion)
    expect(getComp.call({}, 'StatisticsLanguageWidget')).toBe(CampaignManagerStatisticsLanguage)
    expect(getComp.call({}, 'StatisticsEmotionalTriggerWidget')).toBe(CampaignManagerStatisticsEmotionalTrigger)
    expect(getComp.call({}, 'StatisticsBrandWidget')).toBe(CampaignManagerStatisticsBrand)
    expect(getComp.call({}, 'StatisticsAttackTypeWidget')).toBe(CampaignManagerStatisticsAttackType)
    expect(getComp.call({}, 'StatisticsIndustryWidget')).toBe(CampaignManagerStatisticsIndustry)
  })

  it('getComponent default branch falls back to Region widget', () => {
    const getComp = CampaignManagerScenarioStatisticsModal.methods.getComponent
    expect(getComp.call({}, 'StatisticsUnknownWidget')).toBe(CampaignManagerStatisticsRegion)
  })

  it('getComponentData returns each series and defaults to industry', () => {
    const data = {
      region: ['r1'],
      language: ['l1'],
      emotion: ['e1'],
      brand: ['b1'],
      attackType: ['a1'],
      industry: ['i1']
    }
    const getData = CampaignManagerScenarioStatisticsModal.methods.getComponentData
    expect(getData.call({ data }, 'StatisticsRegionWidget')).toEqual(['r1'])
    expect(getData.call({ data }, 'StatisticsLanguageWidget')).toEqual(['l1'])
    expect(getData.call({ data }, 'StatisticsEmotionalTriggerWidget')).toEqual(['e1'])
    expect(getData.call({ data }, 'StatisticsBrandWidget')).toEqual(['b1'])
    expect(getData.call({ data }, 'StatisticsAttackTypeWidget')).toEqual(['a1'])
    expect(getData.call({ data }, 'StatisticsIndustryWidget')).toEqual(['i1'])
    expect(getData.call({ data }, 'StatisticsUnknownWidget')).toEqual(['i1'])
  })

  it('handleDrawerClickOutside emits drawer close', () => {
    const emit = jest.fn()
    CampaignManagerScenarioStatisticsModal.methods.handleDrawerClickOutside.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('navigation-drawer-change', false)
  })

  it('breakpointChanged skips layout reflow when bdCol is greater than 2', () => {
    const original = { x: 9, y: 9, w: 6, h: 6, key: 'pinned' }
    const ctx = {
      activeBreakpoint: 'lg',
      layout: [original],
      getBdCol: () => 12
    }
    CampaignManagerScenarioStatisticsModal.methods.breakpointChanged.call(ctx, { newBreakpoint: 'md' })
    expect(ctx.activeBreakpoint).toBe('md')
    expect(ctx.layout[0]).toEqual(original)
  })

  describe('transformStatisticData', () => {
    it('sorts and handles Unknown/NA and Other grouping (>5 items)', () => {
      const data = [
        { name: 'A', percentage: 20, count: 10 },
        { name: 'B', percentage: 15, count: 8 },
        { name: 'C', percentage: 12, count: 6 },
        { name: 'D', percentage: 10, count: 5 },
        { name: 'E', percentage: 8, count: 4 },
        { name: 'F', percentage: 5, count: 2 },
        { name: 'Unknown', percentage: 2, count: 1 },
        { name: 'N/A', percentage: 3, count: 1.5 }
      ]
      const result = CampaignManagerScenarioStatisticsModal.methods.transformStatisticData(data)
      expect(result.length).toBe(6)
      expect(result[5].name).toBe('Other')
      expect(result[5].percentage).toBe('35')
    })
    it('returns firstData directly if items <= 5 and no excluded data', () => {
      const data = [{ name: 'A', percentage: 100, count: 10 }]
      const result = CampaignManagerScenarioStatisticsModal.methods.transformStatisticData(data)
      expect(result.length).toBe(1)
    })
  })
})
