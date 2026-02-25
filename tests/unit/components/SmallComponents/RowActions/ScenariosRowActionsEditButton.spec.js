import ScenariosRowActionsEditButton from '@/components/SmallComponents/RowActions/ScenariosRowActionsEditButton.vue'

describe('ScenariosRowActionsEditButton.vue', () => {
  it('getTooltipMessage returns name when row.isOwner', () => {
    const ctx = { scope: { row: { isOwner: true } }, name: 'Edit' }
    expect(ScenariosRowActionsEditButton.computed.getTooltipMessage.call(ctx)).toBe('Edit')
  })

  it('getDisabledStatusOfAction returns true when not owner', () => {
    const ctx = { scope: { row: { isOwner: false } }, disabled: false }
    expect(ScenariosRowActionsEditButton.computed.getDisabledStatusOfAction.call(ctx)).toBe(true)
  })
})
