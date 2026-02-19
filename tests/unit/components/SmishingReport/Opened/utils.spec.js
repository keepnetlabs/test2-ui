import {
  COLUMNS,
  getStatusBadgeProps,
  getDifficultyColor,
  UNUSUAL_TYPES,
  ACTIVITY_TYPES
} from '@/components/SmishingReport/Opened/utils'

describe('SmishingReport Opened utils', () => {
  it('returns status badge props', () => {
    expect(getStatusBadgeProps('Not Delivered')).toEqual({
      color: '#757575',
      text: 'Not Delivered'
    })
    expect(getStatusBadgeProps('In Queue')).toEqual({
      color: '#1173C1',
      text: 'In Queue'
    })
    expect(getStatusBadgeProps('Cancelled')).toEqual({
      color: '#B6791D',
      text: 'Cancelled'
    })
    expect(getStatusBadgeProps('Successful')).toEqual({
      color: '#217124',
      text: 'Successful'
    })
    expect(getStatusBadgeProps('Unknown')).toBeUndefined()
  })

  it('returns difficulty colors', () => {
    expect(getDifficultyColor('Easy')).toBe('#217124')
    expect(getDifficultyColor('Medium')).toBe('#2196F3')
    expect(getDifficultyColor('Hard')).toBe('#F56C6C')
    expect(getDifficultyColor('Unexpected')).toBe('#217124')
  })

  it('defines expected columns and constant maps', () => {
    expect(COLUMNS.ACTIVITY_TYPE.type).toBe('slot')
    expect(UNUSUAL_TYPES).toEqual({ UNUSUAL_IP: 1 })
    expect(ACTIVITY_TYPES).toEqual({
      HUMAN: 'Human Activity',
      SYSTEM: 'Bot Activity'
    })
  })
})
