import {
  METHOD_TYPES,
  SCHEDULE_TYPES,
  ACTION_STATUSES,
  getStatusBadgeProps,
  DISTRIBUTION_TYPES,
  DISTRIBUTION_START_TYPES
} from '@/components/CallbackCampaignManager/utils'

describe('CallbackCampaignManager utils', () => {
  it('exports constant groups', () => {
    expect(METHOD_TYPES.MFA).toBe('MFA')
    expect(SCHEDULE_TYPES.SEND_NOW).toBe('1')
    expect(ACTION_STATUSES.ERROR).toBe('Error')
    expect(DISTRIBUTION_TYPES.SMISHING).toBe('3')
    expect(DISTRIBUTION_START_TYPES.SCHEDULED).toBe(2)
  })

  it('maps known status badge props', () => {
    expect(getStatusBadgeProps('Completed')).toEqual({ color: '#217124', text: 'Completed' })
    expect(getStatusBadgeProps('Canceled')).toEqual({ color: '#B6791D', text: 'Cancelled' })
    expect(getStatusBadgeProps('Error')).toEqual({
      color: '#F56C6C',
      text: 'Error',
      outline: false
    })
  })
})
