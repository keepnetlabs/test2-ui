import { getStatusBadgeProps } from '@/components/ScormProxyReport/utils'

describe('ScormProxyReport utils', () => {
  it('maps known statuses and ignores spaces', () => {
    expect(getStatusBadgeProps('Not Responded')).toEqual({
      color: '#B6791D',
      text: 'Not Responded'
    })
    expect(getStatusBadgeProps('In Queue')).toEqual({
      color: '#1173C1',
      text: 'In Queue'
    })
    expect(getStatusBadgeProps('Sending Error')).toEqual({
      color: '#F56C6C',
      text: 'Sending Error',
      outline: false
    })
  })

  it('returns null for unknown status', () => {
    expect(getStatusBadgeProps('SomethingElse')).toBeNull()
  })
})
