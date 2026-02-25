import ExecutiveReportTrainingActivity from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportTrainingActivity/ExecutiveReportTrainingActivity.vue'

describe('ExecutiveReportTrainingActivity.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportTrainingActivity.name).toBe('ExecutiveReportTrainingActivity')
  })

  it('defaultWidgetData watcher updates localWidgetData', () => {
    const ctx = { localWidgetData: null }
    ExecutiveReportTrainingActivity.watch.defaultWidgetData.handler.call(ctx, { a: 1 })
    expect(ctx.localWidgetData).toEqual({ a: 1 })
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { id: 'c1' }
    const ctx = { $emit: jest.fn() }
    ExecutiveReportTrainingActivity.methods.handleDelete.call(ctx, card)
    ExecutiveReportTrainingActivity.methods.handleEdit.call(ctx, card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })

  it('handleSetDefaultWidgetData updates local and emits', () => {
    const ctx = { localWidgetData: null, $emit: jest.fn() }
    ExecutiveReportTrainingActivity.methods.handleSetDefaultWidgetData.call(ctx, 'k', { v: 1 })
    expect(ctx.localWidgetData).toEqual({ v: 1 })
    expect(ctx.$emit).toHaveBeenCalledWith('on-set-default-widget-data', 'k', { v: 1 })
  })

  it('handlePaginationChange emits pagination event', () => {
    const ctx = { $emit: jest.fn() }
    ExecutiveReportTrainingActivity.methods.handlePaginationChange.call(ctx, { id: 1 }, 20)
    expect(ctx.$emit).toHaveBeenCalledWith('on-pagination-change', { id: 1 }, 20)
  })
})
