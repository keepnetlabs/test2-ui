import InputSchedule from '@/components/Common/Inputs/InputSchedule.vue'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import { getTimeByTimeZone } from '@/api/company'
import { getTimeZone, getTimeZoneForMoment } from '@/utils/functions'

jest.mock('@/api/company', () => ({
  getTimeByTimeZone: jest.fn()
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  getTimeZone: jest.fn(() => 'MM/DD/YYYY HH:mm'),
  getTimeZoneForMoment: jest.fn(() => 'YYYY-MM-DD HH:mm')
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('InputSchedule.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed isScheduledTimeDisabled follows schedule type', () => {
    expect(
      InputSchedule.computed.isScheduledTimeDisabled.call({
        value: { scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO }
      })
    ).toBe(false)

    expect(
      InputSchedule.computed.isScheduledTimeDisabled.call({
        value: { scheduleTypeId: SCHEDULE_TYPES.SEND_NOW }
      })
    ).toBe(true)
  })

  it('computed scheduledTimeItems maps timezone list', () => {
    const ctx = {
      $store: {
        getters: {
          'common/getTimezones': {
            timeZoneList: [
              { id: 'tz-1', displayName: 'Europe/Istanbul' },
              { id: 'tz-2', displayName: 'America/New_York' }
            ]
          }
        }
      }
    }

    expect(InputSchedule.computed.scheduledTimeItems.call(ctx)).toEqual([
      { text: 'Europe/Istanbul', value: 'tz-1' },
      { text: 'America/New_York', value: 'tz-2' }
    ])
  })

  it('computed user timezone switch and description return correct variants', () => {
    expect(InputSchedule.computed.canRenderUserTimeZoneSwitch.call({ isPhishing: true, isSmishing: false })).toBe(
      true
    )
    expect(InputSchedule.computed.canRenderUserTimeZoneSwitch.call({ isPhishing: false, isSmishing: false })).toBe(
      false
    )

    expect(
      InputSchedule.computed.getUserTimeZoneSwitchDescription.call({ isPhishing: true, isSmishing: false })
    ).toBe("Deliver emails based on the target users' time zone.")
    expect(
      InputSchedule.computed.getUserTimeZoneSwitchDescription.call({ isPhishing: false, isSmishing: true })
    ).toBe("Deliver SMS based on the target users' time zone.")
  })

  it('computed getScheduledTime extracts time part when available', () => {
    expect(
      InputSchedule.computed.getScheduledTime.call({ value: { scheduledDate: '2026-02-20 11:30:00' } })
    ).toBe(' 11:30:00')
    expect(InputSchedule.computed.getScheduledTime.call({ value: { scheduledDate: '2026-02-20' } })).toBe('')
    expect(InputSchedule.computed.getScheduledTime.call({ value: { scheduledDate: '' } })).toBe('')
  })

  it('timezoneFormat watcher updates parsedFormat only when value exists', () => {
    const ctx = { parsedFormat: 'old-format' }

    InputSchedule.watch.timezoneFormat.handler.call(ctx, null)
    expect(ctx.parsedFormat).toBe('old-format')

    InputSchedule.watch.timezoneFormat.handler.call(ctx, { format: 'custom' })
    expect(getTimeZone).toHaveBeenCalledWith(false, { format: 'custom' })
    expect(ctx.parsedFormat).toBe('MM/DD/YYYY HH:mm')
  })

  it('scheduledDateTimeZoneId watcher fetches date only in create flow', async () => {
    getTimeByTimeZone.mockResolvedValueOnce({ data: { data: '2026-02-20 14:00:00' } })
    const createCtx = {
      isEditOrDuplicate: false,
      value: { scheduledDate: '' }
    }

    InputSchedule.watch['value.scheduledDateTimeZoneId'].call(createCtx, 'tz-1')
    await flushPromises()

    expect(getTimeByTimeZone).toHaveBeenCalledWith('tz-1')
    expect(createCtx.value.scheduledDate).toBe('2026-02-20 14:00:00')

    const editCtx = {
      isEditOrDuplicate: true,
      value: { scheduledDate: '' }
    }
    InputSchedule.watch['value.scheduledDateTimeZoneId'].call(editCtx, 'tz-1')
    expect(editCtx.value.scheduledDate).toBe('')
  })

  it('scheduledDate watcher updates isDateValid according to schedule type', () => {
    const ctx = {
      value: { scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO },
      isDateValid: true
    }

    InputSchedule.watch['value.scheduledDate'].call(ctx, '')
    expect(ctx.isDateValid).toBeFalsy()

    InputSchedule.watch['value.scheduledDate'].call(ctx, '2026-02-20 10:00:00')
    expect(ctx.isDateValid).toBe(true)

    const sendNowCtx = {
      value: { scheduleTypeId: SCHEDULE_TYPES.SEND_NOW },
      isDateValid: false
    }
    InputSchedule.watch['value.scheduledDate'].call(sendNowCtx, '')
    expect(sendNowCtx.isDateValid).toBe(true)
  })

  it('selectedTimeZone watcher syncs scheduledDateTimeZoneId', () => {
    const ctx = {
      value: { scheduledDateTimeZoneId: '' }
    }

    InputSchedule.watch.selectedTimeZone.call(ctx, 'tz-2')
    expect(ctx.value.scheduledDateTimeZoneId).toBe('tz-2')
  })

  it('scheduleType watcher resets and fills defaults when not schedule-to', () => {
    const ctx = {
      value: {
        scheduleTypeId: SCHEDULE_TYPES.SAVE_FOR_LATER,
        scheduledDate: '',
        scheduledDateTimeZoneId: '',
        useTargetUserTimeZone: true
      },
      isDateValid: false,
      selectedTimeZone: 'tz-default',
      $moment: jest.fn(() => ({ format: jest.fn(() => '2026-02-20 09:00:00') }))
    }

    InputSchedule.watch['value.scheduleTypeId'].call(ctx, SCHEDULE_TYPES.SAVE_FOR_LATER)

    expect(ctx.value.useTargetUserTimeZone).toBe(false)
    expect(getTimeZoneForMoment).toHaveBeenCalled()
    expect(ctx.value.scheduledDate).toBe('2026-02-20 09:00:00')
    expect(ctx.value.scheduledDateTimeZoneId).toBe('tz-default')
  })

  it('callForGetTimeZones dispatches only when timezone list is empty', () => {
    const dispatch = jest.fn()
    const emptyCtx = {
      $store: {
        getters: { 'common/getTimezones': { timeZoneList: [] } },
        dispatch
      }
    }
    InputSchedule.methods.callForGetTimeZones.call(emptyCtx)
    expect(dispatch).toHaveBeenCalledWith('common/getTimezone')

    const filledCtx = {
      $store: {
        getters: { 'common/getTimezones': { timeZoneList: [{ id: 'tz-1' }] } },
        dispatch
      }
    }
    InputSchedule.methods.callForGetTimeZones.call(filledCtx)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })

  it('getSelectedTimeZone sets selected timezone in create mode and calls settings in edit mode', () => {
    const dispatch = jest.fn()
    const createCtx = {
      isEditOrDuplicate: false,
      value: { scheduledDateTimeZoneId: '' },
      $store: {
        getters: { 'common/getSelectedTimeZone': 'tz-create' },
        dispatch
      }
    }

    InputSchedule.methods.getSelectedTimeZone.call(createCtx)
    expect(createCtx.value.scheduledDateTimeZoneId).toBe('tz-create')

    const editCtx = {
      isEditOrDuplicate: true,
      value: { scheduledDateTimeZoneId: '' },
      $store: {
        getters: { 'common/getSelectedTimeZone': 'tz-create' },
        dispatch
      }
    }
    InputSchedule.methods.getSelectedTimeZone.call(editCtx)
    expect(dispatch).toHaveBeenCalledWith('common/callForSettings')
  })

  it('validateInput handles schedule types and required fields', () => {
    const sendNowCtx = {
      value: {
        scheduleTypeId: SCHEDULE_TYPES.SEND_NOW,
        scheduledDate: '',
        scheduledDateTimeZoneId: ''
      },
      isDateValid: false
    }
    expect(InputSchedule.methods.validateInput.call(sendNowCtx)).toBe(true)

    const invalidCtx = {
      value: {
        scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
        scheduledDate: '',
        scheduledDateTimeZoneId: 'tz-1'
      },
      isDateValid: true
    }
    expect(InputSchedule.methods.validateInput.call(invalidCtx)).toBe(false)
    expect(invalidCtx.isDateValid).toBe(false)

    const validCtx = {
      value: {
        scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
        scheduledDate: '2026-02-20 10:00:00',
        scheduledDateTimeZoneId: 'tz-1'
      },
      isDateValid: true
    }
    expect(InputSchedule.methods.validateInput.call(validCtx)).toBe(true)
  })
})
