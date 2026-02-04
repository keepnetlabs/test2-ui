jest.mock('@/utils/threatIntelligenceRequest', () => ({
  post: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import threatIntelligenceRequest from '@/utils/threatIntelligenceRequest'
import * as threatIntelligenceApi from '@/api/threatIntelligence'

// Mock APP_CONFIG and localStorage
global.APP_CONFIG = { VUE_APP_API_KEY: 'test-api-key' }
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn((key) => {
      if (key === 'companyRequestId' || key === 'companyId') {
        return 'test-company-id'
      }
      return null
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true,
  configurable: true
})

describe('threatIntelligence API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem.mockReturnValue('test-company-id')
  })

  describe('threat intelligence search and retrieval', () => {
    it('should call getThreatIntelligenceList', async () => {
      const payload = { page: 1 }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith(
        '/leak/search',
        payload,
        expect.objectContaining({
          loading: false,
          headers: expect.objectContaining({
            'X-IR-API-KEY': 'test-api-key',
            'X-IR-COMPANY-ID': 'test-company-id'
          })
        })
      )
    })
  })

  describe('threat intelligence export operations', () => {
    it('should call exportThreatIntelligence', async () => {
      const payload = { filters: {} }
      await threatIntelligenceApi.exportThreatIntelligence(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith(
        '/leak/search/export',
        payload,
        expect.objectContaining({
          responseType: 'blob',
          'X-IR-API-KEY': 'test-api-key',
          'X-IR-COMPANY-ID': 'test-company-id'
        })
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use POST for all operations', async () => {
      const payload = { page: 1 }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalled()
    })
  })

  describe('header consistency', () => {
    it('should include API key and company ID in headers', async () => {
      const payload = { page: 1 }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-API-KEY': 'test-api-key',
            'X-IR-COMPANY-ID': 'test-company-id'
          })
        })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await threatIntelligenceApi.exportThreatIntelligence(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('loading state', () => {
    it('should set loading to false for getThreatIntelligenceList', async () => {
      const payload = { page: 1 }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ loading: false })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle getThreatIntelligenceList with complex filters', async () => {
      const payload = {
        page: 1,
        filters: {
          severity: ['critical', 'high'],
          status: ['active', 'resolved']
        }
      }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalled()
    })

    it('should handle getThreatIntelligenceList with pagination', async () => {
      const payload = {
        page: 2,
        pageSize: 50,
        sort: { field: 'date', direction: 'desc' }
      }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalled()
    })

    it('should handle exportThreatIntelligence with date range', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          severity: ['critical']
        }
      }
      await threatIntelligenceApi.exportThreatIntelligence(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalled()
    })

    it('should handle exportThreatIntelligence with empty filters', async () => {
      const payload = { filters: {} }
      await threatIntelligenceApi.exportThreatIntelligence(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalled()
    })

    it('should use correct company ID from localStorage', async () => {
      localStorage.getItem.mockReturnValue('custom-company-id')
      const payload = { page: 1 }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-COMPANY-ID': 'custom-company-id'
          })
        })
      )
    })
  })
})
