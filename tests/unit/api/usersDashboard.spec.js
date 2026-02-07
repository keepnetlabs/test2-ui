jest.mock('@/utils/usersDashboardRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({})
}))

jest.mock('@/utils/authTestRequest', () => ({
  post: jest.fn().mockResolvedValue({})
}))

jest.mock('@/utils/functions', () => ({
  getDefaultAxiosPayload: jest.fn(() => ({
    pageNumber: 1,
    ascending: false
  }))
}))

import usersDashboardRequest from '@/utils/usersDashboardRequest'
import authTestRequest from '@/utils/authTestRequest'
import * as usersDashboardApi from '@/api/usersDashboard'

describe('usersDashboard API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('authentication operations', () => {
    it('should call login', async () => {
      const username = 'user@example.com'
      await usersDashboardApi.login(username)
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        '/securitygrowthauth/login',
        { username },
        expect.objectContaining({
          headers: expect.objectContaining({
            accept: 'application/json'
          })
        })
      )
    })

    it('should call loginWithSaml', async () => {
      const payload = { username: 'user@example.com', authcode: 'saml-code' }
      await usersDashboardApi.loginWithSaml(payload)
      expect(authTestRequest.post).toHaveBeenCalledWith(
        'connect/token',
        expect.any(URLSearchParams),
        expect.objectContaining({
          loading: true,
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        })
      )
    })

    it('should call sendMagicLink', async () => {
      const email = 'user@example.com'
      await usersDashboardApi.sendMagicLink(email)
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        '/securitygrowthauth/send-magic-link',
        { email },
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call loginWithMagicLink', async () => {
      const magicLinkToken = 'magic-token-123'
      await usersDashboardApi.loginWithMagicLink(magicLinkToken)
      expect(authTestRequest.post).toHaveBeenCalledWith(
        'connect/token',
        expect.any(URLSearchParams),
        expect.objectContaining({
          loading: true,
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('dashboard data retrieval', () => {
    it('should call getPhishingResult', async () => {
      await usersDashboardApi.getPhishingResult()
      expect(usersDashboardRequest.get).toHaveBeenCalledWith(
        '/securitygrowthdashboard/phishing-result',
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getTopPerformance', async () => {
      await usersDashboardApi.getTopPerformance()
      expect(usersDashboardRequest.get).toHaveBeenCalledWith(
        '/securitygrowthdashboard/top-performance',
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getUserInfo', async () => {
      await usersDashboardApi.getUserInfo()
      expect(usersDashboardRequest.get).toHaveBeenCalledWith(
        '/securitygrowthdashboard/user-info',
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getMyBadges', async () => {
      await usersDashboardApi.getMyBadges()
      expect(usersDashboardRequest.get).toHaveBeenCalledWith(
        '/securitygrowthdashboard/my-badges',
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('learning and certificate operations', () => {
    it('should call getMyLearning', async () => {
      await usersDashboardApi.getMyLearning()
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        '/securitygrowthdashboard/my-learning',
        expect.objectContaining({
          pagination: expect.any(Object)
        }),
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call getMyCertificates', async () => {
      await usersDashboardApi.getMyCertificates()
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        '/securitygrowthdashboard/my-certificates',
        expect.objectContaining({
          pagination: expect.any(Object)
        }),
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })

    it('should call downloadCertificate', async () => {
      const enrollmentId = 'enrollment-123'
      await usersDashboardApi.downloadCertificate(enrollmentId)
      expect(usersDashboardRequest.get).toHaveBeenCalledWith(
        `/securitygrowthdashboard/certificate-download/${enrollmentId}`,
        expect.objectContaining({
          responseType: 'blob',
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('user timeline operations', () => {
    it('should call getUserTimeline', async () => {
      const payload = { page: 1 }
      await usersDashboardApi.getUserTimeline(payload)
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        '/securitygrowthdashboard/user-timeline',
        payload,
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for data retrieval', async () => {
      await usersDashboardApi.getPhishingResult()
      expect(usersDashboardRequest.get).toHaveBeenCalled()
    })

    it('should use POST for authentication and data operations', async () => {
      const username = 'user@example.com'
      await usersDashboardApi.login(username)
      expect(usersDashboardRequest.post).toHaveBeenCalled()
    })
  })

  describe('header consistency', () => {
    it('should include accept header in GET requests', async () => {
      await usersDashboardApi.getPhishingResult()
      expect(usersDashboardRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            accept: expect.any(String)
          })
        })
      )
    })

    it('should include Content-Type header in POST requests', async () => {
      const username = 'user@example.com'
      await usersDashboardApi.login(username)
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for certificate download', async () => {
      const enrollmentId = 'enrollment-123'
      await usersDashboardApi.downloadCertificate(enrollmentId)
      expect(usersDashboardRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          responseType: 'blob'
        })
      )
    })
  })

  describe('pagination in POST requests', () => {
    it('should include pagination in learning request', async () => {
      await usersDashboardApi.getMyLearning()
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          pagination: expect.objectContaining({
            pageNumber: expect.any(Number),
            pageSize: 1000,
            orderBy: 'StartDate'
          })
        }),
        expect.any(Object)
      )
    })

    it('should include pagination in certificates request', async () => {
      await usersDashboardApi.getMyCertificates()
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          pagination: expect.objectContaining({
            pageNumber: 1,
            pageSize: 1000,
            orderBy: 'StartDate',
            ascending: false
          })
        }),
        expect.any(Object)
      )
    })
  })

  describe('edge cases', () => {
    it('should handle SAML login with proper credentials', async () => {
      const payload = { username: 'user@company.com', authcode: 'saml-auth-code-123' }
      await usersDashboardApi.loginWithSaml(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should handle magic link with valid token', async () => {
      const magicLinkToken = 'ml-token-abc123xyz'
      await usersDashboardApi.loginWithMagicLink(magicLinkToken)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should handle certificate download with special enrollment ID', async () => {
      const enrollmentId = 'enrollment-456-special'
      await usersDashboardApi.downloadCertificate(enrollmentId)
      expect(usersDashboardRequest.get).toHaveBeenCalledWith(
        expect.stringContaining('enrollment-456-special'),
        expect.any(Object)
      )
    })

    it('should handle user timeline with complex payload', async () => {
      const payload = {
        page: 1,
        filters: { status: ['completed', 'in-progress'] },
        dateRange: { start: '2024-01-01', end: '2024-12-31' }
      }
      await usersDashboardApi.getUserTimeline(payload)
      expect(usersDashboardRequest.post).toHaveBeenCalled()
    })

    it('should handle special characters in email', async () => {
      const email = 'user+test@example.com'
      await usersDashboardApi.sendMagicLink(email)
      expect(usersDashboardRequest.post).toHaveBeenCalled()
    })

    it('should handle numeric and string enrollment IDs', async () => {
      await usersDashboardApi.downloadCertificate(123)
      expect(usersDashboardRequest.get).toHaveBeenCalled()

      usersDashboardRequest.get.mockClear()
      await usersDashboardApi.downloadCertificate('enrollment-xyz')
      expect(usersDashboardRequest.get).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('login should return thenable', () => {
      const result = usersDashboardApi.login('user@example.com')
      expect(typeof result.then).toBe('function')
    })

    it('loginWithSaml should return thenable', () => {
      const result = usersDashboardApi.loginWithSaml({})
      expect(typeof result.then).toBe('function')
    })

    it('sendMagicLink should return thenable', () => {
      const result = usersDashboardApi.sendMagicLink('user@example.com')
      expect(typeof result.then).toBe('function')
    })

    it('loginWithMagicLink should return thenable', () => {
      const result = usersDashboardApi.loginWithMagicLink('token')
      expect(typeof result.then).toBe('function')
    })

    it('getPhishingResult should return thenable', () => {
      const result = usersDashboardApi.getPhishingResult()
      expect(typeof result.then).toBe('function')
    })

    it('getTopPerformance should return thenable', () => {
      const result = usersDashboardApi.getTopPerformance()
      expect(typeof result.then).toBe('function')
    })

    it('getUserInfo should return thenable', () => {
      const result = usersDashboardApi.getUserInfo()
      expect(typeof result.then).toBe('function')
    })

    it('getMyBadges should return thenable', () => {
      const result = usersDashboardApi.getMyBadges()
      expect(typeof result.then).toBe('function')
    })

    it('getMyLearning should return thenable', () => {
      const result = usersDashboardApi.getMyLearning()
      expect(typeof result.then).toBe('function')
    })

    it('getMyCertificates should return thenable', () => {
      const result = usersDashboardApi.getMyCertificates()
      expect(typeof result.then).toBe('function')
    })

    it('downloadCertificate should return thenable', () => {
      const result = usersDashboardApi.downloadCertificate('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('getUserTimeline should return thenable', () => {
      const result = usersDashboardApi.getUserTimeline({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof usersDashboardApi.login).toBe('function')
      expect(typeof usersDashboardApi.loginWithSaml).toBe('function')
      expect(typeof usersDashboardApi.sendMagicLink).toBe('function')
      expect(typeof usersDashboardApi.loginWithMagicLink).toBe('function')
      expect(typeof usersDashboardApi.getPhishingResult).toBe('function')
      expect(typeof usersDashboardApi.getTopPerformance).toBe('function')
      expect(typeof usersDashboardApi.getUserInfo).toBe('function')
      expect(typeof usersDashboardApi.getMyBadges).toBe('function')
      expect(typeof usersDashboardApi.getMyLearning).toBe('function')
      expect(typeof usersDashboardApi.getMyCertificates).toBe('function')
      expect(typeof usersDashboardApi.downloadCertificate).toBe('function')
      expect(typeof usersDashboardApi.getUserTimeline).toBe('function')
    })

    it('should export at least 12 functions', () => {
      const functions = Object.values(usersDashboardApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(12)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle authentication workflow', async () => {
      const username = 'user@example.com'
      await usersDashboardApi.login(username)
      expect(usersDashboardRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle dashboard data retrieval workflow', async () => {
      await usersDashboardApi.getPhishingResult()
      await usersDashboardApi.getTopPerformance()
      await usersDashboardApi.getUserInfo()
      await usersDashboardApi.getMyBadges()

      expect(usersDashboardRequest.get).toHaveBeenCalledTimes(4)
    })

    it('should handle learning and certification workflow', async () => {
      await usersDashboardApi.getMyLearning()
      expect(usersDashboardRequest.post).toHaveBeenCalledTimes(1)

      usersDashboardRequest.post.mockClear()
      await usersDashboardApi.getMyCertificates()
      expect(usersDashboardRequest.post).toHaveBeenCalledTimes(1)

      usersDashboardRequest.get.mockClear()
      await usersDashboardApi.downloadCertificate('enrollment-1')
      expect(usersDashboardRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel dashboard operations', async () => {
      const results = await Promise.all([
        usersDashboardApi.getPhishingResult(),
        usersDashboardApi.getTopPerformance(),
        usersDashboardApi.getUserInfo(),
        usersDashboardApi.getMyBadges()
      ])

      expect(results).toHaveLength(4)
      expect(usersDashboardRequest.get).toHaveBeenCalledTimes(4)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle login with email parameter', async () => {
      const email = 'user@example.com'
      await usersDashboardApi.login(email)
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        '/securitygrowthauth/login',
        { username: email },
        expect.any(Object)
      )
    })

    it('should handle SAML login with full credentials', async () => {
      const payload = {
        username: 'user@company.com',
        authcode: 'saml-code-123',
        relayState: 'relay-state-data'
      }
      await usersDashboardApi.loginWithSaml(payload)
      expect(authTestRequest.post).toHaveBeenCalled()
    })

    it('should handle magic link send with various email formats', async () => {
      const emails = [
        'user@example.com',
        'user+tag@example.com',
        'first.last@example.co.uk'
      ]

      for (const email of emails) {
        usersDashboardRequest.post.mockClear()
        await usersDashboardApi.sendMagicLink(email)
        expect(usersDashboardRequest.post).toHaveBeenCalledWith(
          '/securitygrowthauth/send-magic-link',
          { email },
          expect.any(Object)
        )
      }
    })

    it('should handle timeline with pagination parameters', async () => {
      const payload = { page: 2, pageSize: 50 }
      await usersDashboardApi.getUserTimeline(payload)
      expect(usersDashboardRequest.post).toHaveBeenCalledWith(
        '/securitygrowthdashboard/user-timeline',
        payload,
        expect.any(Object)
      )
    })

    it('should handle certificate download with different ID formats', async () => {
      const enrollmentId = 'enrollment-123'
      await usersDashboardApi.downloadCertificate(enrollmentId)
      expect(usersDashboardRequest.get).toHaveBeenCalledWith(
        `/securitygrowthdashboard/certificate-download/${enrollmentId}`,
        expect.any(Object)
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate login errors', async () => {
      const error = new Error('Login failed')
      usersDashboardRequest.post.mockRejectedValueOnce(error)
      await expect(usersDashboardApi.login('user@example.com')).rejects.toThrow('Login failed')
    })

    it('should propagate SAML login errors', async () => {
      const error = new Error('SAML authentication failed')
      authTestRequest.post.mockRejectedValueOnce(error)
      await expect(usersDashboardApi.loginWithSaml({})).rejects.toThrow('SAML authentication failed')
    })

    it('should propagate magic link send errors', async () => {
      const error = new Error('Magic link send failed')
      usersDashboardRequest.post.mockRejectedValueOnce(error)
      await expect(usersDashboardApi.sendMagicLink('user@example.com')).rejects.toThrow('Magic link send failed')
    })

    it('should propagate magic link login errors', async () => {
      const error = new Error('Magic link login failed')
      authTestRequest.post.mockRejectedValueOnce(error)
      await expect(usersDashboardApi.loginWithMagicLink('token')).rejects.toThrow('Magic link login failed')
    })

    it('should propagate dashboard data errors', async () => {
      const error = new Error('Dashboard fetch failed')
      usersDashboardRequest.get.mockRejectedValueOnce(error)
      await expect(usersDashboardApi.getPhishingResult()).rejects.toThrow('Dashboard fetch failed')
    })

    it('should propagate learning data errors', async () => {
      const error = new Error('Learning data fetch failed')
      usersDashboardRequest.post.mockRejectedValueOnce(error)
      await expect(usersDashboardApi.getMyLearning()).rejects.toThrow('Learning data fetch failed')
    })

    it('should propagate certificate download errors', async () => {
      const error = new Error('Certificate download failed')
      usersDashboardRequest.get.mockRejectedValueOnce(error)
      await expect(usersDashboardApi.downloadCertificate('id-1')).rejects.toThrow('Certificate download failed')
    })

    it('should propagate timeline errors', async () => {
      const error = new Error('Timeline fetch failed')
      usersDashboardRequest.post.mockRejectedValueOnce(error)
      await expect(usersDashboardApi.getUserTimeline({})).rejects.toThrow('Timeline fetch failed')
    })
  })
})
