import CampaignManagerScenarioStatisticsModal from '@/components/CampaignManager/CampaignManagerScenarioStatisticsModal.vue'
import { getCampaignScenarioStatistics } from '@/api/phishingsimulator'

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignScenarioStatistics: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          brand: [{ name: 'BrandA', count: 3, percentage: 30 }],
          industry: [{ name: 'IndustryA', count: 2, percentage: 20 }],
          region: [{ name: 'RegionA', count: 1, percentage: 10 }],
          emotion: [{ name: 'Fear', count: 4, percentage: 40 }],
          language: [{ name: 'English', count: 6, percentage: 60 }],
          attackType: [{ name: 'Click', count: 5, percentage: 50 }]
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerScenarioStatisticsModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('transformStatisticData removes unknown/n-a and appends Other for remaining items', () => {
    const input = [
      { name: 'A', count: 10, percentage: 10 },
      { name: 'B', count: 20, percentage: 20 },
      { name: 'C', count: 30, percentage: 30 },
      { name: 'D', count: 15, percentage: 15 },
      { name: 'E', count: 5, percentage: 5 },
      { name: 'F', count: 8, percentage: 8 },
      { name: 'Unknown', count: 7, percentage: 7 },
      { name: 'N/A', count: 5, percentage: 5 }
    ]

    const result = CampaignManagerScenarioStatisticsModal.methods.transformStatisticData.call(
      {},
      input
    )

    expect(result.length).toBe(6)
    expect(result[5].name).toBe('Other')
    expect(result[5].count).toBe(17)
    expect(result[5].percentage).toBe('17')
  })

  it('transformStatisticData returns first data directly when <=5 and no excluded count', () => {
    const input = [
      { name: 'A', count: 1, percentage: 10 },
      { name: 'B', count: 1, percentage: 20 }
    ]

    const result = CampaignManagerScenarioStatisticsModal.methods.transformStatisticData.call(
      {},
      input
    )
    expect(result).toEqual([
      { name: 'B', count: 1, percentage: 20 },
      { name: 'A', count: 1, percentage: 10 }
    ])
  })

  it('callForData maps payload and translates language names', async () => {
    const ctx = {
      isLoading: false,
      languages: [{ languageName: 'English', text: 'EN' }],
      data: {
        brand: [],
        industry: [],
        attackType: [],
        region: [],
        emotion: [],
        language: []
      },
      transformStatisticData: CampaignManagerScenarioStatisticsModal.methods.transformStatisticData
    }

    CampaignManagerScenarioStatisticsModal.methods.callForData.call(ctx)
    expect(ctx.isLoading).toBe(true)
    await flushPromises()

    expect(getCampaignScenarioStatistics).toHaveBeenCalled()
    expect(ctx.data.brand[0].name).toBe('BrandA')
    expect(ctx.data.language[0].name).toBe('EN')
    expect(ctx.isLoading).toBe(false)
  })

  it('breakpointChanged returns early when bdCol > 2', () => {
    const layout = [{ x: 1, y: 1, w: 6, h: 6, key: 'StatisticsRegionWidget' }]
    const ctx = {
      activeBreakpoint: 'lg',
      layout: [...layout],
      getBdCol: () => 12
    }
    CampaignManagerScenarioStatisticsModal.methods.breakpointChanged.call(ctx, {
      newBreakpoint: 'lg'
    })
    expect(ctx.activeBreakpoint).toBe('lg')
    expect(ctx.layout).toEqual(layout)
  })

  it('breakpointChanged recalculates x/y when bdCol <= 2', () => {
    const ctx = {
      activeBreakpoint: 'lg',
      layout: [
        { x: 6, y: 0, w: 6, h: 6, key: 'StatisticsIndustryWidget' },
        { x: 0, y: 0, w: 6, h: 6, key: 'StatisticsRegionWidget' }
      ],
      getBdCol: () => 2
    }

    CampaignManagerScenarioStatisticsModal.methods.breakpointChanged.call(ctx, {
      newBreakpoint: 'xxs'
    })

    expect(ctx.activeBreakpoint).toBe('xxs')
    expect(ctx.layout[0].x).toBe(0)
    expect(ctx.layout[1].x).toBe(0)
  })

  it('getComponent and getComponentData return defaults for unknown keys', () => {
    const compRegion = CampaignManagerScenarioStatisticsModal.methods.getComponent.call(
      {},
      'StatisticsRegionWidget'
    )
    const compDefault = CampaignManagerScenarioStatisticsModal.methods.getComponent.call(
      {},
      'UnknownWidget'
    )
    expect(compRegion).toBeDefined()
    expect(compDefault).toBe(compRegion)

    const ctx = {
      data: {
        region: [1],
        language: [2],
        emotion: [3],
        brand: [4],
        attackType: [5],
        industry: [6]
      }
    }
    expect(
      CampaignManagerScenarioStatisticsModal.methods.getComponentData.call(
        ctx,
        'UnknownWidget'
      )
    ).toEqual([6])
  })

  it('handleDrawerClickOutside emits close event', () => {
    const emit = jest.fn()
    CampaignManagerScenarioStatisticsModal.methods.handleDrawerClickOutside.call({
      $emit: emit
    })
    expect(emit).toHaveBeenCalledWith('navigation-drawer-change', false)
  })
})
