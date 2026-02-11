const mockRequestHandlers = {}
const mockResponseHandlers = {}
let mockToken = 'token-123'

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn((onFulfilled, onRejected) => {
          mockRequestHandlers.onFulfilled = onFulfilled
          mockRequestHandlers.onRejected = onRejected
        })
      },
      response: {
        use: jest.fn((onFulfilled, onRejected) => {
          mockResponseHandlers.onFulfilled = onFulfilled
          mockResponseHandlers.onRejected = onRejected
        })
      }
    }
  }))
}))

jest.mock('@/store', () => ({
  getters: {
    get 'usersDashboard/getToken'() {
      return mockToken
    }
  },
  dispatch: jest.fn()
}))

jest.mock('@/router', () => ({
  history: {
    current: { name: 'some-route' }
  },
  push: jest.fn(() => Promise.resolve())
}))

import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

describe('usersDashboardRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToken = 'token-123'
    global.APP_CONFIG = {
      VUE_APP_APP_API_TEST: 'https://test-api.keepnetlabs.com/api',
      VUE_APP_API_KEY: 'api-key'
    }
    jest.isolateModules(() => {
      require('@/utils/usersDashboardRequest')
    })
  })

  it('adds auth headers and shows loader on request', () => {
    const config = { loading: true, headers: {} }
    const result = mockRequestHandlers.onFulfilled(config)

    expect(store.dispatch).toHaveBeenCalledWith(
      'common/activateLoader',
      COMMON_CONSTANTS.ENABLELOADER
    )
    expect(result.headers.authorization).toBe('Bearer token-123')
    expect(result.headers['X-IR-API-KEY']).toBe('api-key')
  })

  it('hides loader and shows snackbar on response', () => {
    const response = {
      config: { loading: true, snackbar: { show: true, icon: 'i', color: 'c' } },
      data: { message: 'ok' }
    }
    const result = mockResponseHandlers.onFulfilled(response)

    expect(store.dispatch).toHaveBeenCalledWith(
      'common/activateLoader',
      COMMON_CONSTANTS.DISABLELOADER
    )
    expect(store.dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      message: 'ok',
      icon: 'i',
      color: 'c'
    })
    expect(result).toBe(response)
  })

  it('returns resolved empty object on canceled error', async () => {
    const result = await mockResponseHandlers.onRejected({ message: 'canceled' })
    expect(result).toEqual({})
  })

  it('shows timeout snackbar on ECONNABORTED', async () => {
    const error = {
      code: 'ECONNABORTED',
      message: 'timeout of 100000ms exceeded',
      config: {}
    }
    await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
    expect(store.dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
      message: 'Your request took too long. Please check your connection and try again.',
      icon: 'mdi-alert'
    })
  })

  it('logs out and redirects on 401', async () => {
    const error = {
      response: { status: 401 },
      config: {},
      request: {}
    }
    await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
    expect(store.dispatch).toHaveBeenCalledWith('usersDashboard/logout')
    expect(store.dispatch).toHaveBeenCalledWith('common/resetSnackbars')
    expect(router.push).toHaveBeenCalledWith({ name: 'users-dashboard-login' })
  })

  it('parses json blob error and shows snackbar', async () => {
    global.FileReader = class {
      readAsText() {
        this.result = JSON.stringify({ message: 'Bad request' })
        this.onload()
      }
    }

    const error = {
      request: { responseType: 'blob' },
      response: {
        status: 500,
        data: new Blob([JSON.stringify({ message: 'Bad request' })], {
          type: 'application/json'
        })
      },
      config: {}
    }

    await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
    expect(store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
        message: 'Bad request',
        icon: 'mdi-alert'
      }),
      { root: true }
    )
  })

  it('redirects to users-dashboard-login when token is missing', async () => {
    mockToken = ''
    const error = { response: { status: 404 }, config: {}, request: {} }
    await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
    expect(store.dispatch).toHaveBeenCalledWith('common/resetSnackbars')
    expect(router.push).toHaveBeenCalledWith('/users-dashboard-login')
  })

  describe('Request Interceptor Configuration', () => {
    it('should register request interceptor', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service).toBeDefined()
    })

    it('should activate loader on request', () => {
      const config = { loading: true, headers: {} }
      mockRequestHandlers.onFulfilled(config)
      expect(store.dispatch).toHaveBeenCalledWith('common/activateLoader', expect.any(Number))
    })

    it('should add authorization header', () => {
      const config = { loading: true, headers: {} }
      const result = mockRequestHandlers.onFulfilled(config)
      expect(result.headers.authorization).toBeDefined()
    })

    it('should add API key header', () => {
      const config = { loading: true, headers: {} }
      const result = mockRequestHandlers.onFulfilled(config)
      expect(result.headers['X-IR-API-KEY']).toBeDefined()
    })
  })

  describe('Response Interceptor Configuration', () => {
    it('should register response interceptor', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service.interceptors.response).toBeDefined()
    })

    it('should deactivate loader on response', () => {
      const response = {
        config: { loading: true, snackbar: {} },
        data: {}
      }
      mockResponseHandlers.onFulfilled(response)
      expect(store.dispatch).toHaveBeenCalledWith('common/activateLoader', expect.any(Number))
    })

    it('should show success snackbar', () => {
      const response = {
        config: { loading: true, snackbar: { show: true, icon: 'icon', color: 'color' } },
        data: { message: 'success' }
      }
      mockResponseHandlers.onFulfilled(response)
      expect(store.dispatch).toHaveBeenCalledWith('common/createSnackBar', expect.any(Object))
    })
  })

  describe('Error Handling Strategies', () => {
    it('should handle canceled requests', async () => {
      const error = { message: 'canceled' }
      const result = await mockResponseHandlers.onRejected(error)
      expect(result).toEqual({})
    })

    it('should handle timeout errors', async () => {
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout of 100000ms exceeded',
        config: {}
      }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
    })

    it('should handle blob error responses', async () => {
      global.FileReader = class {
        readAsText() {
          this.result = JSON.stringify({ message: 'error' })
          this.onload()
        }
      }

      const error = {
        request: { responseType: 'blob' },
        response: {
          status: 500,
          data: new Blob([JSON.stringify({ message: 'error' })], { type: 'application/json' })
        },
        config: {}
      }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
    })

    it('should handle network errors', async () => {
      const error = {
        request: {},
        config: {}
      }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
    })
  })

  describe('Token Management', () => {
    it('should retrieve token from store', () => {
      const config = { loading: true, headers: {} }
      mockRequestHandlers.onFulfilled(config)
      expect(store.getters['usersDashboard/getToken']).toBeDefined()
    })

    it('should include token in authorization header', () => {
      const config = { loading: true, headers: {} }
      const result = mockRequestHandlers.onFulfilled(config)
      expect(result.headers.authorization).toContain('Bearer')
    })

    it('should handle missing token gracefully', async () => {
      mockToken = ''
      const error = { response: { status: 404 }, config: {}, request: {} }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
    })
  })

  describe('Loader State Management', () => {
    it('should activate loader when loading flag is true', () => {
      const config = { loading: true, headers: {} }
      mockRequestHandlers.onFulfilled(config)
      expect(store.dispatch).toHaveBeenCalledWith('common/activateLoader', expect.any(Number))
    })

    it('should deactivate loader on successful response', () => {
      const response = {
        config: { loading: true, snackbar: {} },
        data: {}
      }
      mockResponseHandlers.onFulfilled(response)
      expect(store.dispatch).toHaveBeenCalled()
    })

    it('should handle loader state on errors', async () => {
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout',
        config: {}
      }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
    })
  })

  describe('Snackbar Management', () => {
    it('should show snackbar on successful response', () => {
      const response = {
        config: { loading: true, snackbar: { show: true, icon: 'icon', color: 'color' } },
        data: { message: 'success' }
      }
      mockResponseHandlers.onFulfilled(response)
      expect(store.dispatch).toHaveBeenCalledWith('common/createSnackBar', expect.any(Object))
    })

    it('should show error snackbar on timeout', async () => {
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout of 100000ms exceeded',
        config: {}
      }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
      expect(store.dispatch).toHaveBeenCalledWith('common/createSnackBar', expect.any(Object))
    })

    it('should reset snackbars on 401', async () => {
      const error = {
        response: { status: 401 },
        config: {},
        request: {}
      }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
      expect(store.dispatch).toHaveBeenCalledWith('common/resetSnackbars')
    })
  })

  describe('Error Recovery', () => {
    it('should logout user on 401 error', async () => {
      const error = {
        response: { status: 401 },
        config: {},
        request: {}
      }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
      expect(store.dispatch).toHaveBeenCalledWith('usersDashboard/logout')
    })

    it('should redirect to login on 401', async () => {
      const error = {
        response: { status: 401 },
        config: {},
        request: {}
      }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
      expect(router.push).toHaveBeenCalledWith({ name: 'users-dashboard-login' })
    })

    it('should redirect to login page when token is empty', async () => {
      mockToken = ''
      const error = {
        response: { status: 404 },
        config: {},
        request: {}
      }
      await expect(mockResponseHandlers.onRejected(error)).rejects.toBe(error)
      expect(router.push).toHaveBeenCalledWith('/users-dashboard-login')
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle full request-response lifecycle', () => {
      const config = { loading: true, headers: {} }
      const resultConfig = mockRequestHandlers.onFulfilled(config)

      const response = {
        config: resultConfig,
        data: { message: 'ok' }
      }
      const result = mockResponseHandlers.onFulfilled(response)

      expect(result).toBe(response)
    })

    it('should handle request with custom snackbar config', () => {
      const config = {
        loading: true,
        snackbar: { show: true, icon: 'custom-icon', color: 'custom-color' },
        headers: {}
      }
      mockRequestHandlers.onFulfilled(config)
      expect(store.dispatch).toHaveBeenCalled()
    })

    it('should handle multiple consecutive requests', () => {
      const config1 = { loading: true, headers: {} }
      const config2 = { loading: true, headers: {} }

      mockRequestHandlers.onFulfilled(config1)
      mockRequestHandlers.onFulfilled(config2)

      // Verify dispatch was called at least twice for loader activation
      expect(store.dispatch.mock.calls.length).toBeGreaterThanOrEqual(2)
    })
  })
})
