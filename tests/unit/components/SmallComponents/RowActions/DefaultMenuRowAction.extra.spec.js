import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'

describe('DefaultMenuRowAction.vue (extra)', () => {
  describe('null safety - scope/row undefined', () => {
    it('isDisabled returns true when scope is undefined', () => {
      const ctx = { scope: undefined, disabled: false }
      expect(DefaultMenuRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled returns true when scope is null', () => {
      const ctx = { scope: null, disabled: false }
      expect(DefaultMenuRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled returns true when scope.row is undefined', () => {
      const ctx = { scope: {}, disabled: false }
      expect(DefaultMenuRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled returns true when scope.row is null', () => {
      const ctx = { scope: { row: null }, disabled: false }
      expect(DefaultMenuRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled does not throw when scope is missing', () => {
      const ctx = { disabled: false }
      expect(() => DefaultMenuRowAction.computed.isDisabled.call(ctx)).not.toThrow()
      expect(DefaultMenuRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })
  })

  describe('onClick null safety', () => {
    it('onClick does not emit when scope is null', () => {
      const ctx = { scope: null, isDisabled: false, $emit: jest.fn() }
      DefaultMenuRowAction.methods.onClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })

    it('onClick does not emit when scope is undefined', () => {
      const ctx = { scope: undefined, isDisabled: false, $emit: jest.fn() }
      DefaultMenuRowAction.methods.onClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })
  })

  describe('isDisabled with checkIsOwnerProperty false (Agentic row actions)', () => {
    it('ignores isOwner when checkIsOwnerProperty is false', () => {
      const ctx = {
        scope: { row: { isOwner: false } },
        disabled: false,
        checkIsOwnerProperty: false
      }
      expect(DefaultMenuRowAction.computed.isDisabled.call(ctx)).toBe(false)
    })

    it('uses disabled prop when checkIsOwnerProperty is false', () => {
      const ctx = {
        scope: { row: { isOwner: true } },
        disabled: true,
        checkIsOwnerProperty: false
      }
      expect(DefaultMenuRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })
  })

  describe('canRenderTooltip edge cases', () => {
    it('is false when both showTooltip and isDisabled are false', () => {
      const ctx = { showTooltip: false, isDisabled: false }
      expect(DefaultMenuRowAction.computed.canRenderTooltip.call(ctx)).toBe(false)
    })
  })
})
