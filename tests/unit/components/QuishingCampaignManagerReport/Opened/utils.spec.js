import {
  COLUMNS,
  getStatusBadgeProps,
  UNUSUAL_TYPES,
  ACTIVITY_TYPES
} from '@/components/QuishingCampaignManagerReport/Opened/utils'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('QuishingCampaignManagerReport Opened utils', () => {
  it('exposes expected table columns', () => {
    expect(COLUMNS.FIRST_NAME.property).toBe(PROPERTY_STORE.FIRSTNAME)
    expect(COLUMNS.DELIVERY_STATUS.type).toBe('slot')
    expect(COLUMNS.DATE_SCANNED.label).toBe('Date Scanned')
  })

  describe('getStatusBadgeProps', () => {
    it('returns all delivery status badge variants', () => {
      expect(getStatusBadgeProps('Not Delivered')).toEqual({
        color: '#757575',
        text: 'Not Delivered'
      })
      expect(getStatusBadgeProps('In Queue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
      expect(getStatusBadgeProps('InQueue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
      expect(getStatusBadgeProps('Error')).toEqual({
        color: '#B83A3A',
        text: 'Error'
      })
      expect(getStatusBadgeProps('Cancelled')).toEqual({
        color: '#B6791D',
        text: 'Cancelled'
      })
      expect(getStatusBadgeProps('Canceled')).toEqual({
        color: '#B6791D',
        text: 'Cancelled'
      })
      expect(getStatusBadgeProps('Successful')).toEqual({
        color: '#217124',
        text: 'Successful'
      })
      expect(getStatusBadgeProps('Delivered')).toEqual({
        color: '#217124',
        text: 'Delivered'
      })
      expect(getStatusBadgeProps('Processing')).toEqual({
        color: '#1173C1',
        text: 'Processing'
      })
    })

    it('returns undefined for unknown status', () => {
      expect(getStatusBadgeProps('Unknown')).toBeUndefined()
      expect(getStatusBadgeProps('')).toBeUndefined()
    })
  })

  it('exports unusual and activity type maps', () => {
    expect(UNUSUAL_TYPES).toEqual({
      USER_AGENT: 0,
      IP: 1,
      HONEYPOT: 2
    })
    expect(ACTIVITY_TYPES).toEqual({
      HUMAN: 'Human Activity',
      SYSTEM: 'Bot Activity'
    })
  })
})
