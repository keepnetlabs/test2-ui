import { getTrainingReportProgressStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/Progress/utils'

describe('AwarenessEducator TrainingReport Progress utils', () => {
  it('maps progress labels to badges', () => {
    expect(getTrainingReportProgressStatusBadgeProps('Not Completed')).toEqual({
      color: '#B83A3A',
      text: 'Not Completed'
    })
    expect(getTrainingReportProgressStatusBadgeProps('In Progress')).toEqual({
      color: '#B6791D',
      text: 'In Progress'
    })
    expect(getTrainingReportProgressStatusBadgeProps('Completed')).toEqual({
      color: '#217124',
      text: 'Completed'
    })
  })

  it('returns undefined for unknown, empty or whitespace-variant progress values', () => {
    expect(getTrainingReportProgressStatusBadgeProps('Unknown')).toBeUndefined()
    expect(getTrainingReportProgressStatusBadgeProps('')).toBeUndefined()
    expect(getTrainingReportProgressStatusBadgeProps(' completed ')).toBeUndefined()
    expect(getTrainingReportProgressStatusBadgeProps(null)).toBeUndefined()
    expect(getTrainingReportProgressStatusBadgeProps(undefined)).toBeUndefined()
  })
})
