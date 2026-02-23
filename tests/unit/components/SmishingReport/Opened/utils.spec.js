import {
  COLUMNS,
  getStatusBadgeProps,
  getDifficultyColor,
  UNUSUAL_TYPES,
  ACTIVITY_TYPES
} from '@/components/SmishingReport/Opened/utils'

describe('SmishingReport Opened utils', () => {
  describe('getStatusBadgeProps', () => {
    it('returns all status badge variants', () => {
      expect(getStatusBadgeProps('Not Delivered')).toEqual({
        color: '#757575',
        text: 'Not Delivered'
      })
      expect(getStatusBadgeProps('In Queue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
      expect(getStatusBadgeProps('InQueue')).toEqual({
        color: '#1173C1',
        text: 'In Queue'
      })
      expect(getStatusBadgeProps('Error')).toEqual({
        color: '#B83A3A',
        text: 'Error'
      })
      expect(getStatusBadgeProps('Cancelled')).toEqual({
        color: '#B6791D',
        text: 'Cancelled'
      })
      expect(getStatusBadgeProps('Canceled')).toEqual({
        color: '#B6791D',
        text: 'Cancelled'
      })
      expect(getStatusBadgeProps('Successful')).toEqual({
        color: '#217124',
        text: 'Successful'
      })
      expect(getStatusBadgeProps('Delivered')).toEqual({
        color: '#217124',
        text: 'Delivered'
      })
      expect(getStatusBadgeProps('Processing')).toEqual({
        color: '#1173C1',
        text: 'Processing'
      })
    })

    it('returns undefined for unknown status', () => {
      expect(getStatusBadgeProps('Unknown')).toBeUndefined()
      expect(getStatusBadgeProps('')).toBeUndefined()
    })
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
