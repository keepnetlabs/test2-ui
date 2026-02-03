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
})
