import { getStatusBadgeProps } from '@/components/SmishingReport/Users/utils'

describe('SmishingReport Users utils', () => {
  describe('getStatusBadgeProps', () => {
    it('maps all status variants', () => {
      expect(getStatusBadgeProps('SubmittedMFACode')).toEqual({
        color: '#B83A3A',
        text: 'Submitted MFA Code'
      })
      expect(getStatusBadgeProps('NotResponded')).toEqual({
        color: '#217124',
        text: 'Not Responded'
      })
      expect(getStatusBadgeProps('Not Responded')).toEqual({
        color: '#217124',
        text: 'Not Responded'
      })
      expect(getStatusBadgeProps('Clicked')).toEqual({
        color: '#B83A3A',
        text: 'Clicked'
      })
      expect(getStatusBadgeProps('InQueue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
      expect(getStatusBadgeProps('SendingError')).toEqual({
        color: '#F56C6C',
        text: 'Sending Error',
        outline: false
      })
      expect(getStatusBadgeProps('Sending Error')).toEqual({
        color: '#F56C6C',
        text: 'Sending Error',
        outline: false
      })
      expect(getStatusBadgeProps('Error')).toEqual({
        color: '#F56C6C',
        text: 'Sending Error',
        outline: false
      })
      expect(getStatusBadgeProps('Cancelled')).toEqual({
        color: '#B6791D',
        text: 'Cancelled',
        outline: false
      })
      expect(getStatusBadgeProps('Inactive')).toEqual({
        color: '#757575',
        text: 'Inactive'
      })
    })

    it('returns undefined for unknown status', () => {
      expect(getStatusBadgeProps('Unknown')).toBeUndefined()
      expect(getStatusBadgeProps('')).toBeUndefined()
    })

    it('handles null/undefined status', () => {
      expect(getStatusBadgeProps(null)).toBeUndefined()
      expect(getStatusBadgeProps(undefined)).toBeUndefined()
    })
  })
})
