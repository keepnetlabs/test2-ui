import ExecutiveReportPieChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportPieChart.vue'

describe('ExecutiveReportPieChart.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportPieChart.name).toBe('ExecutiveReportPieChart')
  })

  it('calculateData sets chart options and data', () => {
    const rawData = [2, 3]
    const valueEnums = ['Clicked', 'Opened Attachment']
    const ctx = {
      rawData,
      valueEnums,
      chartOptions: {},
      chartData: []
    }
    ExecutiveReportPieChart.methods.calculateData.call(ctx)
    expect(ctx.chartOptions.labels).toEqual(valueEnums)
    expect(ctx.chartOptions.showTooltipLine).toBe(true)
    expect(ctx.chartData).toEqual(rawData)
  })
})
