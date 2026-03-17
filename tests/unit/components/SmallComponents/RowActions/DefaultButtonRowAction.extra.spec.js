import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'

describe('DefaultButtonRowAction.vue (extra)', () => {
  describe('null safety - scope/row undefined', () => {
    it('isDisabled returns true when scope is undefined', () => {
      const ctx = { scope: undefined, disabled: false }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled returns true when scope is null', () => {
      const ctx = { scope: null, disabled: false }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled returns true when scope.row is undefined', () => {
      const ctx = { scope: {}, disabled: false }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled returns true when scope.row is null', () => {
      const ctx = { scope: { row: null }, disabled: false }
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })

    it('isDisabled does not throw when scope is missing', () => {
      const ctx = { disabled: false }
      expect(() => DefaultButtonRowAction.computed.isDisabled.call(ctx)).not.toThrow()
      expect(DefaultButtonRowAction.computed.isDisabled.call(ctx)).toBe(true)
    })
  })

  describe('tooltipMessage null safety', () => {
    it('tooltipMessage returns text when scope is undefined and isDisabled', () => {
      const ctx = {
        scope: undefined,
        isDisabled: true,
        text: 'Fast Launch',
        disabledTooltipText: ''
      }
      expect(DefaultButtonRowAction.computed.tooltipMessage.call(ctx)).toBe('Fast Launch')
    })

    it('tooltipMessage returns disabledTooltipText when scope.row is undefined', () => {
      const ctx = {
        scope: {},
        isDisabled: true,
        text: 'Launch',
        disabledTooltipText: 'Disabled'
      }
      expect(DefaultButtonRowAction.computed.tooltipMessage.call(ctx)).toBe('Disabled')
    })
  })

  describe('handleClick null safety', () => {
    it('handleClick does not emit when scope is null', () => {
      const ctx = { $emit: jest.fn(), isDisabled: false, scope: null }
      DefaultButtonRowAction.methods.handleClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })

    it('handleClick does not emit when scope is undefined', () => {
      const ctx = { $emit: jest.fn(), isDisabled: false, scope: undefined }
      DefaultButtonRowAction.methods.handleClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })
  })
})
