import ConfirmationRequiredPopup from '@/components/IncidentResponder/ConfirmationRequiredPopup.vue'

describe('ConfirmationRequiredPopup.vue', () => {
  it('emits on-close from handleClose', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    ConfirmationRequiredPopup.methods.handleClose.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('emits on-confirm with payload from handleConfirm', () => {
    const emit = jest.fn()
    const payload = { ids: ['1', '2'] }
    const ctx = { payload, $emit: emit }

    ConfirmationRequiredPopup.methods.handleConfirm.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-confirm', payload)
  })
})
