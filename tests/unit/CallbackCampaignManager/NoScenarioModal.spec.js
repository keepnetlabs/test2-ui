import { shallowMount } from '@vue/test-utils'
import NoScenarioModal from '@/components/CallbackCampaignManager/NoScenarioModal.vue'

describe('CallbackCampaignManager/NoScenarioModal.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(NoScenarioModal, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('NoScenarioModal')
  })

  it('accepts status prop', () => {
    const wrapper = mountComponent({ status: false })
    expect(wrapper.vm.status).toBe(false)
  })

  it('emits on-close and on-confirm from handlers', () => {
    const wrapper = mountComponent()

    wrapper.vm.closeModal()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
  })
})

