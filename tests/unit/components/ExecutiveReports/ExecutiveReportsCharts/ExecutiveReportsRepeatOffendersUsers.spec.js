import ExecutiveReportsRepeatOffendersUsers from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsRepeatOffendersUsers.vue'

describe('ExecutiveReportsRepeatOffendersUsers.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsRepeatOffendersUsers.name).toBe('ExecutiveReportsRepeatOffendersUsers')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsRepeatOffendersUsers.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no widget data', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsRepeatOffendersUsers.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsRepeatOffendersUsers.methods.handleDelete.call(ctx)
    ExecutiveReportsRepeatOffendersUsers.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
