import { shallowMount } from '@vue/test-utils'
import NoTextMessageTemplateModal from '@/components/SmishingScenarios/NoTextMessageTemplateModal'
import NoLandingPageTemplateModal from '@/components/SmishingScenarios/NoLandingPageTemplateModal'

describe('Smishing template missing modals', () => {
  it('NoTextMessageTemplateModal emits close and confirm', () => {
    const wrapper = shallowMount(NoTextMessageTemplateModal, {
      propsData: { status: true }
    })

    wrapper.vm.closeModal()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
    expect(wrapper.emitted('handleConfirm')).toBeTruthy()
  })

  it('NoLandingPageTemplateModal emits close and confirm', () => {
    const wrapper = shallowMount(NoLandingPageTemplateModal, {
      propsData: { status: true }
    })

    wrapper.vm.closeModal()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
    expect(wrapper.emitted('handleConfirm')).toBeTruthy()
  })
})

