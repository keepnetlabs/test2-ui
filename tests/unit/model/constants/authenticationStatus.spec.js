import AuthenticationStatus from '@/model/constants/authenticationStatus'

describe('model/constants/authenticationStatus', () => {
  it('contains expected status keys', () => {
    expect(AuthenticationStatus).toEqual({
      EXPIRED: 'EXPIRED',
      UNAUTHENTICATED: 'UNAUTHENTICATED',
      AUTHENTICATED: 'AUTHENTICATED',
      REQUIRETWOSTEP: 'REQUIRETWOSTEP'
    })
  })
})
