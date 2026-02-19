import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'

describe('AwarenessEducator TrainingReport utils', () => {
  it('maps status values to badge props', () => {
    expect(getStatusBadgeProps('Not Responded')).toEqual({
      color: '#B6791D',
      text: 'Not Responded'
    })
    expect(getStatusBadgeProps('Exam Passed')).toEqual({
      color: '#43A047',
      text: 'Exam Passed'
    })
    expect(getStatusBadgeProps('Not Started')).toEqual({
      color: '#757575',
      text: 'Not Started',
      outline: true
    })
  })

  it('returns null for unknown status', () => {
    expect(getStatusBadgeProps('Unknown')).toBeNull()
  })
})
