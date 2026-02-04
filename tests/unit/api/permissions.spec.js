jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
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
})
