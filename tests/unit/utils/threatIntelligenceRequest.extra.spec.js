/**
 * Extra coverage for threatIntelligenceRequest.js - invokes interceptor callbacks
 */
const mockStorage = { data: {}, getItem: (k) => mockStorage.data[k] || null, setItem: (k, v) => { mockStorage.data[k] = v }, clear: () => { mockStorage.data = {} } }
Object.defineProperty(global, 'localStorage', { value: mockStorage, writable: true, configurable: true })

const mockStore = { dispatch: jest.fn().mockResolvedValue({}) }
const mockRouter = { push: jest.fn().mockResolvedValue({}) }
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

describe('threatIntelligenceRequest.js interceptor callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
    mockStorage.setItem('companyRequestId', 'req-123')
    mockStorage.setItem('companyResourceId', 'res-456')
    delete require.cache[require.resolve('@/utils/threatIntelligenceRequest')]
    require('@/utils/threatIntelligenceRequest')
  })

  it('request interceptor adds headers', () => {
    const config = { url: 'threats', headers: {} }
    const result = mockHandlers.request.onFulfilled(config)
    expect(result.headers.authorization).toBe('Bearer token')
    expect(result.headers['X-IR-COMPANY-ID']).toBe('req-123')
  })

  it('request interceptor uses overrideCompanyId when set', () => {
    const config = { url: 'threats', headers: { 'X-IR-COMPANY-ID': 'override-123' }, overrideCompanyId: true }
    mockHandlers.request.onFulfilled(config)
    expect(config.headers['X-IR-COMPANY-ID']).toBe('override-123')
  })

  it('request interceptor uses companyResourceId when isCompanySelect', () => {
    const config = { url: 'threats', headers: {}, isCompanySelect: true }
    mockHandlers.request.onFulfilled(config)
    expect(config.headers['X-IR-COMPANY-ID']).toBe('res-456')
  })

  it('response interceptor success with loading', () => {
    const response = { config: { loading: true } }
    const result = mockHandlers.response.onFulfilled(response)
    expect(mockStore.dispatch).toHaveBeenCalled()
    expect(result).toBe(response)
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
})
