import ExecutiveReportsAreaChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsAreaChart.vue'

describe('ExecutiveReportsAreaChart.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsAreaChart.name).toBe('ExecutiveReportsAreaChart')
  })

  it('calculateData sets datasets and stacked options', () => {
    const ctx = {
      chartData: {},
      chartOptions: {}
    }
    ExecutiveReportsAreaChart.methods.calculateData.call(ctx)
    expect(ctx.chartData.datasets).toHaveLength(4)
    expect(ctx.chartOptions.scales.xAxes[0].stacked).toBe(true)
    expect(ctx.chartOptions.legend.display).toBe(true)
  })
})
