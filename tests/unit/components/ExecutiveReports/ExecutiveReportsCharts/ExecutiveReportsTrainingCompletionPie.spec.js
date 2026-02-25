import ExecutiveReportsTrainingCompletionPie from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTrainingCompletionPie.vue'

describe('ExecutiveReportsTrainingCompletionPie.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTrainingCompletionPie.name).toBe('ExecutiveReportsTrainingCompletionPie')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTrainingCompletionPie.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no widget data', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsTrainingCompletionPie.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r5' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTrainingCompletionPie.methods.handleDelete.call(ctx)
    ExecutiveReportsTrainingCompletionPie.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
