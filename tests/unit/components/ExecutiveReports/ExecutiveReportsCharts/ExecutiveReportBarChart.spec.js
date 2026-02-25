import ExecutiveReportBarChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportBarChart.vue'
import { CHART_COLORS } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

describe('ExecutiveReportBarChart.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportBarChart.name).toBe('ExecutiveReportBarChart')
  })

  it('calculateData sets chart data and options when dataset exists', () => {
    const key = Object.keys(CHART_COLORS)[0]
    const ctx = {
      rawData: {
        valueEnums: [key],
        datasets: [{ result: key, x: '2026-01-01', y: 2 }]
      },
      months: ['Jan'],
      chartOptions: {},
      chartData: {},
      timeUnit: 'month',
      getTimeUnitLabel: jest.fn(() => 'Month')
    }
    ExecutiveReportBarChart.methods.calculateData.call(ctx)
    expect(ctx.chartData.datasets).toHaveLength(1)
    expect(ctx.chartData.datasets[0].data).toHaveLength(1)
    expect(ctx.chartOptions.scales.xAxes[0].time.unit).toBe('month')
    expect(ctx.getTimeUnitLabel).toHaveBeenCalled()
  })

  it('timeUnit watcher triggers calculateData', () => {
    const ctx = { calculateData: jest.fn() }
    ExecutiveReportBarChart.watch.timeUnit.call(ctx)
    expect(ctx.calculateData).toHaveBeenCalled()
  })
})
