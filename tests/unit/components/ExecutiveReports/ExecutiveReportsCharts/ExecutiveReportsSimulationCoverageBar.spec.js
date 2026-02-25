import ExecutiveReportsSimulationCoverageBar from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsSimulationCoverageBar.vue'

describe('ExecutiveReportsSimulationCoverageBar.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsSimulationCoverageBar.name).toBe('ExecutiveReportsSimulationCoverageBar')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsSimulationCoverageBar.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no widget data', () => {
    const ctx = { isEmpty: false, industryAverageObj: {} }
    ExecutiveReportsSimulationCoverageBar.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
    expect(ctx.industryAverageObj).toBeNull()
  })

  it('calculateSimulatedValue scales low simulated counts', () => {
    const scaled = ExecutiveReportsSimulationCoverageBar.methods.calculateSimulatedValue.call(
      {},
      3000,
      1
    )
    expect(scaled).toBeGreaterThan(1)
  })

  it('calculateBiggestValue normalizes upper bounds', () => {
    expect(ExecutiveReportsSimulationCoverageBar.methods.calculateBiggestValue.call({}, 10)).toBe(20)
    expect(ExecutiveReportsSimulationCoverageBar.methods.calculateBiggestValue.call({}, 73)).toBe(80)
    expect(ExecutiveReportsSimulationCoverageBar.methods.calculateBiggestValue.call({}, 121)).toBe(150)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 's2' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsSimulationCoverageBar.methods.handleDelete.call(ctx)
    ExecutiveReportsSimulationCoverageBar.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
