import {
  getStatusBadgeProps,
  UNUSUAL_TYPES,
  ACTIVITY_TYPES
} from '@/components/CampaignManagerReport/Opened/utils'

describe('CampaignManagerReport Opened utils', () => {
  describe('getStatusBadgeProps', () => {
    it('returns Not Delivered badge', () => {
      expect(getStatusBadgeProps('Not Delivered')).toEqual({
        color: '#757575',
        text: 'Not Delivered'
      })
    })

    it('returns In Queue badge for "In Queue" and "InQueue"', () => {
      expect(getStatusBadgeProps('In Queue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
      expect(getStatusBadgeProps('InQueue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
    })

    it('returns Error badge', () => {
      expect(getStatusBadgeProps('Error')).toEqual({
        color: '#B83A3A',
        text: 'Error'
      })
    })

    it('returns Cancelled badge for "Cancelled" and "Canceled"', () => {
      expect(getStatusBadgeProps('Cancelled')).toEqual({
        color: '#B6791D',
        text: 'Cancelled'
      })
      expect(getStatusBadgeProps('Canceled')).toEqual({
        color: '#B6791D',
        text: 'Cancelled'
      })
    })

    it('returns Successful badge', () => {
      expect(getStatusBadgeProps('Successful')).toEqual({
        color: '#217124',
        text: 'Successful'
      })
    })

    it('returns Delivered badge', () => {
      expect(getStatusBadgeProps('Delivered')).toEqual({
        color: '#217124',
        text: 'Delivered'
      })
    })

    it('returns Processing badge', () => {
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

  it('exports unusual and activity type enums', () => {
    expect(UNUSUAL_TYPES).toEqual({
      USER_AGENT: 0,
      IP: 1,
      HONEYPOT: 2,
      USER_AGENT_MATCHED: 3
    })
    expect(ACTIVITY_TYPES.BOT).toBe('Bot Activity')
  })
})
