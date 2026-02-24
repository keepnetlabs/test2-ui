import subdomainBlacklist from '@/utils/subdomainBlacklist'

describe('subdomainBlacklist (extra coverage)', () => {
  it('exports an array', () => {
    expect(Array.isArray(subdomainBlacklist)).toBe(true)
  })

  it('contains expected brands', () => {
    expect(subdomainBlacklist).toContain('Google')
    expect(subdomainBlacklist).toContain('Microsoft')
    expect(subdomainBlacklist).toContain('Amazon')
    expect(subdomainBlacklist).toContain('Facebook')
  })

  it('contains string values only', () => {
    subdomainBlacklist.forEach((item) => {
      expect(typeof item).toBe('string')
    })
  })

  it('has reasonable length', () => {
    expect(subdomainBlacklist.length).toBeGreaterThan(30)
  })
})
