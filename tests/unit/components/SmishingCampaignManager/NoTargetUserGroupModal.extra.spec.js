import { shallowMount } from '@vue/test-utils'
import NoTargetUserGroupModal from '@/components/SmishingCampaignManager/NoTargetUserGroupModal.vue'

describe('NoTargetUserGroupModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(NoTargetUserGroupModal, {
      propsData: { status: true, ...propsData },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('closeModal emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleConfirm emits on-confirm', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})
