import countryLanguageMap from '@/utils/countryLanguageMap'

describe('countryLanguageMap (extra coverage)', () => {
  it('exports an array', () => {
    expect(Array.isArray(countryLanguageMap)).toBe(true)
  })

  it('has expected structure for each entry', () => {
    const sample = countryLanguageMap.find((c) => c.country === 'Turkey')
    expect(sample).toBeDefined()
    expect(sample).toMatchObject({
      country: 'Turkey',
      language: expect.any(String)
    })
  })

  it('has Turkey with Turkish', () => {
    const turkey = countryLanguageMap.find((c) => c.country === 'Turkey')
    expect(turkey.language).toBe('Turkish')
  })

  it('has United States of America', () => {
    const usa = countryLanguageMap.find((c) => c.country === 'United States of America')
    expect(usa).toBeDefined()
    expect(usa.language).toBe('English (United States)')
  })

  it('contains multiple countries', () => {
    expect(countryLanguageMap.length).toBeGreaterThan(100)
  })
})
