/**
 * Extra coverage for request.js - invokes interceptor callbacks
 */
const mockStore = { dispatch: jest.fn().mockResolvedValue({}) }
const mockRouter = { push: jest.fn().mockResolvedValue({}) }
const mockAuth = { getToken: jest.fn().mockReturnValue('token'), removeToken: jest.fn() }

const mockHandlers = {}
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: (onFulfilled, onRejected) => {
          mockHandlers.request = { onFulfilled, onRejected }
        }
      },
      response: {
        use: (onFulfilled, onRejected) => {
          mockHandlers.response = { onFulfilled, onRejected }
        }
      }
    }
  }))
}))
jest.mock('@/router', () => mockRouter)
jest.mock('@/store', () => mockStore)
jest.mock('@/services/authentication', () => mockAuth)

describe('request.js interceptor callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    delete require.cache[require.resolve('@/utils/request')]
    require('@/utils/request')
  })

  it('request interceptor adds auth and enables loader', () => {
    const config = { url: 'test', headers: {} }
    const result = mockHandlers.request.onFulfilled(config)
    expect(mockStore.dispatch).toHaveBeenCalled()
    expect(result.headers.authorization).toBe('Bearer token')
  })

  it('request interceptor skips auth for account/token', () => {
    const config = { url: 'account/token', headers: {} }
    mockHandlers.request.onFulfilled(config)
    expect(config.headers.authorization).toBeUndefined()
  })

  it('response interceptor disables loader on success', () => {
    const response = { config: {} }
    const result = mockHandlers.response.onFulfilled(response)
    expect(mockStore.dispatch).toHaveBeenCalled()
    expect(result).toBe(response)
  })

  it('response interceptor handles error with no response', async () => {
    const error = new Error('network')
    await expect(mockHandlers.response.onRejected(error)).rejects.toThrow('network')
  })

  it('response interceptor redirects on 401 and removes token', async () => {
    const error = { response: { status: 401 } }
    mockAuth.getToken.mockReturnValue('x')
    await expect(mockHandlers.response.onRejected(error)).rejects.toEqual(error)
    expect(mockAuth.removeToken).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalled()
  })

  it('response interceptor redirects on 306', async () => {
    const error = { response: { status: 306 } }
    mockAuth.getToken.mockReturnValue('x')
    await expect(mockHandlers.response.onRejected(error)).rejects.toEqual(error)
    expect(mockAuth.removeToken).toHaveBeenCalled()
  })

  it('response interceptor redirects when token is null', async () => {
    const error = { response: { status: 500 } }
    mockAuth.getToken.mockReturnValue(null)
    await expect(mockHandlers.response.onRejected(error)).rejects.toEqual(error)
    expect(mockRouter.push).toHaveBeenCalled()
  })
})
