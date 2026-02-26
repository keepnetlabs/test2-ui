import { getStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/utils'

describe('AwarenessEducator TrainingReport utils (extra)', () => {
  it('covers interaction and completion status branches', () => {
    expect(getStatusBadgeProps('Opened Email')).toEqual({
      color: '#0198AC',
      text: 'Opened Email'
    })
    expect(getStatusBadgeProps('Clicked Link')).toEqual({
      color: '#1173C1',
      text: 'Clicked Link'
    })
    expect(getStatusBadgeProps('Completed')).toEqual({
      color: '#217124',
      text: 'Completed'
    })
    expect(getStatusBadgeProps('Passed')).toEqual({
      color: '#217124',
      text: 'Passed'
    })
  })

  it('covers success/progress/download related status branches', () => {
    expect(getStatusBadgeProps('Success')).toEqual({ color: '#217124', text: 'Success' })
    expect(getStatusBadgeProps('In Progress')).toEqual({ color: '#1173C1', text: 'In Progress' })
    expect(getStatusBadgeProps('Processing')).toEqual({
      color: '#1173C1',
      text: 'Processing',
      outline: true
    })
    expect(getStatusBadgeProps('Downloaded')).toEqual({ color: '#217124', text: 'Downloaded' })
  })

  it('covers delivery related status branches including spacing normalization', () => {
    expect(getStatusBadgeProps('Not Delivered')).toEqual({
      color: '#757575',
      text: 'Not Delivered',
      outline: true
    })
    expect(getStatusBadgeProps('Not Completed')).toEqual({
      color: '#B83A3A',
      text: 'Not Completed'
    })
    expect(getStatusBadgeProps('Incomplete')).toEqual({
      color: '#757575',
      text: 'Incomplete',
      outline: true
    })
    expect(getStatusBadgeProps('  Not   Started  ')).toEqual({
      color: '#757575',
      text: 'Not Started',
      outline: true
    })
  })

  it('covers exam and error variants that include outline flags', () => {
    expect(getStatusBadgeProps('Exam Failed')).toEqual({
      color: '#F56C6C',
      text: 'Exam Failed',
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
  })

  it('normalizes mixed whitespace (tab/newline) in status keys', () => {
    expect(getStatusBadgeProps('Clicked\t\nLink')).toEqual({
      color: '#1173C1',
      text: 'Clicked Link'
    })
  })

  it('throws for non-string-like values that do not support replaceAll', () => {
    expect(() => getStatusBadgeProps(123)).toThrow(TypeError)
    expect(() => getStatusBadgeProps({})).toThrow(TypeError)
  })
})
