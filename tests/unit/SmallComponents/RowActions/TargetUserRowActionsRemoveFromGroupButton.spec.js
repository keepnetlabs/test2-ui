import { shallowMount } from '@vue/test-utils'
import TargetUserRowActionsRemoveFromGroupButton from '@/components/SmallComponents/RowActions/TargetUserRowActionsRemoveFromGroupButton'

describe('TargetUserRowActionsRemoveFromGroupButton.vue', () => {
  const createWrapper = (isGroupEditable, permission) =>
    shallowMount(TargetUserRowActionsRemoveFromGroupButton, {
      propsData: {
        isGroupEditable,
        scope: {
          $index: 1,
          row: { id: 'r1' }
        }
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getTargetGroupsDeleteUsersPermissions': permission
          }
        }
      }
    })

  it('is enabled and shows remove tooltip when editable and permitted', () => {
    const wrapper = createWrapper(true, true)
    expect(wrapper.vm.getDisabledStatusOfAction).toBe(false)
    expect(wrapper.vm.getTooltipMessage).toBe('Remove from group')
  })

  it('is disabled and shows no permission tooltip otherwise', () => {
    const wrapper = createWrapper(false, false)
    expect(wrapper.vm.getDisabledStatusOfAction).toBe(true)
    expect(wrapper.vm.getTooltipMessage).toBe('No Permission')
  })
})

