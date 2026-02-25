import ExecutiveReportsTotalReportedSuspiciousPie from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTotalReportedSuspiciousPie.vue'

describe('ExecutiveReportsTotalReportedSuspiciousPie.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTotalReportedSuspiciousPie.name).toBe(
      'ExecutiveReportsTotalReportedSuspiciousPie'
    )
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTotalReportedSuspiciousPie.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no data', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsTotalReportedSuspiciousPie.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r3' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTotalReportedSuspiciousPie.methods.handleDelete.call(ctx)
    ExecutiveReportsTotalReportedSuspiciousPie.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
