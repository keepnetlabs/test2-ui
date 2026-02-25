import ExecutiveReportPhishingActivityWidget from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportPhishingActivity/ExecutiveReportPhishingActivityWidget.vue'

describe('ExecutiveReportPhishingActivityWidget.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportPhishingActivityWidget.name).toBe('ExecutiveReportPhisihingActivityWidget')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportPhishingActivityWidget.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state for invalid payload', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportPhishingActivityWidget.methods.setChartData.call(ctx, null)
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { id: 'p1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportPhishingActivityWidget.methods.handleDelete.call(ctx)
    ExecutiveReportPhishingActivityWidget.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
