describe('emailThreatSimulatorRequest (extra branch coverage)', () => {
  let mockRequestFulfilled
  let mockRequestRejected
  let mockResponseFulfilled
  let mockResponseRejected
  let mockStore
  let mockRouter
  let mockAuthenticationService

  const loadModule = ({ routerPushReject = false } = {}) => {
    jest.resetModules()

    mockStore = { dispatch: jest.fn() }
    mockRouter = {
      push: routerPushReject
        ? jest.fn(() => Promise.reject(new Error('push-fail')))
        : jest.fn(() => Promise.resolve()),
      history: { current: { name: 'home' } }
    }
    mockAuthenticationService = {
      getToken: jest.fn(() => 'ets-token'),
      removeToken: jest.fn()
    }

    const mockService = {
      interceptors: {
        request: {
          use: jest.fn((fulfilled, rejected) => {
            mockRequestFulfilled = fulfilled
            mockRequestRejected = rejected
          })
        },
        response: {
          use: jest.fn((fulfilled, rejected) => {
            mockResponseFulfilled = fulfilled
            mockResponseRejected = rejected
          })
        }
      }
    }

    jest.doMock('axios', () => ({
      create: jest.fn(() => mockService)
    }))
    jest.doMock('@/store', () => mockStore)
    jest.doMock('@/router', () => mockRouter)
    jest.doMock('@/services/authentication', () => mockAuthenticationService)

    return require('@/utils/emailThreatSimulatorRequest').default
  }

  it('request fulfilled enables loader when loading=true and injects auth header', () => {
    loadModule()
    const config = { url: 'scan/list', loading: true, headers: {} }

    const result = mockRequestFulfilled(config)

    expect(result.headers.authorization).toBe('Bearer ets-token')
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', 1)
  })

  it('request fulfilled skips auth header for account/token', () => {
    loadModule()
    const config = { url: 'account/token', headers: {}, loading: false }

    mockRequestFulfilled(config)

    expect(config.headers.authorization).toBeUndefined()
  })

  it('request rejected disables loader only when loading=true', () => {
    loadModule()

    mockRequestRejected({ config: { loading: true } })
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', -1)

    mockStore.dispatch.mockClear()
    mockRequestRejected({ config: { loading: false } })
    expect(mockStore.dispatch).not.toHaveBeenCalled()
  })

  it('response fulfilled with snackbar shows notification and disables loader', () => {
    loadModule()
    const response = {
      config: { loading: true, snackbar: { show: true, icon: 'mdi-info', color: '#111' } },
      data: { message: 'done' }
    }

    const result = mockResponseFulfilled(response)

    expect(result).toBe(response)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', -1)
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'done', icon: 'mdi-info', color: '#111' })
    )
  })

  it('response fulfilled without snackbar returns response and skips snackbar dispatch', () => {
    loadModule()
    const response = {
      config: { loading: false, snackbar: { show: false } },
      data: { message: 'ok' }
    }

    expect(mockResponseFulfilled(response)).toBe(response)
    expect(mockStore.dispatch).not.toHaveBeenCalledWith('common/createSnackBar', expect.anything())
  })

  it('response rejected without response propagates error', async () => {
    loadModule()
    const error = new Error('network')
    error.config = { loading: true }

    await expect(mockResponseRejected(error)).rejects.toBe(error)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', -1)
    expect(mockAuthenticationService.removeToken).not.toHaveBeenCalled()
  })

  it('response rejected with 401 removes token and redirects login', async () => {
    loadModule()
    mockRouter.push.mockImplementationOnce(() => Promise.reject(new Error('ignore')))
    const error = { config: { loading: true }, response: { status: 401 } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)

    expect(mockAuthenticationService.removeToken).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'login',
      params: { isSessionExpired: 'true' }
    })
  })

  it('response rejected with 306 removes token and redirects login', async () => {
    loadModule()
    const error = { response: { status: 306 } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)

    expect(mockAuthenticationService.removeToken).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'login',
      params: { isSessionExpired: 'true' }
    })
  })

  it('response rejected with null token removes token even for non-auth status', async () => {
    loadModule()
    mockAuthenticationService.getToken.mockReturnValueOnce(null)
    const error = { response: { status: 500 } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)

    expect(mockAuthenticationService.removeToken).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledTimes(1)
  })

  it('response rejected with valid token and non-auth status does not logout', async () => {
    loadModule()
    const error = { response: { status: 500 } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)

    expect(mockAuthenticationService.removeToken).not.toHaveBeenCalled()
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('response rejected still rejects original error when router push fails', async () => {
    loadModule({ routerPushReject: true })
    const error = { response: { status: 401 } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)
    expect(mockAuthenticationService.removeToken).toHaveBeenCalledTimes(1)
  })
})
