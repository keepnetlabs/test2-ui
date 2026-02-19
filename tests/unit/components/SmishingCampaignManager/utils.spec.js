import {
  METHOD_TYPES,
  SCHEDULE_TYPES,
  SEND_RANDOMLY_USERS_CALCULATE_TYPES,
  ACTION_STATUSES,
  getStatusBadgeProps,
  methods,
  difficulties,
  DISTRIBUTION_TYPES,
  DISTRIBUTION_START_TYPES
} from '@/components/SmishingCampaignManager/utils'

describe('SmishingCampaignManager utils', () => {
  it('exports core enum-like constants', () => {
    expect(METHOD_TYPES).toEqual({
      CLICK_ONLY: 'Click-Only',
      MULTIPLE_METHOD: 'Multiple Method',
      DATA_SUBMISSION: 'Data Submission',
      MFA: 'MFA'
    })
    expect(SCHEDULE_TYPES.SEND_NOW).toBe('1')
    expect(SEND_RANDOMLY_USERS_CALCULATE_TYPES.USERS).toBe('2')
    expect(ACTION_STATUSES.ERROR).toBe('Error')
    expect(DISTRIBUTION_TYPES.SMISHING).toBe('3')
    expect(DISTRIBUTION_START_TYPES.NOW).toBe(1)
  })

  it('maps campaign statuses to badge props', () => {
    expect(getStatusBadgeProps('Completed')).toEqual({ color: '#217124', text: 'Completed' })
    expect(getStatusBadgeProps('Running')).toEqual({ color: '#1173C1', text: 'Running' })
    expect(getStatusBadgeProps('Paused')).toEqual({ color: '#B6791D', text: 'Paused' })
    expect(getStatusBadgeProps('Canceled')).toEqual({ color: '#B6791D', text: 'Cancelled' })
    expect(getStatusBadgeProps('Error')).toEqual({
      color: '#F56C6C',
      text: 'Error',
      outline: false
    })
  })

  it('exports methods and difficulties lists', () => {
    expect(methods).toHaveLength(3)
    expect(methods.map((m) => m.text)).toEqual(['Click-Only', 'Data Submission', 'MFA'])
    expect(difficulties.map((d) => d.text)).toEqual(['Easy', 'Medium', 'Hard'])
  })
})
