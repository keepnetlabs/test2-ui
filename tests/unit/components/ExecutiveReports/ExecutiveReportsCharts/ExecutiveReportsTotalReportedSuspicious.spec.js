import ExecutiveReportsTotalReportedSuspicious from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTotalReportedSuspicious.vue'

describe('ExecutiveReportsTotalReportedSuspicious.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTotalReportedSuspicious.name).toBe('ExecutiveReportsTotalReportedSuspicious')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTotalReportedSuspicious.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when widget data is missing', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsTotalReportedSuspicious.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTotalReportedSuspicious.methods.handleDelete.call(ctx)
    ExecutiveReportsTotalReportedSuspicious.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
