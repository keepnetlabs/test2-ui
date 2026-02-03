jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as systemUsersApi from '@/api/systemUsers'

describe('systemUsers API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('system user search and retrieval', () => {
    it('should call getSystemUsers', async () => {
      const payload = { page: 1 }
      await systemUsersApi.getSystemUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/system-users/search', payload)
    })

    it('should call getSystemUsersRole', async () => {
      await systemUsersApi.getSystemUsersRole()
      expect(testRequest.get).toHaveBeenCalledWith('/roles')
    })

    it('should call getAvailableSystemUsersRole', async () => {
      await systemUsersApi.getAvailableSystemUsersRole()
      expect(testRequest.get).toHaveBeenCalledWith('/roleswithAvailable')
    })
  })

  describe('system user management operations', () => {
    it('should call createSystemUser', async () => {
      const payload = { email: 'user@example.com', role: 'admin' }
      await systemUsersApi.createSystemUser(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateSystemUser', async () => {
      const payload = { resourceId: 'user-123', role: 'editor' }
      await systemUsersApi.updateSystemUser(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/system-users/user-123',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSystemUser', async () => {
      const resourceId = 'user-123'
      await systemUsersApi.deleteSystemUser(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/system-users/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteSystemUser with default empty ID', async () => {
      await systemUsersApi.deleteSystemUser()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/system-users/',
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteSystemUsers', async () => {
      const payload = { userIds: ['user-1', 'user-2'] }
      await systemUsersApi.bulkDeleteSystemUsers(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/system-users/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call sendInformationEmail', async () => {
      const resourceId = 'user-123'
      await systemUsersApi.sendInformationEmail(resourceId)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/system-users/${resourceId}/send-information-email`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call sendInformationEmail with default empty ID', async () => {
      await systemUsersApi.sendInformationEmail()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users//send-information-email',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('export operations', () => {
    it('should call exportSystemUsers', async () => {
      const payload = { filters: {} }
      await systemUsersApi.exportSystemUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportSystemUsers with default empty payload', async () => {
      await systemUsersApi.exportSystemUsers()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users/search/export',
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await systemUsersApi.getSystemUsersRole()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search operations', async () => {
      const payload = { page: 1 }
      await systemUsersApi.getSystemUsers(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { resourceId: 'user-123', role: 'editor' }
      await systemUsersApi.updateSystemUser(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await systemUsersApi.deleteSystemUser('user-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for user creation', async () => {
      const payload = { email: 'user@example.com' }
      await systemUsersApi.createSystemUser(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for user updates', async () => {
      const payload = { resourceId: 'user-123' }
      await systemUsersApi.updateSystemUser(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for user deletion', async () => {
      await systemUsersApi.deleteSystemUser('user-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for email notification', async () => {
      await systemUsersApi.sendInformationEmail('user-123')
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type for exports', () => {
    it('should use blob responseType for system user exports', async () => {
      const payload = { filters: {} }
      await systemUsersApi.exportSystemUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('role management', () => {
    it('should retrieve all system user roles', async () => {
      await systemUsersApi.getSystemUsersRole()
      expect(testRequest.get).toHaveBeenCalledWith('/roles')
    })

    it('should retrieve available system user roles', async () => {
      await systemUsersApi.getAvailableSystemUsersRole()
      expect(testRequest.get).toHaveBeenCalledWith('/roleswithAvailable')
    })
  })

  describe('edge cases', () => {
    it('should handle bulk delete with multiple user IDs', async () => {
      const payload = { userIds: ['user-1', 'user-2', 'user-3', 'user-4'] }
      await systemUsersApi.bulkDeleteSystemUsers(payload)
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle system user creation with multiple roles', async () => {
      const payload = { email: 'user@example.com', roles: ['admin', 'editor'] }
      await systemUsersApi.createSystemUser(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle export with large filter sets', async () => {
      const payload = { filters: { status: ['active', 'inactive'], role: ['admin', 'editor'] } }
      await systemUsersApi.exportSystemUsers(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle system user deletion with special characters in ID', async () => {
      const resourceId = 'user-123!@#'
      await systemUsersApi.deleteSystemUser(resourceId)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/system-users/${resourceId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })
})
