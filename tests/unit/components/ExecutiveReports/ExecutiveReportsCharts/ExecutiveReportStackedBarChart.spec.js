import ExecutiveReportStackedBarChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportStackedBarChart.vue'

describe('ExecutiveReportStackedBarChart.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportStackedBarChart.name).toBe('ExecutiveReportStackedBarChart')
  })

  it('calculateData builds stacked datasets and options', () => {
    const ctx = {
      rawData: {
        valueEnums: ['Safe', 'Risky'],
        datasets: [
          { result: 'Safe', x: '2026-01-01', y: 2 },
          { result: 'Risky', x: '2026-01-01', y: 1 }
        ]
      },
      chartData: {},
      chartOptions: {},
      months: ['Jan'],
      timeUnit: 'month',
      getTimeUnitLabel: jest.fn(() => 'Month')
    }
    ExecutiveReportStackedBarChart.methods.calculateData.call(ctx)
    expect(ctx.chartData.datasets).toHaveLength(2)
    expect(ctx.chartData.datasets[0].data).toHaveLength(1)
    expect(ctx.chartOptions.scales.xAxes[0].stacked).toBe(true)
    expect(ctx.getTimeUnitLabel).toHaveBeenCalled()
  })

  it('timeUnit watcher triggers calculateData', () => {
    const ctx = { calculateData: jest.fn() }
    ExecutiveReportStackedBarChart.watch.timeUnit.call(ctx)
    expect(ctx.calculateData).toHaveBeenCalled()
  })
})
