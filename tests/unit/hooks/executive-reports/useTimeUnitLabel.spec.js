import useTimeUnitLabel from '@/hooks/executive-reports/useTimeUnitLabel'

describe('useTimeUnitLabel.js', () => {
  it('returns Year when timeUnit is year (lowercase)', () => {
    const ctx = { timeUnit: 'year' }
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call(ctx)).toBe('Year')
  })

  it('returns Year when timeUnit is YEAR (case-insensitive branch)', () => {
    const ctx = { timeUnit: 'YEAR' }
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call(ctx)).toBe('Year')
  })

  it('returns formatted label for month value', () => {
    const ctx = { timeUnit: 'month' }
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call(ctx)).toBe('Month / Year')
  })

  it('returns formatted label for week value', () => {
    const ctx = { timeUnit: 'week' }
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call(ctx)).toBe('Week / Year')
  })

  it('keeps rest of string as-is after first char uppercased', () => {
    const ctx = { timeUnit: 'mONTH' }
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call(ctx)).toBe('MONTH / Year')
  })

  it('returns fallback format for empty string input', () => {
    const ctx = { timeUnit: '' }
    expect(useTimeUnitLabel.methods.getTimeUnitLabel.call(ctx)).toBe(' / Year')
  })
})
