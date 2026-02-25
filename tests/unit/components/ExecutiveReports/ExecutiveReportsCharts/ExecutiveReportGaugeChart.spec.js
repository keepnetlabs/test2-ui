import ExecutiveReportGaugeChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportGaugeChart.vue'

describe('ExecutiveReportGaugeChart.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportGaugeChart.name).toBe('ExecutiveReportGaugeChart')
  })

  it('data includes configured needle and arc settings', () => {
    const data = ExecutiveReportGaugeChart.data.call({ rawData: 65 })
    expect(data.chartOptions.needleValue).toBe(65)
    expect(data.chartOptions.arcDelimiters).toEqual([20, 40, 60, 80])
    expect(data.chartOptions.arcColors).toHaveLength(5)
  })
})
