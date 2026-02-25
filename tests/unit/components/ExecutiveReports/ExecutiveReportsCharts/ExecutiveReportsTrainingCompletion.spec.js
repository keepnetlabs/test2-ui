import ExecutiveReportsTrainingCompletion from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTrainingCompletion.vue'

describe('ExecutiveReportsTrainingCompletion.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTrainingCompletion.name).toBe('ExecutiveReportsTrainingCompletion')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTrainingCompletion.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when there is no widget data', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsTrainingCompletion.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r4' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTrainingCompletion.methods.handleDelete.call(ctx)
    ExecutiveReportsTrainingCompletion.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
