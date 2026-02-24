import {
  getSandboxSummaryData,
  getSandboxLog,
  getSandboxStats,
  exportSandboxLog,
  exportSandboxStats
} from '@/api/sandbox'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} })
}))

describe('sandbox API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSandboxSummaryData', () => {
    it('calls POST is/dashboard/summary', async () => {
      await getSandboxSummaryData({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/summary', { page: 1 })
    })
  })

  describe('getSandboxLog', () => {
    it('calls POST is/dashboard/search-log', async () => {
      await getSandboxLog({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/search-log', { page: 1 })
    })
  })

  describe('getSandboxStats', () => {
    it('calls POST is/dashboard/search-stats', async () => {
      await getSandboxStats({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('is/dashboard/search-stats', { page: 1 })
    })
  })

  describe('exportSandboxLog', () => {
    it('calls POST with blob responseType', async () => {
      await exportSandboxLog({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-log/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })

    it('defaults payload to empty object', async () => {
      await exportSandboxLog()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-log/export',
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('exportSandboxStats', () => {
    it('calls POST with blob responseType', async () => {
      await exportSandboxStats({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-stats/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })

    it('defaults payload to empty object', async () => {
      await exportSandboxStats()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/is/dashboard/search-stats/export',
        {},
        { responseType: 'blob' }
      )
    })
  })
})
