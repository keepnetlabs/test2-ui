import ExecutiveReportsTopRiskiestUsers from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTopRiskiestUsers.vue'

describe('ExecutiveReportsTopRiskiestUsers.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTopRiskiestUsers.name).toBe('ExecutiveReportsTopRiskiestUsers')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTopRiskiestUsers.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no widget data', () => {
    const ctx = { isEmpty: false, chartOptions: {}, chartData: {} }
    ExecutiveReportsTopRiskiestUsers.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'u1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTopRiskiestUsers.methods.handleDelete.call(ctx)
    ExecutiveReportsTopRiskiestUsers.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
