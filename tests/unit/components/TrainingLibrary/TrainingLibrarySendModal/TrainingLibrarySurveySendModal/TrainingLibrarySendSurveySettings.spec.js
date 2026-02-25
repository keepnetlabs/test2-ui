import TrainingLibrarySendSurveySettings from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySurveySendModal/TrainingLibrarySendSurveySettings.vue'
import { DELIVERY_METHODS } from '@/components/Common/DeliveryMethod/utils'

describe('TrainingLibrarySendSurveySettings.vue', () => {
  it('isScheduledTimeDisabled follows schedule type', () => {
    expect(
      TrainingLibrarySendSurveySettings.computed.isScheduledTimeDisabled.call({
        formData: { scheduleTypeId: '1' }
      })
    ).toBe(true)
    expect(
      TrainingLibrarySendSurveySettings.computed.isScheduledTimeDisabled.call({
        formData: { scheduleTypeId: '2' }
      })
    ).toBe(false)
  })

  it('deliveryMethodText returns LMS text', () => {
    const text = TrainingLibrarySendSurveySettings.computed.deliveryMethodText.call({
      formData: { deliveryMethod: DELIVERY_METHODS.LMS }
    })
    expect(text.toLowerCase()).toContain('lms')
  })

  it('handleDeliveryMethodChange updates sms and proxy flags', () => {
    const ctx = {
      formData: {
        deliveryMethod: DELIVERY_METHODS.EMAIL,
        isProxy: false,
        isSendSMSNotification: false
      }
    }
    TrainingLibrarySendSurveySettings.methods.handleDeliveryMethodChange.call(
      ctx,
      DELIVERY_METHODS.SMS
    )
    expect(ctx.formData.isSendSMSNotification).toBe(true)
    expect(ctx.formData.isProxy).toBe(false)
  })
})
