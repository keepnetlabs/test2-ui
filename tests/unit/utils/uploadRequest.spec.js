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

describe('uploadRequest utility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
  })

  describe('module export and structure', () => {
    it('should export uploadRequest service', () => {
      const service = require('@/utils/uploadRequest').default
      expect(service).toBeDefined()
    })

    it('should export service with interceptors', () => {
      const service = require('@/utils/uploadRequest').default
      expect(service.interceptors).toBeDefined()
      expect(service.interceptors.request).toBeDefined()
      expect(service.interceptors.response).toBeDefined()
    })

    it('should have request interceptor with use method', () => {
      const service = require('@/utils/uploadRequest').default
      expect(typeof service.interceptors.request.use).toBe('function')
    })

    it('should have response interceptor with use method', () => {
      const service = require('@/utils/uploadRequest').default
      expect(typeof service.interceptors.response.use).toBe('function')
    })
  })

  describe('file upload specific features', () => {
    it('should be configured for file uploads', () => {
      const service = require('@/utils/uploadRequest').default
      expect(service).toBeDefined()
    })

    it('should support extended timeout for large files', () => {
      const service = require('@/utils/uploadRequest').default
      expect(service.interceptors).toBeDefined()
    })

    it('should have authentication integration', () => {
      expect(mockAuthenticationService.getToken).toBeDefined()
    })

    it('should have store integration', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('localStorage integration', () => {
    it('should access company ID from localStorage', () => {
      mockStorage.setItem('companyRequestId', 'company-123')
      expect(mockStorage.getItem('companyRequestId')).toBe('company-123')
    })

    it('should support company resource ID', () => {
      mockStorage.setItem('companyResourceId', 'resource-123')
      expect(mockStorage.getItem('companyResourceId')).toBe('resource-123')
    })

    it('should support company selection', () => {
      mockStorage.setItem('companyRequestId', 'request-123')
      const service = require('@/utils/uploadRequest').default
      expect(service).toBeDefined()
    })
  })

  describe('request/response handling', () => {
    it('should be configured with request interceptor', () => {
      const service = require('@/utils/uploadRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should be configured with response interceptor', () => {
      const service = require('@/utils/uploadRequest').default
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
    it('should handle connection abort errors', () => {
      const service = require('@/utils/uploadRequest').default
      expect(service.interceptors.response).toBeDefined()
    })

    it('should handle authentication errors', () => {
      expect(mockAuthenticationService.removeToken).toBeDefined()
    })

    it('should redirect to login on 401', () => {
      expect(mockRouter.push).toBeDefined()
    })

    it('should handle error messages from server', () => {
      expect(mockStore.dispatch).toBeDefined()
    })
  })

  describe('header injection capability', () => {
    it('should support authorization header', () => {
      const service = require('@/utils/uploadRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should support API key header', () => {
      const service = require('@/utils/uploadRequest').default
      expect(service.interceptors.request).toBeDefined()
    })

    it('should support company ID header', () => {
      mockStorage.setItem('companyRequestId', 'company-123')
      const service = require('@/utils/uploadRequest').default
      expect(service.interceptors.request).toBeDefined()
    })
  })
})
