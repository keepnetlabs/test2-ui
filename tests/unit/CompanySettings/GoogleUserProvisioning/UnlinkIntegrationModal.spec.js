import { shallowMount } from '@vue/test-utils'
import UnlinkIntegrationModal from '@/components/Company Settings/GoogleUserProvisioning/UnlinkIntegrationModal.vue'

describe('UnlinkIntegrationModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(UnlinkIntegrationModal, {
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UnlinkIntegrationModal')
  })

  it('emits close and confirm actions', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})
