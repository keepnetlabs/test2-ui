import ExecutiveReportsTopRiskiestCompanies from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTopRiskiestCompanies.vue'

describe('ExecutiveReportsTopRiskiestCompanies.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTopRiskiestCompanies.name).toBe('ExecutiveReportsTopRiskiestCompanies')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTopRiskiestCompanies.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no widget data', () => {
    const ctx = { isEmpty: false, chartOptions: {}, chartData: {} }
    ExecutiveReportsTopRiskiestCompanies.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'c1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTopRiskiestCompanies.methods.handleDelete.call(ctx)
    ExecutiveReportsTopRiskiestCompanies.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
