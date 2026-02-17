import { createLocalVue, shallowMount } from '@vue/test-utils'
import Permissions from '@/views/Permissions'
import { getPermissionAll, getPermissionLogs } from '@/api/permissions'

jest.mock('@/api/permissions', () => ({
  deletePermission: jest.fn(() => Promise.resolve({ data: { message: 'ok' } })),
  getPermissionLogs: jest.fn(() =>
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
  getPermissionAll: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getPermissionData: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

describe('RoleBasedAccess.vue', () => {
  const localVue = createLocalVue()

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

  const mountComponent = () =>
    shallowMount(Permissions, {
      localVue,
      stubs: {
        DataTable: true,
        NewPermissions: true,
        AppDialog: true,
        AppDialogFooter: true,
        DefaultButtonRowAction: true,
        CannotDeleteRoleDialog: true
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSystemRolesCreatePermission': true,
            'permissions/getSystemRolesUpdatePermission': true,
            'permissions/getSystemRolesDeletePermission': true,
            'permissions/getSystemRolesSearchPermission': true
          },
          dispatch: jest.fn()
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('loads current role-based access view component', () => {
    expect(mountComponent().vm.$options.name).toBe('Permission')
  })

  it('calls permission APIs on created', async () => {
    mountComponent()
    await flushPromises()
    expect(getPermissionAll).toHaveBeenCalled()
    expect(getPermissionLogs).toHaveBeenCalled()
  })

  it('opens cannot-delete dialog when selected role has users', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleDelete({ userCount: 2, roleName: 'Admin', resourceId: 'r1' })
    expect(wrapper.vm.isShowCannotDeleteDialog).toBe(true)
    expect(wrapper.vm.deleteDialog).toBe(false)
  })

  it('opens delete dialog when selected role has no users', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleDelete({ userCount: 0, roleName: 'Viewer', resourceId: 'r2' })
    expect(wrapper.vm.deleteDialog).toBe(true)
    expect(wrapper.vm.deletePermissionName).toBe('Viewer')
    expect(wrapper.vm.deletePermissionId).toBe('r2')
  })

  it('togglePermissionModalStatus resets edit state when closing', () => {
    const wrapper = mountComponent()
    wrapper.vm.newPermissionsModalStatus = true
    wrapper.vm.isEdit = true
    wrapper.vm.resourceId = 'perm-1'

    wrapper.vm.togglePermissionModalStatus()

    expect(wrapper.vm.newPermissionsModalStatus).toBe(false)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.resourceId).toBe(null)
  })

  it('openPermissionModal toggles modal status', () => {
    const wrapper = mountComponent()
    wrapper.vm.newPermissionsModalStatus = false
    wrapper.vm.openPermissionModal()
    expect(wrapper.vm.newPermissionsModalStatus).toBe(true)
  })
})
