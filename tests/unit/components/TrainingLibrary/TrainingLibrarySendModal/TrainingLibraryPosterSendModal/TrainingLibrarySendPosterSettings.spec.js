import TrainingLibrarySendPosterSettings from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryPosterSendModal/TrainingLibrarySendPosterSettings.vue'
import { DELIVERY_METHODS } from '@/components/Common/DeliveryMethod/utils'

describe('TrainingLibrarySendPosterSettings.vue', () => {
  it('checkDateIsValid returns false for empty scheduled date in schedule mode', () => {
    const ctx = {
      formData: { scheduleTypeId: '2', enrollmentScheduler: { scheduledDate: '' } },
      isDateValid: true
    }
    expect(TrainingLibrarySendPosterSettings.methods.checkDateIsValid.call(ctx)).toBeFalsy()
  })

  it('handleDeliveryMethodChange updates delivery state', () => {
    const ctx = {
      formData: { deliveryMethod: DELIVERY_METHODS.EMAIL, isProxy: false, isSendSMSNotification: false }
    }
    TrainingLibrarySendPosterSettings.methods.handleDeliveryMethodChange.call(
      ctx,
      DELIVERY_METHODS.LMS
    )
    expect(ctx.formData.isProxy).toBe(true)
    expect(ctx.formData.isSendSMSNotification).toBe(false)
  })
})

