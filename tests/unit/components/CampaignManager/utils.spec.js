import {
  CAMPAIGN_TYPE,
  METHOD_TYPES,
  scenarioDistributionFilterItems,
  scenarioDistributionItems,
  ACTION_STATUSES,
  STATUS_FILTER_ITEMS,
  getStatusBadgeProps,
  isIdleOrScheduledStatus,
  SCENARIO_DISTRIBUTION,
  SCENARIO_DISTRIBUTION_TEXTS,
  COLUMNS
} from '@/components/CampaignManager/utils'

describe('CampaignManager utils', () => {
  it('exports campaign and scenario constants', () => {
    expect(CAMPAIGN_TYPE.Phishing).toBe(1)
    expect(METHOD_TYPES.ATTACHMENT).toBe('Attachment')
    expect(scenarioDistributionFilterItems).toHaveLength(5)
    expect(scenarioDistributionItems).toHaveLength(5)
    expect(SCENARIO_DISTRIBUTION.SAME_SCENARIO_FOR_ALL).toBe(2)
    expect(SCENARIO_DISTRIBUTION.AGENTIC_AI_EXPLICIT_USER_SCENARIO_MAPPING).toBe(4)
    expect(SCENARIO_DISTRIBUTION_TEXTS[0]).toBe('Manually')
    expect(SCENARIO_DISTRIBUTION_TEXTS[4]).toBe('Agentic AI explicit user-scenario mapping')
  })

  it('builds status filter items from action statuses', () => {
    expect(STATUS_FILTER_ITEMS.length).toBe(Object.values(ACTION_STATUSES).length)
    expect(STATUS_FILTER_ITEMS.some((i) => i.value === 'Scheduled')).toBe(true)
  })

  describe('getStatusBadgeProps', () => {
    it('maps all status badge variants', () => {
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
      expect(getStatusBadgeProps('Individual Printout')).toEqual({
        color: '#757575',
        text: 'Individual Printout'
      })
    })

    it('returns undefined for unknown status', () => {
      expect(getStatusBadgeProps('Unknown')).toBeUndefined()
    })
  })

  describe('isIdleOrScheduledStatus', () => {
    it('returns true for Idle/Scheduled regardless of casing', () => {
      expect(isIdleOrScheduledStatus('Idle')).toBe(true)
      expect(isIdleOrScheduledStatus('idle')).toBe(true)
      expect(isIdleOrScheduledStatus('IDLE')).toBe(true)
      expect(isIdleOrScheduledStatus('  idle  ')).toBe(true)
      expect(isIdleOrScheduledStatus('Scheduled')).toBe(true)
      expect(isIdleOrScheduledStatus('scheduled')).toBe(true)
      expect(isIdleOrScheduledStatus('SCHEDULED')).toBe(true)
      expect(isIdleOrScheduledStatus('  Scheduled  ')).toBe(true)
      expect(isIdleOrScheduledStatus('ScHeDuLeD')).toBe(true)
    })

    it('matches ACTION_STATUSES canonical strings used by API filters', () => {
      expect(isIdleOrScheduledStatus(ACTION_STATUSES.IDLE)).toBe(true)
      expect(isIdleOrScheduledStatus(ACTION_STATUSES.SCHEDULED)).toBe(true)
    })

    it('returns false for other statuses, whitespace-only, and non-strings', () => {
      expect(isIdleOrScheduledStatus('Running')).toBe(false)
      expect(isIdleOrScheduledStatus('Completed')).toBe(false)
      expect(isIdleOrScheduledStatus('Paused')).toBe(false)
      expect(isIdleOrScheduledStatus('Error')).toBe(false)
      expect(isIdleOrScheduledStatus('Idle ')).toBe(true)
      expect(isIdleOrScheduledStatus('')).toBe(false)
      expect(isIdleOrScheduledStatus('   ')).toBe(false)
      expect(isIdleOrScheduledStatus(null)).toBe(false)
      expect(isIdleOrScheduledStatus(undefined)).toBe(false)
    })

    it('coerces non-string status via String() for edge payloads', () => {
      expect(isIdleOrScheduledStatus(42)).toBe(false)
      expect(isIdleOrScheduledStatus({})).toBe(false)
    })

    it('returns false for tab or newline-only strings after trim', () => {
      expect(isIdleOrScheduledStatus('\t')).toBe(false)
      expect(isIdleOrScheduledStatus('\n')).toBe(false)
    })

    it('returns false for boolean and array status values', () => {
      expect(isIdleOrScheduledStatus(true)).toBe(false)
      expect(isIdleOrScheduledStatus(false)).toBe(false)
      expect(isIdleOrScheduledStatus([])).toBe(false)
    })
  })

  describe('COLUMNS', () => {
    it('TARGET_USERS_ITEM_TABLE has type text and correct property', () => {
      // Default column def stays type text; Item/Frequency tables override to type
      // 'slot' in computed columns so Users can render Groups + dialog (DataTable
      // only mounts datatable-custom-column when col.type === 'slot').
      expect(COLUMNS.TARGET_USERS_ITEM_TABLE.type).toBe('text')
      expect(COLUMNS.TARGET_USERS_ITEM_TABLE.property).toBe('totalTargetUserCount')
      expect(COLUMNS.TARGET_USERS_ITEM_TABLE.emptyText).toBe(0)
    })

    it('STATUS column has type slot for custom badge rendering', () => {
      expect(COLUMNS.STATUS.type).toBe('slot')
      expect(COLUMNS.STATUS.property).toBeDefined()
    })

    it('METHOD filter includes Double Barrel', () => {
      const values = COLUMNS.METHOD.filterableItems.map((i) => i.value)
      expect(values).toContain('Double Barrel')
      // existing method options remain intact
      expect(values).toEqual(
        expect.arrayContaining([
          'Multiple Method',
          'Click-Only',
          'Data Submission',
          'Attachment',
          'MFA',
          'Double Barrel'
        ])
      )
    })
  })
})
