import ExecutiveReportsRiskScoreTrendAcrossIndustries from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsRiskScoreTrendAcrossIndustries.vue'

describe('ExecutiveReportsRiskScoreTrendAcrossIndustries.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsRiskScoreTrendAcrossIndustries.name).toBe(
      'ExecutiveReportsRiskScoreTrendAcrossIndustries'
    )
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsRiskScoreTrendAcrossIndustries.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when datasets are empty', () => {
    const ctx = { isEmpty: false, chartData: {}, chartOptions: {}, dateFormat: '' }
    ExecutiveReportsRiskScoreTrendAcrossIndustries.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r2' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsRiskScoreTrendAcrossIndustries.methods.handleDelete.call(ctx)
    ExecutiveReportsRiskScoreTrendAcrossIndustries.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
