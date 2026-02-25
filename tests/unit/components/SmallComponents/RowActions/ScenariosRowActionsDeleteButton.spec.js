import ScenariosRowActionsDeleteButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsDeleteButton.vue'

describe('ScenariosRowActionsDeleteButton.vue', () => {
  it('getTooltipMessage returns name when row.isOwner', () => {
    const ctx = { scope: { row: { isOwner: true } }, name: 'Delete' }
    expect(ScenariosRowActionsDeleteButton.computed.getTooltipMessage.call(ctx)).toBe('Delete')
  })

  it('getTooltipMessage returns auth message when not owner', () => {
    const ctx = { scope: { row: { isOwner: false } }, name: 'Delete' }
    expect(ScenariosRowActionsDeleteButton.computed.getTooltipMessage.call(ctx)).toBe(
      'You are not authorized to delete this template'
    )
  })

  it('getDisabledStatusOfAction returns true when not owner', () => {
    const ctx = { scope: { row: { isOwner: false } }, disabled: false }
    expect(ScenariosRowActionsDeleteButton.computed.getDisabledStatusOfAction.call(ctx)).toBe(true)
  })
})
