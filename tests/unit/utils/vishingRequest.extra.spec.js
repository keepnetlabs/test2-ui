/**
 * Extra coverage for vishingRequest.js - invokes interceptor callbacks
 */
const mockStorage = { data: {}, getItem: (k) => mockStorage.data[k] || null, setItem: (k, v) => { mockStorage.data[k] = v }, clear: () => { mockStorage.data = {} } }
Object.defineProperty(global, 'localStorage', { value: mockStorage, writable: true, configurable: true })

const mockStore = { dispatch: jest.fn().mockResolvedValue({}) }
const mockRouter = { push: jest.fn().mockResolvedValue({}) }
const mockAuth = { getToken: jest.fn().mockReturnValue('token'), removeToken: jest.fn() }
const mockGetErrorMessage = jest.fn((e) => e?.message || 'Unknown error')

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
jest.mock('@/utils/functions', () => ({ getErrorMessage: mockGetErrorMessage }))

describe('vishingRequest.js interceptor callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
    mockStorage.setItem('companyRequestId', 'req-123')
    mockGetErrorMessage.mockImplementation((e) => e?.message || 'Unknown error')
    delete require.cache[require.resolve('@/utils/vishingRequest')]
    require('@/utils/vishingRequest')
  })

  it('request interceptor adds headers', () => {
    const config = { url: 'vishing', headers: {} }
    const result = mockHandlers.request.onFulfilled(config)
    expect(result.headers.authorization).toBe('Bearer token')
    expect(result.headers['X-IR-COMPANY-ID']).toBe('req-123')
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

  it('response error handler rejects when no response', async () => {
    const error = new Error('network')
    await expect(mockHandlers.response.onRejected(error)).rejects.toThrow('network')
  })

  it('response error handler redirects on 401', async () => {
    const error = { response: { status: 401 } }
    await expect(mockHandlers.response.onRejected(error)).rejects.toEqual(error)
    expect(mockAuth.removeToken).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalled()
  })

  it('response error handler shows snackbar for non-404', async () => {
    const error = { response: { status: 500, data: { message: 'Error' } } }
    mockAuth.getToken.mockReturnValue('x')
    await expect(mockHandlers.response.onRejected(error)).rejects.toEqual(error)
    expect(mockStore.dispatch).toHaveBeenCalled()
    expect(mockGetErrorMessage).toHaveBeenCalledWith(error)
  })
})
