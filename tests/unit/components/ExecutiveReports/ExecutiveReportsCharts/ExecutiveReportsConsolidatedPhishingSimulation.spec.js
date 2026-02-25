import ExecutiveReportsConsolidatedPhishingSimulation from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsConsolidatedPhishingSimulation.vue'

describe('ExecutiveReportsConsolidatedPhishingSimulation.vue', () => {
  it('created calls calculateData', () => {
    const ctx = { calculateData: jest.fn() }

    ExecutiveReportsConsolidatedPhishingSimulation.created.call(ctx)

    expect(ctx.calculateData).toHaveBeenCalled()
  })

  it('calculateData builds chart data and options', () => {
    const ctx = {}

    ExecutiveReportsConsolidatedPhishingSimulation.methods.calculateData.call(ctx)

    expect(ctx.chartData.labels).toEqual(['January', 'February', 'March', 'April', 'May', 'June', 'July'])
    expect(ctx.chartData.datasets).toHaveLength(8)
    expect(ctx.chartOptions.legend.display).toBe(true)
  })
})
