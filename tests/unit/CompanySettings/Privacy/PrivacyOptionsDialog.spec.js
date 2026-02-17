import { shallowMount } from '@vue/test-utils'
import PrivacyOptionsDialog from '@/components/Company Settings/Privacy/PrivacyOptionsDialog.vue'

describe('PrivacyOptionsDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(PrivacyOptionsDialog, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true,
        VCheckbox: true
      }
    })

  it('starts with unconfirmed state and static constants', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isConfirm).toBe(false)
    expect(wrapper.vm.CONSTANTS.title).toBe('Privacy Options')
    expect(wrapper.vm.CONSTANTS.icon).toBe('mdi-shield-alert')
  })

  it('emits close and success actions', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    wrapper.vm.handleSuccess()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-success')).toBeTruthy()
  })
})
