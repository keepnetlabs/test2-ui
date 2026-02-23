import { shallowMount } from '@vue/test-utils'
import NoTargetUserGroupModal from '@/components/CallbackCampaignManager/NoTargetUserGroupModal.vue'

describe('CallbackCampaignManager/NoTargetUserGroupModal.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(NoTargetUserGroupModal, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('has expected component name and status prop type', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('NoTargetUserGroupModal')
    expect(NoTargetUserGroupModal.props.status.type).toBe(Boolean)
  })

  it('accepts status prop and emits close/confirm events', () => {
    const wrapper = mountComponent({ status: false })
    expect(wrapper.vm.status).toBe(false)

    wrapper.vm.closeModal()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})
