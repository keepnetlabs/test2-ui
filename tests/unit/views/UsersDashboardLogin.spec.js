import UsersDashboardLogin from '@/views/UsersDashboardLogin.vue'
import labels from '@/model/constants/labels'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

jest.mock('@/api/usersDashboard', () => ({
  loginWithSaml: jest.fn(),
  loginWithMagicLink: jest.fn(),
  sendMagicLink: jest.fn()
}))

const { loginWithSaml, loginWithMagicLink, sendMagicLink } = require('@/api/usersDashboard')
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('UsersDashboardLogin.vue', () => {
  beforeAll(() => {
    global.APP_CONFIG = { VUE_APP_RECAPTCHA_SITEKEY: 'test-site-key' }
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name and data contract', () => {
    expect(UsersDashboardLogin.name).toBe('UsersDashboardLogin')

    const data = UsersDashboardLogin.data()
    expect(data.showSignInMethods).toBe(false)
    expect(data.showEmailVerification).toBe(false)
    expect(data.countdown).toBe(30)
    expect(data.recaptcha).toBe('test-site-key')
  })

  it('created handles magic-link, saml, auth redirect and default paths', () => {
    const dispatch = jest.fn()

    const magicCtx = {
      $store: { dispatch },
      $route: { query: { ml: 'magic' } },
      handleMagicLinkCallback: jest.fn(),
      handleSamlCallback: jest.fn(),
      isUsersDashboardAuthenticated: true,
      $router: { push: jest.fn() }
    }
    UsersDashboardLogin.created.call(magicCtx)
    expect(magicCtx.handleMagicLinkCallback).toHaveBeenCalled()
    expect(magicCtx.handleSamlCallback).not.toHaveBeenCalled()
    expect(magicCtx.$router.push).not.toHaveBeenCalled()

    const samlCtx = {
      $store: { dispatch },
      $route: { query: { authcode: 'a', uid: 'u', state: 's' } },
      handleMagicLinkCallback: jest.fn(),
      handleSamlCallback: jest.fn(),
      isUsersDashboardAuthenticated: false,
      $router: { push: jest.fn() }
    }
    UsersDashboardLogin.created.call(samlCtx)
    expect(samlCtx.handleSamlCallback).toHaveBeenCalled()
    expect(samlCtx.$router.push).not.toHaveBeenCalled()

    const authCtx = {
      $store: { dispatch },
      $route: { query: {} },
      handleMagicLinkCallback: jest.fn(),
      handleSamlCallback: jest.fn(),
      isUsersDashboardAuthenticated: true,
      $router: { push: jest.fn() }
    }
    UsersDashboardLogin.created.call(authCtx)
    expect(authCtx.$router.push).toHaveBeenCalledWith('/users-dashboard')

    expect(dispatch).toHaveBeenCalledWith('usersDashboard/initializeFromStorage')
    expect(dispatch).toHaveBeenCalledWith('whitelabel/resetState')
    expect(dispatch).toHaveBeenCalledWith('login/getWhiteLabelByUrl')
  })

  it('created default path does not redirect when not authenticated and no callbacks', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      $route: { query: {} },
      handleMagicLinkCallback: jest.fn(),
      handleSamlCallback: jest.fn(),
      isUsersDashboardAuthenticated: false,
      $router: { push: jest.fn() }
    }

    UsersDashboardLogin.created.call(ctx)

    expect(ctx.handleMagicLinkCallback).not.toHaveBeenCalled()
    expect(ctx.handleSamlCallback).not.toHaveBeenCalled()
    expect(ctx.$router.push).not.toHaveBeenCalled()
  })

  it('beforeDestroy clears countdown interval only when present', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
    const withTimer = { countdownInterval: 15 }
    UsersDashboardLogin.beforeDestroy.call(withTimer)
    expect(clearIntervalSpy).toHaveBeenCalledWith(15)
    expect(withTimer.countdownInterval).toBe(null)

    clearIntervalSpy.mockClear()
    UsersDashboardLogin.beforeDestroy.call({ countdownInterval: null })
    expect(clearIntervalSpy).not.toHaveBeenCalled()

    clearIntervalSpy.mockRestore()
  })

  it('computed showCaptcha and isContinueDisabled evaluate both branches', () => {
    expect(
      UsersDashboardLogin.computed.showCaptcha.call({ loginErrorCount: 0, verifiedCaptchaResponse: null })
    ).toBe(false)
    expect(
      UsersDashboardLogin.computed.showCaptcha.call({ loginErrorCount: 2, verifiedCaptchaResponse: null })
    ).toBe(true)
    expect(
      UsersDashboardLogin.computed.showCaptcha.call({ loginErrorCount: 0, verifiedCaptchaResponse: 'ok' })
    ).toBe(true)

    expect(
      UsersDashboardLogin.computed.isContinueDisabled.call({ showCaptcha: true, verifiedCaptchaResponse: null })
    ).toBe(true)
    expect(
      UsersDashboardLogin.computed.isContinueDisabled.call({ showCaptcha: true, verifiedCaptchaResponse: 'ok' })
    ).toBe(false)
    expect(
      UsersDashboardLogin.computed.isContinueDisabled.call({ showCaptcha: false, verifiedCaptchaResponse: null })
    ).toBe(false)
  })

  it('isLoading computed proxies getter and no-op setter', () => {
    const ctx = { isLoadingFromStore: 3 }
    expect(UsersDashboardLogin.computed.isLoading.get.call(ctx)).toBe(3)
    expect(() => UsersDashboardLogin.computed.isLoading.set.call(ctx, 10)).not.toThrow()
  })

  it('handleSamlCallback sets token and redirects on success, handles error otherwise', async () => {
    const dispatch = jest.fn()
    const setToken = jest.fn()
    const onErrorLogin = jest.fn()
    const push = jest.fn()

    loginWithSaml.mockResolvedValueOnce({
      data: { access_token: 'a', expiredIn: 10, status: 'ok' }
    })

    const successCtx = {
      $route: { query: { authcode: 'code', uid: 'user' } },
      $store: { dispatch },
      setToken,
      $router: { push },
      onErrorLogin,
      loginErrorCount: 4
    }

    await UsersDashboardLogin.methods.handleSamlCallback.call(successCtx)

    expect(loginWithSaml).toHaveBeenCalledWith({ authcode: 'code', username: 'user' })
    expect(setToken).toHaveBeenCalledWith({ token: 'a', expiredIn: 10, status: 'ok' })
    expect(successCtx.loginErrorCount).toBe(0)
    expect(push).toHaveBeenCalledWith('/users-dashboard')
    expect(dispatch).toHaveBeenCalledWith('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })
    expect(dispatch).toHaveBeenCalledWith('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, { root: true })

    loginWithSaml.mockRejectedValueOnce(new Error('failed'))
    const errorCtx = {
      $route: { query: { authcode: 'code', uid: 'user' } },
      $store: { dispatch },
      setToken,
      $router: { push },
      onErrorLogin,
      loginErrorCount: 1
    }

    await UsersDashboardLogin.methods.handleSamlCallback.call(errorCtx)
    expect(onErrorLogin).toHaveBeenCalled()
  })

  it('handleMagicLinkCallback sets token and redirects on success, handles error otherwise', async () => {
    const dispatch = jest.fn()
    const setToken = jest.fn()
    const onErrorLogin = jest.fn()
    const push = jest.fn()

    loginWithMagicLink.mockResolvedValueOnce({
      data: { token: 't', expired: 20, status: 'ok' }
    })

    const successCtx = {
      $route: { query: { ml: 'token' } },
      $store: { dispatch },
      setToken,
      $router: { push },
      onErrorLogin,
      loginErrorCount: 3
    }

    await UsersDashboardLogin.methods.handleMagicLinkCallback.call(successCtx)

    expect(loginWithMagicLink).toHaveBeenCalledWith('token')
    expect(setToken).toHaveBeenCalledWith({ token: 't', expiredIn: 20, status: 'ok' })
    expect(successCtx.loginErrorCount).toBe(0)
    expect(push).toHaveBeenCalledWith('/users-dashboard')

    loginWithMagicLink.mockRejectedValueOnce(new Error('failed'))
    const errorCtx = {
      $route: { query: { ml: 'token' } },
      $store: { dispatch },
      setToken,
      $router: { push },
      onErrorLogin,
      loginErrorCount: 0
    }

    await UsersDashboardLogin.methods.handleMagicLinkCallback.call(errorCtx)
    expect(onErrorLogin).toHaveBeenCalled()
  })

  it('handleContinue stops when form invalid or captcha required but not verified', () => {
    const invalidCtx = {
      $refs: { loginForm: { validate: jest.fn(() => false) } },
      showCaptcha: false,
      verifiedCaptchaResponse: null,
      clearError: jest.fn(),
      setCompanyEmail: jest.fn(),
      usersDashboardLogin: jest.fn(),
      $store: { dispatch: jest.fn() }
    }

    UsersDashboardLogin.methods.handleContinue.call(invalidCtx)
    expect(invalidCtx.clearError).not.toHaveBeenCalled()
    expect(invalidCtx.setCompanyEmail).not.toHaveBeenCalled()

    const captchaBlockedCtx = {
      $refs: { loginForm: { validate: jest.fn(() => true) } },
      showCaptcha: true,
      verifiedCaptchaResponse: null,
      clearError: jest.fn(),
      setCompanyEmail: jest.fn(),
      usersDashboardLogin: jest.fn(),
      $store: { dispatch: jest.fn() }
    }

    UsersDashboardLogin.methods.handleContinue.call(captchaBlockedCtx)
    expect(captchaBlockedCtx.clearError).not.toHaveBeenCalled()
    expect(captchaBlockedCtx.usersDashboardLogin).not.toHaveBeenCalled()
  })

  it('handleContinue success and error flows toggle loader and reset captcha', async () => {
    const dispatch = jest.fn()
    const successCtx = {
      $refs: {
        loginForm: { validate: jest.fn(() => true) },
        recaptcha: { reset: jest.fn() }
      },
      showCaptcha: false,
      verifiedCaptchaResponse: null,
      clearError: jest.fn(),
      setCompanyEmail: jest.fn(),
      companyEmail: 'user@company.com',
      usersDashboardLogin: jest.fn(() => Promise.resolve({ data: { data: { samlProvider: 'google' } } })),
      $store: { dispatch },
      onErrorLogin: jest.fn(),
      loginErrorCount: 8,
      showSignInMethods: false
    }

    UsersDashboardLogin.methods.handleContinue.call(successCtx)
    await flushPromises()

    expect(successCtx.clearError).toHaveBeenCalled()
    expect(successCtx.setCompanyEmail).toHaveBeenCalledWith('user@company.com')
    expect(successCtx.usersDashboardLogin).toHaveBeenCalledWith({
      companyEmail: 'user@company.com',
      loginMethod: 'email',
      captchaResponse: null
    })
    expect(successCtx.loginErrorCount).toBe(0)
    expect(successCtx.showSignInMethods).toBe(true)
    expect(dispatch).toHaveBeenCalledWith('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })
    expect(dispatch).toHaveBeenCalledWith('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, { root: true })
    expect(successCtx.$refs.recaptcha.reset).toHaveBeenCalled()

    const errorCtx = {
      $refs: {
        loginForm: { validate: jest.fn(() => true) },
        recaptcha: { reset: jest.fn() }
      },
      showCaptcha: false,
      verifiedCaptchaResponse: null,
      clearError: jest.fn(),
      setCompanyEmail: jest.fn(),
      companyEmail: 'user@company.com',
      usersDashboardLogin: jest.fn(() => Promise.reject(new Error('nope'))),
      $store: { dispatch },
      onErrorLogin: jest.fn(),
      showSignInMethods: false
    }

    UsersDashboardLogin.methods.handleContinue.call(errorCtx)
    await flushPromises()
    expect(errorCtx.onErrorLogin).toHaveBeenCalled()
    expect(errorCtx.$refs.recaptcha.reset).toHaveBeenCalled()
  })

  it('handleContinue keeps sign-in methods hidden when api response has no data node', async () => {
    const dispatch = jest.fn()
    const ctx = {
      $refs: {
        loginForm: { validate: jest.fn(() => true) },
        recaptcha: { reset: jest.fn() }
      },
      showCaptcha: false,
      verifiedCaptchaResponse: 'captcha-ok',
      clearError: jest.fn(),
      setCompanyEmail: jest.fn(),
      companyEmail: 'user@company.com',
      usersDashboardLogin: jest.fn(() => Promise.resolve({ data: {} })),
      $store: { dispatch },
      onErrorLogin: jest.fn(),
      loginErrorCount: 1,
      showSignInMethods: false
    }

    UsersDashboardLogin.methods.handleContinue.call(ctx)
    await flushPromises()

    expect(ctx.usersDashboardLogin).toHaveBeenCalledWith({
      companyEmail: 'user@company.com',
      loginMethod: 'email',
      captchaResponse: 'captcha-ok'
    })
    expect(ctx.showSignInMethods).toBe(false)
  })

  it('handleMagicLink and handleResendEmail manage success and error branches', async () => {
    const dispatch = jest.fn()
    const baseCtx = {
      companyEmail: 'user@company.com',
      clearError: jest.fn(),
      startCountdown: jest.fn(),
      onErrorLogin: jest.fn(),
      $store: { dispatch },
      showEmailVerification: false,
      showSignInMethods: true,
      countdown: 0
    }

    sendMagicLink.mockResolvedValueOnce({})
    await UsersDashboardLogin.methods.handleMagicLink.call(baseCtx)
    expect(baseCtx.showEmailVerification).toBe(true)
    expect(baseCtx.showSignInMethods).toBe(false)
    expect(baseCtx.countdown).toBe(30)
    expect(baseCtx.startCountdown).toHaveBeenCalled()

    sendMagicLink.mockRejectedValueOnce(new Error('send failed'))
    await UsersDashboardLogin.methods.handleResendEmail.call(baseCtx)
    expect(baseCtx.onErrorLogin).toHaveBeenCalled()
  })

  it('handleMicrosoftLogin and handleGoogleLogin redirect only when saml url exists', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'location')
    if (!descriptor || !descriptor.configurable) {
      expect(() =>
        UsersDashboardLogin.methods.handleMicrosoftLogin.call({ samlRedirectUrl: '' })
      ).not.toThrow()
      expect(() =>
        UsersDashboardLogin.methods.handleGoogleLogin.call({ samlRedirectUrl: '' })
      ).not.toThrow()
      return
    }

    const originalLocation = window.location
    delete window.location
    window.location = { href: 'https://initial' }

    const microsoftCtx = { samlRedirectUrl: 'https://microsoft-login' }
    UsersDashboardLogin.methods.handleMicrosoftLogin.call(microsoftCtx)
    expect(window.location.href).toBe('https://microsoft-login')

    const googleCtx = { samlRedirectUrl: 'https://google-login' }
    UsersDashboardLogin.methods.handleGoogleLogin.call(googleCtx)
    expect(window.location.href).toBe('https://google-login')

    const noRedirectCtx = { samlRedirectUrl: '' }
    UsersDashboardLogin.methods.handleMicrosoftLogin.call(noRedirectCtx)
    expect(window.location.href).toBe('https://google-login')

    window.location = originalLocation
  })

  it('callback handlers do not set token when response has no data', async () => {
    const dispatch = jest.fn()
    const setToken = jest.fn()
    const push = jest.fn()
    const onErrorLogin = jest.fn()

    loginWithSaml.mockResolvedValueOnce({})
    await UsersDashboardLogin.methods.handleSamlCallback.call({
      $route: { query: { authcode: 'code', uid: 'user' } },
      $store: { dispatch },
      setToken,
      $router: { push },
      onErrorLogin,
      loginErrorCount: 5
    })
    expect(setToken).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()

    loginWithMagicLink.mockResolvedValueOnce({})
    await UsersDashboardLogin.methods.handleMagicLinkCallback.call({
      $route: { query: { ml: 'token' } },
      $store: { dispatch },
      setToken,
      $router: { push },
      onErrorLogin,
      loginErrorCount: 5
    })
    expect(setToken).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })

  it('onErrorLogin resolves message priority branches', () => {
    const commit = jest.fn()
    const ctx = { loginErrorCount: 0, $store: { commit } }

    UsersDashboardLogin.methods.onErrorLogin.call(ctx, {
      response: { data: { Message: 'Capital Message' } }
    })
    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_MESSAGE', 'Capital Message', {
      root: true
    })

    commit.mockClear()
    UsersDashboardLogin.methods.onErrorLogin.call(ctx, {
      response: { data: { message: 'lower message' } }
    })
    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_MESSAGE', 'lower message', {
      root: true
    })

    commit.mockClear()
    UsersDashboardLogin.methods.onErrorLogin.call(ctx, {
      response: { data: { errors: [{ message: 'array message' }] } }
    })
    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_MESSAGE', 'array message', {
      root: true
    })
  })

  it('startCountdown decrements and clears interval at zero', () => {
    jest.useFakeTimers()

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
    const ctx = { countdown: 2, countdownInterval: null }

    UsersDashboardLogin.methods.startCountdown.call(ctx)
    expect(ctx.countdownInterval).not.toBe(null)

    jest.advanceTimersByTime(1000)
    expect(ctx.countdown).toBe(1)

    jest.advanceTimersByTime(1000)
    expect(ctx.countdown).toBe(0)
    expect(ctx.countdownInterval).toBe(null)
    expect(clearIntervalSpy).toHaveBeenCalled()

    clearIntervalSpy.mockRestore()
    jest.useRealTimers()
  })

  it('startCountdown clears previous interval before creating a new one', () => {
    jest.useFakeTimers()
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
    const ctx = { countdown: 5, countdownInterval: 999 }

    UsersDashboardLogin.methods.startCountdown.call(ctx)

    expect(clearIntervalSpy).toHaveBeenCalledWith(999)
    expect(ctx.countdownInterval).not.toBe(999)

    clearIntervalSpy.mockRestore()
    jest.useRealTimers()
  })

  it('back handlers reset states and optionally clear timer/reset recaptcha', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')

    const emailVerificationCtx = {
      showEmailVerification: true,
      showSignInMethods: false,
      countdownInterval: 88,
      countdown: 4
    }
    UsersDashboardLogin.methods.handleBackFromEmailVerification.call(emailVerificationCtx)
    expect(emailVerificationCtx.showEmailVerification).toBe(false)
    expect(emailVerificationCtx.showSignInMethods).toBe(true)
    expect(emailVerificationCtx.countdownInterval).toBe(null)
    expect(emailVerificationCtx.countdown).toBe(30)

    const backCtx = {
      showSignInMethods: true,
      verifiedCaptchaResponse: 'captcha',
      loginErrorCount: 5,
      $refs: { recaptcha: { reset: jest.fn() } }
    }
    UsersDashboardLogin.methods.handleBack.call(backCtx)
    expect(backCtx.showSignInMethods).toBe(false)
    expect(backCtx.verifiedCaptchaResponse).toBe(null)
    expect(backCtx.loginErrorCount).toBe(0)
    expect(backCtx.$refs.recaptcha.reset).toHaveBeenCalled()

    const backWithoutRefCtx = {
      showSignInMethods: true,
      verifiedCaptchaResponse: 'captcha',
      loginErrorCount: 5,
      $refs: {}
    }
    expect(() => UsersDashboardLogin.methods.handleBack.call(backWithoutRefCtx)).not.toThrow()

    clearIntervalSpy.mockRestore()
  })

  it('handleBackFromEmailVerification without timer only resets flags and countdown', () => {
    const ctx = {
      showEmailVerification: true,
      showSignInMethods: false,
      countdownInterval: null,
      countdown: 10
    }

    UsersDashboardLogin.methods.handleBackFromEmailVerification.call(ctx)

    expect(ctx.showEmailVerification).toBe(false)
    expect(ctx.showSignInMethods).toBe(true)
    expect(ctx.countdown).toBe(30)
  })

  it('error/captcha helper methods commit expected values', () => {
    const commit = jest.fn()
    const ctx = {
      loginErrorCount: 0,
      $store: { commit },
      verifiedCaptchaResponse: null
    }

    UsersDashboardLogin.methods.onErrorLogin.call(ctx, {
      response: { data: { error_description: 'Error Description', message: 'fallback message' } }
    })

    expect(ctx.loginErrorCount).toBe(1)
    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_STATE', true, { root: true })
    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_MESSAGE', 'Error Description', {
      root: true
    })

    commit.mockClear()
    UsersDashboardLogin.methods.onErrorLogin.call(ctx, {})
    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_MESSAGE', labels.ServiceUnavailable, {
      root: true
    })

    UsersDashboardLogin.methods.clearError.call(ctx)
    expect(commit).toHaveBeenCalledWith('common/SET_ERROR_STATE', false, { root: true })

    UsersDashboardLogin.methods.onCaptchaVerified.call(ctx, 'verified')
    expect(ctx.verifiedCaptchaResponse).toBe('verified')

    UsersDashboardLogin.methods.onCaptchaExpired.call(ctx)
    expect(ctx.verifiedCaptchaResponse).toBe(null)
  })
})
