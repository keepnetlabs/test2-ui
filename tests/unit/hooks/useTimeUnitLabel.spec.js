import useTimeUnitLabel from '@/hooks/executive-reports/useTimeUnitLabel'

describe('useTimeUnitLabel hook', () => {
  it('returns Year when timeUnit is year (case-insensitive)', () => {
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call({ timeUnit: 'year' })).toBe('Year')
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call({ timeUnit: 'YEAR' })).toBe('Year')
  })

  it('returns "<Unit> / Year" for non-year units', () => {
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call({ timeUnit: 'month' })).toBe(
      'Month / Year'
    )
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call({ timeUnit: 'week' })).toBe(
      'Week / Year'
    )
  })
})
