import ExecutiveReportAvgPhishingSimClickerRate from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportAvgPhishingSimClickerRate.vue'

describe('ExecutiveReportAvgPhishingSimClickerRate.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportAvgPhishingSimClickerRate.name).toBe(
      'ExecutiveReportAvgPhishingSimClickerRate'
    )
  })

  it('setChartData marks widget as empty when no widget data', () => {
    const ctx = {
      isEmpty: false,
      industryAverageObj: {},
      isLoading: true
    }
    ExecutiveReportAvgPhishingSimClickerRate.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
    expect(ctx.industryAverageObj).toBeNull()
  })

  it('handleDelete and handleEdit emit events with card', () => {
    const card = { resourceId: 'w1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportAvgPhishingSimClickerRate.methods.handleDelete.call(ctx)
    ExecutiveReportAvgPhishingSimClickerRate.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportAvgPhishingSimClickerRate.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })
})
