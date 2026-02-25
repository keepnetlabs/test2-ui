jest.mock('@/utils/functions', () => ({
  __esModule: true,
  createRandomCryptStringNumber: jest.fn(() => 'abc123')
}))

import ExecutiveReportTable from '@/components/ExecutiveReports/ExecutiveReportTable.vue'

describe('ExecutiveReportTable.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportTable.name).toBe('ExecutiveReportTable')
  })

  it('computed table style and status works', () => {
    expect(ExecutiveReportTable.computed.getTableStyle.call({ auto: true })).toBe('table-layout:auto')
    expect(ExecutiveReportTable.computed.getTableStatus.call({ data: [1] })).toBe(true)
  })

  it('getThClass maps labels to class names', () => {
    const result = ExecutiveReportTable.methods.getThClass.call({}, { label: 'My Label' })
    expect(result).toBe('k-widget-list__th-mylabel')
  })

  it('onEmptyBtnClicked emits event', () => {
    const ctx = { $emit: jest.fn() }
    ExecutiveReportTable.methods.onEmptyBtnClicked.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('onEmptyBtnClicked')
  })

  it('handleMouseLeaveTd hides overflow tooltip', () => {
    const ctx = { showOverFlowTooltip: true }
    ExecutiveReportTable.methods.handleMouseLeaveTd.call(ctx)
    expect(ctx.showOverFlowTooltip).toBe(false)
  })
})
