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
})
