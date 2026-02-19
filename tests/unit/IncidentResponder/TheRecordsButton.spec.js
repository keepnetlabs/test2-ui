import TheRecordsButton from '@/components/IncidentResponder/TheRecordsButton.vue'

describe('TheRecordsButton.vue', () => {
  const { computed, methods, watch } = TheRecordsButton

  it('getText pluralizes label based on total', () => {
    expect(computed.getText.call({ row: { total: 0 }, label: 'record' })).toBe('0 record')
    expect(computed.getText.call({ row: { total: 1 }, label: 'record' })).toBe('1 record')
    expect(computed.getText.call({ row: { total: 2 }, label: 'record' })).toBe('2 records')
  })

  it('isRenderButton follows isShowButtonWithZeroTotal and total', () => {
    expect(computed.isRenderButton.call({ isShowButtonWithZeroTotal: true, row: { total: 0 } })).toBe(
      true
    )
    expect(
      computed.isRenderButton.call({ isShowButtonWithZeroTotal: false, row: { total: 0 } })
    ).toBe(false)
    expect(
      computed.isRenderButton.call({ isShowButtonWithZeroTotal: false, row: { total: 3 } })
    ).toBe(true)
  })

  it('isIconVisible hides icon when row total equals disabledCount', () => {
    expect(computed.isIconVisible.call({ row: { total: 1 }, disabledCount: 1 })).toEqual({
      visibility: 'hidden'
    })
    expect(computed.isIconVisible.call({ row: { total: 2 }, disabledCount: 1 })).toEqual({
      visibility: 'visible'
    })
  })

  it('row watcher updates disabled state', () => {
    const ctx = { disabledCount: 2, isDisabled: false }

    watch.row.call(ctx, { total: 2 })
    expect(ctx.isDisabled).toBe(true)

    watch.row.call(ctx, { total: 4 })
    expect(ctx.isDisabled).toBe(false)
  })

  it('emits clicked row from handleClick', () => {
    const emit = jest.fn()
    const row = { total: 3 }
    const ctx = { row, $emit: emit }

    methods.handleClick.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-click', row)
  })
})
