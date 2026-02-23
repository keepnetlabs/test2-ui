import {
  getStatusBadgeProps,
  UNUSUAL_TYPES,
  REPORT_TABS,
  ACTIVITY_TYPES
} from '@/components/CallbackReport/Opened/utils'

describe('CallbackReport Opened utils', () => {
  describe('getStatusBadgeProps', () => {
    it('returns Not Delivered badge', () => {
      expect(getStatusBadgeProps('Not Delivered')).toEqual({
        color: '#757575',
        text: 'Not Delivered'
      })
    })

    it('returns In Queue badge for "In Queue"', () => {
      expect(getStatusBadgeProps('In Queue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
    })

    it('returns In Queue badge for "InQueue"', () => {
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

    it('returns Cancelled badge for "Cancelled"', () => {
      expect(getStatusBadgeProps('Cancelled')).toEqual({
        color: '#B6791D',
        text: 'Cancelled'
      })
    })

    it('returns Cancelled badge for "Canceled"', () => {
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
      expect(getStatusBadgeProps(null)).toBeUndefined()
    })
  })

  it('exports report tabs and enums', () => {
    expect(UNUSUAL_TYPES.UNUSUAL_IP).toBe(1)
    expect(REPORT_TABS.CALLBACK).toBe('Callback')
    expect(ACTIVITY_TYPES.SYSTEM).toBe('Bot Activity')
  })
})
