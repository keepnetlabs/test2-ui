import { shallowMount } from '@vue/test-utils'
import StopSyncronizationModal from '@/components/Company Settings/GoogleUserProvisioning/StopSyncronizationModal'

describe('StopSyncronizationModal.vue', () => {
  it('renders and emits close/confirm', () => {
    const wrapper = shallowMount(StopSyncronizationModal, {
      propsData: {
        status: true,
        isActionButtonDisabled: false
      }
    })

    expect(wrapper.find('appdialog-stub').exists()).toBe(true)
    wrapper.vm.handleClose()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})

