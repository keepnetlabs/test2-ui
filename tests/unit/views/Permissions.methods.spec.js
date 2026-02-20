jest.mock('@/api/permissions', () => ({
  deletePermission: jest.fn(() => Promise.resolve({ data: { message: 'Deleted' } })),
  getPermissionLogs: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ resourceId: 'r-1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  getPermissionAll: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { moduleName: 'Threat Sharing', children: null },
          {
            moduleName: 'Phishing Simulator',
            permissionResourceId: 'perm-1',
            children: [{ moduleName: 'Child', children: null }]
          },
          { moduleName: 'Unknown' }
        ]
      }
    })
  ),
  getPermissionData: jest.fn(() => Promise.resolve({ data: { data: { name: 'Role A' } } }))
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    createRandomCryptStringNumber: jest.fn(() => 'rnd-1'),
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    })),
    getErrorMessage: jest.fn(() => 'Generic error')
  }
})

import Permissions from '@/views/Permissions.vue'
import {
  deletePermission,
  getPermissionLogs,
  getPermissionAll,
  getPermissionData
} from '@/api/permissions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Permissions.vue methods', () => {
  const { methods } = Permissions

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('closeDeleteDialog closes dialog', () => {
    const ctx = { deleteDialog: true }
    methods.closeDeleteDialog.call(ctx)
    expect(ctx.deleteDialog).toBe(false)
  })

  it('handleDelete opens cannot-delete dialog when permission has users', () => {
    const toggleShowCannotDeleteDialog = jest.fn()
    const ctx = {
      systemUserCount: 0,
      toggleShowCannotDeleteDialog
    }

    methods.handleDelete.call(ctx, { userCount: 3, roleName: 'Admin', resourceId: 'p-1' })

    expect(ctx.systemUserCount).toBe(3)
    expect(toggleShowCannotDeleteDialog).toHaveBeenCalledTimes(1)
  })

  it('handleDelete prepares delete modal when permission has no users', () => {
    const ctx = {
      systemUserCount: 0,
      deletePermissionName: null,
      deletePermissionId: null,
      selectedItem: null,
      deleteDialog: false
    }
    const item = { userCount: 0, roleName: 'Editor', resourceId: 'p-2' }

    methods.handleDelete.call(ctx, item)

    expect(ctx.deletePermissionName).toBe('Editor')
    expect(ctx.deletePermissionId).toBe('p-2')
    expect(ctx.selectedItem).toEqual(item)
    expect(ctx.deleteDialog).toBe(true)
  })

  it('toggleShowCannotDeleteDialog toggles state', () => {
    const ctx = { isShowCannotDeleteDialog: false }
    methods.toggleShowCannotDeleteDialog.call(ctx)
    expect(ctx.isShowCannotDeleteDialog).toBe(true)
    methods.toggleShowCannotDeleteDialog.call(ctx)
    expect(ctx.isShowCannotDeleteDialog).toBe(false)
  })

  it('togglePermissionModalStatus and closeOverlayWithUpdate reset edit fields when closing', () => {
    const callForData = jest.fn()
    const ctx = {
      newPermissionsModalStatus: true,
      resourceId: 'r-1',
      isEdit: true,
      callForData
    }

    methods.togglePermissionModalStatus.call(ctx)
    expect(ctx.newPermissionsModalStatus).toBe(false)
    expect(ctx.resourceId).toBe(null)
    expect(ctx.isEdit).toBe(false)

    methods.closeOverlayWithUpdate.call(ctx)
    expect(ctx.newPermissionsModalStatus).toBe(true)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('openPermissionModal delegates to togglePermissionModalStatus', () => {
    const togglePermissionModalStatus = jest.fn()
    const ctx = { togglePermissionModalStatus }
    methods.openPermissionModal.call(ctx)
    expect(togglePermissionModalStatus).toHaveBeenCalledTimes(1)
  })

  it('handleSearchChange keeps filterable fields and maps TypeName to Type', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      tableOptions: {
        columns: [
          { property: 'RoleName', filterableType: 'text' },
          { property: 'TypeName', filterableType: 'select' },
          { property: 'CreateTime' }
        ]
      },
      axiosPayload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber,
      callForData
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'RoleName', Value: 'Admin' },
              { FieldName: 'TypeName', Value: '1' },
              { FieldName: 'CreateTime', Value: '2025-01-01' }
            ]
          }
        ]
      }
    }

    methods.handleSearchChange.call(ctx, searchFilter)

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'RoleName', Value: 'Admin' },
      { FieldName: 'Type', Value: '1' }
    ])
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('callForData updates table and server-side props, and clears loading', async () => {
    const ctx = {
      loading: false,
      axiosPayload: {},
      serverSideProps: {},
      tableData: []
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(getPermissionLogs).toHaveBeenCalledWith(ctx.axiosPayload)
    expect(ctx.tableData).toEqual([{ resourceId: 'r-1' }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.loading).toBe(false)
  })

  it('handleDeleteDialog success flow dispatches snackbar, unselects row and refreshes', async () => {
    const dispatch = jest.fn()
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      deletePermissionId: 'p-1',
      selectedItem: { resourceId: 'p-1' },
      deleteDialog: true,
      callForData,
      $store: { dispatch },
      $refs: { refPermissionList: { unSelectRow } }
    }

    methods.handleDeleteDialog.call(ctx)
    await flushPromises()

    expect(deletePermission).toHaveBeenCalledWith('p-1')
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Deleted' })
    )
    expect(unSelectRow).toHaveBeenCalledWith(ctx.selectedItem)
    expect(ctx.deleteDialog).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleDeleteDialog closes dialog on 400 error and shows error snackbar for others', async () => {
    const dispatch = jest.fn()
    const baseCtx = {
      deletePermissionId: 'p-1',
      deleteDialog: true,
      callForData: jest.fn(),
      $store: { dispatch },
      $refs: { refPermissionList: { unSelectRow: jest.fn() } }
    }

    deletePermission.mockRejectedValueOnce({ response: { status: 400 } })
    methods.handleDeleteDialog.call(baseCtx)
    await flushPromises()
    expect(baseCtx.deleteDialog).toBe(false)

    baseCtx.deleteDialog = true
    deletePermission.mockRejectedValueOnce({ response: { status: 500 } })
    methods.handleDeleteDialog.call(baseCtx)
    await flushPromises()
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Generic error' })
    )
  })

  it('editPermissions fetches role detail and opens modal in edit mode', async () => {
    const togglePermissionModalStatus = jest.fn()
    const ctx = {
      resourceId: null,
      isEdit: false,
      permissionEditData: null,
      togglePermissionModalStatus
    }

    methods.editPermissions.call(ctx, { resourceId: 'perm-1' })
    await flushPromises()

    expect(getPermissionData).toHaveBeenCalledWith('perm-1')
    expect(ctx.isEdit).toBe(true)
    expect(ctx.permissionEditData).toEqual({ name: 'Role A' })
    expect(togglePermissionModalStatus).toHaveBeenCalledTimes(1)
  })

  it('getPermissions sorts known modules and normalizes nested permissions', async () => {
    const ctx = { permissions: [] }

    methods.getPermissions.call(ctx)
    await flushPromises()

    expect(getPermissionAll).toHaveBeenCalled()
    expect(ctx.permissions).toHaveLength(2)
    expect(ctx.permissions[0].moduleName).toBe('Threat Sharing')
    expect(ctx.permissions[0].permissionResourceId).toBe('rnd-1')
    expect(ctx.permissions[0].children).toBeUndefined()
    expect(ctx.permissions[1].children[0].permissionResourceId).toBe('rnd-1')
  })

  it('checkIfCanClosePermissionsModal delegates to modal closeOverlay when ref exists', () => {
    const closeOverlay = jest.fn()
    const ctx = {
      $refs: { permissionsModal: { closeOverlay } }
    }

    methods.checkIfCanClosePermissionsModal.call(ctx)
    expect(closeOverlay).toHaveBeenCalledTimes(1)
  })
})
