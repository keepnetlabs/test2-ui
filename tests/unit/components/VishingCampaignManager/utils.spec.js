import {
  getStatusBadgeProps,
  sendCallsOnDaysOptions,
  sendCallsOnDaysOptionsShort,
  recipientTypes,
  sendCallsOverTypes,
  getSendCallOnDays,
  getScheduleType
} from '@/components/VishingCampaignManager/utils'

describe('VishingCampaignManager utils', () => {
  it('maps status badges', () => {
    expect(getStatusBadgeProps('Completed')).toEqual({ color: '#217124', text: 'Completed' })
    expect(getStatusBadgeProps('Scheduled')).toEqual({ color: '#757575', text: 'Scheduled' })
    expect(getStatusBadgeProps('Error')).toEqual({ color: '#F56C6C', text: 'Error', outline: false })
  })

  it('exports option collections', () => {
    expect(sendCallsOnDaysOptions).toHaveLength(7)
    expect(sendCallsOnDaysOptionsShort).toHaveLength(7)
    expect(recipientTypes.map((i) => i.value)).toEqual([1, 2])
    expect(sendCallsOverTypes.map((i) => i.value)).toEqual(['days', 'weeks'])
  })

  it('decodes day bitmask and schedule type', () => {
    expect(getSendCallOnDays(5)).toEqual([1, 4])
    expect(getScheduleType(2)).toBe('2')
    expect(getScheduleType('SendNow')).toBe('1')
    expect(getScheduleType('SaveForLater')).toBe('2')
    expect(getScheduleType('SomethingElse')).toBe('3')
    expect(getScheduleType(null)).toBe('1')
  })
})
