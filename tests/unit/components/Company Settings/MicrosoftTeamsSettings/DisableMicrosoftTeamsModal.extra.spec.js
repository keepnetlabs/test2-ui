import { shallowMount } from '@vue/test-utils'
import DisableMicrosoftTeamsModal from '@/components/Company Settings/MicrosoftTeamsSettings/DisableMicrosoftTeamsModal.vue'

describe('DisableMicrosoftTeamsModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DisableMicrosoftTeamsModal, {
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleConfirm emits on-confirm', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})
