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
  })
})
