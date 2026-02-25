import ExecutiveReportPhishingAndQuickResponseTime from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportPhishingAndQuickResponseTime.vue'

describe('ExecutiveReportPhishingAndQuickResponseTime.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportPhishingAndQuickResponseTime.name).toBe(
      'ExecutiveReportPhishingAndQuickResponseTime'
    )
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportPhishingAndQuickResponseTime.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when widget data is empty', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportPhishingAndQuickResponseTime.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'p1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportPhishingAndQuickResponseTime.methods.handleDelete.call(ctx)
    ExecutiveReportPhishingAndQuickResponseTime.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
