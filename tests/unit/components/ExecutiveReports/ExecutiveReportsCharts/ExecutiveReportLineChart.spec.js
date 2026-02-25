import ExecutiveReportLineChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportLineChart.vue'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

describe('ExecutiveReportLineChart.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportLineChart.name).toBe('ExecutiveReportLineChart')
  })

  it('calculateData sets chart data and options when dataset exists', () => {
    const key = Object.keys(CHART_COLORS)[0]
    const ctx = {
      rawData: {
        valueEnums: [key],
        datasets: [{ result: key, x: '2026-01-01', y: 3 }]
      },
      months: ['Jan'],
      chartOptions: {},
      chartData: {},
      timeUnit: 'week',
      getTimeUnitLabel: jest.fn(() => 'Week')
    }
    ExecutiveReportLineChart.methods.calculateData.call(ctx)
    expect(ctx.chartData.datasets).toHaveLength(1)
    expect(ctx.chartData.datasets[0].data).toHaveLength(1)
    expect(ctx.chartOptions.scales.xAxes[0].time.unit).toBe('week')
    expect(ctx.getTimeUnitLabel).toHaveBeenCalled()
  })

  it('timeUnit watcher triggers calculateData', () => {
    const ctx = { calculateData: jest.fn() }
    ExecutiveReportLineChart.watch.timeUnit.call(ctx)
    expect(ctx.calculateData).toHaveBeenCalled()
  })
})
