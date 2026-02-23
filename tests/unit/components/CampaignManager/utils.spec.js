import {
  CAMPAIGN_TYPE,
  METHOD_TYPES,
  scenarioDistributionFilterItems,
  scenarioDistributionItems,
  ACTION_STATUSES,
  STATUS_FILTER_ITEMS,
  getStatusBadgeProps,
  SCENARIO_DISTRIBUTION,
  SCENARIO_DISTRIBUTION_TEXTS
} from '@/components/CampaignManager/utils'

describe('CampaignManager utils', () => {
  it('exports campaign and scenario constants', () => {
    expect(CAMPAIGN_TYPE.Phishing).toBe(1)
    expect(METHOD_TYPES.ATTACHMENT).toBe('Attachment')
    expect(scenarioDistributionFilterItems).toHaveLength(4)
    expect(scenarioDistributionItems).toHaveLength(4)
    expect(SCENARIO_DISTRIBUTION.SAME_SCENARIO_FOR_ALL).toBe(2)
    expect(SCENARIO_DISTRIBUTION_TEXTS[0]).toBe('Manually')
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
})
