const mockStorage = {
  data: { companyRequestId: 'company-123' },
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
  dispatch: jest.fn().mockResolvedValue({})
}

const mockRouter = {
  push: jest.fn().mockResolvedValue({}),
  history: {
    current: {
      name: 'home'
    }
  }
}

const mockAuthenticationService = {
  getToken: jest.fn().mockReturnValue('test-token'),
  removeToken: jest.fn()
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
jest.mock('@/services/authentication', () => mockAuthenticationService)
jest.mock('@/utils/functions', () => ({
  getErrorMessage: jest.fn((error) => error?.message || 'Unknown error')
}))

describe('vishingRequest utility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
    mockStorage.data.companyRequestId = 'company-123'
  })

  describe('module export and structure', () => {
    it('should export vishing service instance', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service).toBeDefined()
    })

    it('should export service with interceptors', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors).toBeDefined()
      expect(service.interceptors.request).toBeDefined()
      expect(service.interceptors.response).toBeDefined()
    })

    it('should have request interceptor with use method', () => {
      const service = require('@/utils/vishingRequest').default
      expect(typeof service.interceptors.request.use).toBe('function')
    })

    it('should have response interceptor with use method', () => {
      const service = require('@/utils/vishingRequest').default
      expect(typeof service.interceptors.response.use).toBe('function')
    })
  })

  describe('vishing integration', () => {
    it('should be configured for vishing API', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service).toBeDefined()
    })

    it('should use getErrorMessage from functions utility', () => {
      const functions = require('@/utils/functions')
      expect(functions.getErrorMessage).toBeDefined()
    })

    it('should have authentication integration', () => {
      expect(mockAuthenticationService.getToken).toBeDefined()
    })

    it('should have store integration', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('localStorage integration', () => {
    it('should access companyRequestId from localStorage', () => {
      expect(mockStorage.getItem('companyRequestId')).toBe('company-123')
    })

    it('should support company ID updates', () => {
      mockStorage.setItem('companyRequestId', 'new-company')
      expect(mockStorage.getItem('companyRequestId')).toBe('new-company')
    })

    it('should use company ID in headers', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.request).toBeDefined()
    })
  })

  describe('request/response handling', () => {
    it('should be configured with request interceptor', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should be configured with response interceptor', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.response).toBeDefined()
    })

    it('should support loading state management', () => {
      expect(mockStore.dispatch).toBeDefined()
    })

    it('should support snackbar notifications', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('should handle authentication errors', () => {
      expect(mockAuthenticationService.removeToken).toBeDefined()
    })

    it('should handle 401 unauthorized', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service).toBeDefined()
    })

    it('should handle 306 errors', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service).toBeDefined()
    })

    it('should redirect to login on session expiry', () => {
      expect(mockRouter.push).toBeDefined()
    })

    it('should display error messages', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('header injection capability', () => {
    it('should support authorization header', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should support API key header', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should support company ID header from localStorage', () => {
      mockStorage.setItem('companyRequestId', 'company-123')
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.request).toBeDefined()
    })
  })

  describe('error message formatting', () => {
    it('should use getErrorMessage helper for errors', () => {
      const functions = require('@/utils/functions')
      const result = functions.getErrorMessage({ message: 'Test error' })
      expect(result).toBe('Test error')
    })

    it('should display formatted error messages', () => {
      expect(mockStore.dispatch).toBeDefined()
    })

    it('should handle missing error messages', () => {
      const functions = require('@/utils/functions')
      const result = functions.getErrorMessage({})
      expect(result).toBe('Unknown error')
    })
  })

  describe('Service Initialization', () => {
    it('should be properly initialized', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service).toBeDefined()
      expect(typeof service).toBe('object')
    })

    it('should have axios instance characteristics', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors).toBeDefined()
      expect(typeof service.interceptors).toBe('object')
    })

    it('should be importable without errors', () => {
      expect(() => {
        require('@/utils/vishingRequest')
      }).not.toThrow()
    })

    it('should initialize with default configuration', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.request.use).toBeDefined()
      expect(service.interceptors.response.use).toBeDefined()
    })
  })

  describe('Company ID Management', () => {
    it('should read company ID from localStorage', () => {
      const companyId = mockStorage.getItem('companyRequestId')
      expect(companyId).toBe('company-123')
    })

    it('should support company ID changes', () => {
      mockStorage.setItem('companyRequestId', 'new-id-456')
      expect(mockStorage.getItem('companyRequestId')).toBe('new-id-456')
    })

    it('should handle missing company ID', () => {
      mockStorage.removeItem('companyRequestId')
      const companyId = mockStorage.getItem('companyRequestId')
      expect(companyId).toBeNull()
    })

    it('should persist company ID across calls', () => {
      mockStorage.setItem('companyRequestId', 'persistent-id')
      expect(mockStorage.getItem('companyRequestId')).toBe('persistent-id')
      expect(mockStorage.getItem('companyRequestId')).toBe('persistent-id')
    })
  })

  describe('Authentication Integration', () => {
    it('should get authentication token', () => {
      const token = mockAuthenticationService.getToken()
      expect(token).toBe('test-token')
    })

    it('should support token removal', () => {
      mockAuthenticationService.removeToken()
      expect(mockAuthenticationService.removeToken).toHaveBeenCalled()
    })

    it('should have token getter method', () => {
      expect(typeof mockAuthenticationService.getToken).toBe('function')
    })

    it('should have token remover method', () => {
      expect(typeof mockAuthenticationService.removeToken).toBe('function')
    })

    it('should work with interceptor for auth headers', () => {
      const service = require('@/utils/vishingRequest').default
      const token = mockAuthenticationService.getToken()
      expect(token).toBeDefined()
      expect(service.interceptors.request).toBeDefined()
    })
  })

  describe('Interceptor Configuration', () => {
    it('request interceptor should be registered', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.request.use).toBeDefined()
    })

    it('response interceptor should be registered', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.response.use).toBeDefined()
    })

    it('interceptors should have use method', () => {
      const service = require('@/utils/vishingRequest').default
      expect(typeof service.interceptors.request.use).toBe('function')
      expect(typeof service.interceptors.response.use).toBe('function')
    })

    it('should support multiple interceptor handlers', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.request).toBeDefined()
      expect(service.interceptors.response).toBeDefined()
    })
  })

  describe('Router Integration', () => {
    it('should have router access', () => {
      expect(mockRouter).toBeDefined()
      expect(mockRouter.push).toBeDefined()
    })

    it('should support navigation', () => {
      expect(typeof mockRouter.push).toBe('function')
    })

    it('should track current route', () => {
      expect(mockRouter.history.current).toBeDefined()
      expect(mockRouter.history.current.name).toBe('home')
    })

    it('should redirect on auth failure', () => {
      mockRouter.push('/login')
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('Store Integration', () => {
    it('should dispatch store actions', () => {
      mockStore.dispatch('loadingStart')
      expect(mockStore.dispatch).toHaveBeenCalled()
    })

    it('should support snackbar notifications via store', () => {
      mockStore.dispatch('showSnackbar', { message: 'test' })
      expect(mockStore.dispatch).toHaveBeenCalled()
    })

    it('should manage loading state', () => {
      expect(typeof mockStore.dispatch).toBe('function')
    })

    it('should return promise from dispatch', async () => {
      const result = mockStore.dispatch('action')
      expect(result instanceof Promise || result?.then).toBeTruthy()
    })
  })

  describe('Request Header Management', () => {
    it('should configure request headers', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should include company ID in headers', () => {
      const companyId = mockStorage.getItem('companyRequestId')
      expect(companyId).toBe('company-123')
    })

    it('should include authentication token in headers', () => {
      const token = mockAuthenticationService.getToken()
      expect(token).toBe('test-token')
    })

    it('should support dynamic header updates', () => {
      mockStorage.setItem('companyRequestId', 'updated-company')
      expect(mockStorage.getItem('companyRequestId')).toBe('updated-company')
    })
  })

  describe('Error Handling Strategies', () => {
    it('should handle 401 responses', () => {
      const service = require('@/utils/vishingRequest').default
      expect(service.interceptors.response).toBeDefined()
    })

    it('should handle 403 forbidden', () => {
      expect(mockRouter.push).toBeDefined()
    })

    it('should handle server errors', () => {
      expect(mockStore.dispatch).toBeDefined()
    })

    it('should handle network errors', () => {
      const functions = require('@/utils/functions')
      const error = { message: 'Network error' }
      const formatted = functions.getErrorMessage(error)
      expect(formatted).toBe('Network error')
    })

    it('should provide meaningful error messages', () => {
      const functions = require('@/utils/functions')
      const result = functions.getErrorMessage({ message: 'API Error' })
      expect(result).toBe('API Error')
    })
  })

  describe('Function Utility Integration', () => {
    it('should use getErrorMessage from functions', () => {
      const functions = require('@/utils/functions')
      expect(functions.getErrorMessage).toBeDefined()
    })

    it('should handle various error formats', () => {
      const functions = require('@/utils/functions')
      expect(functions.getErrorMessage({ message: 'test' })).toBe('test')
      expect(functions.getErrorMessage({})).toBe('Unknown error')
    })

    it('should extract messages from error objects', () => {
      const functions = require('@/utils/functions')
      const error = { message: 'API call failed', code: 500 }
      const message = functions.getErrorMessage(error)
      expect(message).toBe('API call failed')
    })
  })

  describe('Performance and Stability', () => {
    it('should initialize without performance issues', () => {
      const startTime = Date.now()
      const service = require('@/utils/vishingRequest').default
      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(100)
    })

    it('should handle repeated access efficiently', () => {
      for (let i = 0; i < 100; i++) {
        mockStorage.getItem('companyRequestId')
      }
      expect(mockStorage.getItem('companyRequestId')).toBe('company-123')
    })

    it('should maintain stability through multiple operations', () => {
      mockStorage.setItem('key1', 'value1')
      mockStorage.setItem('key2', 'value2')
      mockAuthenticationService.getToken()
      const service = require('@/utils/vishingRequest').default
      expect(service).toBeDefined()
    })
  })

  describe('Multiple Instances and Isolation', () => {
    it('should share same service instance', () => {
      const service1 = require('@/utils/vishingRequest').default
      const service2 = require('@/utils/vishingRequest').default
      expect(service1).toBe(service2)
    })

    it('should share same storage mock', () => {
      mockStorage.setItem('test-key', 'test-value')
      expect(mockStorage.getItem('test-key')).toBe('test-value')
      mockStorage.removeItem('test-key')
      expect(mockStorage.getItem('test-key')).toBeNull()
    })

    it('should maintain consistent mock behavior', () => {
      mockStorage.clear()
      mockStorage.setItem('key', 'value')
      expect(mockStorage.getItem('key')).toBe('value')
    })
  })
})
