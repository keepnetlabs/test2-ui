import { shallowMount } from '@vue/test-utils'
import CannotDeleteRoleDialog from '@/components/Permissions/CannotDeleteRoleDialog.vue'

describe('CannotDeleteRoleDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CannotDeleteRoleDialog, {
      propsData: {
        status: true,
        systemUserCount: 5,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        VBtn: true
      }
    })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('CannotDeleteRoleDialog')
  })

  it('emits on-close from handleClose', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
