jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({})
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

  describe('return values', () => {
    it('getSandboxSummaryData should return thenable', () => {
      const result = sandboxApi.getSandboxSummaryData({})
      expect(typeof result.then).toBe('function')
    })

    it('getSandboxLog should return thenable', () => {
      const result = sandboxApi.getSandboxLog({})
      expect(typeof result.then).toBe('function')
    })

    it('getSandboxStats should return thenable', () => {
      const result = sandboxApi.getSandboxStats({})
      expect(typeof result.then).toBe('function')
    })

    it('exportSandboxLog should return thenable', () => {
      const result = sandboxApi.exportSandboxLog()
      expect(typeof result.then).toBe('function')
    })

    it('exportSandboxStats should return thenable', () => {
      const result = sandboxApi.exportSandboxStats()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 5 functions', () => {
      const functions = Object.values(sandboxApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(5)
    })

    it('should have all sandbox functions', () => {
      expect(typeof sandboxApi.getSandboxSummaryData).toBe('function')
      expect(typeof sandboxApi.getSandboxLog).toBe('function')
      expect(typeof sandboxApi.getSandboxStats).toBe('function')
      expect(typeof sandboxApi.exportSandboxLog).toBe('function')
      expect(typeof sandboxApi.exportSandboxStats).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle sandbox data retrieval workflow', async () => {
      // Get summary
      await sandboxApi.getSandboxSummaryData({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get log
      testRequest.post.mockClear()
      await sandboxApi.getSandboxLog({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get stats
      testRequest.post.mockClear()
      await sandboxApi.getSandboxStats({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle sandbox export workflow', async () => {
      // Export log
      await sandboxApi.exportSandboxLog({ filters: {} })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Export stats
      testRequest.post.mockClear()
      await sandboxApi.exportSandboxStats({ filters: {} })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel data retrieval requests', async () => {
      const results = await Promise.all([
        sandboxApi.getSandboxSummaryData({}),
        sandboxApi.getSandboxLog({}),
        sandboxApi.getSandboxStats({})
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(3)
    })

    it('should handle parallel export requests', async () => {
      const results = await Promise.all([
        sandboxApi.exportSandboxLog({}),
        sandboxApi.exportSandboxStats({})
      ])

      expect(results).toHaveLength(2)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle empty payloads for summary data', async () => {
      await sandboxApi.getSandboxSummaryData({})
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/summary', {})
    })

    it('should handle complex time range in summary data', async () => {
      const payload = { timeRange: '30d' }
      await sandboxApi.getSandboxSummaryData(payload)
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/summary', payload)
    })

    it('should handle pagination payloads for logs', async () => {
      const payload = { page: 3, pageSize: 100 }
      await sandboxApi.getSandboxLog(payload)
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/search-log', payload)
    })

    it('should handle filter payloads for stats', async () => {
      const payload = { filters: { verdict: 'malicious' } }
      await sandboxApi.getSandboxStats(payload)
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/search-stats', payload)
    })

    it('should use default empty payload for exportSandboxLog', async () => {
      await sandboxApi.exportSandboxLog()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-log/export',
        {},
        expect.any(Object)
      )
    })

    it('should use default empty payload for exportSandboxStats', async () => {
      await sandboxApi.exportSandboxStats()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-stats/export',
        {},
        expect.any(Object)
      )
    })

    it('should accept custom payload for exportSandboxLog', async () => {
      const payload = { dateRange: { start: '2024-01-01' } }
      await sandboxApi.exportSandboxLog(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-log/export',
        payload,
        expect.any(Object)
      )
    })

    it('should accept custom payload for exportSandboxStats', async () => {
      const payload = { category: ['email'] }
      await sandboxApi.exportSandboxStats(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-stats/export',
        payload,
        expect.any(Object)
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate getSandboxSummaryData errors', async () => {
      const error = new Error('Summary fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(sandboxApi.getSandboxSummaryData({})).rejects.toThrow('Summary fetch failed')
    })

    it('should propagate getSandboxLog errors', async () => {
      const error = new Error('Log fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(sandboxApi.getSandboxLog({})).rejects.toThrow('Log fetch failed')
    })

    it('should propagate getSandboxStats errors', async () => {
      const error = new Error('Stats fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(sandboxApi.getSandboxStats({})).rejects.toThrow('Stats fetch failed')
    })

    it('should propagate exportSandboxLog errors', async () => {
      const error = new Error('Log export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(sandboxApi.exportSandboxLog()).rejects.toThrow('Log export failed')
    })

    it('should propagate exportSandboxStats errors', async () => {
      const error = new Error('Stats export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(sandboxApi.exportSandboxStats()).rejects.toThrow('Stats export failed')
    })
  })
})
