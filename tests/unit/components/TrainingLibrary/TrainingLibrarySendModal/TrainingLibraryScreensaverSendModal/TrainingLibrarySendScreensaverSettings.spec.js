import TrainingLibrarySendScreensaverSettings from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryScreensaverSendModal/TrainingLibrarySendScreensaverSettings.vue'

describe('TrainingLibrarySendScreensaverSettings.vue', () => {
  it('checkDateIsValid returns true in send-now mode', () => {
    const ctx = {
      formData: { scheduleTypeId: '1', enrollmentScheduler: { scheduledDate: '' } },
      isDateValid: false
    }
    expect(TrainingLibrarySendScreensaverSettings.methods.checkDateIsValid.call(ctx)).toBe(true)
  })

  it('validateForm proxies refForm.validate', () => {
    const validate = jest.fn(() => true)
    const result = TrainingLibrarySendScreensaverSettings.methods.validateForm.call({
      $refs: { refForm: { validate } }
    })
    expect(result).toBe(true)
    expect(validate).toHaveBeenCalled()
  })
})

