import Login from '@/views/Login.vue'
import labels from '@/model/constants/labels'

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

  describe('getLoginErrorMessage', () => {
    const call = (error) => Login.methods.getLoginErrorMessage.call({}, error)

    it('returns IP_RESTRICTED message from response data when status flag is set', () => {
      const error = {
        response: {
          status: 403,
          data: {
            status: 'IP_RESTRICTED',
            message: 'Your network is not authorized to access this platform.'
          }
        }
      }
      expect(call(error)).toBe('Your network is not authorized to access this platform.')
    })

    it('falls back to labels.IpRestricted when IP_RESTRICTED status has no message', () => {
      const error = { response: { status: 403, data: { status: 'IP_RESTRICTED' } } }
      expect(call(error)).toBe(labels.IpRestricted)
    })

    it('IP_RESTRICTED takes precedence over OAuth error_description', () => {
      const error = {
        response: {
          data: {
            status: 'IP_RESTRICTED',
            message: 'blocked',
            error_description: 'invalid_grant'
          }
        }
      }
      expect(call(error)).toBe('blocked')
    })

    it('returns error_description first for non IP_RESTRICTED errors', () => {
      const error = {
        response: {
          data: {
            error_description: 'invalid_grant',
            Message: 'should-not-pick',
            message: 'should-not-pick-either'
          }
        }
      }
      expect(call(error)).toBe('invalid_grant')
    })

    it('falls back to capital Message when error_description is missing', () => {
      const error = { response: { data: { Message: 'big M wins' } } }
      expect(call(error)).toBe('big M wins')
    })

    it('falls back to lowercase message when Message is missing (regression for IP restriction backend contract)', () => {
      const error = { response: { data: { message: 'small m wins' } } }
      expect(call(error)).toBe('small m wins')
    })

    it('returns ServiceUnavailable label when no message field is present', () => {
      expect(call({ response: { data: {} } })).toBe(labels.ServiceUnavailable)
      expect(call({})).toBe(labels.ServiceUnavailable)
      expect(call(undefined)).toBe(labels.ServiceUnavailable)
    })
  })
})
