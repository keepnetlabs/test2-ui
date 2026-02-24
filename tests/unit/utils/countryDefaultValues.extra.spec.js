import countryDefaultValues from '@/utils/countryDefaultValues'

describe('countryDefaultValues (extra coverage)', () => {
  it('exports an array', () => {
    expect(Array.isArray(countryDefaultValues)).toBe(true)
  })

  it('has expected structure for each country', () => {
    const sample = countryDefaultValues.find((c) => c.name === 'Turkey')
    expect(sample).toBeDefined()
    expect(sample).toMatchObject({
      name: 'Turkey',
      timeFormat: expect.any(String),
      dateFormat: expect.any(String),
      timezone: expect.any(String),
      phoneNumberCode: expect.any(String)
    })
  })

  it('has Turkey with expected values', () => {
    const turkey = countryDefaultValues.find((c) => c.name === 'Turkey')
    expect(turkey.timeFormat).toBe('24h')
    expect(turkey.dateFormat).toBe('dd/MM/yyyy')
    expect(turkey.phoneNumberCode).toBe('+90')
  })

  it('has United States of America', () => {
    const usa = countryDefaultValues.find((c) => c.name === 'United States of America')
    expect(usa).toBeDefined()
    expect(usa.timeFormat).toBe('12h')
    expect(usa.dateFormat).toBe('MM/dd/yyyy')
  })

  it('contains multiple countries', () => {
    expect(countryDefaultValues.length).toBeGreaterThan(50)
  })
})
