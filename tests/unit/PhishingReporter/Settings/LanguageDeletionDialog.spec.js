import { shallowMount } from '@vue/test-utils'
import LanguageDeletionDialog from '@/components/PhishingReporter/Settings/LanguageDeletionDialog.vue'

describe('LanguageDeletionDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(LanguageDeletionDialog, {
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
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('LanguageDeletionDialog')
  })

  it('emits close when handleClose is called', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits confirm when handleConfirm is called', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })
})
