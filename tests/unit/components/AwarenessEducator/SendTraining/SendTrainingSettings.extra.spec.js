jest.mock('@/api/company', () => ({
  getTimeByTimeZone: jest.fn(() => Promise.resolve({ data: { data: '2026-01-01 10:00:00' } }))
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  getTimeZone: jest.fn(() => 'DD/MM/YYYY HH:mm'),
  getTimeZoneForMoment: jest.fn(() => 'YYYY-MM-DD HH:mm:ss')
}))

import SendTrainingSettings from '@/components/AwarenessEducator/SendTraining/SendTrainingSettings.vue'
import { getTimeByTimeZone } from '@/api/company'

describe('SendTrainingSettings.vue (extra branch coverage)', () => {
  it('isScheduledTimeDisabled computed branch', () => {
    expect(
      SendTrainingSettings.computed.isScheduledTimeDisabled.call({
        formData: { scheduleTypeId: '1' }
      })
    ).toBe(true)
    expect(
      SendTrainingSettings.computed.isScheduledTimeDisabled.call({
        formData: { scheduleTypeId: '2' }
      })
    ).toBe(false)
  })

  it('getPeriodTypeItems maps enumTypes when available and fallback otherwise', () => {
    const mapped = SendTrainingSettings.computed.getPeriodTypeItems.call({
      enumTypes: { EmailPeriodTypeEnum: [{ name: 'Day' }, { name: 'Week' }] },
      periodTypeItems: [{ text: 'Days' }, { text: 'Weeks' }]
    })
    expect(mapped).toEqual([
      { text: 'Days', value: 'Day' },
      { text: 'Weeks', value: 'Week' }
    ])

    const fallback = SendTrainingSettings.computed.getPeriodTypeItems.call({
      enumTypes: null,
      periodTypeItems: [{ text: 'Days', value: 'Day' }]
    })
    expect(fallback).toEqual([{ text: 'Days', value: 'Day' }])
  })

  it('disabledEndDates returns true for past date and false for today/future', () => {
    const past = new Date(Date.now() - 86400000)
    const now = new Date()
    expect(SendTrainingSettings.methods.disabledEndDates.call({}, past)).toBe(true)
    expect(SendTrainingSettings.methods.disabledEndDates.call({}, now)).toBe(false)
  })

  it('getSelectedTimeZone sets timezone when getter exists', () => {
    const ctx = {
      formData: { enrollmentScheduler: { scheduledTimeZoneId: '' } },
      $store: { getters: { 'common/getSelectedTimeZone': 'UTC' }, dispatch: jest.fn() }
    }
    SendTrainingSettings.methods.getSelectedTimeZone.call(ctx)
    expect(ctx.formData.enrollmentScheduler.scheduledTimeZoneId).toBe('UTC')
  })

  it('getSelectedTimeZone dispatches settings call when getter missing', () => {
    const dispatch = jest.fn()
    const ctx = {
      formData: { enrollmentScheduler: { scheduledTimeZoneId: '' } },
      $store: { getters: {}, dispatch }
    }
    SendTrainingSettings.methods.getSelectedTimeZone.call(ctx)
    expect(dispatch).toHaveBeenCalledWith('common/callForSettings')
  })

  it('handleEnrollmentTypeChange updates static labels', () => {
    const ctx = {
      enrollmentAutoEnrollTypeItems: [{}, {}, { text: '' }, { text: '' }],
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }
    SendTrainingSettings.methods.handleEnrollmentTypeChange.call(ctx)
    expect(ctx.enrollmentAutoEnrollTypeItems[2].text).toBe('next')
    expect(ctx.enrollmentAutoEnrollTypeItems[3].text).toBe('in')
  })

  it('watch timezoneFormat updates parsedFormat when value exists', () => {
    const ctx = { parsedFormat: '' }
    SendTrainingSettings.watch.timezoneFormat.handler.call(ctx, 'utc-format')
    expect(ctx.parsedFormat).toBe('DD/MM/YYYY HH:mm')
  })

  it('watch scheduledTimeZoneId loads time and updates scheduledDate', async () => {
    const ctx = {
      formData: { enrollmentScheduler: { scheduledDate: '', scheduledTimeZoneId: '' } }
    }
    SendTrainingSettings.watch['formData.enrollmentScheduler.scheduledTimeZoneId'].call(
      ctx,
      'UTC'
    )
    await Promise.resolve()
    expect(getTimeByTimeZone).toHaveBeenCalledWith('UTC')
    expect(ctx.formData.enrollmentScheduler.scheduledDate).toBe('2026-01-01 10:00:00')
  })

  it('watch selectedTimeZone sets formData timezone id', () => {
    const ctx = {
      formData: { enrollmentScheduler: { scheduledTimeZoneId: '' } }
    }
    SendTrainingSettings.watch.selectedTimeZone.call(ctx, 'Europe/Istanbul')
    expect(ctx.formData.enrollmentScheduler.scheduledTimeZoneId).toBe('Europe/Istanbul')
  })

  it('watch scheduleTypeId resets date validation and default date/timezone when missing', () => {
    const ctx = {
      isDateValid: false,
      selectedTimeZone: 'UTC',
      formData: {
        scheduleTypeId: '1',
        enrollmentScheduler: { scheduledDate: '', scheduledTimeZoneId: '' }
      },
      $moment: () => ({ format: () => '2026-02-26 10:00:00' })
    }
    SendTrainingSettings.watch['formData.scheduleTypeId'].call(ctx, '1')
    expect(ctx.isDateValid).toBe(true)
    expect(ctx.formData.enrollmentScheduler.scheduledDate).toBe('2026-02-26 10:00:00')
    expect(ctx.formData.enrollmentScheduler.scheduledTimeZoneId).toBe('UTC')
  })

  it('checkDateIsValid returns false when formData is missing', () => {
    const ctx = { formData: null, isDateValid: true }
    const result = SendTrainingSettings.methods.checkDateIsValid.call(ctx)
    expect(result).toBe(false)
    expect(ctx.isDateValid).toBe(false)
  })
})
