import {
  ACTIVITY_TYPE_COLOR_MAP,
  ACTIVITY_TYPES_FAIL_MAP,
  ACTIVITY_TYPES_NEUTRAL_MAP,
  ACTIVITY_TYPES_OPENED_MAP,
  userActivityDetailsFilters
} from '@/components/GamificationReport/utils'

describe('GamificationReport utils', () => {
  describe('activity maps', () => {
    it('contains expected color mappings for key activity types', () => {
      expect(ACTIVITY_TYPE_COLOR_MAP['Reported Email']).toBe('#43A047')
      expect(ACTIVITY_TYPE_COLOR_MAP['Clicked Link']).toBe('#F56C6C')
      expect(ACTIVITY_TYPE_COLOR_MAP['Email Sent']).toBe('#1173C1')
    })

    it('marks fail-type actions correctly', () => {
      expect(ACTIVITY_TYPES_FAIL_MAP['Clicked Link']).toBe(true)
      expect(ACTIVITY_TYPES_FAIL_MAP['Exam Failed']).toBe(true)
      expect(ACTIVITY_TYPES_FAIL_MAP['Training Completed']).toBe(false)
    })

    it('marks neutral actions correctly', () => {
      expect(ACTIVITY_TYPES_NEUTRAL_MAP['Email Sent']).toBe(true)
      expect(ACTIVITY_TYPES_NEUTRAL_MAP['Call Sent']).toBe(true)
      expect(ACTIVITY_TYPES_NEUTRAL_MAP['Reported']).toBe(false)
    })

    it('contains only opened email activity aliases in opened map', () => {
      expect(ACTIVITY_TYPES_OPENED_MAP).toEqual({
        'Email Opened': true,
        'Opened Email': true
      })
    })
  })

  describe('user activity filter schema', () => {
    it('has 3 default filters with stable keys', () => {
      expect(userActivityDetailsFilters).toHaveLength(3)
      expect(userActivityDetailsFilters.map((f) => f.key)).toEqual([
        'activityType',
        'product',
        'difficulty'
      ])
    })

    it('defines required shape fields for each filter', () => {
      userActivityDetailsFilters.forEach((filter) => {
        expect(filter).toHaveProperty('text')
        expect(filter).toHaveProperty('icon')
        expect(filter).toHaveProperty('key')
        expect(filter).toHaveProperty('show', true)
        expect(filter).toHaveProperty('filterType', 'search')
        expect(filter).toHaveProperty('operator', 'Include')
        expect(filter).toHaveProperty('activeOperator', 'Include')
        expect(filter).toHaveProperty('isFilterActive', false)
        expect(Array.isArray(filter.items)).toBe(true)
        expect(Array.isArray(filter.value)).toBe(true)
        expect(Array.isArray(filter.activeValue)).toBe(true)
      })
    })
  })
})

