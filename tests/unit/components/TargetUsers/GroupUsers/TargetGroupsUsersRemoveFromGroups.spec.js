jest.mock('@/api/targetUsers', () => ({
  deleteTargetGroupUsers: jest.fn(() => Promise.resolve())
}))

import TargetGroupsUsersRemoveFromGroups from '@/components/TargetUsers/GroupUsers/TargetGroupsUsersRemoveFromGroups.vue'

describe('TargetGroupsUsersRemoveFromGroups.vue', () => {
  it('getContent returns singular when one user', () => {
    const ctx = { selectedRows: [{ resourceId: 'u1' }], groupName: 'Group A' }
    const result = TargetGroupsUsersRemoveFromGroups.computed.getContent.call(ctx)
    expect(result).toContain('1 user')
    expect(result).toContain('Group A')
  })

  it('getContent returns plural when multiple users', () => {
    const ctx = {
      selectedRows: [{ resourceId: 'u1' }, { resourceId: 'u2' }],
      groupName: 'Group B'
    }
    const result = TargetGroupsUsersRemoveFromGroups.computed.getContent.call(ctx)
    expect(result).toContain('2 users')
    expect(result).toContain('Group B')
  })

  it('handleClose emits closeDialog', () => {
    const ctx = { $emit: jest.fn() }
    TargetGroupsUsersRemoveFromGroups.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('closeDialog')
  })

  it('handleConfirm calls deleteTargetGroupUsers and emits handleRemoveUsers', async () => {
    const deleteTargetGroupUsers = require('@/api/targetUsers').deleteTargetGroupUsers
    const ctx = {
      resourceId: 'g1',
      selectedRows: [{ resourceId: 'u1' }],
      $emit: jest.fn()
    }
    await TargetGroupsUsersRemoveFromGroups.methods.handleConfirm.call(ctx)
    expect(deleteTargetGroupUsers).toHaveBeenCalledWith('g1', {
      targetUserResourceIds: ['u1']
    })
    expect(ctx.$emit).toHaveBeenCalledWith('handleRemoveUsers')
  })

})
