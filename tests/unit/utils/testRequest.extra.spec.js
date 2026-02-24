/**
 * Extra coverage for testRequest.js - invokes interceptor callbacks
 */
const mockStorage = {
  data: {},
  getItem: (k) => mockStorage.data[k] || null,
  setItem: (k, v) => { mockStorage.data[k] = v },
  clear: () => { mockStorage.data = {} }
}
Object.defineProperty(global, 'localStorage', { value: mockStorage, writable: true, configurable: true })

const mockStore = { dispatch: jest.fn().mockResolvedValue({}) }
const mockRouter = { push: jest.fn().mockResolvedValue({}), go: jest.fn(), history: { current: { name: 'home' } } }
const mockAuth = { getToken: jest.fn().mockReturnValue('token'), removeToken: jest.fn() }

const mockHandlers = {}
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: (onFulfilled, onRejected) => { mockHandlers.request = { onFulfilled, onRejected } } },
      response: { use: (onFulfilled, onRejected) => { mockHandlers.response = { onFulfilled, onRejected } } }
    }
  }))
}))
jest.mock('@/router', () => mockRouter)
jest.mock('@/store', () => mockStore)
jest.mock('@/services/authentication', () => mockAuth)

describe('testRequest.js interceptor callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
    mockStorage.setItem('companyRequestId', 'req-123')
    mockStorage.setItem('companyResourceId', 'res-456')
    delete require.cache[require.resolve('@/utils/testRequest')]
    require('@/utils/testRequest')
  })

  it('request interceptor adds headers when url is not account/token', () => {
    const config = { url: 'test', headers: {} }
    const result = mockHandlers.request.onFulfilled(config)
    expect(result.headers.authorization).toBe('Bearer token')
    expect(result.headers['X-IR-API-KEY']).toBeDefined()
    expect(result.headers['X-IR-COMPANY-ID']).toBe('req-123')
  })

  it('request interceptor uses companyResourceId when isCompanySelect', () => {
    const config = { url: 'test', headers: {}, isCompanySelect: true }
    mockHandlers.request.onFulfilled(config)
    expect(config.headers['X-IR-COMPANY-ID']).toBe('res-456')
  })

  it('response interceptor success with loading', () => {
    const response = { config: { loading: true } }
    const result = mockHandlers.response.onFulfilled(response)
    expect(mockStore.dispatch).toHaveBeenCalled()
    expect(result).toBe(response)
  })

  it('response interceptor success with snackbar', () => {
    const response = { config: { snackbar: { show: true, icon: 'x', color: 'red' } }, data: { message: 'ok' } }
    mockHandlers.response.onFulfilled(response)
    expect(mockStore.dispatch).toHaveBeenCalledWith('common/createSnackBar', expect.any(Object))
  })

  it('response error handler returns resolved promise for canceled', async () => {
    const error = { message: 'canceled' }
    const result = await mockHandlers.response.onRejected(error)
    expect(result).toEqual({})
  })

  it('response error handler handles 403 PRIVACY_ERROR', async () => {
    mockStorage.setItem('companyResourceId', 'main')
    mockStorage.setItem('companyName', 'Main')
    const error = { response: { status: 403, data: { status: 'PRIVACY_ERROR' } } }
    const result = await mockHandlers.response.onRejected(error)
    expect(result).toEqual({})
  })

  it('response error handler handles 503', async () => {
    const error = { response: { status: 503 } }
    const result = await mockHandlers.response.onRejected(error)
    expect(result).toEqual({})
  })

  it('response error handler handles ECONNABORTED timeout', async () => {
    const error = { code: 'ECONNABORTED', message: 'timeout of 100000ms exceeded' }
    await expect(mockHandlers.response.onRejected(error)).rejects.toEqual(error)
    expect(mockStore.dispatch).toHaveBeenCalled()
  })

  it('response error handler redirects on 401', async () => {
    const error = { response: { status: 401 } }
    mockRouter.history.current.name = 'home'
    await expect(mockHandlers.response.onRejected(error)).rejects.toEqual(error)
    expect(mockAuth.removeToken).toHaveBeenCalled()
  })

  it('response error handler shows snackbar for non-404 errors', async () => {
    const error = {
      request: { responseType: 'json' },
      response: { status: 500, data: { message: 'Server error' } }
    }
    mockAuth.getToken.mockReturnValue('x')
    await expect(mockHandlers.response.onRejected(error)).rejects.toEqual(error)
    expect(mockStore.dispatch).toHaveBeenCalled()
  })
})
