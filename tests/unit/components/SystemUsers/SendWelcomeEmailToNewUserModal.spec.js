import SendWelcomeEmailToNewUserModal from '@/components/SystemUsers/SendWelcomeEmailToNewUserModal.vue'

describe('SendWelcomeEmailToNewUserModal.vue', () => {
  it('closeOverlay emits closeOverlay', () => {
    const ctx = { $emit: jest.fn() }
    SendWelcomeEmailToNewUserModal.methods.closeOverlay.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('closeOverlay')
  })

  it('handleSend emits sendEmail', () => {
    const ctx = { $emit: jest.fn() }
    SendWelcomeEmailToNewUserModal.methods.handleSend.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('sendEmail')
  })

  it('data returns formValues with chooseTime default', () => {
    const data = SendWelcomeEmailToNewUserModal.data()
    expect(data.formValues.chooseTime).toBe('SendImmediately')
  })
})
