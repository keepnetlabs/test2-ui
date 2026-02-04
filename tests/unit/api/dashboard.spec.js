// Mock localStorage before importing modules that use it
const mockStorage = {
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
  value: mockStorage,
  writable: true,
  configurable: true
})

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as dashboardApi from '@/api/dashboard'

describe('dashboard API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.clear()
  })

  describe('company and user operations', () => {
    it('should call selectCompany', async () => {
      mockStorage.setItem('companyId', 'company-123')
      await dashboardApi.selectCompany()
      expect(testRequest.get).toHaveBeenCalledWith(
        `companies/company-123`,
        { loading: true }
      )
    })

    it('should call selectCompany with loading enabled', async () => {
      localStorage.setItem('companyId', 'company-456')
      await dashboardApi.selectCompany()
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ loading: true })
      )
    })

    it('should call logoutUser', async () => {
      await dashboardApi.logoutUser()
      expect(testRequest.get).toHaveBeenCalledWith('account/logout')
    })
  })

  describe('feedback and notifications', () => {
    it('should call sendFeedback', async () => {
      const payload = { message: 'Great application!' }
      await dashboardApi.sendFeedback(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'feedback',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getNotifications', async () => {
      const payload = { userId: 'user-123' }
      await dashboardApi.getNotifications(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/system-users/notification-setting', payload)
    })
  })

  describe('audit log operations', () => {
    it('should call getAuditLogs', async () => {
      const payload = { page: 1 }
      await dashboardApi.getAuditLogs(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/audit-logs/search', payload)
    })

    it('should call exportAuditLog', async () => {
      const payload = { filters: {} }
      await dashboardApi.exportAuditLog(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/audit-logs/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportAuditLog with default empty payload', async () => {
      await dashboardApi.exportAuditLog()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/audit-logs/search/export',
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for company selection', async () => {
      mockStorage.setItem('companyId', 'company-123')
      await dashboardApi.selectCompany()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for notifications and audit logs', async () => {
      const payload = { page: 1 }
      await dashboardApi.getAuditLogs(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for feedback', async () => {
      const payload = { message: 'Feedback' }
      await dashboardApi.sendFeedback(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for audit log export', async () => {
      const payload = { filters: {} }
      await dashboardApi.exportAuditLog(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('localStorage integration', () => {
    it('should retrieve company ID from localStorage', async () => {
      const companyId = 'test-company-123'
      localStorage.setItem('companyId', companyId)
      await dashboardApi.selectCompany()
      expect(testRequest.get).toHaveBeenCalledWith(
        `companies/${companyId}`,
        expect.any(Object)
      )
    })

    it('should handle empty localStorage', async () => {
      localStorage.clear()
      await dashboardApi.selectCompany()
      expect(testRequest.get).toHaveBeenCalledWith(
        'companies/null',
        { loading: true }
      )
    })
  })

  describe('edge cases', () => {
    it('should handle feedback with long message', async () => {
      const longMessage = 'A'.repeat(1000)
      const payload = { message: longMessage }
      await dashboardApi.sendFeedback(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle audit log export with multiple filters', async () => {
      const payload = {
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-12-31' },
          actions: ['create', 'update', 'delete'],
          users: ['user-1', 'user-2']
        }
      }
      await dashboardApi.exportAuditLog(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle notification settings with complex payload', async () => {
      const payload = {
        userId: 'user-123',
        emailNotifications: true,
        pushNotifications: false,
        settings: { frequency: 'daily' }
      }
      await dashboardApi.getNotifications(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })
})
