jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as permissionsApi from '@/api/permissions'

describe('permissions API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('permission retrieval', () => {
    it('should call getPermissionLogs', async () => {
      const payload = { page: 1 }
      await permissionsApi.getPermissionLogs(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/roles/search', payload)
    })

    it('should call getPermissionAll', async () => {
      await permissionsApi.getPermissionAll()
      expect(testRequest.get).toHaveBeenCalledWith('/permissions/all')
    })

    it('should call getPermissionData', async () => {
      const id = 'role-123'
      await permissionsApi.getPermissionData(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/roles/${id}`)
    })
  })

  describe('permission role management', () => {
    it('should call createPermissionRoles', async () => {
      const payload = { name: 'New Role' }
      await permissionsApi.createPermissionRoles(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/roles',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updatePermissionRoles', async () => {
      const id = 'role-123'
      const payload = { name: 'Updated Role' }
      await permissionsApi.updatePermissionRoles(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/roles/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deletePermission', async () => {
      const id = 'role-123'
      await permissionsApi.deletePermission(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/roles/${id}`,
        { snackbar: { hideError: true } }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await permissionsApi.getPermissionAll()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await permissionsApi.getPermissionLogs(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const id = 'role-123'
      const payload = { name: 'Updated' }
      await permissionsApi.updatePermissionRoles(payload, id)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await permissionsApi.deletePermission('role-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for role creation', async () => {
      const payload = { name: 'New Role' }
      await permissionsApi.createPermissionRoles(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for role updates', async () => {
      const id = 'role-123'
      const payload = { name: 'Updated' }
      await permissionsApi.updatePermissionRoles(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use custom snackbar for deletion', async () => {
      await permissionsApi.deletePermission('role-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: { hideError: true } })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle role creation with permissions array', async () => {
      const payload = { name: 'Role', permissions: ['read', 'write', 'delete'] }
      await permissionsApi.createPermissionRoles(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle permission data retrieval', async () => {
      const id = 'admin-role'
      await permissionsApi.getPermissionData(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/roles/${id}`)
    })

    it('should handle permission log search with filters', async () => {
      const payload = { page: 1, status: 'active' }
      await permissionsApi.getPermissionLogs(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle role deletion with special characters', async () => {
      const id = 'role-123!@#'
      await permissionsApi.deletePermission(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/roles/${id}`,
        expect.any(Object)
      )
    })
  })

  describe('return values', () => {
    it('getPermissionLogs should return thenable', () => {
      const result = permissionsApi.getPermissionLogs({})
      expect(typeof result.then).toBe('function')
    })

    it('getPermissionAll should return thenable', () => {
      const result = permissionsApi.getPermissionAll()
      expect(typeof result.then).toBe('function')
    })

    it('getPermissionData should return thenable', () => {
      const result = permissionsApi.getPermissionData('1')
      expect(typeof result.then).toBe('function')
    })

    it('createPermissionRoles should return thenable', () => {
      const result = permissionsApi.createPermissionRoles({})
      expect(typeof result.then).toBe('function')
    })

    it('updatePermissionRoles should return thenable', () => {
      const result = permissionsApi.updatePermissionRoles({}, '1')
      expect(typeof result.then).toBe('function')
    })

    it('deletePermission should return thenable', () => {
      const result = permissionsApi.deletePermission('1')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 6 functions', () => {
      const functions = Object.values(permissionsApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(6)
    })

    it('should have all permission functions', () => {
      expect(typeof permissionsApi.getPermissionLogs).toBe('function')
      expect(typeof permissionsApi.getPermissionAll).toBe('function')
      expect(typeof permissionsApi.getPermissionData).toBe('function')
      expect(typeof permissionsApi.createPermissionRoles).toBe('function')
      expect(typeof permissionsApi.updatePermissionRoles).toBe('function')
      expect(typeof permissionsApi.deletePermission).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle role CRUD workflow', async () => {
      // Get all permissions first
      await permissionsApi.getPermissionAll()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Create role
      testRequest.post.mockClear()
      await permissionsApi.createPermissionRoles({ name: 'Test Role' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get role details
      testRequest.get.mockClear()
      await permissionsApi.getPermissionData('1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Update role
      testRequest.put.mockClear()
      await permissionsApi.updatePermissionRoles({ name: 'Updated' }, '1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Delete role
      testRequest.delete.mockClear()
      await permissionsApi.deletePermission('1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle permission search and retrieval', async () => {
      // Search permissions
      await permissionsApi.getPermissionLogs({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get all permissions
      testRequest.get.mockClear()
      await permissionsApi.getPermissionAll()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel requests', async () => {
      const results = await Promise.all([
        permissionsApi.getPermissionAll(),
        permissionsApi.getPermissionLogs({}),
        permissionsApi.getPermissionData('1')
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle numeric and string IDs', async () => {
      await permissionsApi.getPermissionData(123)
      expect(testRequest.get).toHaveBeenCalledWith('/roles/123')

      testRequest.get.mockClear()
      await permissionsApi.getPermissionData('role-abc')
      expect(testRequest.get).toHaveBeenCalledWith('/roles/role-abc')
    })

    it('should handle complex payloads for role creation', async () => {
      const payload = {
        name: 'Complex Role',
        permissions: ['read', 'write', 'delete', 'admin'],
        description: 'A complex test role',
        isActive: true
      }
      await permissionsApi.createPermissionRoles(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/roles', payload, expect.any(Object))
    })

    it('should handle empty payloads', async () => {
      await permissionsApi.createPermissionRoles({})
      expect(testRequest.post).toHaveBeenCalledWith('/roles', {}, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate errors correctly', async () => {
      const postError = new Error('POST failed')
      const getError = new Error('GET failed')
      const putError = new Error('PUT failed')
      const deleteError = new Error('DELETE failed')

      // Test POST error
      testRequest.post.mockRejectedValueOnce(postError)
      await expect(permissionsApi.getPermissionLogs({})).rejects.toThrow('POST failed')

      // Test GET error from getPermissionAll
      testRequest.get.mockRejectedValueOnce(getError)
      await expect(permissionsApi.getPermissionAll()).rejects.toThrow('GET failed')

      // Test GET error from getPermissionData
      testRequest.get.mockRejectedValueOnce(getError)
      await expect(permissionsApi.getPermissionData('1')).rejects.toThrow('GET failed')

      // Test POST error from createPermissionRoles
      testRequest.post.mockRejectedValueOnce(postError)
      await expect(permissionsApi.createPermissionRoles({})).rejects.toThrow('POST failed')

      // Test PUT error
      testRequest.put.mockRejectedValueOnce(putError)
      await expect(permissionsApi.updatePermissionRoles({}, '1')).rejects.toThrow('PUT failed')

      // Test DELETE error
      testRequest.delete.mockRejectedValueOnce(deleteError)
      await expect(permissionsApi.deletePermission('1')).rejects.toThrow('DELETE failed')
    })
  })
})
