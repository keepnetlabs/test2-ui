import { getStatusBadgeProps } from '@/components/VishingReport/utils'

describe('VishingReport utils', () => {
  it('returns badge props for known statuses', () => {
    expect(getStatusBadgeProps('Not Responded')).toEqual({
      color: '#757575',
      text: 'Not Responded'
    })
    expect(getStatusBadgeProps('NotDelivered')).toEqual({
      color: '#757575',
      text: 'Not Delivered'
    })
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
    expect(getStatusBadgeProps('InQueue')).toEqual({
      color: '#1173C1',
      text: 'In Queue'
    })
    expect(getStatusBadgeProps('CallingError')).toEqual({
      color: '#F56C6C',
      text: 'Calling Error',
      outline: false
    })
    expect(getStatusBadgeProps('Cancelled')).toEqual({
      color: '#B6791D',
      text: 'Cancelled',
      outline: false
    })
    expect(getStatusBadgeProps('Unknown')).toBeUndefined()
  })
})
