jest.mock('@/api/targetUsers', () => ({
  bulkImportTargetUsersToGroups: jest.fn(() => Promise.resolve())
}))

import TargetGroupUsersAddUsersModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddUsersModal.vue'

describe('TargetGroupUsersAddUsersModal.vue', () => {
  it('getTitle returns title with group name', () => {
    const ctx = { groupName: 'Sales' }
    const result = TargetGroupUsersAddUsersModal.computed.getTitle.call(ctx)
    expect(result).toContain('Add Users To')
    expect(result).toContain('Sales')
    expect(result).toContain('Group')
  })

  it('getConfirmButtonDisabled returns true when saveDisable', () => {
    const ctx = {
      saveDisable: true,
      payload: { targetUserResourceIds: ['u1'], selectAll: false }
    }
    expect(TargetGroupUsersAddUsersModal.computed.getConfirmButtonDisabled.call(ctx)).toBe(true)
  })

  it('getConfirmButtonDisabled returns true when no selection', () => {
    const ctx = {
      saveDisable: false,
      payload: { targetUserResourceIds: [], selectAll: false }
    }
    expect(TargetGroupUsersAddUsersModal.computed.getConfirmButtonDisabled.call(ctx)).toBe(true)
  })

  it('getConfirmButtonDisabled returns false when selectAll is true', () => {
    const ctx = {
      saveDisable: false,
      payload: { targetUserResourceIds: [], selectAll: true }
    }
    expect(TargetGroupUsersAddUsersModal.computed.getConfirmButtonDisabled.call(ctx)).toBe(false)
  })

  it('getConfirmButtonDisabled returns false when has targetUserResourceIds', () => {
    const ctx = {
      saveDisable: false,
      payload: { targetUserResourceIds: ['u1'], selectAll: false }
    }
    expect(TargetGroupUsersAddUsersModal.computed.getConfirmButtonDisabled.call(ctx)).toBe(false)
  })

  it('closeOverlay emits closeOverlay', () => {
    const ctx = { $emit: jest.fn() }
    TargetGroupUsersAddUsersModal.methods.closeOverlay.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('closeOverlay')
  })
})
