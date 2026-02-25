jest.mock('@/utils/functions', () => ({
  __esModule: true,
  createRandomCryptStringNumber: jest.fn(() => '123')
}))

import WidgetList from '@/components/Common/Widget/WidgetList.vue'

describe('WidgetList.vue', () => {
  it('has correct component name', () => {
    expect(WidgetList.name).toBe('WidgetList')
  })

  it('getTableStyle uses auto flag', () => {
    expect(WidgetList.computed.getTableStyle.call({ auto: true })).toBe('table-layout:auto')
    expect(WidgetList.computed.getTableStyle.call({ auto: false })).toBe('table-layout:fixed')
  })

  it('getTableStatus reflects data availability', () => {
    expect(WidgetList.computed.getTableStatus.call({ data: [{ id: 1 }] })).toBe(true)
    expect(WidgetList.computed.getTableStatus.call({ data: [] })).toBe(false)
  })

  it('getThClass builds normalized class suffix from label', () => {
    expect(WidgetList.methods.getThClass.call({}, { label: 'Last Name' })).toBe(
      'k-widget-list__th-lastname'
    )
    expect(WidgetList.methods.getThClass.call({}, {})).toBe('k-widget-list__th')
  })

  it('onEmptyBtnClicked emits event', () => {
    const $emit = jest.fn()
    WidgetList.methods.onEmptyBtnClicked.call({ $emit })
    expect($emit).toHaveBeenCalledWith('onEmptyBtnClicked')
  })

  it('handleMouseLeaveTd hides overflow tooltip', () => {
    const ctx = { showOverFlowTooltip: true }
    WidgetList.methods.handleMouseLeaveTd.call(ctx)
    expect(ctx.showOverFlowTooltip).toBe(false)
  })
})
