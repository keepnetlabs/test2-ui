import { shallowMount } from '@vue/test-utils'
import NewPermissions from '@/components/Permissions/NewPermissions.vue'

describe('NewPermissions.vue', () => {
  const basePermissions = [
    {
      permissionResourceId: 'm1',
      moduleName: 'Users',
      children: [
        {
          permissionResourceId: 'g1',
          groupName: 'System Users',
          children: []
        }
      ]
    },
    {
      permissionResourceId: 'm2',
      moduleName: 'Campaign',
      children: []
    }
  ]

  const createWrapper = (propsData = {}) =>
    shallowMount(NewPermissions, {
      propsData: {
        status: true,
        isEdit: false,
        permissions: basePermissions,
        ...propsData
      },
      stubs: {
        AppModal: true,
        AppModalBodyHeader: true,
        FormGroup: true,
        MakeAvailableFor: true,
        InputEntityName: true,
        InputDescription: true,
        VForm: true,
        VTextField: true,
        VTreeview: true
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      }
    })

  it('computes title for create and edit modes', () => {
    const createWrapperVm = createWrapper()
    expect(createWrapperVm.vm.getTitle).toBe('New System User Role')

    const editWrapper = createWrapper({
      isEdit: true,
      resourceId: 'role-1',
      permissionEditData: {
        name: 'Role',
        description: 'Desc',
        permissionResourceIdList: [],
        availableForList: []
      }
    })
    expect(editWrapper.vm.getTitle).toBe('Edit System User Role')
  })

  it('returns readable sub names and permission name flags', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getItemPermissionName({ permissionDescription: 'desc', permissionName: 'name' })).toBe(
      'name'
    )
    expect(wrapper.vm.getItemPermissionName({ permissionDescription: 'desc' })).toBeFalsy()

    expect(wrapper.vm.getItemSubName({ permissionDescription: 'desc' })).toBe('desc')
    expect(wrapper.vm.getItemSubName({ parentGroupName: 'parent' })).toBe('parent')
    expect(wrapper.vm.getItemSubName({ groupName: 'group' })).toBe('group')
    expect(wrapper.vm.getItemSubName({ moduleName: 'module' })).toBe('module')
    expect(wrapper.vm.getItemSubName({})).toBe('No Name')
  })

  it('filters searched items by module/group names recursively', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ search: 'system' })

    const items = wrapper.vm.getPrivilegesItems
    expect(items).toHaveLength(1)
    expect(items[0].permissionResourceId).toBe('m1')
    expect(items[0].children).toHaveLength(1)
    expect(items[0].children[0].permissionResourceId).toBe('g1')
  })

  it('closeOverlay emits directly when form is unchanged', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      formValues: {
        name: 'Role A',
        description: 'Desc',
        permissionResourceIdList: []
      },
      initialFormValues: {
        name: 'Role A',
        description: 'Desc',
        permissionResourceIdList: []
      }
    })

    wrapper.vm.closeOverlay()
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
  })

  it('closeOverlay asks leaving dialog when form has changes', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      formValues: {
        name: 'Role A',
        description: 'Desc changed',
        permissionResourceIdList: []
      },
      initialFormValues: {
        name: 'Role A',
        description: 'Desc',
        permissionResourceIdList: []
      }
    })

    wrapper.vm.closeOverlay()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )

    const payload = wrapper.vm.$store.dispatch.mock.calls[0][1]
    payload.callback()
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
  })
})
