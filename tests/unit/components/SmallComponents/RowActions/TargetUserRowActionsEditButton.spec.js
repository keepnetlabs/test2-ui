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
})
