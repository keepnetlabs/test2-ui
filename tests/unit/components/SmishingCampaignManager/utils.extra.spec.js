import {
  getStatusBadgeProps,
  axiosPayload,
  METHOD_TYPES,
  SCHEDULE_TYPES,
  DISTRIBUTION_TYPES,
  COLUMNS
} from '@/components/SmishingCampaignManager/utils'

describe('SmishingCampaignManager utils (extra branch coverage)', () => {
  describe('getStatusBadgeProps', () => {
    it('returns undefined for null and undefined', () => {
      expect(getStatusBadgeProps(null)).toBeUndefined()
      expect(getStatusBadgeProps(undefined)).toBeUndefined()
    })

    it('Error status includes outline false', () => {
      expect(getStatusBadgeProps('Error')).toEqual({
        color: '#F56C6C',
        text: 'Error',
        outline: false
      })
    })

    it('Cancelled and Canceled map to same badge', () => {
      const expected = { color: '#B6791D', text: 'Cancelled' }
      expect(getStatusBadgeProps('Cancelled')).toEqual(expected)
      expect(getStatusBadgeProps('Canceled')).toEqual(expected)
    })
  })

  describe('axiosPayload structure', () => {
    it('has FilterGroups with AND and OR conditions', () => {
      expect(axiosPayload.filter.Condition).toBe('AND')
      expect(axiosPayload.filter.FilterGroups).toHaveLength(2)
      expect(axiosPayload.filter.FilterGroups[0].Condition).toBe('AND')
      expect(axiosPayload.filter.FilterGroups[1].Condition).toBe('OR')
    })

    it('has default pagination', () => {
      expect(axiosPayload.pageNumber).toBe(1)
      expect(axiosPayload.pageSize).toBe(10)
      expect(axiosPayload.ascending).toBe(false)
    })
  })

  describe('COLUMNS', () => {
    it('TARGET_USERS_ITEM_TABLE has type text and correct property', () => {
      expect(COLUMNS.TARGET_USERS_ITEM_TABLE.type).toBe('text')
      expect(COLUMNS.TARGET_USERS_ITEM_TABLE.property).toBe('totalTargetUserCount')
    })

    it('STATUS column has slot type', () => {
      expect(COLUMNS.STATUS.type).toBe('slot')
    })
  })

  describe('constants', () => {
    it('METHOD_TYPES has expected values', () => {
      expect(METHOD_TYPES.CLICK_ONLY).toBe('Click-Only')
      expect(METHOD_TYPES.MFA).toBe('MFA')
    })

    it('SCHEDULE_TYPES and DISTRIBUTION_TYPES', () => {
      expect(SCHEDULE_TYPES.SAVE_FOR_LATER).toBe('2')
      expect(DISTRIBUTION_TYPES.QUISHING_INDIVIDUAL_PRINTOUT).toBe('4')
    })
  })
})
