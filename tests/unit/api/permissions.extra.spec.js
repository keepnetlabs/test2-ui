import {
  getPermissionLogs,
  getPermissionAll,
  getPermissionData,
  deletePermission,
  createPermissionRoles,
  updatePermissionRoles
} from '@/api/permissions'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('permissions API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPermissionLogs', () => {
    it('calls POST /roles/search', async () => {
      await getPermissionLogs({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/roles/search', { page: 1 })
    })
  })

  describe('getPermissionAll', () => {
    it('calls GET /permissions/all', async () => {
      await getPermissionAll()
      expect(testRequest.get).toHaveBeenCalledWith('/permissions/all')
    })
  })

  describe('getPermissionData', () => {
    it('calls GET /roles/:id', async () => {
      await getPermissionData('role-1')
      expect(testRequest.get).toHaveBeenCalledWith('/roles/role-1')
    })
  })

  describe('deletePermission', () => {
    it('calls DELETE with hideError', async () => {
      await deletePermission('role-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/roles/role-1',
        expect.objectContaining({ snackbar: expect.objectContaining({ hideError: true }) })
      )
    })
  })

  describe('createPermissionRoles', () => {
    it('calls POST with snackbar', async () => {
      await createPermissionRoles({ name: 'Admin' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/roles',
        { name: 'Admin' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('updatePermissionRoles', () => {
    it('calls PUT with id', async () => {
      await updatePermissionRoles({ name: 'Updated' }, 'role-1')
      expect(testRequest.put).toHaveBeenCalledWith(
        '/roles/role-1',
        { name: 'Updated' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })
})
