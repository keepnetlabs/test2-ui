jest.mock('@/utils/threatIntelligenceRequest', () => ({
  post: jest.fn().mockResolvedValue({})
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

  describe('return values', () => {
    it('getThreatIntelligenceList should return thenable', () => {
      const result = threatIntelligenceApi.getThreatIntelligenceList({})
      expect(typeof result.then).toBe('function')
    })

    it('exportThreatIntelligence should return thenable', () => {
      const result = threatIntelligenceApi.exportThreatIntelligence({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 2 functions', () => {
      const functions = Object.values(threatIntelligenceApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(2)
    })

    it('should have all threat intelligence functions', () => {
      expect(typeof threatIntelligenceApi.getThreatIntelligenceList).toBe('function')
      expect(typeof threatIntelligenceApi.exportThreatIntelligence).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle threat intelligence search and export workflow', async () => {
      // Search threat intelligence
      await threatIntelligenceApi.getThreatIntelligenceList({ page: 1 })
      expect(threatIntelligenceRequest.post).toHaveBeenCalledTimes(1)

      // Export results
      threatIntelligenceRequest.post.mockClear()
      await threatIntelligenceApi.exportThreatIntelligence({ filters: {} })
      expect(threatIntelligenceRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel search and export requests', async () => {
      const results = await Promise.all([
        threatIntelligenceApi.getThreatIntelligenceList({ page: 1 }),
        threatIntelligenceApi.exportThreatIntelligence({})
      ])

      expect(results).toHaveLength(2)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledTimes(2)
    })

    it('should handle multiple paginated searches', async () => {
      await threatIntelligenceApi.getThreatIntelligenceList({ page: 1 })
      expect(threatIntelligenceRequest.post).toHaveBeenCalledTimes(1)

      threatIntelligenceRequest.post.mockClear()
      await threatIntelligenceApi.getThreatIntelligenceList({ page: 2 })
      expect(threatIntelligenceRequest.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle empty payloads for getThreatIntelligenceList', async () => {
      await threatIntelligenceApi.getThreatIntelligenceList({})
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith('/leak/search', {}, expect.any(Object))
    })

    it('should handle complex filter payloads', async () => {
      const payload = {
        page: 1,
        filters: {
          severity: ['critical', 'high', 'medium'],
          status: ['active', 'resolved', 'ignored'],
          dateRange: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith('/leak/search', payload, expect.any(Object))
    })

    it('should handle pagination parameters', async () => {
      const payload = { page: 5, pageSize: 100 }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith('/leak/search', payload, expect.any(Object))
    })

    it('should handle sorting parameters', async () => {
      const payload = { sort: { field: 'severity', direction: 'asc' } }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith('/leak/search', payload, expect.any(Object))
    })

    it('should handle empty export payload', async () => {
      await threatIntelligenceApi.exportThreatIntelligence({})
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith('/leak/search/export', {}, expect.any(Object))
    })

    it('should handle complex export payload', async () => {
      const payload = {
        filters: {
          severity: ['critical'],
          dateRange: { start: '2024-06-01', end: '2024-12-31' }
        },
        format: 'csv'
      }
      await threatIntelligenceApi.exportThreatIntelligence(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith('/leak/search/export', payload, expect.any(Object))
    })
  })

  describe('localStorage Integration', () => {
    it('should retrieve company ID from localStorage for list operations', async () => {
      const payload = { page: 1 }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(localStorage.getItem).toHaveBeenCalledWith('companyRequestId')
    })

    it('should retrieve company ID from localStorage for export operations', async () => {
      const payload = { filters: {} }
      await threatIntelligenceApi.exportThreatIntelligence(payload)
      expect(localStorage.getItem).toHaveBeenCalledWith('companyRequestId')
    })

    it('should handle null company ID from localStorage', async () => {
      localStorage.getItem.mockReturnValue(null)
      const payload = { page: 1 }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)
      expect(threatIntelligenceRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-COMPANY-ID': null
          })
        })
      )
    })

    it('should update company ID when localStorage changes', async () => {
      localStorage.getItem.mockReturnValue('company-1')
      const payload = { page: 1 }
      await threatIntelligenceApi.getThreatIntelligenceList(payload)

      threatIntelligenceRequest.post.mockClear()
      localStorage.getItem.mockReturnValue('company-2')
      await threatIntelligenceApi.getThreatIntelligenceList(payload)

      const calls = threatIntelligenceRequest.post.mock.calls
      expect(calls[0][2].headers['X-IR-COMPANY-ID']).toBe('company-2')
    })
  })

  describe('Error Handling', () => {
    it('should propagate getThreatIntelligenceList errors', async () => {
      const error = new Error('List fetch failed')
      threatIntelligenceRequest.post.mockRejectedValueOnce(error)
      await expect(threatIntelligenceApi.getThreatIntelligenceList({})).rejects.toThrow('List fetch failed')
    })

    it('should propagate exportThreatIntelligence errors', async () => {
      const error = new Error('Export failed')
      threatIntelligenceRequest.post.mockRejectedValueOnce(error)
      await expect(threatIntelligenceApi.exportThreatIntelligence({})).rejects.toThrow('Export failed')
    })

    it('should handle network errors during search', async () => {
      const error = new Error('Network timeout')
      threatIntelligenceRequest.post.mockRejectedValueOnce(error)
      await expect(threatIntelligenceApi.getThreatIntelligenceList({ page: 1 })).rejects.toThrow('Network timeout')
    })

    it('should handle network errors during export', async () => {
      const error = new Error('Export network error')
      threatIntelligenceRequest.post.mockRejectedValueOnce(error)
      await expect(threatIntelligenceApi.exportThreatIntelligence({ filters: {} })).rejects.toThrow('Export network error')
    })
  })
})
