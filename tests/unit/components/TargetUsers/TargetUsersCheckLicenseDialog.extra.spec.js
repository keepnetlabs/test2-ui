import { shallowMount } from '@vue/test-utils'
import TargetUsersCheckLicenseDialog from '@/components/TargetUsers/TargetUsersCheckLicenseDialog.vue'

describe('TargetUsersCheckLicenseDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TargetUsersCheckLicenseDialog, {
      propsData: {
        status: true,
        dialogBody: 'You have exceeded the license limit.',
        ...propsData
      },
      stubs: { AppDialog: true }
    })

  it('passes dialogBody prop', () => {
    const wrapper = createWrapper({ dialogBody: 'Custom warning text' })
    expect(wrapper.vm.dialogBody).toBe('Custom warning text')
  })

  it('closeDialog emits close-overlay', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeDialog()
    expect(wrapper.emitted('close-overlay')).toBeTruthy()
  })
})
