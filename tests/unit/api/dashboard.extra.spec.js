import {
  selectCompany,
  logoutUser,
  sendFeedback,
  getNotifications,
  getAuditLogs,
  exportAuditLog
} from '@/api/dashboard'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} })
}))

describe('dashboard API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem('companyId', 'comp-1')
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('selectCompany', () => {
    it('calls GET companies/:id with loading', async () => {
      await selectCompany()
      expect(testRequest.get).toHaveBeenCalledWith('companies/comp-1', { loading: true })
    })
  })

  describe('logoutUser', () => {
    it('calls GET account/logout', async () => {
      await logoutUser()
      expect(testRequest.get).toHaveBeenCalledWith('account/logout')
    })
  })

  describe('sendFeedback', () => {
    it('calls POST feedback with snackbar', async () => {
      await sendFeedback({ message: 'Test' })
      expect(testRequest.post).toHaveBeenCalledWith(
        'feedback',
        { message: 'Test' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getNotifications', () => {
    it('calls POST notification-setting', async () => {
      await getNotifications({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users/notification-setting',
        { page: 1 }
      )
    })
  })

  describe('getAuditLogs', () => {
    it('calls POST audit-logs/search', async () => {
      await getAuditLogs({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/audit-logs/search', { page: 1 })
    })
  })

  describe('exportAuditLog', () => {
    it('calls POST with blob', async () => {
      await exportAuditLog({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/audit-logs/search/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })
    it('defaults payload to empty object', async () => {
      await exportAuditLog()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/audit-logs/search/export',
        {},
        { responseType: 'blob' }
      )
    })
  })
})
