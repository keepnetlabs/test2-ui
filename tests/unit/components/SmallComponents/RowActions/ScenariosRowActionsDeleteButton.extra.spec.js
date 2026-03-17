import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton.vue'

describe('ScenariosRowActionsDeleteButton.vue (extra)', () => {
  describe('null safety - scope/row undefined', () => {
    it('getTooltipMessage returns name when scope is undefined', () => {
      const ctx = { scope: undefined, name: 'Delete' }
      expect(ScenariosRowActionsDeleteButton.computed.getTooltipMessage.call(ctx)).toBe('Delete')
    })

    it('getTooltipMessage returns name when scope.row is undefined', () => {
      const ctx = { scope: {}, name: 'Delete' }
      expect(ScenariosRowActionsDeleteButton.computed.getTooltipMessage.call(ctx)).toBe('Delete')
    })

    it('getDisabledStatusOfAction returns true when scope is undefined', () => {
      const ctx = { scope: undefined, disabled: false }
      expect(ScenariosRowActionsDeleteButton.computed.getDisabledStatusOfAction.call(ctx)).toBe(true)
    })

    it('getDisabledStatusOfAction returns true when scope.row is undefined', () => {
      const ctx = { scope: {}, disabled: false }
      expect(ScenariosRowActionsDeleteButton.computed.getDisabledStatusOfAction.call(ctx)).toBe(true)
    })

    it('getTooltipMessage does not throw when scope is null', () => {
      const ctx = { scope: null, name: 'Delete' }
      expect(() => ScenariosRowActionsDeleteButton.computed.getTooltipMessage.call(ctx)).not.toThrow()
      expect(ScenariosRowActionsDeleteButton.computed.getTooltipMessage.call(ctx)).toBe('Delete')
    })
  })

  describe('onDeleteClick', () => {
    it('onDeleteClick emits on-click when row is valid and not disabled', () => {
      const row = { resourceId: 's-1', isOwner: true }
      const ctx = {
        scope: { row },
        disabled: false,
        getDisabledStatusOfAction: false,
        $emit: jest.fn()
      }
      ScenariosRowActionsDeleteButton.methods.onDeleteClick.call(ctx)
      expect(ctx.$emit).toHaveBeenCalledWith('on-click', row)
    })

    it('onDeleteClick does not emit when scope is null', () => {
      const ctx = {
        scope: null,
        getDisabledStatusOfAction: false,
        $emit: jest.fn()
      }
      ScenariosRowActionsDeleteButton.methods.onDeleteClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })

    it('onDeleteClick does not emit when scope.row is undefined', () => {
      const ctx = {
        scope: {},
        getDisabledStatusOfAction: false,
        $emit: jest.fn()
      }
      ScenariosRowActionsDeleteButton.methods.onDeleteClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })

    it('onDeleteClick does not emit when getDisabledStatusOfAction is true', () => {
      const ctx = {
        scope: { row: { resourceId: 's-1' } },
        getDisabledStatusOfAction: true,
        $emit: jest.fn()
      }
      ScenariosRowActionsDeleteButton.methods.onDeleteClick.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })
  })
})
