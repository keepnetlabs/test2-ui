jest.mock('@/api/permissions', () => ({
  createPermissionRoles: jest.fn(() => Promise.resolve()),
  updatePermissionRoles: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    scrollToComponent: jest.fn(),
    isDifferent: jest.fn(() => false),
    createRandomCryptStringNumber: jest.fn(() => '123')
  }
})

import NewPermissions from '@/components/Permissions/NewPermissions.vue'
import { createPermissionRoles, updatePermissionRoles } from '@/api/permissions'
import { scrollToComponent, isDifferent } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('NewPermissions.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('search watcher clears open list when search is empty', () => {
    const ctx = {
      open: ['x'],
      $nextTick: (cb) => cb()
    }

    NewPermissions.watch.search.call(ctx, '')

    expect(ctx.open).toEqual([])
  })

  it('search watcher keeps open list untouched for non-empty value', () => {
    const ctx = {
      open: ['x'],
      $nextTick: jest.fn()
    }

    NewPermissions.watch.search.call(ctx, 'adm')

    expect(ctx.open).toEqual(['x'])
    expect(ctx.$nextTick).not.toHaveBeenCalled()
  })

  it('getPrivilegesItems watcher appends open ids and refreshes tree key', () => {
    const ctx = {
      open: [],
      treeViewKey: 'old'
    }

    NewPermissions.watch.getPrivilegesItems.call(ctx, [
      { permissionResourceId: 'm1' },
      { permissionResourceId: 'm2' }
    ])

    expect(ctx.open).toEqual(['m1', 'm2'])
    expect(ctx.treeViewKey).toBe('scroll-key-123')
  })

  it('computed getPrivilegesItems returns original permissions when search is empty', () => {
    const permissions = [{ permissionResourceId: 'm1', moduleName: 'Users', children: [] }]
    const ctx = {
      search: '',
      permissions,
      getSearchedItems: jest.fn()
    }

    const result = NewPermissions.computed.getPrivilegesItems.call(ctx)

    expect(result).toBe(permissions)
    expect(ctx.getSearchedItems).not.toHaveBeenCalled()
  })

  it('getSearchedItems keeps parent item when child matches search', () => {
    const items = [
      {
        permissionResourceId: 'parent-1',
        moduleName: 'Dashboard',
        children: [
          {
            permissionResourceId: 'child-1',
            groupName: 'User Management',
            children: []
          }
        ]
      }
    ]
    const ctx = {
      search: 'user',
      getSearchedItems: NewPermissions.methods.getSearchedItems
    }

    const result = NewPermissions.methods.getSearchedItems.call(ctx, items)

    expect(result).toHaveLength(1)
    expect(result[0].permissionResourceId).toBe('parent-1')
    expect(result[0].children).toHaveLength(1)
    expect(result[0].children[0].permissionResourceId).toBe('child-1')
  })

  it('submit with valid form in create mode builds payload and calls create handler', () => {
    const createHandler = jest.fn()
    const ctx = {
      $refs: {
        refForm: { validate: () => true },
        refMakeAvailableForNewPermissions: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true,
          getAvailableForValues: jest.fn(() => [{ type: 'MyCompanyOnly' }])
        }
      },
      availableForRequests: [{ id: 'x' }],
      saveDisable: false,
      formValues: {
        name: 'Role A',
        description: 'Desc A',
        permissionResourceIdList: ['p1']
      },
      isEdit: false,
      createPermissionRoles: createHandler,
      updatePermissionRoles: jest.fn()
    }

    NewPermissions.methods.submit.call(ctx)

    expect(ctx.$refs.refMakeAvailableForNewPermissions.validateAvailableFor).toHaveBeenCalledWith([
      { id: 'x' }
    ])
    expect(createHandler).toHaveBeenCalledWith({
      Name: 'Role A',
      Description: 'Desc A',
      AvailableForRequests: [{ type: 'MyCompanyOnly' }],
      PermissionResourceIdList: ['p1']
    })
    expect(ctx.saveDisable).toBe(true)
  })

  it('submit with valid form in edit mode calls update handler', () => {
    const updateHandler = jest.fn()
    const ctx = {
      $refs: {
        refForm: { validate: () => true },
        refMakeAvailableForNewPermissions: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true,
          getAvailableForValues: jest.fn(() => [])
        }
      },
      availableForRequests: [],
      saveDisable: false,
      formValues: {
        name: 'Role B',
        description: 'Desc B',
        permissionResourceIdList: ['p2']
      },
      isEdit: true,
      createPermissionRoles: jest.fn(),
      updatePermissionRoles: updateHandler
    }

    NewPermissions.methods.submit.call(ctx)

    expect(updateHandler).toHaveBeenCalledWith({
      Name: 'Role B',
      Description: 'Desc B',
      AvailableForRequests: [],
      PermissionResourceIdList: ['p2']
    })
  })

  it('submit invalid form scrolls to first error', () => {
    const errorEl = { id: 'e1' }
    const ctx = {
      $refs: {
        refForm: { validate: () => false, $el: { querySelector: () => errorEl } }
      },
      availableForRequests: [],
      saveDisable: true,
      $nextTick: (cb) => cb()
    }

    NewPermissions.methods.submit.call(ctx)

    expect(ctx.saveDisable).toBe(false)
    expect(scrollToComponent).toHaveBeenCalledWith(errorEl)
  })

  it('submit invalid when available-for validation fails', () => {
    const errorEl = { id: 'e2' }
    const ctx = {
      $refs: {
        refForm: { validate: () => true, $el: { querySelector: () => errorEl } },
        refMakeAvailableForNewPermissions: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: false,
          getAvailableForValues: jest.fn(() => [])
        }
      },
      availableForRequests: [{ id: 'bad' }],
      saveDisable: true,
      $nextTick: (cb) => cb()
    }

    NewPermissions.methods.submit.call(ctx)

    expect(ctx.saveDisable).toBe(false)
    expect(scrollToComponent).toHaveBeenCalledWith(errorEl)
  })

  it('createPermissionRoles emits close event and resets button state', async () => {
    const emit = jest.fn()
    const ctx = {
      saveDisable: true,
      $emit: emit
    }

    NewPermissions.methods.createPermissionRoles.call(ctx, { Name: 'Role' })
    await flushPromises()

    expect(createPermissionRoles).toHaveBeenCalledWith({ Name: 'Role' })
    expect(emit).toHaveBeenCalledWith('closeOverlayWithUpdate')
    expect(ctx.saveDisable).toBe(false)
  })

  it('getItemPermissionName returns truthy only when name and description exist', () => {
    expect(
      NewPermissions.methods.getItemPermissionName({
        permissionName: 'View Users',
        permissionDescription: 'Can view users'
      })
    ).toBe('View Users')
    expect(
      NewPermissions.methods.getItemPermissionName({
        permissionName: 'View Users'
      })
    ).toBeFalsy()
  })

  it('updatePermissionRoles emits close event and resets button state', async () => {
    const emit = jest.fn()
    const ctx = {
      saveDisable: true,
      resourceId: 'r-1',
      $emit: emit
    }

    NewPermissions.methods.updatePermissionRoles.call(ctx, { Name: 'Role' })
    await flushPromises()

    expect(updatePermissionRoles).toHaveBeenCalledWith({ Name: 'Role' }, 'r-1')
    expect(emit).toHaveBeenCalledWith('closeOverlayWithUpdate')
    expect(ctx.saveDisable).toBe(false)
  })

  it('getItemSubName falls back across all fields and defaults to No Name', () => {
    expect(NewPermissions.methods.getItemSubName({ permissionDescription: 'desc' })).toBe('desc')
    expect(NewPermissions.methods.getItemSubName({ parentGroupName: 'parent' })).toBe('parent')
    expect(NewPermissions.methods.getItemSubName({ groupName: 'group' })).toBe('group')
    expect(NewPermissions.methods.getItemSubName({ moduleName: 'module' })).toBe('module')
    expect(NewPermissions.methods.getItemSubName({})).toBe('No Name')
  })

  it('mounted in create mode snapshots initial form values', () => {
    const ctx = {
      isEdit: false,
      formValues: { name: null, description: null, permissionResourceIdList: [] }
    }

    NewPermissions.mounted.call(ctx)

    expect(ctx.initialFormValues).toEqual({ name: null, description: null, permissionResourceIdList: [] })
  })

  it('mounted in edit mode maps availableFor list and updates key', () => {
    const ctx = {
      isEdit: true,
      resourceId: 'r-2',
      permissionEditData: {
        name: 'Role C',
        description: 'Desc C',
        permissionResourceIdList: ['p3'],
        availableForList: [{ type: 'T' }]
      },
      $refs: {
        refMakeAvailableForNewPermissions: {
          getAvailableForListFromBackend: jest.fn(() => [{ id: 'mapped' }])
        }
      },
      $nextTick: (cb) => cb(),
      availableForRequests: [],
      availableForKey: 'initial',
      formValues: {}
    }

    NewPermissions.mounted.call(ctx)

    expect(ctx.formValues).toEqual(ctx.permissionEditData)
    expect(ctx.availableForRequests).toEqual([{ id: 'mapped' }])
    expect(ctx.availableForKey).toBe('updatedKey')
    expect(ctx.initialFormValues).toEqual(ctx.permissionEditData)
  })

  it('mounted in edit mode uses default availableFor when mapping is empty', () => {
    const ctx = {
      isEdit: true,
      resourceId: 'r-3',
      permissionEditData: {
        name: 'Role D',
        description: 'Desc D',
        permissionResourceIdList: [],
        availableForList: [{ type: 'T' }]
      },
      $refs: {
        refMakeAvailableForNewPermissions: {
          getAvailableForListFromBackend: jest.fn(() => [])
        }
      },
      $nextTick: (cb) => cb(),
      availableForRequests: [],
      availableForKey: 'initial',
      formValues: {}
    }

    NewPermissions.mounted.call(ctx)

    expect(ctx.availableForRequests).toEqual([
      {
        id: 'MyCompanyOnly',
        label: 'My company only',
        type: 'MyCompanyOnly',
        resourceId: null
      }
    ])
  })

  it('mounted in edit mode uses default availableFor when backend list is empty', () => {
    const ctx = {
      isEdit: true,
      resourceId: 'r-4',
      permissionEditData: {
        name: 'Role E',
        description: 'Desc E',
        permissionResourceIdList: [],
        availableForList: []
      },
      $refs: {},
      $nextTick: (cb) => cb(),
      availableForRequests: [],
      availableForKey: 'initial',
      formValues: {}
    }

    NewPermissions.mounted.call(ctx)

    expect(ctx.availableForRequests).toEqual([
      {
        id: 'MyCompanyOnly',
        label: 'My company only',
        type: 'MyCompanyOnly',
        resourceId: null
      }
    ])
    expect(ctx.availableForKey).toBe('updatedKey')
  })

  it('mounted in edit mode does not overwrite when resourceId is missing', () => {
    const ctx = {
      isEdit: true,
      resourceId: '',
      permissionEditData: {
        name: 'Role X',
        description: 'Desc X',
        permissionResourceIdList: [],
        availableForList: []
      },
      formValues: { name: 'initial' },
      initialFormValues: { name: 'initial' },
      $nextTick: (cb) => cb(),
      $refs: {}
    }

    NewPermissions.mounted.call(ctx)

    expect(ctx.formValues).toEqual({ name: 'initial' })
    expect(ctx.initialFormValues).toEqual({ name: 'initial' })
  })

  it('closeOverlay emits directly when form is unchanged', () => {
    isDifferent.mockReturnValueOnce(false)
    const emit = jest.fn()
    const ctx = {
      formValues: { name: 'x' },
      initialFormValues: { name: 'x' },
      $emit: emit,
      $store: { dispatch: jest.fn() }
    }

    NewPermissions.methods.closeOverlay.call(ctx)

    expect(emit).toHaveBeenCalledWith('closeOverlay')
    expect(ctx.$store.dispatch).not.toHaveBeenCalled()
  })

  it('closeOverlay dispatches leaving dialog when form changed', () => {
    isDifferent.mockReturnValueOnce(true)
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      formValues: { name: 'x2' },
      initialFormValues: { name: 'x1' },
      $emit: emit,
      $store: { dispatch }
    }

    NewPermissions.methods.closeOverlay.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
    dispatch.mock.calls[0][1].callback()
    expect(emit).toHaveBeenCalledWith('closeOverlay')
  })

  it('computed username/password rules require value only when authentication enabled', () => {
    const requiredCtx = { formValues: { useAuthentication: true } }
    const optionalCtx = { formValues: { useAuthentication: false } }

    expect(NewPermissions.computed.getUserNameRules.call(requiredCtx)).toHaveLength(2)
    expect(NewPermissions.computed.getUserNameRules.call(optionalCtx)).toHaveLength(1)
    expect(NewPermissions.computed.getPasswordRules.call(requiredCtx)).toHaveLength(2)
    expect(NewPermissions.computed.getPasswordRules.call(optionalCtx)).toHaveLength(1)
    expect(NewPermissions.computed.getUserNameAndPasswordCommonProps.call(optionalCtx)).toBe(null)
    expect(NewPermissions.computed.getUserNameAndPasswordCommonProps.call(requiredCtx)).toEqual({
      hint: '*Required',
      persistentHint: true
    })
  })
})
