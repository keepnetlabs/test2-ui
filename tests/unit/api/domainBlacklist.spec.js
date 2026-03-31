import * as BlacklistAPI from '@/api/domainBlacklist'
import axios from 'axios'

jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn().mockResolvedValue({ data: {} })
  }
  return {
    create: jest.fn(() => mockAxiosInstance),
    __mockInstance: mockAxiosInstance
  }
})

const mockClient = axios.__mockInstance

describe('Domain Blacklist API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('axios client configuration', () => {
    it('should use external API base URL, not testRequest', () => {
      // domainBlacklist uses its own axios instance, not the internal testRequest
      // Verify by checking that mockClient.get is used (not testRequest)
      BlacklistAPI.getAllDomainBlacklistStatuses()
      expect(mockClient.get).toHaveBeenCalled()
    })
  })

  describe('getAllDomainBlacklistStatuses', () => {
    it('should call GET /domains', async () => {
      await BlacklistAPI.getAllDomainBlacklistStatuses()
      expect(mockClient.get).toHaveBeenCalledWith('/domains')
    })

    it('should return thenable', () => {
      const result = BlacklistAPI.getAllDomainBlacklistStatuses()
      expect(typeof result.then).toBe('function')
    })

    it('should return domains array on success', async () => {
      const mockResponse = {
        data: {
          domains: [
            { domain: 'example.com', status: 'clean', reason: null },
            { domain: 'malicious.com', status: 'malicious', reason: 'Blocked by 3 vendors' }
          ],
          total: 2
        }
      }
      mockClient.get.mockResolvedValueOnce(mockResponse)
      const response = await BlacklistAPI.getAllDomainBlacklistStatuses()
      expect(response.data.domains).toHaveLength(2)
      expect(response.data.domains[1].status).toBe('malicious')
    })
  })

  describe('getDomainBlacklistStatus', () => {
    it('should always delegate to the worker API (no client-side static override)', async () => {
      mockClient.get.mockResolvedValueOnce({
        data: { status: 'malicious', reason: 'This domain is blocked by major browsers.' }
      })
      await BlacklistAPI.getDomainBlacklistStatus('sirketiciduyuruonline.com')
      expect(mockClient.get).toHaveBeenCalledTimes(1)
      expect(mockClient.get).toHaveBeenCalledWith('/domains/sirketiciduyuruonline.com')
    })

    it('should call GET /domains/{domain}', async () => {
      await BlacklistAPI.getDomainBlacklistStatus('example.com')
      expect(mockClient.get).toHaveBeenCalledWith('/domains/example.com')
    })

    it('should pass domain name correctly', async () => {
      await BlacklistAPI.getDomainBlacklistStatus('digitalsecurelogin.co')
      expect(mockClient.get).toHaveBeenCalledWith('/domains/digitalsecurelogin.co')
    })

    it('should return thenable', () => {
      const result = BlacklistAPI.getDomainBlacklistStatus('test.com')
      expect(typeof result.then).toBe('function')
    })

    it('should return domain status with reason', async () => {
      const mockResponse = {
        data: {
          domain: 'malicious.com',
          status: 'malicious',
          reason: 'This domain is blocked by major browsers.',
          safeBrowsing: { status: 'malicious', detail: 'SOCIAL_ENGINEERING' },
          virusTotal: { status: 'malicious', detail: '5 engines', maliciousCount: 5, suspiciousCount: 0 }
        }
      }
      mockClient.get.mockResolvedValueOnce(mockResponse)
      const response = await BlacklistAPI.getDomainBlacklistStatus('malicious.com')
      expect(response.data.status).toBe('malicious')
      expect(response.data.reason).toBeTruthy()
    })

    it('should return null reason for clean domains', async () => {
      const mockResponse = {
        data: { domain: 'clean.com', status: 'clean', reason: null }
      }
      mockClient.get.mockResolvedValueOnce(mockResponse)
      const response = await BlacklistAPI.getDomainBlacklistStatus('clean.com')
      expect(response.data.status).toBe('clean')
      expect(response.data.reason).toBeNull()
    })
  })

  describe('getCleanDomainSuggestions', () => {
    it('should call GET /domains/suggestions/clean', async () => {
      await BlacklistAPI.getCleanDomainSuggestions()
      expect(mockClient.get).toHaveBeenCalledWith('/domains/suggestions/clean')
    })

    it('should return thenable', () => {
      const result = BlacklistAPI.getCleanDomainSuggestions()
      expect(typeof result.then).toBe('function')
    })

    it('should return suggestions array', async () => {
      const mockResponse = {
        data: {
          suggestions: [
            { domain: 'clean1.com', lastChecked: '2026-03-23T12:00:00Z' },
            { domain: 'clean2.com', lastChecked: '2026-03-23T12:00:00Z' }
          ],
          total: 2
        }
      }
      mockClient.get.mockResolvedValueOnce(mockResponse)
      const response = await BlacklistAPI.getCleanDomainSuggestions()
      expect(response.data.suggestions).toHaveLength(2)
      expect(response.data.suggestions[0].domain).toBe('clean1.com')
    })
  })

  describe('Error Handling', () => {
    it('getAllDomainBlacklistStatuses should propagate errors', async () => {
      mockClient.get.mockRejectedValueOnce(new Error('Network Error'))
      await expect(BlacklistAPI.getAllDomainBlacklistStatuses()).rejects.toThrow('Network Error')
    })

    it('getDomainBlacklistStatus should propagate 404 errors', async () => {
      mockClient.get.mockRejectedValueOnce({ response: { status: 404, data: { error: 'Domain not found' } } })
      await expect(BlacklistAPI.getDomainBlacklistStatus('unknown.com')).rejects.toEqual(
        expect.objectContaining({ response: expect.objectContaining({ status: 404 }) })
      )
    })

    it('getCleanDomainSuggestions should propagate errors', async () => {
      mockClient.get.mockRejectedValueOnce(new Error('Timeout'))
      await expect(BlacklistAPI.getCleanDomainSuggestions()).rejects.toThrow('Timeout')
    })
  })

  describe('All Exported Functions', () => {
    it('should export getAllDomainBlacklistStatuses', () => {
      expect(typeof BlacklistAPI.getAllDomainBlacklistStatuses).toBe('function')
    })

    it('should export getDomainBlacklistStatus', () => {
      expect(typeof BlacklistAPI.getDomainBlacklistStatus).toBe('function')
    })

    it('should export getCleanDomainSuggestions', () => {
      expect(typeof BlacklistAPI.getCleanDomainSuggestions).toBe('function')
    })
  })

  describe('HTTP Method Consistency', () => {
    it('all functions should use GET method', async () => {
      await BlacklistAPI.getAllDomainBlacklistStatuses()
      await BlacklistAPI.getDomainBlacklistStatus('test.com')
      await BlacklistAPI.getCleanDomainSuggestions()
      expect(mockClient.get).toHaveBeenCalledTimes(3)
    })
  })

  describe('Domain Status Values', () => {
    const statusCases = [
      { status: 'clean', reason: null },
      { status: 'malicious', reason: 'This domain is blocked by major browsers.' },
      { status: 'suspicious', reason: 'This domain has been flagged by 2 security vendors.' },
      { status: 'error', reason: 'Security check could not be completed.' },
      { status: 'partial', reason: 'One of the security checks failed.' },
      { status: 'pending', reason: null }
    ]

    statusCases.forEach(({ status, reason }) => {
      it(`should handle "${status}" status correctly`, async () => {
        mockClient.get.mockResolvedValueOnce({
          data: { domain: 'test.com', status, reason }
        })
        const response = await BlacklistAPI.getDomainBlacklistStatus('test.com')
        expect(response.data.status).toBe(status)
        if (reason) {
          expect(response.data.reason).toBeTruthy()
        } else {
          expect(response.data.reason).toBeNull()
        }
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle domain with special characters', async () => {
      await BlacklistAPI.getDomainBlacklistStatus('global-cloud-llc.com')
      expect(mockClient.get).toHaveBeenCalledWith('/domains/global-cloud-llc.com')
    })

    it('should handle subdomain-like domain names', async () => {
      await BlacklistAPI.getDomainBlacklistStatus('insan-kaynaklari.me')
      expect(mockClient.get).toHaveBeenCalledWith('/domains/insan-kaynaklari.me')
    })

    it('should handle empty suggestions response', async () => {
      mockClient.get.mockResolvedValueOnce({
        data: { suggestions: [], total: 0 }
      })
      const response = await BlacklistAPI.getCleanDomainSuggestions()
      expect(response.data.suggestions).toHaveLength(0)
    })

    it('should handle large domains list', async () => {
      const domains = Array.from({ length: 52 }, (_, i) => ({
        domain: `domain${i}.com`,
        status: 'clean',
        reason: null
      }))
      mockClient.get.mockResolvedValueOnce({ data: { domains, total: 52 } })
      const response = await BlacklistAPI.getAllDomainBlacklistStatuses()
      expect(response.data.domains).toHaveLength(52)
      expect(response.data.total).toBe(52)
    })
  })
})
