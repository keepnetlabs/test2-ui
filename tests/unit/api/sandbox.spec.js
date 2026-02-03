jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import * as sandboxApi from '@/api/sandbox'

describe('sandbox API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sandbox data retrieval', () => {
    it('should call getSandboxSummaryData', async () => {
      const payload = { timeRange: '24h' }
      await sandboxApi.getSandboxSummaryData(payload)
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/summary', payload)
    })

    it('should call getSandboxLog', async () => {
      const payload = { page: 1 }
      await sandboxApi.getSandboxLog(payload)
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/search-log', payload)
    })

    it('should call getSandboxStats', async () => {
      const payload = { page: 1 }
      await sandboxApi.getSandboxStats(payload)
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/search-stats', payload)
    })
  })

  describe('sandbox export operations', () => {
    it('should call exportSandboxLog', async () => {
      const payload = { filters: {} }
      await sandboxApi.exportSandboxLog(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-log/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportSandboxLog with empty payload', async () => {
      await sandboxApi.exportSandboxLog()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-log/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call exportSandboxStats', async () => {
      const payload = { filters: {} }
      await sandboxApi.exportSandboxStats(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-stats/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportSandboxStats with empty payload', async () => {
      await sandboxApi.exportSandboxStats()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-stats/export',
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use POST for all operations', async () => {
      const payload = { page: 1 }
      await sandboxApi.getSandboxSummaryData(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for log export', async () => {
      const payload = { filters: {} }
      await sandboxApi.exportSandboxLog(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for stats export', async () => {
      const payload = { filters: {} }
      await sandboxApi.exportSandboxStats(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle getSandboxSummaryData with complex payload', async () => {
      const payload = {
        timeRange: '7d',
        filters: {
          status: ['active', 'inactive'],
          priority: ['high', 'critical']
        }
      }
      await sandboxApi.getSandboxSummaryData(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle getSandboxLog with pagination', async () => {
      const payload = {
        page: 2,
        pageSize: 50,
        sort: { field: 'date', direction: 'desc' }
      }
      await sandboxApi.getSandboxLog(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle getSandboxStats with filters', async () => {
      const payload = {
        page: 1,
        filters: {
          type: ['email', 'url'],
          verdict: ['malicious', 'suspicious']
        }
      }
      await sandboxApi.getSandboxStats(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle exportSandboxLog with complex filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          severity: ['critical', 'high'],
          status: ['open', 'closed']
        }
      }
      await sandboxApi.exportSandboxLog(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle exportSandboxStats with complex filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          category: ['email', 'web', 'file'],
          confidence: { min: 80, max: 100 }
        }
      }
      await sandboxApi.exportSandboxStats(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })
})
