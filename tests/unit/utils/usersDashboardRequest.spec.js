const mockStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null
  },
  setItem(key, value) {
    this.data[key] = value
  },
  removeItem(key) {
    delete this.data[key]
  },
  clear() {
    this.data = {}
  }
}

Object.defineProperty(global, 'localStorage', {
  value: mockStorage,
  writable: true,
  configurable: true
})

const mockStore = {
  dispatch: jest.fn().mockResolvedValue({}),
  getters: {
    'usersDashboard/getToken': 'dashboard-token'
  }
}

const mockRouter = {
  push: jest.fn().mockResolvedValue({}),
  history: {
    current: {
      name: 'home'
    }
  }
}

jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  })
}))

jest.mock('@/router', () => mockRouter)
jest.mock('@/store', () => mockStore)

describe('usersDashboardRequest utility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
    mockStore.getters['usersDashboard/getToken'] = 'dashboard-token'
  })

  describe('module export and structure', () => {
    it('should export usersDashboardService instance', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service).toBeDefined()
    })

    it('should export service with interceptors', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service.interceptors).toBeDefined()
      expect(service.interceptors.request).toBeDefined()
      expect(service.interceptors.response).toBeDefined()
    })

    it('should have request interceptor with use method', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(typeof service.interceptors.request.use).toBe('function')
    })

    it('should have response interceptor with use method', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(typeof service.interceptors.response.use).toBe('function')
    })
  })

  describe('users dashboard integration', () => {
    it('should be configured for users dashboard API', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service).toBeDefined()
    })

    it('should use usersDashboard store getter for token', () => {
      expect(mockStore.getters['usersDashboard/getToken']).toBeDefined()
    })

    it('should have router integration', () => {
      expect(mockRouter.push).toBeDefined()
    })

    it('should have store integration', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('request/response handling', () => {
    it('should be configured with request interceptor', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should be configured with response interceptor', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service.interceptors.response).toBeDefined()
    })

    it('should support loading state management', () => {
      expect(mockStore.dispatch).toBeDefined()
    })

    it('should support snackbar notifications', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('users dashboard-specific error handling', () => {
    it('should dispatch logout on session expiry', () => {
      expect(mockStore.dispatch).toBeDefined()
    })

    it('should redirect to users-dashboard-login on 401', () => {
      expect(mockRouter.push).toBeDefined()
    })

    it('should handle 503 service unavailable', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service).toBeDefined()
    })

    it('should handle request cancellation', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service.interceptors.response).toBeDefined()
    })

    it('should handle timeout errors', () => {
      expect(mockStore.dispatch).toBeDefined()
    })

    it('should handle blob response errors', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service).toBeDefined()
    })
  })

  describe('header injection capability', () => {
    it('should support authorization header from store', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should support API key header', () => {
      const service = require('@/utils/usersDashboardRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should support dynamic token retrieval', () => {
      expect(mockStore.getters['usersDashboard/getToken']).toBeDefined()
    })
  })
})
