import ExecutiveReportDoughnutChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportDoughnutChart.vue'

describe('ExecutiveReportDoughnutChart.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportDoughnutChart.name).toBe('ExecutiveReportDoughnutChart')
  })

  it('calculateData maps raw data and labels into chartData', () => {
    const ctx = {
      valueEnums: ['Clicked', 'Open Attachment'],
      rawData: [4, 6],
      chartData: {}
    }
    ExecutiveReportDoughnutChart.methods.calculateData.call(ctx)
    expect(ctx.chartData.labels).toEqual(['Clicked', 'Open Attachment'])
    expect(ctx.chartData.datasets[0].data).toEqual([4, 6])
    expect(ctx.chartData.datasets[0].backgroundColor).toHaveLength(2)
  })
})
