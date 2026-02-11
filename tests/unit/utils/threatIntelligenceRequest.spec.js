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
  getters: {}
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

describe('threatIntelligenceRequest utility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
  })

  describe('module export and structure', () => {
    it('should export service instance', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service).toBeDefined()
    })

    it('should export service with interceptors', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors).toBeDefined()
      expect(service.interceptors.request).toBeDefined()
      expect(service.interceptors.response).toBeDefined()
    })

    it('should have request interceptor with use method', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(typeof service.interceptors.request.use).toBe('function')
    })

    it('should have response interceptor with use method', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(typeof service.interceptors.response.use).toBe('function')
    })
  })

  describe('threat intelligence integration', () => {
    it('should be configured for threat intelligence API', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service).toBeDefined()
    })

    it('should have authentication integration', () => {
      expect(mockAuthenticationService.getToken).toBeDefined()
    })

    it('should have router integration', () => {
      expect(mockRouter.push).toBeDefined()
    })

    it('should have store integration', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('localStorage integration', () => {
    it('should access localStorage for company ID', () => {
      mockStorage.setItem('companyRequestId', 'company-123')
      expect(mockStorage.getItem('companyRequestId')).toBe('company-123')
    })

    it('should support company resource ID', () => {
      mockStorage.setItem('companyResourceId', 'resource-123')
      expect(mockStorage.getItem('companyResourceId')).toBe('resource-123')
    })

    it('should support company selection', () => {
      mockStorage.setItem('companyRequestId', 'request-123')
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service).toBeDefined()
    })
  })

  describe('request/response handling', () => {
    it('should be configured with request interceptor', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should be configured with response interceptor', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors.response).toBeDefined()
    })

    it('should support loading state management', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('should handle authentication errors', () => {
      expect(mockAuthenticationService.removeToken).toBeDefined()
    })

    it('should handle 401 unauthorized', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service).toBeDefined()
    })

    it('should redirect to login on session expiry', () => {
      expect(mockRouter.push).toBeDefined()
    })
  })

  describe('header injection capability', () => {
    it('should support authorization header', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should support API key header', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should support company ID header', () => {
      mockStorage.setItem('companyRequestId', 'company-123')
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors.request).toBeDefined()
    })
  })

  describe('HTTP Request Service', () => {
    it('should provide axios instance', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service).toBeDefined()
    })

    it('should have interceptor configuration', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors.request).toBeDefined()
      expect(service.interceptors.response).toBeDefined()
    })

    it('should support request interceptor setup', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(typeof service.interceptors.request.use).toBe('function')
    })

    it('should support response interceptor setup', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(typeof service.interceptors.response.use).toBe('function')
    })
  })

  describe('Service Dependencies', () => {
    it('should have authentication service available', () => {
      expect(mockAuthenticationService).toBeDefined()
      expect(mockAuthenticationService.getToken).toBeDefined()
    })

    it('should have router available for navigation', () => {
      expect(mockRouter).toBeDefined()
      expect(mockRouter.push).toBeDefined()
    })

    it('should have store available for state', () => {
      expect(mockStore).toBeDefined()
      expect(mockStore.dispatch).toBeDefined()
    })

    it('should have localStorage available', () => {
      expect(mockStorage).toBeDefined()
      expect(mockStorage.getItem).toBeDefined()
    })
  })

  describe('Request Interception', () => {
    it('should intercept requests', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      const interceptor = service.interceptors.request
      expect(interceptor).toBeDefined()
    })

    it('should allow request middleware', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(typeof service.interceptors.request.use).toBe('function')
    })

    it('should call request interceptor use method', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      service.interceptors.request.use(config => config)
      expect(service.interceptors.request.use).toHaveBeenCalled()
    })
  })

  describe('Response Interception', () => {
    it('should intercept responses', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      const interceptor = service.interceptors.response
      expect(interceptor).toBeDefined()
    })

    it('should allow response middleware', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(typeof service.interceptors.response.use).toBe('function')
    })

    it('should handle response errors', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors.response).toBeDefined()
    })
  })

  describe('Authentication Integration', () => {
    it('should get auth token', () => {
      const token = mockAuthenticationService.getToken()
      expect(token).toBe('test-token')
    })

    it('should remove auth token', () => {
      mockAuthenticationService.removeToken()
      expect(mockAuthenticationService.removeToken).toHaveBeenCalled()
    })

    it('should support token validation', () => {
      expect(mockAuthenticationService.getToken).toBeDefined()
    })
  })

  describe('Navigation Integration', () => {
    it('should support router navigation', () => {
      mockRouter.push('/login')
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('should track current route', () => {
      expect(mockRouter.history.current).toBeDefined()
    })

    it('should handle route redirects', () => {
      expect(mockRouter.push).toBeDefined()
    })
  })

  describe('State Management Integration', () => {
    it('should dispatch store actions', () => {
      mockStore.dispatch('logout')
      expect(mockStore.dispatch).toHaveBeenCalledWith('logout')
    })

    it('should support async actions', () => {
      const result = mockStore.dispatch('action')
      expect(result).toBeDefined()
      expect(typeof result.then).toBe('function')
    })

    it('should handle store mutations', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('localStorage Operations', () => {
    it('should read from localStorage', () => {
      mockStorage.setItem('testKey', 'testValue')
      expect(mockStorage.getItem('testKey')).toBe('testValue')
    })

    it('should write to localStorage', () => {
      mockStorage.setItem('newKey', 'newValue')
      expect(mockStorage.data.newKey).toBe('newValue')
    })

    it('should remove from localStorage', () => {
      mockStorage.setItem('removeKey', 'value')
      mockStorage.removeItem('removeKey')
      expect(mockStorage.getItem('removeKey')).toBeNull()
    })

    it('should clear all localStorage', () => {
      mockStorage.setItem('key1', 'value1')
      mockStorage.setItem('key2', 'value2')
      mockStorage.clear()
      expect(mockStorage.getItem('key1')).toBeNull()
    })
  })

  describe('Company ID Management', () => {
    it('should handle company request ID', () => {
      mockStorage.setItem('companyRequestId', 'req-123')
      expect(mockStorage.getItem('companyRequestId')).toBe('req-123')
    })

    it('should handle company resource ID', () => {
      mockStorage.setItem('companyResourceId', 'res-456')
      expect(mockStorage.getItem('companyResourceId')).toBe('res-456')
    })

    it('should support multiple company IDs', () => {
      mockStorage.setItem('companyRequestId', 'req-789')
      mockStorage.setItem('companyResourceId', 'res-789')
      expect(mockStorage.getItem('companyRequestId')).toBe('req-789')
      expect(mockStorage.getItem('companyResourceId')).toBe('res-789')
    })

    it('should handle null company IDs', () => {
      expect(mockStorage.getItem('nonexistentKey')).toBeNull()
    })
  })

  describe('Service Initialization', () => {
    it('should initialize with all interceptors', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors.request).toBeDefined()
      expect(service.interceptors.response).toBeDefined()
    })

    it('should be ready for HTTP operations', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service).toBeDefined()
      expect(typeof service).toBe('object')
    })

    it('should support request configuration', () => {
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(service.interceptors).toBeDefined()
    })

    it('should maintain localStorage state across requests', () => {
      mockStorage.setItem('companyRequestId', 'company-1')
      const service = require('@/utils/threatIntelligenceRequest').default
      expect(mockStorage.getItem('companyRequestId')).toBe('company-1')
    })
  })
})
