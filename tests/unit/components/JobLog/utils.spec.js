import { getStatusBadgeProps } from '@/components/JobLog/utils'

describe('JobLog utils', () => {
  it('maps known statuses to badge props', () => {
    expect(getStatusBadgeProps('Completed')).toEqual({ color: '#217124', text: 'Completed' })
    expect(getStatusBadgeProps('Running')).toEqual({ color: '#1173C1', text: 'Running' })
    expect(getStatusBadgeProps('Failed')).toEqual({ color: '#B83A3A', text: 'Failed' })
  })

  it('returns waiting state for unknown status', () => {
    expect(getStatusBadgeProps('Unknown')).toEqual({ color: '#1173C1', text: 'Waiting' })
  })
})
