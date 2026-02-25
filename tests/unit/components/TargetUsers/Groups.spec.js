jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  createTargetGroup: jest.fn(() => Promise.resolve()),
  updateTargetGroup: jest.fn(() => Promise.resolve()),
  deleteTargetGroup: jest.fn(() => Promise.resolve()),
  exportTargetGroups: jest.fn(() => Promise.resolve())
}))

import Groups from '@/components/TargetUsers/Groups.vue'

describe('TargetUsers Groups.vue', () => {
  it('getGroupNameTooltipMessage returns empty when no row name', () => {
    const ctx = {}
    expect(Groups.methods.getGroupNameTooltipMessage.call(ctx, {})).toBe('')
  })

  it('getGroupNameTooltipMessage returns Repeat Offenders message', () => {
    const ctx = {}
    const msg = Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'Repeat Offenders' })
    expect(msg).toContain('Repeat Offenders')
    expect(msg).toContain('phishing campaigns')
  })

  it('getGroupNameTooltipMessage returns New Hires message', () => {
    const ctx = {}
    const msg = Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'New Hires' })
    expect(msg).toContain('New hires')
    expect(msg).toContain('90 days')
  })

  it('getGroupNameTooltipMessage returns Non-Simulated Users message', () => {
    const ctx = {}
    const msg = Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'Non-Simulated Users' })
    expect(msg).toContain('simulations')
  })

  it('getGroupNameTooltipMessage returns Untrained Users message', () => {
    const ctx = {}
    const msg = Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'Untrained Users' })
    expect(msg).toContain('training')
  })

  it('getGroupNameTooltipMessage returns empty for unknown group', () => {
    const ctx = {}
    expect(Groups.methods.getGroupNameTooltipMessage.call(ctx, { name: 'Custom Group' })).toBe('')
  })

  it('getAddUsersToGroupButtonTooltipMessage returns SCIM message when isCheckSCIM', () => {
    const ctx = {}
    expect(
      Groups.methods.getAddUsersToGroupButtonTooltipMessage.call(ctx, { name: 'G1', isScimGroup: true }, true)
    ).toContain('SCIM')
  })

  it('getAddUsersToGroupButtonTooltipMessage returns Google message for Google group', () => {
    const ctx = {}
    expect(
      Groups.methods.getAddUsersToGroupButtonTooltipMessage.call(ctx, { name: 'G1', isGoogleGroup: true })
    ).toContain('Google')
  })

  it('getDeleteButtonTooltipMessage returns message for Repeat Offenders', () => {
    const ctx = {}
    expect(
      Groups.methods.getDeleteButtonTooltipMessage.call(ctx, { name: 'Repeat Offenders' })
    ).toContain('deleted')
  })

  it('isTooltipRenderable returns true for SCIM group when isCheckSCIM', () => {
    const ctx = {}
    expect(Groups.methods.isTooltipRenderable.call(ctx, { isScimGroup: true }, true)).toBe(true)
  })

  it('isTooltipRenderable returns true for system groups', () => {
    const ctx = {}
    expect(Groups.methods.isTooltipRenderable.call(ctx, { name: 'Repeat Offenders' })).toBe(true)
  })

  it('isTooltipRenderable returns false for custom group', () => {
    const ctx = {}
    expect(Groups.methods.isTooltipRenderable.call(ctx, { name: 'Custom Group' })).toBe(false)
  })

  it('handleDelete sets selectedRow and calls changeDeleteGroupModalStatus', () => {
    const ctx = {
      changeDeleteGroupModalStatus: jest.fn(),
      selectedRow: null
    }
    const row = { resourceId: 'g1' }
    Groups.methods.handleDelete.call(ctx, row)
    expect(ctx.changeDeleteGroupModalStatus).toHaveBeenCalledWith(true)
    expect(ctx.selectedRow).toBe(row)
  })

  it('handleDeleteGroupMultiple calls handleDeleteGroup for each item', () => {
    const handleDeleteGroup = jest.fn()
    const ctx = { handleDeleteGroup }
    const selection = [{ resourceId: 'g1' }, { resourceId: 'g2' }]
    Groups.methods.handleDeleteGroupMultiple.call(ctx, selection)
    expect(handleDeleteGroup).toHaveBeenCalledTimes(2)
  })
})
