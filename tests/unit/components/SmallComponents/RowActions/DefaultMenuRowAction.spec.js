import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'

describe('DefaultMenuRowAction.vue', () => {
  it('isDisabled returns true when row.isOwner is false', () => {
    const ctx = {
      scope: { row: { isOwner: false } },
      disabled: false,
      checkIsOwnerProperty: true
    }
    expect(DefaultMenuRowAction.computed.isDisabled.call(ctx)).toBe(true)
  })

  it('onClick emits on-click when not disabled', () => {
    const scope = { row: { isOwner: true } }
    const ctx = { scope, $emit: jest.fn() }
    DefaultMenuRowAction.methods.onClick.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-click', scope)
  })

  it('onClick does not emit when disabled', () => {
    const ctx = {
      scope: { row: { isOwner: false } },
      disabled: true,
      isDisabled: true,
      $emit: jest.fn()
    }
    DefaultMenuRowAction.methods.onClick.call(ctx)
    expect(ctx.$emit).not.toHaveBeenCalled()
  })
})
