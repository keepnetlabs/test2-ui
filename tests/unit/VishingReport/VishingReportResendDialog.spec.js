import { shallowMount } from '@vue/test-utils'
import VishingReportResendDialog from '@/components/VishingReport/VishingReportResendDialog.vue'

describe('VishingReportResendDialog.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportResendDialog, {
      propsData: {
        status: true,
        items: { answered: 5, noResponse: 2, callingError: 1 },
        vishingName: 'Test Campaign',
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true, VCheckbox: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('has correct component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('VishingReportResendDialog')
  })

  it('getActionButtonDisabled is true when types is empty', () => {
    const wrapper = mountComponent()
    wrapper.vm.types = []
    expect(wrapper.vm.getActionButtonDisabled).toBe(true)
  })

  it('getActionButtonDisabled is true when isActionButtonDisabled prop is true', () => {
    const wrapper = mountComponent({ isActionButtonDisabled: true })
    wrapper.vm.types = [1]
    expect(wrapper.vm.getActionButtonDisabled).toBe(true)
  })

  it('getActionButtonDisabled is false when types has value and not disabled', () => {
    const wrapper = mountComponent()
    wrapper.vm.types = [1]
    expect(wrapper.vm.getActionButtonDisabled).toBe(false)
  })

  it('closeModal emits on-close', () => {
    const wrapper = mountComponent()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleConfirm emits on-confirm with types', () => {
    const wrapper = mountComponent()
    wrapper.vm.types = [1, 2]
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('on-confirm')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')[0][0]).toEqual([1, 2])
  })
})
