jest.mock('@/api/reports', () => ({
  __esModule: true,
  getExecutiveReportMetrics: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          metrics: [{ name: 'M1', widgets: [{ name: 'W1', isAdded: false }] }]
        }
      }
    })
  ),
  getExecutiveReportLogo: jest.fn(() => Promise.reject(new Error('not found'))),
  getReportSchedulingLogo: jest.fn(() => Promise.resolve({ data: { size: 0 } }))
}))

import NewExecutiveReportCommonContainer from '@/components/ExecutiveReports/NewExecutiveReportCommonContainer.vue'
import { getExecutiveReportMetrics } from '@/api/reports'

describe('NewExecutiveReportCommonContainer.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(NewExecutiveReportCommonContainer.name).toBe('NewExecutiveReportCommonContainer')
  })

  it('visibleCards keeps cards with widgets only', () => {
    const result = NewExecutiveReportCommonContainer.computed.visibleCards.call({
      cards: [{ widgets: [{ name: 'A' }] }, { widgets: [] }]
    })
    expect(result).toHaveLength(1)
  })

  it('filteredCards filters by search text', () => {
    const ctx = {
      search: 'risk',
      visibleCards: [{ widgets: [{ name: 'Risk Widget' }, { name: 'Other Widget' }] }]
    }
    const result = NewExecutiveReportCommonContainer.computed.filteredCards.call(ctx)
    expect(result[0].widgets).toHaveLength(1)
    expect(result[0].widgets[0].name).toBe('Risk Widget')
  })

  it('hasManagerMetricAdded and hasNonManagerMetricAdded compute flags', () => {
    const cards = [{ widgets: [{ isSupportManager: true, isAdded: true }] }]
    expect(
      NewExecutiveReportCommonContainer.computed.hasManagerMetricAdded.call({ visibleCards: cards })
    ).toBe(true)
    expect(
      NewExecutiveReportCommonContainer.computed.hasNonManagerMetricAdded.call({
        visibleCards: [{ widgets: [{ isSupportManager: false, isAdded: true }] }]
      })
    ).toBe(true)
  })

  it('callForMetrics loads cards', async () => {
    const ctx = {
      cards: [],
      setLoading: jest.fn()
    }
    NewExecutiveReportCommonContainer.methods.callForMetrics.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(getExecutiveReportMetrics).toHaveBeenCalled()
    expect(ctx.cards).toHaveLength(1)
  })

  it('handleDeleteWidget resets matching widget isAdded flag', () => {
    const widget = { widgetType: 'k1', chartType: 'bar', isAdded: true }
    const ctx = {
      cards: [{ widgets: [widget] }],
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }
    NewExecutiveReportCommonContainer.methods.handleDeleteWidget.call(ctx, {
      key: 'k1',
      chartType: 'bar'
    })
    expect(widget.isAdded).toBe(false)
  })

  it('handleLayoutGet marks found widgets as added', () => {
    const widget = { resourceId: 'w1', isAdded: false }
    const ctx = {
      cards: [{ widgets: [widget] }],
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }
    NewExecutiveReportCommonContainer.methods.handleLayoutGet.call(ctx, [{ resourceId: 'w1' }])
    expect(widget.isAdded).toBe(true)
  })
})
