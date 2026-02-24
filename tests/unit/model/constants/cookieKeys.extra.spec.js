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
})
