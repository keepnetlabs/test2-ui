describe('authTestRequest (extra branch coverage)', () => {
  let mockRequestFulfilled
  let mockRequestRejected
  let mockResponseFulfilled
  let mockResponseRejected
  let mockStore
  let mockAuthenticationService

  const loadModule = () => {
    jest.resetModules()

    mockStore = { dispatch: jest.fn() }
    mockAuthenticationService = {
      getToken: jest.fn(() => 'token-1'),
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
    jest.doMock('@/services/authentication', () => mockAuthenticationService)

    return require('@/utils/authTestRequest').default
  }

  it('request fulfilled enables loader and injects bearer token for non-token endpoint', () => {
    loadModule()
    const config = { url: 'users/list', headers: {} }

    const result = mockRequestFulfilled(config)

    expect(result.headers.authorization).toBe('Bearer token-1')
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', 1)
  })

  it('request fulfilled does not inject authorization for account/token endpoint', () => {
    loadModule()
    const config = { url: 'account/token', headers: {} }

    mockRequestFulfilled(config)

    expect(config.headers.authorization).toBeUndefined()
  })

  it('request rejected disables loader', () => {
    loadModule()

    mockRequestRejected(new Error('request-failed'))

    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', -1)
  })

  it('response fulfilled with FAILED code dispatches snackbar and returns response', () => {
    loadModule()
    const response = { data: { code: 'FAILED', message: 'bad request' } }

    const result = mockResponseFulfilled(response)

    expect(result).toBe(response)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', -1)
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'bad request', color: '#f56c6c' }),
      { root: true }
    )
  })

  it('response fulfilled with non-FAILED code returns response without snackbar', () => {
    loadModule()
    const response = { data: { code: 'SUCCESS' } }

    const result = mockResponseFulfilled(response)

    expect(result).toBe(response)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', -1)
    expect(mockStore.dispatch).not.toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.anything(),
      expect.anything()
    )
  })

  it('response rejected without response object propagates error', async () => {
    loadModule()
    const error = new Error('network')

    await expect(mockResponseRejected(error)).rejects.toBe(error)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/activateLoader', -1)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/setReCaptcha', undefined)
    expect(mockAuthenticationService.removeToken).not.toHaveBeenCalled()
  })

  it('response rejected with 401 removes token and rejects error', async () => {
    loadModule()
    const error = { response: { status: 401, data: { enforceCaptcha: true } } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/setReCaptcha', true)
    expect(mockAuthenticationService.removeToken).toHaveBeenCalledTimes(1)
  })

  it('response rejected with 306 removes token and rejects error', async () => {
    loadModule()
    const error = { response: { status: 306, data: { enforceCaptcha: false } } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/setReCaptcha', false)
    expect(mockAuthenticationService.removeToken).toHaveBeenCalledTimes(1)
  })

  it('response rejected with 404 still removes token when token is null', async () => {
    loadModule()
    mockAuthenticationService.getToken.mockReturnValueOnce(null)
    const error = { response: { status: 404, data: {} } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)
    expect(mockAuthenticationService.removeToken).toHaveBeenCalledTimes(1)
  })

  it('response fulfilled FAILED branch uses Message when message is missing', () => {
    loadModule()
    const response = { data: { code: 'FAILED', Message: 'fallback message' } }

    const result = mockResponseFulfilled(response)

    expect(result).toBe(response)
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'fallback message' }),
      { root: true }
    )
  })

  it('response rejected sets captcha undefined when response exists but data is missing', async () => {
    loadModule()
    const error = { response: { status: 500 } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/setReCaptcha', undefined)
  })

  it('response rejected with 404 and valid token does not remove token', async () => {
    loadModule()
    mockAuthenticationService.getToken.mockReturnValueOnce('token-2')
    const error = { response: { status: 404, data: { enforceCaptcha: false } } }

    await expect(mockResponseRejected(error)).rejects.toBe(error)
    expect(mockAuthenticationService.removeToken).not.toHaveBeenCalled()
  })

  it('response fulfilled FAILED branch keeps undefined message when both message fields are missing', () => {
    loadModule()
    const response = { data: { code: 'FAILED' } }

    mockResponseFulfilled(response)

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: undefined }),
      { root: true }
    )
  })

  it('request fulfilled throws when headers object is missing (current behavior)', () => {
    loadModule()

    expect(() => mockRequestFulfilled({ url: 'users/list' })).toThrow()
  })
})
