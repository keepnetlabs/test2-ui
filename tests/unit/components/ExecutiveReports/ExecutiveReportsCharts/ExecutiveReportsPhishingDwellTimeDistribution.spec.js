import ExecutiveReportsPhishingDwellTimeDistribution from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsPhishingDwellTimeDistribution.vue'

describe('ExecutiveReportsPhishingDwellTimeDistribution.vue', () => {
  it('setChartData marks empty when widget data is missing', () => {
    const ctx = { isEmpty: false }

    ExecutiveReportsPhishingDwellTimeDistribution.methods.setChartData.call(ctx, [])

    expect(ctx.isEmpty).toBe(true)
  })

  it('setChartData builds data and options when widget data exists', () => {
    const ctx = {
      chartXScales: [],
      isEmpty: true,
      averageInside: false,
      chartData: {},
      chartOptions: {},
      isLoading: true
    }

    ExecutiveReportsPhishingDwellTimeDistribution.methods.setChartData.call(ctx, [
      {
        dataObject: { ActionRange: '0-5' },
        values: [
          { name: 'AverageDwellTime', value: 3 },
          { name: 'Percentage', value: 45 }
        ]
      },
      {
        dataObject: { ActionRange: '6-10' },
        values: [
          { name: 'AverageDwellTime', value: 3 },
          { name: 'Percentage', value: 10 }
        ]
      }
    ])

    expect(ctx.isEmpty).toBe(false)
    expect(ctx.chartData.datasets).toHaveLength(3)
    expect(ctx.chartOptions.scales.yAxes[0].ticks.max).toBe(100)
  })
})
