import ExecutiveReportsPhishingSimulationEngagement from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsPhishingSimulationEngagement.vue'
import { createExecutiveReportChartData } from '@/components/ExecutiveReports/ExecutiveReportsWidget/utils'

jest.mock('@/components/ExecutiveReports/ExecutiveReportsWidget/utils', () => ({
  createExecutiveReportChartData: jest.fn(() => ({ valueEnums: [], datasets: [] }))
}))

describe('ExecutiveReportsPhishingSimulationEngagement.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('setChartData marks empty when no widget data exists', () => {
    const ctx = { isEmpty: false }

    ExecutiveReportsPhishingSimulationEngagement.methods.setChartData.call(ctx, [])

    expect(ctx.isEmpty).toBe(true)
  })

  it('setChartData marks empty when utility returns no datasets', () => {
    const ctx = { isEmpty: false, dateFormat: '', chartData: {}, chartOptions: {} }
    createExecutiveReportChartData.mockReturnValueOnce({ valueEnums: [], datasets: [] })

    ExecutiveReportsPhishingSimulationEngagement.methods.setChartData.call(ctx, [
      { widgetDatas: [{ values: [{ name: 'v', value: 1 }] }] }
    ])

    expect(createExecutiveReportChartData).toHaveBeenCalled()
    expect(ctx.isEmpty).toBe(true)
  })

  it('setChartData builds datasets and chart options', () => {
    const ctx = { isEmpty: true, dateFormat: 'MM/YYYY', chartData: {}, chartOptions: {} }
    createExecutiveReportChartData.mockReturnValueOnce({
      valueEnums: [
        'Users Who Did Not Reported (%)',
        'Users Who Did Not Click And Reported (%)',
        'Users Who Clicked And Reported (%)'
      ],
      datasets: [
        { result: 'Users Who Did Not Reported (%)', y: 30, x: '01/2026' },
        { result: 'Users Who Did Not Click And Reported (%)', y: 50, x: '01/2026' },
        { result: 'Users Who Clicked And Reported (%)', y: 20, x: '01/2026' }
      ]
    })

    ExecutiveReportsPhishingSimulationEngagement.methods.setChartData.call(ctx, [
      { widgetDatas: [{ values: [{ name: 'v', value: 1 }] }] }
    ])

    expect(ctx.isEmpty).toBe(false)
    expect(ctx.chartData.datasets).toHaveLength(3)
    expect(ctx.chartOptions.scales.yAxes[0].ticks.max).toBe(100)
  })
})
