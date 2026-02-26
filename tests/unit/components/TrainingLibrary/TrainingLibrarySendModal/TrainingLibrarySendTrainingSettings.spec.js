import TrainingLibrarySendTrainingSettings from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingSettings.vue'
import { DELIVERY_METHODS } from '@/components/Common/DeliveryMethod/utils'

describe('TrainingLibrarySendTrainingSettings.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrarySendTrainingSettings.name).toBe('TrainingLibrarySendTrainingSettings')
  })

  it('selectedRow prop is required', () => {
    expect(TrainingLibrarySendTrainingSettings.props.selectedRow).toBeDefined()
  })

  it('isScheduledTimeDisabled reflects schedule type', () => {
    const disabled = TrainingLibrarySendTrainingSettings.computed.isScheduledTimeDisabled.call({
      formData: { scheduleTypeId: '1' }
    })
    const enabled = TrainingLibrarySendTrainingSettings.computed.isScheduledTimeDisabled.call({
      formData: { scheduleTypeId: '2' }
    })

    expect(disabled).toBe(true)
    expect(enabled).toBe(false)
  })

  it('deliveryMethodText returns expected texts for LMS/SMS/Teams/default', () => {
    const lms = TrainingLibrarySendTrainingSettings.computed.deliveryMethodText.call({
      formData: { deliveryMethod: DELIVERY_METHODS.LMS }
    })
    const sms = TrainingLibrarySendTrainingSettings.computed.deliveryMethodText.call({
      formData: { deliveryMethod: DELIVERY_METHODS.SMS }
    })
    const teams = TrainingLibrarySendTrainingSettings.computed.deliveryMethodText.call({
      formData: { deliveryMethod: DELIVERY_METHODS.MICROSOFT_TEAMS }
    })
    const fallback = TrainingLibrarySendTrainingSettings.computed.deliveryMethodText.call({
      formData: { deliveryMethod: 'Email' }
    })

    expect(lms.toLowerCase()).toContain('lms')
    expect(sms.toLowerCase()).toContain('sms')
    expect(teams.toLowerCase()).toContain('microsoft teams')
    expect(fallback).toBe('')
  })

  it('isDeliveryMethodSMS and isDeliveryMethodLMS evaluate correctly', () => {
    const sms = TrainingLibrarySendTrainingSettings.computed.isDeliveryMethodSMS.call({
      formData: { deliveryMethod: DELIVERY_METHODS.SMS }
    })
    const notSms = TrainingLibrarySendTrainingSettings.computed.isDeliveryMethodSMS.call({
      formData: { deliveryMethod: DELIVERY_METHODS.LMS }
    })
    const lms = TrainingLibrarySendTrainingSettings.computed.isDeliveryMethodLMS.call({
      formData: { deliveryMethod: DELIVERY_METHODS.LMS }
    })
    const notLms = TrainingLibrarySendTrainingSettings.computed.isDeliveryMethodLMS.call({
      formData: { deliveryMethod: DELIVERY_METHODS.SMS }
    })

    expect(sms).toBe(true)
    expect(notSms).toBe(false)
    expect(lms).toBe(true)
    expect(notLms).toBe(false)
  })

  it('getPeriodTypeItems maps enum values when enumTypes exists and falls back otherwise', () => {
    const mapped = TrainingLibrarySendTrainingSettings.computed.getPeriodTypeItems.call({
      enumTypes: {
        EmailPeriodTypeEnum: [{ name: 'Day' }, { name: 'Week' }]
      },
      periodTypeItems: [{ text: 'Days' }, { text: 'Weeks' }]
    })
    const fallback = TrainingLibrarySendTrainingSettings.computed.getPeriodTypeItems.call({
      enumTypes: null,
      periodTypeItems: [{ text: 'Days', value: 'Day' }]
    })

    expect(mapped).toEqual([
      { text: 'Days', value: 'Day' },
      { text: 'Weeks', value: 'Week' }
    ])
    expect(fallback).toEqual([{ text: 'Days', value: 'Day' }])
  })

  it('checkDateIsValid handles schedule modes and missing formData', () => {
    const ctxScheduled = {
      formData: {
        scheduleTypeId: '2',
        enrollmentScheduler: { scheduledDate: '' }
      },
      isDateValid: true
    }
    const invalid = TrainingLibrarySendTrainingSettings.methods.checkDateIsValid.call(ctxScheduled)

    const ctxNow = {
      formData: {
        scheduleTypeId: '1',
        enrollmentScheduler: { scheduledDate: '' }
      },
      isDateValid: false
    }
    const valid = TrainingLibrarySendTrainingSettings.methods.checkDateIsValid.call(ctxNow)

    const ctxMissing = { formData: null, isDateValid: true }
    const missing = TrainingLibrarySendTrainingSettings.methods.checkDateIsValid.call(ctxMissing)

    expect(Boolean(invalid)).toBe(false)
    expect(valid).toBe(true)
    expect(missing).toBe(false)
  })

  it('disabledEndDates returns true for past days and false for future days', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)

    expect(TrainingLibrarySendTrainingSettings.methods.disabledEndDates(yesterday)).toBe(true)
    expect(TrainingLibrarySendTrainingSettings.methods.disabledEndDates(tomorrow)).toBe(false)
  })

  it('getSelectedTimeZone sets timezone from getter or dispatches settings call', () => {
    const dispatch = jest.fn()
    const ctxWithTimezone = {
      $store: {
        getters: { 'common/getSelectedTimeZone': 'UTC' },
        dispatch
      },
      formData: { enrollmentScheduler: { scheduledTimeZoneId: '' } }
    }
    TrainingLibrarySendTrainingSettings.methods.getSelectedTimeZone.call(ctxWithTimezone)
    expect(ctxWithTimezone.formData.enrollmentScheduler.scheduledTimeZoneId).toBe('UTC')
    expect(dispatch).not.toHaveBeenCalled()

    const ctxWithoutTimezone = {
      $store: {
        getters: { 'common/getSelectedTimeZone': '' },
        dispatch
      },
      formData: { enrollmentScheduler: { scheduledTimeZoneId: '' } }
    }
    TrainingLibrarySendTrainingSettings.methods.getSelectedTimeZone.call(ctxWithoutTimezone)
    expect(dispatch).toHaveBeenCalledWith('common/callForSettings')
  })

  it('handleEnrollmentTypeChange updates specific item labels via $set', () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const items = [{ text: 'a' }, { text: 'b' }, { text: 'old-next' }, { text: 'old-in' }]
    const ctx = {
      enrollmentAutoEnrollTypeItems: items,
      $set: set
    }

    TrainingLibrarySendTrainingSettings.methods.handleEnrollmentTypeChange.call(ctx, 'In')

    expect(set).toHaveBeenNthCalledWith(1, items[2], 'text', 'next')
    expect(set).toHaveBeenNthCalledWith(2, items[3], 'text', 'in')
  })

  it('validateForm delegates to refForm', () => {
    const validate = jest.fn(() => true)
    const result = TrainingLibrarySendTrainingSettings.methods.validateForm.call({
      $refs: { refForm: { validate } }
    })
    expect(result).toBe(true)
    expect(validate).toHaveBeenCalled()
  })

  it('handleDeliveryMethodChange updates proxy and sms notification flags', () => {
    const ctx = {
      formData: {
        deliveryMethod: 'Email',
        isProxy: false,
        isSendSMSNotification: false
      }
    }

    TrainingLibrarySendTrainingSettings.methods.handleDeliveryMethodChange.call(
      ctx,
      DELIVERY_METHODS.LMS
    )
    expect(ctx.formData.deliveryMethod).toBe(DELIVERY_METHODS.LMS)
    expect(ctx.formData.isProxy).toBe(true)
    expect(ctx.formData.isSendSMSNotification).toBe(false)

    TrainingLibrarySendTrainingSettings.methods.handleDeliveryMethodChange.call(
      ctx,
      DELIVERY_METHODS.SMS
    )
    expect(ctx.formData.deliveryMethod).toBe(DELIVERY_METHODS.SMS)
    expect(ctx.formData.isProxy).toBe(false)
    expect(ctx.formData.isSendSMSNotification).toBe(true)
  })

  it('scheduleTypeId watcher restores defaults when switching away from scheduled mode', () => {
    const ctx = {
      isDateValid: false,
      selectedTimeZone: 'Europe/Istanbul',
      formData: {
        scheduleTypeId: '2',
        enrollmentScheduler: {
          scheduledDate: '',
          scheduledTimeZoneId: ''
        }
      },
      $moment: () => ({
        format: () => '2026-01-01 10:00'
      })
    }

    TrainingLibrarySendTrainingSettings.watch['formData.scheduleTypeId'].call(ctx, '1')

    expect(ctx.isDateValid).toBe(true)
    expect(ctx.formData.enrollmentScheduler.scheduledDate).toBe('2026-01-01 10:00')
    expect(ctx.formData.enrollmentScheduler.scheduledTimeZoneId).toBe('Europe/Istanbul')
  })
})
