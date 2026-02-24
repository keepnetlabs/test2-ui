import CookieKeys from '@/model/constants/cookieKeys'

describe('model/constants/cookieKeys (extra coverage)', () => {
  it('has AUTH_KEY', () => {
    expect(CookieKeys.AUTH_KEY).toBe('token')
  })

  it('has PERMISSIONS', () => {
    expect(CookieKeys.PERMISSIONS).toBe('permissions')
  })

  it('has EXPIRE_KEY', () => {
    expect(CookieKeys.EXPIRE_KEY).toBe('expire-date-milisecond')
  })

  it('has exactly 3 keys', () => {
    expect(Object.keys(CookieKeys).length).toBe(3)
  })

  it('all cookie key values are non-empty strings', () => {
    Object.values(CookieKeys).forEach((value) => {
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
    })
  })

  it('cookie keys are unique', () => {
    const values = Object.values(CookieKeys)
    expect(new Set(values).size).toBe(values.length)
  })

  it('expire key has expected date suffix pattern', () => {
    expect(CookieKeys.EXPIRE_KEY).toContain('expire')
    expect(CookieKeys.EXPIRE_KEY).toContain('milisecond')
  })

  it('cookie keys expose expected uppercase property names', () => {
    expect(Object.keys(CookieKeys)).toEqual(['AUTH_KEY', 'PERMISSIONS', 'EXPIRE_KEY'])
  })

  it('AUTH_KEY and PERMISSIONS do not look like date-related keys', () => {
    expect(CookieKeys.AUTH_KEY.toLowerCase()).not.toContain('expire')
    expect(CookieKeys.PERMISSIONS.toLowerCase()).not.toContain('expire')
  })
})
