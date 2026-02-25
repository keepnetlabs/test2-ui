import ExecutiveReportsTopRiskiestDepartments from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTopRiskiestDepartments.vue'

describe('ExecutiveReportsTopRiskiestDepartments.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTopRiskiestDepartments.name).toBe('ExecutiveReportsTopRiskiestDepartments')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTopRiskiestDepartments.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no widget data', () => {
    const ctx = { isEmpty: false, chartOptions: {}, chartData: {} }
    ExecutiveReportsTopRiskiestDepartments.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'd1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTopRiskiestDepartments.methods.handleDelete.call(ctx)
    ExecutiveReportsTopRiskiestDepartments.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
