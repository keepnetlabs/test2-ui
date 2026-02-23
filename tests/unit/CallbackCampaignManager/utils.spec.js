import {
  ACTION_STATUSES,
  COLUMNS,
  DISTRIBUTION_START_TYPES,
  DISTRIBUTION_TYPES,
  METHOD_TYPES,
  SCHEDULE_TYPES,
  SEND_RANDOMLY_USERS_CALCULATE_TYPES,
  getStatusBadgeProps
} from '@/components/CallbackCampaignManager/utils'

describe('CallbackCampaignManager/utils.js', () => {
  it('exports expected static constants', () => {
    expect(METHOD_TYPES.CLICK_ONLY).toBe('Click-Only')
    expect(SCHEDULE_TYPES.SEND_NOW).toBe('1')
    expect(SEND_RANDOMLY_USERS_CALCULATE_TYPES.PERCENTAGE).toBe('1')
    expect(DISTRIBUTION_TYPES.PHISHING).toBe('1')
    expect(DISTRIBUTION_START_TYPES.NOW).toBe(1)
    expect(ACTION_STATUSES.ERROR).toBe('Error')
    expect(COLUMNS.CAMPAIGN_NAME.property).toBe('name')
    expect(COLUMNS.STATUS.filterableType).toBe('select')
  })

  it('returns badge props for all known statuses', () => {
    expect(getStatusBadgeProps('Completed')).toEqual({ color: '#217124', text: 'Completed' })
    expect(getStatusBadgeProps('Running')).toEqual({ color: '#1173C1', text: 'Running' })
    expect(getStatusBadgeProps('Idle')).toEqual({ color: '#0198AC', text: 'Idle' })
    expect(getStatusBadgeProps('Paused')).toEqual({ color: '#B6791D', text: 'Paused' })
    expect(getStatusBadgeProps('Cancelled')).toEqual({ color: '#B6791D', text: 'Cancelled' })
    expect(getStatusBadgeProps('Canceled')).toEqual({ color: '#B6791D', text: 'Cancelled' })
    expect(getStatusBadgeProps('Scheduled')).toEqual({ color: '#757575', text: 'Scheduled' })
    expect(getStatusBadgeProps('Error')).toEqual({
      color: '#F56C6C',
      text: 'Error',
      outline: false
    })
  })

  it('returns undefined for unknown status', () => {
    expect(getStatusBadgeProps('Unknown')).toBe(undefined)
  })
})
