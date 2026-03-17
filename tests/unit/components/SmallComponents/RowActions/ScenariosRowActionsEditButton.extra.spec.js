import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton.vue'

describe('ScenariosRowActionsEditButton.vue (extra)', () => {
  describe('null safety - scope/row undefined', () => {
    it('getTooltipMessage returns name when scope is undefined', () => {
      const ctx = { scope: undefined, name: 'Edit' }
      expect(ScenariosRowActionsEditButton.computed.getTooltipMessage.call(ctx)).toBe('Edit')
    })

    it('getTooltipMessage returns name when scope.row is undefined', () => {
      const ctx = { scope: {}, name: 'Edit' }
      expect(ScenariosRowActionsEditButton.computed.getTooltipMessage.call(ctx)).toBe('Edit')
    })

    it('getDisabledStatusOfAction returns true when scope is undefined', () => {
      const ctx = { scope: undefined, disabled: false }
      expect(ScenariosRowActionsEditButton.computed.getDisabledStatusOfAction.call(ctx)).toBe(true)
    })

    it('getDisabledStatusOfAction returns true when scope.row is undefined', () => {
      const ctx = { scope: {}, disabled: false }
      expect(ScenariosRowActionsEditButton.computed.getDisabledStatusOfAction.call(ctx)).toBe(true)
    })

    it('getTooltipMessage does not throw when scope is null', () => {
      const ctx = { scope: null, name: 'Edit' }
      expect(() => ScenariosRowActionsEditButton.computed.getTooltipMessage.call(ctx)).not.toThrow()
      expect(ScenariosRowActionsEditButton.computed.getTooltipMessage.call(ctx)).toBe('Edit')
    })
  })

  describe('onEditClick', () => {
    it('onEditClick emits on-click when row is valid and not disabled', () => {
      const row = { resourceId: 's-1', isOwner: true }
      const ctx = {
        scope: { row },
        disabled: false,
        getDisabledStatusOfAction: false,
        $emit: jest.fn()
      }
      ScenariosRowActionsEditButton.methods.onEditClick.call(ctx)
      expect(ctx.$emit).toHaveBeenCalledWith('on-click', row)
    })

    it('onEditClick does not emit when scope is null', () => {
      const ctx = {
        scope: null,
        getDisabledStatusOfAction: false,
        $emit: jest.fn()
      }
      ScenariosRowActionsEditButton.methods.onEditClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })

    it('onEditClick does not emit when scope.row is undefined', () => {
      const ctx = {
        scope: {},
        getDisabledStatusOfAction: false,
        $emit: jest.fn()
      }
      ScenariosRowActionsEditButton.methods.onEditClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })

    it('onEditClick does not emit when getDisabledStatusOfAction is true', () => {
      const ctx = {
        scope: { row: { resourceId: 's-1' } },
        getDisabledStatusOfAction: true,
        $emit: jest.fn()
      }
      ScenariosRowActionsEditButton.methods.onEditClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })
  })
})
