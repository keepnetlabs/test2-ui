import {
  ACTIVITY_TYPE_COLOR_MAP,
  ACTIVITY_TYPES_FAIL_MAP,
  ACTIVITY_TYPES_NEUTRAL_MAP,
  ACTIVITY_TYPES_OPENED_MAP,
  userActivityDetailsFilters
} from '@/components/GamificationReport/utils'

describe('GamificationReport utils', () => {
  it('exports activity color map and behavior maps', () => {
    expect(ACTIVITY_TYPE_COLOR_MAP['Clicked Link']).toBe('#F56C6C')
    expect(ACTIVITY_TYPES_FAIL_MAP['Exam Failed']).toBe(true)
    expect(ACTIVITY_TYPES_NEUTRAL_MAP['SMS Sent']).toBe(true)
    expect(ACTIVITY_TYPES_OPENED_MAP['Email Opened']).toBe(true)
  })

  it('exports user activity filters with expected keys', () => {
    expect(userActivityDetailsFilters).toHaveLength(3)
    expect(userActivityDetailsFilters.map((f) => f.key)).toEqual([
      'activityType',
      'product',
      'difficulty'
    ])
  })
})
