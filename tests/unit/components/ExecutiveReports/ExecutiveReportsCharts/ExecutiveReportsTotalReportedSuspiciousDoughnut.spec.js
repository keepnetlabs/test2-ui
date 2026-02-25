import ExecutiveReportsTotalReportedSuspiciousDoughnut from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTotalReportedSuspiciousDoughnut.vue'

describe('ExecutiveReportsTotalReportedSuspiciousDoughnut.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTotalReportedSuspiciousDoughnut.name).toBe(
      'ExecutiveReportsTotalReportedSuspiciousDoughnut'
    )
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTotalReportedSuspiciousDoughnut.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no valid values', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsTotalReportedSuspiciousDoughnut.methods.setChartData.call(ctx, [
      { widgetDatas: [] }
    ])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r2' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTotalReportedSuspiciousDoughnut.methods.handleDelete.call(ctx)
    ExecutiveReportsTotalReportedSuspiciousDoughnut.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
