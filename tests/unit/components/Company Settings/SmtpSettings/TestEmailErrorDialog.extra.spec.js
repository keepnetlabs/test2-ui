import { shallowMount } from '@vue/test-utils'
import TestEmailErrorDialog from '@/components/Company Settings/SmtpSettings/TestEmailErrorDialog.vue'

describe('TestEmailErrorDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TestEmailErrorDialog, {
      propsData: {
        isShowErrorMessage: true,
        errorMessage: 'Connection failed',
        ...propsData
      },
      stubs: { AppDialog: true }
    })

  it('renders when isShowErrorMessage is true', () => {
    const wrapper = createWrapper({ isShowErrorMessage: true })
    expect(wrapper.vm.isShowErrorMessage).toBe(true)
  })

  it('passes errorMessage prop', () => {
    const wrapper = createWrapper({ errorMessage: 'Test error' })
    expect(wrapper.vm.errorMessage).toBe('Test error')
  })

  it('handleCloseDialog emits closeDialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleCloseDialog()
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })
})
