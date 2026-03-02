import {
  getStatusBadgeProps,
  frequencyItems,
  SCENARIO_DISTRIBUTION,
  SCENARIO_DISTRIBUTION_TEXTS
} from '@/components/CampaignManager/utils'

describe('CampaignManager utils (extra branch coverage)', () => {
  describe('getStatusBadgeProps', () => {
    it('returns undefined for empty string', () => {
      expect(getStatusBadgeProps('')).toBeUndefined()
    })

    it('returns undefined for null and undefined', () => {
      expect(getStatusBadgeProps(null)).toBeUndefined()
      expect(getStatusBadgeProps(undefined)).toBeUndefined()
    })

    it('returns undefined for unknown status', () => {
      expect(getStatusBadgeProps('Unknown')).toBeUndefined()
      expect(getStatusBadgeProps('CustomStatus')).toBeUndefined()
    })

    it('Error status includes outline false', () => {
      expect(getStatusBadgeProps('Error')).toEqual({
        color: '#F56C6C',
        text: 'Error',
        outline: false
      })
    })

    it('Cancelled and Canceled both map to same badge', () => {
      const expected = { color: '#B6791D', text: 'Cancelled' }
      expect(getStatusBadgeProps('Cancelled')).toEqual(expected)
      expect(getStatusBadgeProps('Canceled')).toEqual(expected)
    })
  })

  describe('frequencyItems and scenario constants', () => {
    it('frequencyItems has expected structure', () => {
      expect(frequencyItems).toHaveLength(5)
      expect(frequencyItems[0]).toEqual({ text: 'One Time', value: 0 })
      expect(frequencyItems[4]).toEqual({ text: 'Quarterly', value: 4 })
    })

    it('SCENARIO_DISTRIBUTION has expected values', () => {
      expect(SCENARIO_DISTRIBUTION.MANUALLY).toBe(0)
      expect(SCENARIO_DISTRIBUTION.RANDOM_SCENARIO_FOR_EACH).toBe(1)
      expect(SCENARIO_DISTRIBUTION.SAME_SCENARIO_FOR_ALL).toBe(2)
    })

    it('SCENARIO_DISTRIBUTION_TEXTS has 4 entries', () => {
      expect(SCENARIO_DISTRIBUTION_TEXTS).toHaveLength(4)
      expect(SCENARIO_DISTRIBUTION_TEXTS[0]).toBe('Manually')
    })
  })
})
