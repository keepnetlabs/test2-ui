import SendTrainingSettings from '@/components/AwarenessEducator/SendTraining/SendTrainingSettings.vue'

describe('SendTrainingSettings.vue', () => {
  it('checkDateIsValid fails when scheduled date is required but empty', () => {
    const ctx = {
      formData: { scheduleTypeId: '2', enrollmentScheduler: { scheduledDate: '' } },
      isDateValid: true
    }
    const result = SendTrainingSettings.methods.checkDateIsValid.call(ctx)
    expect(Boolean(result)).toBe(false)
    expect(Boolean(ctx.isDateValid)).toBe(false)
  })

  it('validateForm proxies refForm.validate', () => {
    const validate = jest.fn(() => true)
    const result = SendTrainingSettings.methods.validateForm.call({
      $refs: { refForm: { validate } }
    })
    expect(result).toBe(true)
    expect(validate).toHaveBeenCalled()
  })
})
