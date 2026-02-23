import { getStatusBadgeProps } from '@/components/ScormProxyReport/utils'

describe('ScormProxyReport utils', () => {
  describe('getStatusBadgeProps', () => {
    it('maps all known statuses', () => {
      expect(getStatusBadgeProps('NotResponded')).toEqual({
        color: '#B6791D',
        text: 'Not Responded'
      })
      expect(getStatusBadgeProps('Not Responded')).toEqual({
        color: '#B6791D',
        text: 'Not Responded'
      })
      expect(getStatusBadgeProps('OpenedEmail')).toEqual({
        color: '#0198AC',
        text: 'Opened Email'
      })
      expect(getStatusBadgeProps('ClickedLink')).toEqual({
        color: '#1173C1',
        text: 'Clicked Link'
      })
      expect(getStatusBadgeProps('InProgress')).toEqual({
        color: '#1173C1',
        text: 'In Progress'
      })
      expect(getStatusBadgeProps('Completed')).toEqual({
        color: '#217124',
        text: 'Completed'
      })
      expect(getStatusBadgeProps('Passed')).toEqual({
        color: '#217124',
        text: 'Passed'
      })
      expect(getStatusBadgeProps('InQueue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
      expect(getStatusBadgeProps('In Queue')).toEqual({
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
      expect(getStatusBadgeProps('Failed')).toEqual({
        color: '#B83A3A',
        text: 'Failed',
        outline: true
      })
      expect(getStatusBadgeProps('Excluded')).toEqual({
        color: '#E0E0E0',
        text: 'Excluded',
        outline: false,
        textBlack: true
      })
      expect(getStatusBadgeProps('Processing')).toEqual({
        color: '#1173C1',
        text: 'Processing',
        outline: true
      })
      expect(getStatusBadgeProps('NotDelivered')).toEqual({
        color: '#757575',
        text: 'Not Delivered',
        outline: true
      })
      expect(getStatusBadgeProps('Incomplete')).toEqual({
        color: '#757575',
        text: 'Incomplete',
        outline: true
      })
      expect(getStatusBadgeProps('NotCompleted')).toEqual({
        color: '#B83A3A',
        text: 'Not Completed'
      })
    })

    it('returns null for unknown status', () => {
      expect(getStatusBadgeProps('SomethingElse')).toBeNull()
      expect(getStatusBadgeProps('Unknown')).toBeNull()
    })

    it('handles null/undefined and returns null', () => {
      expect(getStatusBadgeProps(null)).toBeNull()
      expect(getStatusBadgeProps(undefined)).toBeNull()
      expect(getStatusBadgeProps('')).toBeNull()
    })
  })
})
