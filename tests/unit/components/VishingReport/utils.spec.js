import { getStatusBadgeProps } from '@/components/VishingReport/utils'

describe('VishingReport utils', () => {
  describe('getStatusBadgeProps', () => {
    it('returns badge props for Not Responded variants', () => {
      expect(getStatusBadgeProps('Not Responded')).toEqual({
        color: '#757575',
        text: 'Not Responded'
      })
      expect(getStatusBadgeProps('NotResponded')).toEqual({
        color: '#757575',
        text: 'Not Responded'
      })
    })

    it('returns badge props for Not Delivered variants', () => {
      expect(getStatusBadgeProps('Not Delivered')).toEqual({
        color: '#757575',
        text: 'Not Delivered'
      })
      expect(getStatusBadgeProps('NotDelivered')).toEqual({
        color: '#757575',
        text: 'Not Delivered'
      })
    })

    it('returns badge props for In Queue variants', () => {
      expect(getStatusBadgeProps('In Queue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
      expect(getStatusBadgeProps('InQueue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
    })

    it('returns badge props for Calling Error variants', () => {
      expect(getStatusBadgeProps('Calling Error')).toEqual({
        color: '#F56C6C',
        text: 'Calling Error',
        outline: false
      })
      expect(getStatusBadgeProps('CallingError')).toEqual({
        color: '#F56C6C',
        text: 'Calling Error',
        outline: false
      })
    })

    it('returns badge props for other known statuses', () => {
      expect(getStatusBadgeProps('Busy')).toEqual({
        color: '#757575',
        text: 'Busy'
      })
      expect(getStatusBadgeProps('Answered')).toEqual({
        color: '#B6791D',
        text: 'Answered'
      })
      expect(getStatusBadgeProps('Vished')).toEqual({
        color: '#B83A3A',
        text: 'Vished'
      })
      expect(getStatusBadgeProps('Cancelled')).toEqual({
        color: '#B6791D',
        text: 'Cancelled',
        outline: false
      })
    })

    it('returns undefined for unknown status', () => {
      expect(getStatusBadgeProps('Unknown')).toBeUndefined()
      expect(getStatusBadgeProps('')).toBeUndefined()
    })
  })
})
