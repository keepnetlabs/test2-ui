describe('testRequest.js branch/function extra coverage', () => {
  let handlers
  let mockStore
  let mockRouter
  let mockAuth

  const loadModule = () => {
    jest.resetModules()
    handlers = {}

    mockStore = { dispatch: jest.fn() }
    mockRouter = {
      push: jest.fn(() => Promise.resolve()),
      go: jest.fn(),
      history: { current: { name: 'home' } }
    }
    mockAuth = {
      getToken: jest.fn(() => 'default-token'),
      removeToken: jest.fn()
    }

    Object.defineProperty(global, 'localStorage', {
      value: {
        data: {},
        getItem(key) {
          return this.data[key] || null
        },
        setItem(key, value) {
          this.data[key] = value
        }
      },
      writable: true,
      configurable: true
    })

    localStorage.setItem('companyRequestId', 'req-1')
    localStorage.setItem('companyResourceId', 'res-1')
    localStorage.setItem('companyName', 'Company One')

    jest.doMock('axios', () => ({
      create: jest.fn(() => ({
        interceptors: {
          request: {
            use: jest.fn((onFulfilled, onRejected) => {
              handlers.requestFulfilled = onFulfilled
              handlers.requestRejected = onRejected
            })
          },
          response: {
            use: jest.fn((onFulfilled, onRejected) => {
              handlers.responseFulfilled = onFulfilled
              handlers.responseRejected = onRejected
            })
          }
        }
      }))
    }))
    jest.doMock('@/store', () => mockStore)
    jest.doMock('@/router', () => mockRouter)
    jest.doMock('@/services/authentication', () => mockAuth)

    require('@/utils/testRequest')
  }

  beforeEach(() => {
    loadModule()
  })

  it('request uses custom token when overrideToken is true', () => {
    const config = {
      url: 'x',
      headers: {},
      overrideToken: true,
      customToken: 'custom-123'
    }

    handlers.requestFulfilled(config)

    expect(config.headers.authorization).toBe('Bearer custom-123')
  })

  it('request enables loader dispatch when loading flag is true', () => {
    const config = {
      url: 'x',
      headers: {},
      loading: true
    }

    handlers.requestFulfilled(config)

    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', 1)
  })

  it('request does not inject auth headers for account/token endpoint', () => {
    const config = {
      url: 'account/token',
      headers: {}
    }

    handlers.requestFulfilled(config)

    expect(config.headers.authorization).toBeUndefined()
    expect(config.headers['X-IR-API-KEY']).toBeUndefined()
    expect(config.headers['X-IR-COMPANY-ID']).toBeUndefined()
  })

  it('request keeps provided company header when overrideCompanyId is true', () => {
    const config = {
      url: 'x',
      headers: { 'X-IR-COMPANY-ID': 'manual-company' },
      overrideCompanyId: true
    }

    handlers.requestFulfilled(config)

    expect(config.headers['X-IR-COMPANY-ID']).toBe('manual-company')
  })

  it('request rejected handler throws because config reference is undefined', () => {
    expect(() => handlers.requestRejected(new Error('request failed'))).toThrow()
  })

  it('response error returns reject directly when hideError is enabled', async () => {
    const error = {
      config: { snackbar: { hideError: true } },
      response: { status: 500 }
    }

    await expect(handlers.responseRejected(error)).rejects.toBe(error)
    expect(mockStore.dispatch).not.toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.anything(),
      expect.anything()
    )
  })

  it('response error handles 306 same as unauthorized and resets auth', async () => {
    const error = { response: { status: 306 } }

    await expect(handlers.responseRejected(error)).rejects.toBe(error)

    expect(mockAuth.removeToken).toHaveBeenCalledTimes(1)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/resetSnackbars')
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'login',
      params: { isSessionExpired: 'true' }
    })
  })

  it('response error does not navigate when already on login route', async () => {
    mockRouter.history.current.name = 'login'
    const error = { response: { status: 401 } }

    await expect(handlers.responseRejected(error)).rejects.toBe(error)

    expect(mockAuth.removeToken).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('response error 404 with no token redirects to /login', async () => {
    mockAuth.getToken.mockReturnValueOnce(null)
    const error = { response: { status: 404 }, request: { responseType: 'json' } }

    await expect(handlers.responseRejected(error)).rejects.toBe(error)

    expect(mockStore.dispatch).toHaveBeenCalledWith('common/resetSnackbars')
    expect(mockRouter.push).toHaveBeenCalledWith('/login')
  })

  it('response error 404 with token does not force redirect', async () => {
    mockAuth.getToken.mockReturnValueOnce('still-authenticated')
    const error = { response: { status: 404 }, request: { responseType: 'json' } }

    await expect(handlers.responseRejected(error)).rejects.toBe(error)

    expect(mockRouter.push).not.toHaveBeenCalledWith('/login')
    expect(mockStore.dispatch).not.toHaveBeenCalledWith('common/resetSnackbars')
  })

  it('response error ECONNABORTED with different message rejects without snackbar', async () => {
    const error = { code: 'ECONNABORTED', message: 'socket hang up' }

    await expect(handlers.responseRejected(error)).rejects.toBe(error)

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message: 'Your request took too long. Please check your connection and try again.'
      })
    )
  })

  it('response blob-json branch parses payload and dispatches snackbar', async () => {
    class MockBlob {
      constructor(content, options = {}) {
        this.content = content
        this.type = options.type || ''
      }
    }
    class MockFileReader {
      readAsText(blob) {
        this.result = blob.content
        this.onload()
      }
    }
    global.Blob = MockBlob
    global.FileReader = MockFileReader

    const blobData = new MockBlob('{"message":"blob error"}', { type: 'application/json' })
    const error = {
      request: { responseType: 'blob' },
      response: { status: 500, data: blobData },
      message: 'blob failure'
    }

    await expect(handlers.responseRejected(error)).rejects.toBe(error)

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'blob error' }),
      { root: true }
    )
  })

  it('response blob-json branch rejects when FileReader fails', async () => {
    class MockBlob {
      constructor(content, options = {}) {
        this.content = content
        this.type = options.type || ''
      }
    }
    class FailingReader {
      readAsText() {
        this.onerror()
      }
    }
    global.Blob = MockBlob
    global.FileReader = FailingReader

    const blobData = new MockBlob('{"message":"blob error"}', { type: 'application/json' })
    const error = {
      request: { responseType: 'blob' },
      response: { status: 500, data: blobData },
      message: 'blob failure'
    }

    await expect(handlers.responseRejected(error)).rejects.toBe(error)
  })
})
