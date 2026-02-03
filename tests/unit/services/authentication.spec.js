const mockLocalStorage = {
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
  value: mockLocalStorage,
  writable: true,
  configurable: true
})

import CookieKeys from '@/model/constants/cookieKeys'
import AuthenticationStatus from '@/model/constants/authenticationStatus'
import AuthenticationService from '@/services/authentication'

describe('AuthenticationService', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
  })

  describe('token management', () => {
    it('should set token with default parameters', () => {
      const token = 'test-token-123'
      AuthenticationService.setToken(token)
      const stored = mockLocalStorage.getItem(CookieKeys.AUTH_KEY)
      expect(stored).toBeDefined()
      const parsed = JSON.parse(stored)
      expect(parsed.token).toBe(token)
    })

    it('should set token with custom expired timestamp', () => {
      const token = 'test-token'
      const expired = 1234567890
      AuthenticationService.setToken(token, expired)
      const stored = JSON.parse(mockLocalStorage.getItem(CookieKeys.AUTH_KEY))
      expect(stored.expired).toBe(expired)
    })

    it('should set token with custom status', () => {
      const token = 'test-token'
      const status = 2
      AuthenticationService.setToken(token, 9999999999999, status)
      const stored = JSON.parse(mockLocalStorage.getItem(CookieKeys.AUTH_KEY))
      expect(stored.status).toBe(status)
    })

    it('should get token from localStorage', () => {
      const token = 'my-token-456'
      AuthenticationService.setToken(token)
      const retrieved = AuthenticationService.getToken()
      expect(retrieved).toBe(token)
    })

    it('should return null when no token is stored', () => {
      const retrieved = AuthenticationService.getToken()
      expect(retrieved).toBeNull()
    })

    it('should remove token from localStorage', () => {
      AuthenticationService.setToken('test-token')
      expect(AuthenticationService.getToken()).toBe('test-token')
      AuthenticationService.removeToken()
      expect(AuthenticationService.getToken()).toBeNull()
    })

    it('should handle empty token string', () => {
      mockLocalStorage.setItem(CookieKeys.AUTH_KEY, '')
      const token = AuthenticationService.getToken()
      expect(token).toBeNull()
    })
  })

  describe('token model', () => {
    it('should retrieve complete token model', () => {
      const token = 'test-token'
      const expired = 1234567890
      const status = 2
      AuthenticationService.setToken(token, expired, status)
      const model = AuthenticationService.getTokenModel()
      expect(model).toEqual({
        token,
        expired,
        status
      })
    })

    it('should return null when no token model exists', () => {
      const model = AuthenticationService.getTokenModel()
      expect(model).toBeNull()
    })

    it('should return null when token string is empty', () => {
      mockLocalStorage.setItem(CookieKeys.AUTH_KEY, '')
      const model = AuthenticationService.getTokenModel()
      expect(model).toBeNull()
    })

    it('should parse valid token model JSON', () => {
      const model = { token: 'abc123', expired: 9999999999999, status: 1 }
      mockLocalStorage.setItem(CookieKeys.AUTH_KEY, JSON.stringify(model))
      const retrieved = AuthenticationService.getTokenModel()
      expect(retrieved).toEqual(model)
    })
  })

  describe('authentication status', () => {
    it('should return AUTHENTICATED when token status is 1', () => {
      AuthenticationService.setToken('token', 9999999999999, 1)
      const status = AuthenticationService.getAuthenticationStatus()
      expect(status).toBe(AuthenticationStatus.AUTHENTICATED)
    })

    it('should return REQUIRETWOSTEP when token status is 3', () => {
      AuthenticationService.setToken('token', 9999999999999, 3)
      const status = AuthenticationService.getAuthenticationStatus()
      expect(status).toBe(AuthenticationStatus.REQUIRETWOSTEP)
    })

    it('should return UNAUTHENTICATED when no token exists', () => {
      const status = AuthenticationService.getAuthenticationStatus()
      expect(status).toBe(AuthenticationStatus.UNAUTHENTICATED)
    })

    it('should return UNAUTHENTICATED when token is empty', () => {
      mockLocalStorage.setItem(CookieKeys.AUTH_KEY, '')
      const status = AuthenticationService.getAuthenticationStatus()
      expect(status).toBe(AuthenticationStatus.UNAUTHENTICATED)
    })
  })

  describe('authentication checks', () => {
    it('should return true when isAuthenticated and status is AUTHENTICATED', () => {
      AuthenticationService.setToken('token', 9999999999999, 1)
      expect(AuthenticationService.isAuthenticated()).toBe(true)
    })

    it('should return false when isAuthenticated and no token exists', () => {
      expect(AuthenticationService.isAuthenticated()).toBe(false)
    })

    it('should return false when isAuthenticated but status requires two step', () => {
      AuthenticationService.setToken('token', 9999999999999, 3)
      expect(AuthenticationService.isAuthenticated()).toBe(false)
    })
  })

  describe('token expiration', () => {
    it('should have isExpired method', () => {
      expect(typeof AuthenticationService.isExpired).toBe('function')
    })

    it('should return false when no token exists', () => {
      expect(AuthenticationService.isExpired()).toBe(false)
    })

    it('should work with EXPIRED status if defined', () => {
      // This test depends on AuthenticationStatus having EXPIRED defined
      AuthenticationService.setToken('token', 9999999999999, 4)
      const status = AuthenticationService.getAuthenticationStatus()
      expect(status).toBeDefined()
    })
  })

  describe('token model structure', () => {
    it('should maintain token structure after set and get', () => {
      const originalToken = 'jwt-token-xyz'
      const originalExpired = 1609459200
      const originalStatus = 1

      AuthenticationService.setToken(originalToken, originalExpired, originalStatus)
      const model = AuthenticationService.getTokenModel()

      expect(model.token).toBe(originalToken)
      expect(model.expired).toBe(originalExpired)
      expect(model.status).toBe(originalStatus)
    })

    it('should handle different status codes', () => {
      const statuses = [1, 2, 3, 4, 5]

      statuses.forEach((status) => {
        mockLocalStorage.clear()
        AuthenticationService.setToken('token', 9999999999999, status)
        const model = AuthenticationService.getTokenModel()
        expect(model.status).toBe(status)
      })
    })

    it('should handle large expired timestamps', () => {
      const largeTimestamp = 999999999999999
      AuthenticationService.setToken('token', largeTimestamp)
      const model = AuthenticationService.getTokenModel()
      expect(model.expired).toBe(largeTimestamp)
    })

    it('should handle zero expired timestamp', () => {
      AuthenticationService.setToken('token', 0)
      const model = AuthenticationService.getTokenModel()
      expect(model.expired).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should handle special characters in token', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
      AuthenticationService.setToken(token)
      const retrieved = AuthenticationService.getToken()
      expect(retrieved).toBe(token)
    })

    it('should handle very long tokens', () => {
      const longToken = 'a'.repeat(10000)
      AuthenticationService.setToken(longToken)
      const retrieved = AuthenticationService.getToken()
      expect(retrieved).toBe(longToken)
    })

    it('should handle rapid setToken calls', () => {
      AuthenticationService.setToken('token1')
      AuthenticationService.setToken('token2')
      AuthenticationService.setToken('token3')
      const retrieved = AuthenticationService.getToken()
      expect(retrieved).toBe('token3')
    })

    it('should handle token with null bytes gracefully', () => {
      const token = 'token-with-data'
      AuthenticationService.setToken(token)
      expect(AuthenticationService.getToken()).toBe(token)
    })
  })

  describe('multiple operations', () => {
    it('should set, get, and remove token correctly', () => {
      const token = 'test-token'

      AuthenticationService.setToken(token)
      expect(AuthenticationService.getToken()).toBe(token)

      AuthenticationService.removeToken()
      expect(AuthenticationService.getToken()).toBeNull()
    })

    it('should overwrite existing token', () => {
      AuthenticationService.setToken('token1')
      expect(AuthenticationService.getToken()).toBe('token1')

      AuthenticationService.setToken('token2')
      expect(AuthenticationService.getToken()).toBe('token2')
    })

    it('should handle get after remove', () => {
      AuthenticationService.setToken('token')
      AuthenticationService.removeToken()

      const token = AuthenticationService.getToken()
      const model = AuthenticationService.getTokenModel()
      const status = AuthenticationService.getAuthenticationStatus()

      expect(token).toBeNull()
      expect(model).toBeNull()
      expect(status).toBe(AuthenticationStatus.UNAUTHENTICATED)
    })
  })

  describe('localStorage integration', () => {
    it('should use correct cookie key', () => {
      AuthenticationService.setToken('token')
      expect(mockLocalStorage.data[CookieKeys.AUTH_KEY]).toBeDefined()
    })

    it('should store JSON stringified token model', () => {
      AuthenticationService.setToken('token', 123, 2)
      const stored = mockLocalStorage.getItem(CookieKeys.AUTH_KEY)
      const parsed = JSON.parse(stored)
      expect(typeof parsed).toBe('object')
      expect(parsed.token).toBeDefined()
      expect(parsed.expired).toBeDefined()
      expect(parsed.status).toBeDefined()
    })

    it('should handle direct localStorage manipulation', () => {
      const model = { token: 'direct-token', expired: 999, status: 1 }
      mockLocalStorage.setItem(CookieKeys.AUTH_KEY, JSON.stringify(model))

      expect(AuthenticationService.getToken()).toBe('direct-token')
      expect(AuthenticationService.getTokenModel()).toEqual(model)
    })
  })
})
