import ExecutiveReportPhishingActivity from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportPhishingActivity/ExecutiveReportPhishingActivity.vue'

describe('ExecutiveReportPhishingActivity.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportPhishingActivity.name).toBe('ExecutiveReportPhishingActivity')
  })

  it('defaultWidgetData watcher updates local widget data', () => {
    const ctx = { localWidgetData: null }
    ExecutiveReportPhishingActivity.watch.defaultWidgetData.handler.call(ctx, { a: 1 })
    expect(ctx.localWidgetData).toEqual({ a: 1 })
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { id: 'c1' }
    const ctx = { $emit: jest.fn() }
    ExecutiveReportPhishingActivity.methods.handleDelete.call(ctx, card)
    ExecutiveReportPhishingActivity.methods.handleEdit.call(ctx, card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })

  it('handleSetDefaultWidgetData updates local data and emits payload', () => {
    const ctx = { localWidgetData: null, $emit: jest.fn() }
    ExecutiveReportPhishingActivity.methods.handleSetDefaultWidgetData.call(ctx, 'k1', { b: 2 })
    expect(ctx.localWidgetData).toEqual({ b: 2 })
    expect(ctx.$emit).toHaveBeenCalledWith('on-set-default-widget-data', 'k1', { b: 2 })
  })

  it('handlePaginationChange emits pagination event', () => {
    const ctx = { $emit: jest.fn() }
    ExecutiveReportPhishingActivity.methods.handlePaginationChange.call(ctx, { id: 1 }, 25)
    expect(ctx.$emit).toHaveBeenCalledWith('on-pagination-change', { id: 1 }, 25)
  })
})
