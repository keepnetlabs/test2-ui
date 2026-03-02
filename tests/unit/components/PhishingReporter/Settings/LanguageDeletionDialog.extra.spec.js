import { shallowMount } from '@vue/test-utils'
import LanguageDeletionDialog from '@/components/PhishingReporter/Settings/LanguageDeletionDialog.vue'

describe('LanguageDeletionDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(LanguageDeletionDialog, {
      propsData: { status: true, ...propsData },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('renders when status is true', () => {
    const wrapper = createWrapper({ status: true })
    expect(wrapper.vm.$options.name).toBe('LanguageDeletionDialog')
  })

  it('mounts with status false', () => {
    const wrapper = createWrapper({ status: false })
    expect(wrapper.vm.$options.name).toBe('LanguageDeletionDialog')
    expect(wrapper.vm.$props.status).toBe(false)
  })

  it('handleClose emits close event', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('handleConfirm emits confirm event', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })
})
