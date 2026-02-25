import { shallowMount } from '@vue/test-utils'
import TargetGroupRowActionsDeleteButton from '@/components/SmallComponents/RowActions/TargetGroupRowActionsDeleteButton.vue'

describe('TargetGroupRowActionsDeleteButton.vue', () => {
  it('getTooltipMessage returns tooltipMessage when provided', () => {
    const wrapper = shallowMount(TargetGroupRowActionsDeleteButton, {
      propsData: {
        scope: { row: { isEditable: true } },
        tooltipMessage: 'Custom message'
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetGroupsDeletePermissions': true }
        }
      }
    })
    expect(wrapper.vm.getTooltipMessage).toBe('Custom message')
  })

  it('getDisabledStatusOfAction returns true when not editable', () => {
    const wrapper = shallowMount(TargetGroupRowActionsDeleteButton, {
      propsData: {
        scope: { row: { isEditable: false } }
      },
      mocks: {
        $store: {
          getters: { 'permissions/getTargetGroupsDeletePermissions': true }
        }
      }
    })
    expect(wrapper.vm.getDisabledStatusOfAction).toBe(true)
  })
})
