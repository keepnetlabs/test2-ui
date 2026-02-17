import { createLocalVue, shallowMount } from '@vue/test-utils'
import SystemUsers from '@/views/SystemUsers'

describe('SystemUsers.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (getterOverrides = {}) =>
    shallowMount(SystemUsers, {
      localVue,
      stubs: {
        KContainer: true,
        People: true,
        Permissions: true,
        'el-tabs': true,
        'el-tab-pane': true
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSystemUsersSearchPermission': true,
            'permissions/getSystemRolesSearchPermission': true,
            ...getterOverrides
          }
        }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('SystemUsers')
  })

  it('defaults to roles tab when people permission is missing', () => {
    const wrapper = mountComponent({
      'permissions/getSystemUsersSearchPermission': false,
      'permissions/getSystemRolesSearchPermission': true
    })
    expect(wrapper.vm.tab).toBe('system-users--roles')
  })

  it('changeTabStatus updates active tab', () => {
    const wrapper = mountComponent()
    wrapper.vm.changeTabStatus('system-users--roles')
    expect(wrapper.vm.tab).toBe('system-users--roles')
  })

  it('beforeRouteLeave blocks when people modal is open', () => {
    const wrapper = mountComponent()
    const next = jest.fn()
    const checkIfCanCloseSystemUserModal = jest.fn()
    wrapper.vm.$refs = {
      refPeople: {
        showCreateOrEditSystemUserModal: true,
        checkIfCanCloseSystemUserModal
      }
    }

    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(checkIfCanCloseSystemUserModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave blocks when permissions modal is open', () => {
    const wrapper = mountComponent()
    const next = jest.fn()
    const checkIfCanClosePermissionsModal = jest.fn()
    wrapper.vm.$refs = {
      refPermissions: {
        newPermissionsModalStatus: true,
        checkIfCanClosePermissionsModal
      }
    }

    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(checkIfCanClosePermissionsModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave allows navigation when no modal is open', () => {
    const wrapper = mountComponent()
    const next = jest.fn()
    wrapper.vm.$refs = {}

    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(next).toHaveBeenCalledTimes(1)
  })
})
