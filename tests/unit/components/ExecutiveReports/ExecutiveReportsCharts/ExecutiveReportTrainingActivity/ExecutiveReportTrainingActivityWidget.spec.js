import ExecutiveReportTrainingActivityWidget from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportTrainingActivity/ExecutiveReportTrainingActivityWidget.vue'

describe('ExecutiveReportTrainingActivityWidget.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportTrainingActivityWidget.name).toBe('ExecutiveReportPhisihingActivityWidget')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportTrainingActivityWidget.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state for invalid payload', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportTrainingActivityWidget.methods.setChartData.call(ctx, null)
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { id: 'w1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportTrainingActivityWidget.methods.handleDelete.call(ctx)
    ExecutiveReportTrainingActivityWidget.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
