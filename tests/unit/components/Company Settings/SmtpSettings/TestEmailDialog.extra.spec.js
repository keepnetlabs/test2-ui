import { shallowMount } from '@vue/test-utils'
import TestEmailDialog from '@/components/Company Settings/SmtpSettings/TestEmailDialog.vue'

describe('TestEmailDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TestEmailDialog, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true, FormGroup: true, InputEmail: true }
    })

  it('handleCloseDialog emits closeDialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleCloseDialog()
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })

  it('handleConfirm emits confirm with formValues when form valid', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      formValues: {
        to: 'test@test.com',
        from: 'sender@test.com',
        fromName: 'Sender',
        message: 'Test message'
      }
    })
    wrapper.vm.$refs = { refForm: { validate: () => true } }
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')[0][0]).toMatchObject({
      to: 'test@test.com',
      from: 'sender@test.com'
    })
  })

  it('handleConfirm does not emit when form invalid', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = { refForm: { validate: () => false } }
    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('confirm')).toBeFalsy()
  })
})
