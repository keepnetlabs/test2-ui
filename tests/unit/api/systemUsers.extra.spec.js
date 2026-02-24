import {
  getSystemUsers,
  createSystemUser,
  updateSystemUser,
  deleteSystemUser,
  exportSystemUsers,
  getSystemUsersRole,
  bulkDeleteSystemUsers
} from '@/api/systemUsers'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('systemUsers API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSystemUsers', () => {
    it('calls POST search', async () => {
      await getSystemUsers({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/system-users/search', { page: 1 })
    })
  })

  describe('createSystemUser', () => {
    it('calls POST with snackbar', async () => {
      await createSystemUser({ email: 'u@x.com' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users',
        { email: 'u@x.com' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('updateSystemUser', () => {
    it('calls PUT with resourceId from payload', async () => {
      await updateSystemUser({ resourceId: 'usr-1', email: 'x@y.com' })
      expect(testRequest.put).toHaveBeenCalledWith(
        '/system-users/usr-1',
        { resourceId: 'usr-1', email: 'x@y.com' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('deleteSystemUser', () => {
    it('calls DELETE with resourceId', async () => {
      await deleteSystemUser('usr-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/system-users/usr-1',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('exportSystemUsers', () => {
    it('calls POST export with blob', async () => {
      await exportSystemUsers({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users/search/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })
    it('defaults payload to empty object', async () => {
      await exportSystemUsers()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/system-users/search/export',
        {},
        { responseType: 'blob' }
      )
    })
  })

  describe('getSystemUsersRole', () => {
    it('calls GET /roles', async () => {
      await getSystemUsersRole()
      expect(testRequest.get).toHaveBeenCalledWith('/roles')
    })
  })

  describe('bulkDeleteSystemUsers', () => {
    it('calls DELETE bulk-delete', async () => {
      await bulkDeleteSystemUsers({ ids: ['a', 'b'] })
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/system-users/bulk-delete',
        expect.objectContaining({ data: { ids: ['a', 'b'] } })
      )
    })
  })
})
