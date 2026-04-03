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

  describe('canRenderTooltip', () => {
    it('is true when showTooltip and isDisabled are both true', () => {
      const ctx = { showTooltip: true, isDisabled: true }
      expect(DefaultMenuRowAction.computed.canRenderTooltip.call(ctx)).toBe(true)
    })

    it('is false when showTooltip is false', () => {
      const ctx = { showTooltip: false, isDisabled: true }
      expect(DefaultMenuRowAction.computed.canRenderTooltip.call(ctx)).toBe(false)
    })

    it('is false when isDisabled is false', () => {
      const ctx = { showTooltip: true, isDisabled: false }
      expect(DefaultMenuRowAction.computed.canRenderTooltip.call(ctx)).toBe(false)
    })
  })
})
