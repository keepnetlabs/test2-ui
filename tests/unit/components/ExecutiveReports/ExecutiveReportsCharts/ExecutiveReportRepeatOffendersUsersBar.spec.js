import { getExecutiveReportChartData } from '@/api/reports'
import ExecutiveReportRepeatOffendersUsersBar from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportRepeatOffendersUsersBar.vue'

jest.mock('@/api/reports', () => ({
  getExecutiveReportChartData: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

describe('ExecutiveReportRepeatOffendersUsersBar.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('setChartData marks empty when no widget data exists', () => {
    const ctx = { isEmpty: false }

    ExecutiveReportRepeatOffendersUsersBar.methods.setChartData.call(ctx, [])

    expect(ctx.isEmpty).toBe(true)
  })

  it('setChartData builds stacked chart when data exists', () => {
    const ctx = { isEmpty: true, isLoading: true, chartData: {}, chartOptions: {} }

    ExecutiveReportRepeatOffendersUsersBar.methods.setChartData.call(ctx, [
      {
        widgetDatas: [
          {
            values: [
              { name: 'CountRepeatOffender', value: 10 },
              { name: 'CountSimulated', value: 90 },
              { name: 'RepeatOffenderPercentage', value: 10 },
              { name: 'PercentageSimulated', value: 90 }
            ]
          }
        ]
      }
    ])

    expect(ctx.isEmpty).toBe(false)
    expect(ctx.chartData.datasets).toHaveLength(2)
    expect(ctx.chartData.datasets[0].data[0]).toBe(10)
  })

  it('callForData requests API and emits cached widget data', async () => {
    const setChartData = jest.fn()
    const ctx = {
      isLoading: false,
      card: { resourceId: 'wid-1', key: 'repeat' },
      datePeriod: 2,
      dateRange: ['2026-01-01', '2026-01-31'],
      $emit: jest.fn(),
      setChartData
    }
    getExecutiveReportChartData.mockResolvedValueOnce({
      data: { data: [{ widgetDatas: [{ values: [{ name: 'PercentageSimulated', value: 100 }] }] }] }
    })

    await ExecutiveReportRepeatOffendersUsersBar.methods.callForData.call(ctx)

    expect(getExecutiveReportChartData).toHaveBeenCalledWith({
      widgetIds: ['wid-1'],
      datePeriod: 2,
      startDate: '2026-01-01',
      endDate: '2026-01-31'
    })
    expect(ctx.$emit).toHaveBeenCalledWith('on-set-default-widget-data', 'repeat', expect.any(Array))
    expect(setChartData).toHaveBeenCalled()
  })
})
