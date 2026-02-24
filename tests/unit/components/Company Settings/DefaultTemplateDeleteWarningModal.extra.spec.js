import { shallowMount } from '@vue/test-utils'
import DefaultTemplateDeleteWarningModal from '@/components/Company Settings/DefaultTemplateDeleteWarningModal.vue'

describe('DefaultTemplateDeleteWarningModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DefaultTemplateDeleteWarningModal, {
      propsData: {
        status: true,
        templateName: 'Default Template',
        ...propsData
      },
      stubs: { AppDialog: true }
    })

  it('passes templateName prop', () => {
    const wrapper = createWrapper({ templateName: 'Email Template' })
    expect(wrapper.vm.templateName).toBe('Email Template')
  })

  it('closeOverlay emits closeOverlay', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeOverlay()
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
  })
})
