import {
  ACTION_STATUSES,
  axiosPayload,
  CAMPAIGN_TYPE,
  getStatusBadgeProps,
  frequencyItems,
  isIdleOrScheduledStatus,
  METHOD_TYPES,
  SCENARIO_DISTRIBUTION,
  SCENARIO_DISTRIBUTION_TEXTS,
  scenarioDistributionFilterItems,
  scenarioDistributionItems,
  SCHEDULE_TYPES,
  SEND_RANDOMLY_USERS_CALCULATE_TYPES,
  STATUS_FILTER_ITEMS
} from '@/components/CampaignManager/utils'

describe('CampaignManager utils (extra branch coverage)', () => {
  describe('isIdleOrScheduledStatus', () => {
    it('treats only idle and scheduled as eligible (boundary vs similar strings)', () => {
      expect(isIdleOrScheduledStatus('Idle')).toBe(true)
      expect(isIdleOrScheduledStatus('Scheduled')).toBe(true)
      expect(isIdleOrScheduledStatus('IdleExtra')).toBe(false)
      expect(isIdleOrScheduledStatus('PreScheduled')).toBe(false)
      expect(isIdleOrScheduledStatus('NotIdle')).toBe(false)
    })

    it('accepts internal spaces in scheduled after trim', () => {
      expect(isIdleOrScheduledStatus('  sched uled  ')).toBe(false)
      expect(isIdleOrScheduledStatus('  scheduled  ')).toBe(true)
    })

    it('returns false for non-string status values', () => {
      expect(isIdleOrScheduledStatus(null)).toBe(false)
      expect(isIdleOrScheduledStatus(undefined)).toBe(false)
      expect(isIdleOrScheduledStatus(0)).toBe(false)
      expect(isIdleOrScheduledStatus(NaN)).toBe(false)
      expect(isIdleOrScheduledStatus({})).toBe(false)
    })

    it('returns false for empty string and whitespace-only after trim', () => {
      expect(isIdleOrScheduledStatus('')).toBe(false)
      expect(isIdleOrScheduledStatus('   ')).toBe(false)
    })
  })

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

    it('returns undefined for Resumed (API status not mapped to badge)', () => {
      expect(getStatusBadgeProps('Resumed')).toBeUndefined()
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

    it('maps Paused, Scheduled, Running, Idle, Completed, and Individual Printout', () => {
      expect(getStatusBadgeProps('Paused')).toEqual({ color: '#B6791D', text: 'Paused' })
      expect(getStatusBadgeProps('Scheduled')).toEqual({ color: '#757575', text: 'Scheduled' })
      expect(getStatusBadgeProps('Running')).toEqual({ color: '#1173C1', text: 'Running' })
      expect(getStatusBadgeProps('Idle')).toEqual({ color: '#0198AC', text: 'Idle' })
      expect(getStatusBadgeProps('Completed')).toEqual({ color: '#217124', text: 'Completed' })
      expect(getStatusBadgeProps('Individual Printout')).toEqual({
        color: '#757575',
        text: 'Individual Printout'
      })
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
      expect(SCENARIO_DISTRIBUTION.AI_ALLY_SELECTS_SCENARIO_FOR_EACH_USER).toBe(3)
      expect(SCENARIO_DISTRIBUTION.AGENTIC_AI_EXPLICIT_USER_SCENARIO_MAPPING).toBe(4)
    })

    it('SCENARIO_DISTRIBUTION_TEXTS has 5 entries', () => {
      expect(SCENARIO_DISTRIBUTION_TEXTS).toHaveLength(5)
      expect(SCENARIO_DISTRIBUTION_TEXTS[0]).toBe('Manually')
      expect(SCENARIO_DISTRIBUTION_TEXTS[4]).toBe('Agentic AI explicit user-scenario mapping')
    })

    it('CAMPAIGN_TYPE exposes distinct numeric scenario kinds', () => {
      const values = Object.values(CAMPAIGN_TYPE)
      expect(new Set(values).size).toBe(values.length)
      expect(CAMPAIGN_TYPE.Phishing).toBe(1)
      expect(CAMPAIGN_TYPE.Smishing).toBe(2)
      expect(CAMPAIGN_TYPE.Quishing).toBe(3)
      expect(CAMPAIGN_TYPE.Callback).toBe(4)
      expect(CAMPAIGN_TYPE.Vishing).toBe(5)
    })
  })

  describe('request and enum exports (contract)', () => {
    it('axiosPayload has AND/OR filter groups for list queries', () => {
      const groups = axiosPayload.filter.FilterGroups
      expect(groups).toHaveLength(2)
      expect(groups[0].Condition).toBe('AND')
      expect(groups[1].Condition).toBe('OR')
    })

    it('METHOD_TYPES and schedule/random enums use expected string values', () => {
      expect(METHOD_TYPES.CLICK_ONLY).toBe('Click-Only')
      expect(METHOD_TYPES.MFA).toBe('MFA')
      expect(SCHEDULE_TYPES.SEND_NOW).toBe('1')
      expect(SCHEDULE_TYPES.SCHEDULE_TO).toBe('3')
      expect(SEND_RANDOMLY_USERS_CALCULATE_TYPES.PERCENTAGE).toBe('1')
      expect(SEND_RANDOMLY_USERS_CALCULATE_TYPES.USERS).toBe('2')
    })

    it('ACTION_STATUSES values are unique display strings', () => {
      const values = Object.values(ACTION_STATUSES)
      expect(new Set(values).size).toBe(values.length)
      expect(ACTION_STATUSES.PAUSE).toBe('Paused')
      expect(ACTION_STATUSES.CANCEL).toBe('Canceled')
    })

    it('STATUS_FILTER_ITEMS mirrors ACTION_STATUSES for filters', () => {
      expect(STATUS_FILTER_ITEMS).toHaveLength(Object.keys(ACTION_STATUSES).length)
      expect(STATUS_FILTER_ITEMS[0]).toEqual({
        text: ACTION_STATUSES.RUNNING,
        value: ACTION_STATUSES.RUNNING
      })
    })

    it('scenario distribution filter and select items stay aligned in length', () => {
      expect(scenarioDistributionFilterItems).toHaveLength(5)
      expect(scenarioDistributionItems).toHaveLength(5)
      const values = scenarioDistributionItems.map((i) => i.value)
      expect(new Set(values)).toEqual(new Set([0, 1, 2, 3, 4]))
    })
  })
})
