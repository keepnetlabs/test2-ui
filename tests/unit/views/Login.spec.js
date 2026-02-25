import Login from '@/views/Login.vue'

describe('Login.vue', () => {
  it('has correct component name', () => {
    expect(Login.name).toBe('Login')
  })

  it('query check helpers return expected booleans', () => {
    expect(
      Login.methods.checkQueryHasCommunityPostId.call({
        $route: { query: { communityResourceId: 'c1', communityPostResourceId: 'p1' } }
      })
    ).toBe(true)
    expect(Login.methods.checkQueryHasCommunityRequestId.call({ $route: { query: {} } })).toBe(false)
    expect(Login.methods.checkQueryHasInvitation.call({ $route: { query: { showInvitation: true } } })).toBe(true)
    expect(Login.methods.checkQueryHasResetPasswordOrCreatePassword.call({ $route: { query: { cp: 'x' } } })).toBe('x')
  })

  it('computed password field helpers and description branches work', () => {
    expect(Login.computed.getPasswordFieldType.call({ isHidePassword: true })).toBe('text')
    expect(Login.computed.getPasswordFieldType.call({ isHidePassword: false })).toBe('password')
    expect(Login.computed.getPasswordFieldIcon.call({ isHidePassword: true })).toBe('mdi-eye-outline')
    expect(Login.computed.getPasswordFieldIcon.call({ isHidePassword: false })).toBe('mdi-eye-off-outline')

    expect(
      Login.computed.getLoginDescription.call({
        isSessionExpired: true,
        showPasswordField: false,
        email: ''
      })
    ).toContain('timed out')
    expect(
      Login.computed.getLoginDescription.call({
        isSessionExpired: false,
        showPasswordField: true,
        email: 'a@b.com'
      })
    ).toContain('a@b.com')
  })

  it('setQueryResetPasswordOrCreatePassword sets reset type and page number', () => {
    const createCtx = {
      $route: { query: { cp: 'token1' } },
      getToken: jest.fn(() => 'parsed-token'),
      pageNumber: 1,
      token: '',
      resetType: ''
    }
    Login.methods.setQueryResetPasswordOrCreatePassword.call(createCtx)
    expect(createCtx.pageNumber).toBe(5)
    expect(createCtx.resetType).toBe('createPassword')
    expect(createCtx.token).toBe('parsed-token')
  })
})
