import { shallowMount } from '@vue/test-utils'
import EmailTemplateWarningModal from '@/components/CallbackScenarios/EmailTemplateWarningModal.vue'

describe('EmailTemplateWarningModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(EmailTemplateWarningModal, {
      propsData: {
        status: true,
        templateName: 'Default Template',
        ...propsData
      },
      stubs: { AppDialog: true }
    })

  it('passes templateName prop', () => {
    const wrapper = createWrapper({ templateName: 'My Template' })
    expect(wrapper.vm.templateName).toBe('My Template')
  })

  it('closeOverlay emits closeOverlay', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeOverlay()
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
  })
})
