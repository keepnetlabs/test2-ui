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

  it('normalizes whitespace in status keys', () => {
    expect(getStatusBadgeProps('  In   Queue  ')).toEqual({
      color: '#1173C1',
      text: 'In Queue'
    })
  })

  it('returns null for empty or missing status input', () => {
    expect(getStatusBadgeProps('')).toBeNull()
    expect(getStatusBadgeProps(null)).toBeNull()
    expect(getStatusBadgeProps(undefined)).toBeNull()
  })

  it('returns special flags for excluded and sending error statuses', () => {
    expect(getStatusBadgeProps('Excluded')).toEqual({
      color: '#E0E0E0',
      text: 'Excluded',
      outline: false,
      textBlack: true
    })
    expect(getStatusBadgeProps('Sending Error')).toEqual({
      color: '#F56C6C',
      text: 'Sending Error',
      outline: false
    })
  })

  it('maps error alias and failed status outline flags correctly', () => {
    expect(getStatusBadgeProps('Error')).toEqual({
      color: '#F56C6C',
      text: 'Sending Error',
      outline: false
    })
    expect(getStatusBadgeProps('Failed')).toEqual({
      color: '#B83A3A',
      text: 'Failed',
      outline: true
    })
  })
})
