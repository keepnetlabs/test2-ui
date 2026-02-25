import ExecutiveReportsUsersTimeToFailure from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsUsersTimeToFailure.vue'

describe('ExecutiveReportsUsersTimeToFailure.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsUsersTimeToFailure.name).toBe('ExecutiveReportsUsersTimeToFailure')
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsUsersTimeToFailure.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when there is no widget data', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsUsersTimeToFailure.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'u1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsUsersTimeToFailure.methods.handleDelete.call(ctx)
    ExecutiveReportsUsersTimeToFailure.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
