import ExecutiveReportsSimulationCoverage from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsSimulationCoverage.vue'

describe('ExecutiveReportsSimulationCoverage.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsSimulationCoverage.name).toBe('ExecutiveReportsSimulationCoverage')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsSimulationCoverage.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no widget data', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsSimulationCoverage.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 's1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsSimulationCoverage.methods.handleDelete.call(ctx)
    ExecutiveReportsSimulationCoverage.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
