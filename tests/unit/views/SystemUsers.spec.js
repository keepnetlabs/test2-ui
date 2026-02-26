import SystemUsers from '@/views/SystemUsers.vue'

describe('SystemUsers.vue', () => {
  it('created switches tab to roles when people permission is missing', () => {
    const ctx = {
      tab: 'system-users--people',
      getSystemUsersSearchPermission: false,
      getSystemRolesSearchPermission: true
    }
    SystemUsers.created.call(ctx)
    expect(ctx.tab).toBe('system-users--roles')
  })

  it('created keeps people tab when condition does not match', () => {
    const ctx = {
      tab: 'system-users--people',
      getSystemUsersSearchPermission: true,
      getSystemRolesSearchPermission: true
    }
    SystemUsers.created.call(ctx)
    expect(ctx.tab).toBe('system-users--people')
  })

  it('changeTabStatus updates current tab', () => {
    const ctx = { tab: 'system-users--people' }
    SystemUsers.methods.changeTabStatus.call(ctx, 'system-users--roles')
    expect(ctx.tab).toBe('system-users--roles')
  })

  it('beforeRouteLeave handles people modal, permissions modal and allow branch', () => {
    const next = jest.fn()

    const peopleCtx = {
      $refs: {
        refPeople: {
          showCreateOrEditSystemUserModal: true,
          checkIfCanCloseSystemUserModal: jest.fn()
        }
      }
    }
    SystemUsers.beforeRouteLeave.call(peopleCtx, {}, {}, next)
    expect(peopleCtx.$refs.refPeople.checkIfCanCloseSystemUserModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const permissionsCtx = {
      $refs: {
        refPermissions: {
          newPermissionsModalStatus: true,
          checkIfCanClosePermissionsModal: jest.fn()
        }
      }
    }
    SystemUsers.beforeRouteLeave.call(permissionsCtx, {}, {}, next)
    expect(permissionsCtx.$refs.refPermissions.checkIfCanClosePermissionsModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    SystemUsers.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })
})

