import CookieKeys from '@/model/constants/cookieKeys'

describe('model/constants/cookieKeys', () => {
  it('contains expected cookie/storage keys', () => {
    expect(CookieKeys).toEqual({
      AUTH_KEY: 'token',
      PERMISSIONS: 'permissions',
      EXPIRE_KEY: 'expire-date-milisecond'
    })
  })
})
