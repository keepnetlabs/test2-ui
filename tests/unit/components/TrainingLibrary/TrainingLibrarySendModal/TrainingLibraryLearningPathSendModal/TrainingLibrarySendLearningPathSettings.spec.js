import TrainingLibrarySendLearningPathSettings from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryLearningPathSendModal/TrainingLibrarySendLearningPathSettings.vue'
import { DELIVERY_METHODS } from '@/components/Common/DeliveryMethod/utils'

describe('TrainingLibrarySendLearningPathSettings.vue', () => {
  it('checkDateIsValid requires non-empty scheduled date', () => {
    const ctx = {
      formData: { enrollmentScheduler: { scheduledDate: '' } },
      isDateValid: true
    }
    expect(TrainingLibrarySendLearningPathSettings.methods.checkDateIsValid.call(ctx)).toBeFalsy()
  })

  it('handleDeliveryMethodChange updates proxy and sms flags', () => {
    const ctx = {
      formData: { deliveryMethod: DELIVERY_METHODS.EMAIL, isProxy: false, isSendSMSNotification: false }
    }
    TrainingLibrarySendLearningPathSettings.methods.handleDeliveryMethodChange.call(
      ctx,
      DELIVERY_METHODS.SMS
    )
    expect(ctx.formData.isProxy).toBe(false)
    expect(ctx.formData.isSendSMSNotification).toBe(true)
  })
})

