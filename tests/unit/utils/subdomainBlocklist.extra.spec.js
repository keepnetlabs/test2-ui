import subdomainBlocklist from '@/utils/subdomainBlocklist'

describe('subdomainBlocklist (extra coverage)', () => {
  it('exports an array', () => {
    expect(Array.isArray(subdomainBlocklist)).toBe(true)
  })

  it('contains expected brands', () => {
    expect(subdomainBlocklist).toContain('Google')
    expect(subdomainBlocklist).toContain('Microsoft')
    expect(subdomainBlocklist).toContain('Amazon')
    expect(subdomainBlocklist).toContain('Facebook')
  })

  it('contains string values only', () => {
    subdomainBlocklist.forEach((item) => {
      expect(typeof item).toBe('string')
    })
  })

  it('has reasonable length', () => {
    expect(subdomainBlocklist.length).toBeGreaterThan(30)
  })
})
