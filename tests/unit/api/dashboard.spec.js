import * as DashboardAPI from '@/api/dashboard'
import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} })
}))

jest.mock('@/model/constants/commonConstants', () => ({
  COMMON_SNACKBAR: { color: 'red', duration: 5000 }
}))

describe('Dashboard API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('selectCompany', () => {
    it('should call GET with companyId from localStorage', async () => {
      localStorage.setItem('companyId', '123')
      await DashboardAPI.selectCompany()
      expect(testRequest.get).toHaveBeenCalledWith('companies/123', { loading: true })
    })

    it('should pass loading flag', async () => {
      localStorage.setItem('companyId', 'abc-123')
      await DashboardAPI.selectCompany()
      expect(testRequest.get).toHaveBeenCalledWith('companies/abc-123', { loading: true })
    })

    it('should handle different company IDs', async () => {
      testRequest.get.mockClear()
      localStorage.setItem('companyId', 'company-456')
      await DashboardAPI.selectCompany()
      expect(testRequest.get).toHaveBeenCalledWith('companies/company-456', { loading: true })
    })

    it('should return thenable', () => {
      localStorage.setItem('companyId', '1')
      const result = DashboardAPI.selectCompany()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('logoutUser', () => {
    it('should call GET logout endpoint', async () => {
      await DashboardAPI.logoutUser()
      expect(testRequest.get).toHaveBeenCalledWith('account/logout')
    })

    it('should not require parameters', async () => {
      await DashboardAPI.logoutUser()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should return thenable', () => {
      const result = DashboardAPI.logoutUser()
      expect(typeof result.then).toBe('function')
    })
  })

  describe('sendFeedback', () => {
    it('should call POST with payload', async () => {
      const payload = { message: 'Great app!' }
      await DashboardAPI.sendFeedback(payload)
      expect(testRequest.post).toHaveBeenCalledWith('feedback', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should include COMMON_SNACKBAR config', async () => {
      await DashboardAPI.sendFeedback({ feedback: 'test' })
      const calls = testRequest.post.mock.calls
      expect(calls[0][2]).toHaveProperty('snackbar')
      expect(calls[0][2].snackbar).toBeDefined()
    })

    it('should handle complex payloads', async () => {
      const payload = {
        message: 'Test feedback',
        rating: 5,
        email: 'test@example.com'
      }
      await DashboardAPI.sendFeedback(payload)
      expect(testRequest.post).toHaveBeenCalledWith('feedback', payload, expect.any(Object))
    })

    it('should handle empty payload', async () => {
      await DashboardAPI.sendFeedback({})
      expect(testRequest.post).toHaveBeenCalledWith('feedback', {}, expect.any(Object))
    })

    it('should return thenable', () => {
      const result = DashboardAPI.sendFeedback({ test: true })
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getNotifications', () => {
    it('should call POST with payload', async () => {
      const payload = { userId: '123' }
      await DashboardAPI.getNotifications(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/system-users/notification-setting', payload)
    })

    it('should not include snackbar config', async () => {
      await DashboardAPI.getNotifications({ test: true })
      const calls = testRequest.post.mock.calls
      expect(calls[0].length).toBe(2)
    })

    it('should handle various payloads', async () => {
      const payloads = [
        { id: 1, enabled: true },
        { filter: 'active' },
        {}
      ]

      for (const payload of payloads) {
        testRequest.post.mockClear()
        await DashboardAPI.getNotifications(payload)
        expect(testRequest.post).toHaveBeenCalledWith('/system-users/notification-setting', payload)
      }
    })

    it('should return thenable', () => {
      const result = DashboardAPI.getNotifications({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getAuditLogs', () => {
    it('should call POST with search payload', async () => {
      const payload = { filter: 'all' }
      await DashboardAPI.getAuditLogs(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/audit-logs/search', payload)
    })

    it('should handle complex search filters', async () => {
      const payload = {
        filter: {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          action: 'LOGIN'
        }
      }
      await DashboardAPI.getAuditLogs(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/audit-logs/search', payload)
    })

    it('should not include snackbar', async () => {
      await DashboardAPI.getAuditLogs({ page: 1 })
      const calls = testRequest.post.mock.calls
      expect(calls[0].length).toBe(2)
    })

    it('should return thenable', () => {
      const result = DashboardAPI.getAuditLogs({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('exportAuditLog', () => {
    it('should call POST with blob responseType', async () => {
      const payload = { export: true }
      await DashboardAPI.exportAuditLog(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/audit-logs/search/export', payload, {
        responseType: 'blob'
      })
    })

    it('should handle default empty payload', async () => {
      await DashboardAPI.exportAuditLog()
      expect(testRequest.post).toHaveBeenCalledWith('/audit-logs/search/export', {}, {
        responseType: 'blob'
      })
    })

    it('should always use blob responseType', async () => {
      await DashboardAPI.exportAuditLog({ format: 'csv' })
      const calls = testRequest.post.mock.calls
      expect(calls[0][2]).toEqual({ responseType: 'blob' })
    })

    it('should return thenable', () => {
      const result = DashboardAPI.exportAuditLog({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('HTTP Method Consistency', () => {
    it('should use GET for read-only operations', async () => {
      localStorage.setItem('companyId', '1')
      await DashboardAPI.selectCompany()
      await DashboardAPI.logoutUser()
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })

    it('should use POST for data modification', async () => {
      await DashboardAPI.sendFeedback({})
      await DashboardAPI.getNotifications({})
      await DashboardAPI.getAuditLogs({})
      await DashboardAPI.exportAuditLog()
      expect(testRequest.post).toHaveBeenCalledTimes(4)
    })

    it('should not mix GET and POST incorrectly', async () => {
      testRequest.get.mockClear()
      testRequest.post.mockClear()

      await DashboardAPI.sendFeedback({ msg: 'test' })

      expect(testRequest.post).toHaveBeenCalled()
      expect(testRequest.get).not.toHaveBeenCalled()
    })
  })

  describe('Snackbar Configuration', () => {
    it('sendFeedback should include snackbar config', async () => {
      await DashboardAPI.sendFeedback({})
      const call = testRequest.post.mock.calls[0]
      expect(call[2]).toHaveProperty('snackbar')
    })

    it('other POST functions should not include snackbar', async () => {
      testRequest.post.mockClear()
      await DashboardAPI.getNotifications({})
      await DashboardAPI.getAuditLogs({})
      await DashboardAPI.exportAuditLog()

      testRequest.post.mock.calls.forEach((call, index) => {
        if (index === 0 || index === 1) {
          expect(call[2]).toBeUndefined()
        }
        if (index === 2) {
          expect(call[2]).toHaveProperty('responseType')
          expect(call[2]).not.toHaveProperty('snackbar')
        }
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export 6 functions', () => {
      const functions = Object.values(DashboardAPI).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(6)
    })

    it('should have selectCompany', () => {
      expect(typeof DashboardAPI.selectCompany).toBe('function')
    })

    it('should have logoutUser', () => {
      expect(typeof DashboardAPI.logoutUser).toBe('function')
    })

    it('should have sendFeedback', () => {
      expect(typeof DashboardAPI.sendFeedback).toBe('function')
    })

    it('should have getNotifications', () => {
      expect(typeof DashboardAPI.getNotifications).toBe('function')
    })

    it('should have getAuditLogs', () => {
      expect(typeof DashboardAPI.getAuditLogs).toBe('function')
    })

    it('should have exportAuditLog', () => {
      expect(typeof DashboardAPI.exportAuditLog).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle complete session flow', async () => {
      localStorage.setItem('companyId', 'acme-corp')

      await DashboardAPI.selectCompany()
      await DashboardAPI.sendFeedback({ rating: 5 })
      await DashboardAPI.logoutUser()

      expect(testRequest.get).toHaveBeenCalledTimes(2)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle audit log operations', async () => {
      await DashboardAPI.getAuditLogs({ page: 1 })
      await DashboardAPI.exportAuditLog({ format: 'csv' })

      expect(testRequest.post).toHaveBeenCalledTimes(2)
    })

    it('should handle parallel requests', async () => {
      localStorage.setItem('companyId', '1')
      const results = await Promise.all([
        DashboardAPI.getAuditLogs({}),
        DashboardAPI.getNotifications({}),
        DashboardAPI.selectCompany()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
    })
  })

  describe('Error Handling', () => {
    it('should propagate GET errors', async () => {
      const error = new Error('Network error')
      testRequest.get.mockRejectedValueOnce(error)
      localStorage.setItem('companyId', '1')

      await expect(DashboardAPI.selectCompany()).rejects.toThrow('Network error')
    })

    it('should propagate POST errors', async () => {
      const error = new Error('Server error')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(DashboardAPI.sendFeedback({})).rejects.toThrow('Server error')
    })
  })
})
