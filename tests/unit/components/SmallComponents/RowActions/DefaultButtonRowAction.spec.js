import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'

describe('DefaultButtonRowAction.vue', () => {
  it('isDisabled returns true when row.isOwner is false and checkIsOwnerProperty true', () => {
    const ctx = {
      scope: { row: { isOwner: false } },
      disabled: false,
      checkIsOwnerProperty: true
    }
    expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
  })

  it('isDisabled returns false when row.isOwner is true', () => {
    const ctx = {
      scope: { row: { isOwner: true } },
      disabled: false,
      checkIsOwnerProperty: true
    }
    expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(false)
  })

  it('handleClick emits on-click when not disabled', () => {
    const scope = { row: { isOwner: true } }
    const ctx = { $emit: jest.fn(), isDisabled: false, scope }
    DefaultButtonRowAction.methods.handleClick.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-click', scope)
  })
})
