import { shallowMount } from '@vue/test-utils'
import TargetUserMenuActionsEditButton from '@/components/SmallComponents/RowActions/TargetUserMenuActionsEditButton.vue'

describe('TargetUserMenuActionsEditButton.vue', () => {
  it('getDisabledStatusOfAction returns true when not editable', () => {
    const wrapper = shallowMount(TargetUserMenuActionsEditButton, {
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
})
