import { shallowMount } from '@vue/test-utils'
import TargetUserRowActionsEditButton from '@/components/SmallComponents/RowActions/TargetUserRowActionsEditButton.vue'

describe('TargetUserRowActionsEditButton.vue', () => {
  it('getTooltipMessage returns tooltipMessage when provided', () => {
    const wrapper = shallowMount(TargetUserRowActionsEditButton, {
      propsData: {
        scope: { row: { isEditable: true } },
        tooltipMessage: 'Custom tooltip'
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetUsersEditPermissions': true }
        }
      }
    })
    expect(wrapper.vm.getTooltipMessage).toBe('Custom tooltip')
  })

  it('getDisabledStatusOfAction returns true when not editable', () => {
    const wrapper = shallowMount(TargetUserRowActionsEditButton, {
      propsData: {
        scope: { row: { isEditable: false } }
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetUsersEditPermissions': true }
        }
      }
    })
    expect(wrapper.vm.getDisabledStatusOfAction).toBe(true)
  })

  it('getTooltipMessage returns name when editable and has permission', () => {
    const wrapper = shallowMount(TargetUserRowActionsEditButton, {
      propsData: {
        scope: { row: { isEditable: true } },
        name: 'Edit'
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetUsersEditPermissions': true }
        }
      }
    })
    expect(wrapper.vm.getTooltipMessage).toBe('Edit')
  })

  it('getTooltipMessage returns No Permission when editable but no permission', () => {
    const wrapper = shallowMount(TargetUserRowActionsEditButton, {
      propsData: {
        scope: { row: { isEditable: true } },
        name: 'Edit'
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetUsersEditPermissions': false }
        }
      }
    })
    expect(wrapper.vm.getTooltipMessage).toBe('No Permission')
  })

  it('getTooltipMessage returns LDAP message when not editable with ldapConfigName', () => {
    const wrapper = shallowMount(TargetUserRowActionsEditButton, {
      propsData: {
        scope: { row: { isEditable: false, ldapConfigName: 'MyLDAP' } },
        type: 'user'
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetUsersEditPermissions': true }
        }
      }
    })
    expect(wrapper.vm.getTooltipMessage).toContain('LDAP')
    expect(wrapper.vm.getTooltipMessage).toContain('MyLDAP')
    expect(wrapper.vm.getTooltipMessage).toContain('cannot be edited')
  })

  it('getTooltipMessage returns SCIM message when not editable without ldapConfigName', () => {
    const wrapper = shallowMount(TargetUserRowActionsEditButton, {
      propsData: {
        scope: { row: { isEditable: false, scimSettingName: 'MySCIM' } },
        type: 'user'
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetUsersEditPermissions': true }
        }
      }
    })
    expect(wrapper.vm.getTooltipMessage).toContain('SCIM')
    expect(wrapper.vm.getTooltipMessage).toContain('MySCIM')
  })

  it('getTooltipMessage returns Google message when not editable and isGoogleGroup', () => {
    const wrapper = shallowMount(TargetUserRowActionsEditButton, {
      propsData: {
        scope: { row: { isEditable: false, isGoogleGroup: true } },
        type: 'group'
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetUsersEditPermissions': true }
        }
      }
    })
    expect(wrapper.vm.getTooltipMessage).toContain('Google synced')
    expect(wrapper.vm.getTooltipMessage).toContain('cannot be edited')
  })
})
