jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
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

  describe('return values', () => {
    it('all functions should return thenables', async () => {
      expect(typeof systemUsersApi.getSystemUsers({}).then).toBe('function')
      expect(typeof systemUsersApi.getSystemUsersRole().then).toBe('function')
      expect(typeof systemUsersApi.getAvailableSystemUsersRole().then).toBe('function')
      expect(typeof systemUsersApi.createSystemUser({}).then).toBe('function')
      expect(typeof systemUsersApi.updateSystemUser({}).then).toBe('function')
      expect(typeof systemUsersApi.deleteSystemUser('id').then).toBe('function')
      expect(typeof systemUsersApi.bulkDeleteSystemUsers({}).then).toBe('function')
      expect(typeof systemUsersApi.sendInformationEmail('id').then).toBe('function')
      expect(typeof systemUsersApi.exportSystemUsers().then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 9 functions', () => {
      const functions = Object.values(systemUsersApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(9)
    })

    it('should have all system user management functions', () => {
      expect(typeof systemUsersApi.getSystemUsers).toBe('function')
      expect(typeof systemUsersApi.getSystemUsersRole).toBe('function')
      expect(typeof systemUsersApi.getAvailableSystemUsersRole).toBe('function')
      expect(typeof systemUsersApi.createSystemUser).toBe('function')
      expect(typeof systemUsersApi.updateSystemUser).toBe('function')
      expect(typeof systemUsersApi.deleteSystemUser).toBe('function')
      expect(typeof systemUsersApi.bulkDeleteSystemUsers).toBe('function')
      expect(typeof systemUsersApi.sendInformationEmail).toBe('function')
      expect(typeof systemUsersApi.exportSystemUsers).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle system user CRUD workflow', async () => {
      // Search users
      await systemUsersApi.getSystemUsers({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Create user
      testRequest.post.mockClear()
      await systemUsersApi.createSystemUser({ email: 'user@example.com' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Update user
      testRequest.put.mockClear()
      await systemUsersApi.updateSystemUser({ resourceId: 'user-1', role: 'editor' })
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Delete user
      testRequest.delete.mockClear()
      await systemUsersApi.deleteSystemUser('user-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle role management workflow', async () => {
      // Get all roles
      await systemUsersApi.getSystemUsersRole()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Get available roles
      testRequest.get.mockClear()
      await systemUsersApi.getAvailableSystemUsersRole()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle bulk operations workflow', async () => {
      // Search users
      await systemUsersApi.getSystemUsers({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Bulk delete users
      testRequest.delete.mockClear()
      await systemUsersApi.bulkDeleteSystemUsers({ userIds: ['user-1', 'user-2'] })
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle user notification workflow', async () => {
      // Create user
      await systemUsersApi.createSystemUser({ email: 'user@example.com' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Send information email
      testRequest.post.mockClear()
      await systemUsersApi.sendInformationEmail('user-1')
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel role retrieval', async () => {
      const results = await Promise.all([
        systemUsersApi.getSystemUsersRole(),
        systemUsersApi.getAvailableSystemUsersRole()
      ])

      expect(results).toHaveLength(2)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle user search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await systemUsersApi.getSystemUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/system-users/search', payload)
    })

    it('should handle user creation with complex payload', async () => {
      const payload = {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        enabled: true
      }
      await systemUsersApi.createSystemUser(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/system-users', payload, expect.any(Object))
    })

    it('should handle user update with resourceId extraction', async () => {
      const payload = { resourceId: 'user-123', role: 'editor', permissions: ['read', 'write'] }
      await systemUsersApi.updateSystemUser(payload)
      expect(testRequest.put).toHaveBeenCalledWith('/system-users/user-123', payload, expect.any(Object))
    })

    it('should handle numeric and string IDs for deletion', async () => {
      await systemUsersApi.deleteSystemUser(123)
      expect(testRequest.delete).toHaveBeenCalledWith('/system-users/123', expect.any(Object))

      testRequest.delete.mockClear()
      await systemUsersApi.deleteSystemUser('user-abc')
      expect(testRequest.delete).toHaveBeenCalledWith('/system-users/user-abc', expect.any(Object))
    })

    it('should handle export with empty payload', async () => {
      await systemUsersApi.exportSystemUsers()
      expect(testRequest.post).toHaveBeenCalledWith('/system-users/search/export', {}, expect.any(Object))
    })

    it('should handle export with complex filters', async () => {
      const payload = {
        filters: {
          status: ['active', 'inactive'],
          role: ['admin', 'editor', 'viewer'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await systemUsersApi.exportSystemUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/system-users/search/export', payload, expect.any(Object))
    })

    it('should handle bulk delete with multiple IDs', async () => {
      const payload = { userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'] }
      await systemUsersApi.bulkDeleteSystemUsers(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/system-users/bulk-delete',
        expect.objectContaining({ data: payload })
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate GET errors', async () => {
      const error = new Error('Role fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(systemUsersApi.getSystemUsersRole()).rejects.toThrow('Role fetch failed')
    })

    it('should propagate POST errors', async () => {
      const error = new Error('User creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(systemUsersApi.createSystemUser({})).rejects.toThrow('User creation failed')
    })

    it('should propagate PUT errors', async () => {
      const error = new Error('User update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(systemUsersApi.updateSystemUser({})).rejects.toThrow('User update failed')
    })

    it('should propagate DELETE errors', async () => {
      const error = new Error('User deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(systemUsersApi.deleteSystemUser('id')).rejects.toThrow('User deletion failed')
    })

    it('should handle search errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(systemUsersApi.getSystemUsers({})).rejects.toThrow('Search failed')
    })

    it('should handle export errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(systemUsersApi.exportSystemUsers()).rejects.toThrow('Export failed')
    })

    it('should handle email notification errors', async () => {
      const error = new Error('Email send failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(systemUsersApi.sendInformationEmail('id')).rejects.toThrow('Email send failed')
    })

    it('should handle bulk delete errors', async () => {
      const error = new Error('Bulk delete failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(systemUsersApi.bulkDeleteSystemUsers({})).rejects.toThrow('Bulk delete failed')
    })
  })
})
