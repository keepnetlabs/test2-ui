import { getStatusBadgeProps } from '@/components/SmishingReport/Users/utils'

describe('SmishingReport Users utils', () => {
  it('maps status text variants', () => {
    expect(getStatusBadgeProps('SubmittedMFACode')).toEqual({
      color: '#B83A3A',
      text: 'Submitted MFA Code'
    })
    expect(getStatusBadgeProps('Not Responded')).toEqual({
      color: '#217124',
      text: 'Not Responded'
    })
    expect(getStatusBadgeProps('Sending Error')).toEqual({
      color: '#F56C6C',
      text: 'Sending Error',
      outline: false
    })
  })

  it('handles inactive status', () => {
    expect(getStatusBadgeProps('Inactive')).toEqual({
      color: '#757575',
      text: 'Inactive'
    })
  })
})
