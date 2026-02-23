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
  describe('getStatusBadgeProps', () => {
    it('maps all status badge variants', () => {
      expect(getStatusBadgeProps('Completed')).toEqual({ color: '#217124', text: 'Completed' })
      expect(getStatusBadgeProps('Running')).toEqual({ color: '#1173C1', text: 'Running' })
      expect(getStatusBadgeProps('Idle')).toEqual({ color: '#0198AC', text: 'Idle' })
      expect(getStatusBadgeProps('Scheduled')).toEqual({ color: '#757575', text: 'Scheduled' })
      expect(getStatusBadgeProps('Cancelled')).toEqual({ color: '#B83A3A', text: 'Cancelled' })
      expect(getStatusBadgeProps('Error')).toEqual({ color: '#F56C6C', text: 'Error', outline: false })
    })

    it('returns undefined for unknown status', () => {
      expect(getStatusBadgeProps('Unknown')).toBeUndefined()
      expect(getStatusBadgeProps('')).toBeUndefined()
    })
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
