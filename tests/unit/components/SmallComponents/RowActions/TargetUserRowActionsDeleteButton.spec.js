import { shallowMount } from '@vue/test-utils'
import TargetUserRowActionsDeleteButton from '@/components/SmallComponents/RowActions/TargetUserRowActionsDeleteButton.vue'

describe('TargetUserRowActionsDeleteButton.vue', () => {
  it('getTooltipMessage returns name when editable and has permission', () => {
    const wrapper = shallowMount(TargetUserRowActionsDeleteButton, {
      propsData: {
        scope: { row: { isEditable: true, ldapConfigName: null } }
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetUsersDeletePermissions': true }
        }
      }
    })
    expect(wrapper.vm.getTooltipMessage).toBe('Delete')
  })

  it('getDisabledStatusOfAction returns true when not editable', () => {
    const wrapper = shallowMount(TargetUserRowActionsDeleteButton, {
      propsData: {
        scope: { row: { isEditable: false } }
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetUsersDeletePermissions': true }
        }
      }
    })
    expect(wrapper.vm.getDisabledStatusOfAction).toBe(true)
  })
})
