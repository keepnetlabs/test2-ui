import {
  getTargetUsers,
  getTargetUsersCountSummary,
  deleteTargetUser,
  bulkDeleteTargetUsers,
  createTargetUser,
  updateTargetUser,
  getTargetGroups,
  searchTargetGroups,
  searchAllTargetGroups,
  getTargetGroup,
  createTargetGroup,
  updateTargetGroup,
  deleteTargetGroup,
  getTargetUserCustomFieldsByCompanyId,
  downloadExampleTargetUserFile,
  exportTargetUsers,
  exportTargetGroups,
  getAllJobs,
  getJobDetail
} from '@/api/targetUsers'
import testRequest from '@/utils/testRequest'
import uploadRequest from '@/utils/uploadRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

jest.mock('@/utils/uploadRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} })
}))

describe('targetUsers API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTargetUsers', () => {
    it('calls POST /target-users/search', async () => {
      await getTargetUsers({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/target-users/search', { page: 1 })
    })
  })

  describe('getTargetUsersCountSummary', () => {
    it('calls GET count-summary', async () => {
      await getTargetUsersCountSummary()
      expect(testRequest.get).toHaveBeenCalledWith('/target-users/count-summary')
    })
  })

  describe('deleteTargetUser', () => {
    it('calls DELETE with resourceId', async () => {
      await deleteTargetUser('res-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/target-users/res-1',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('bulkDeleteTargetUsers', () => {
    it('calls DELETE bulk-delete', async () => {
      await bulkDeleteTargetUsers({ ids: ['a', 'b'] })
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/target-users/bulk-delete',
        expect.objectContaining({ data: { ids: ['a', 'b'] } })
      )
    })
  })

  describe('createTargetUser', () => {
    it('calls POST with snackbar', async () => {
      await createTargetUser({ email: 'a@b.com' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-users',
        { email: 'a@b.com' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('updateTargetUser', () => {
    it('calls PUT with resourceId from payload', async () => {
      await updateTargetUser({ resourceId: 'res-1', email: 'x@y.com' })
      expect(testRequest.put).toHaveBeenCalledWith(
        '/target-users/res-1',
        { resourceId: 'res-1', email: 'x@y.com' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getTargetGroups', () => {
    it('calls GET /target-groups', async () => {
      await getTargetGroups()
      expect(testRequest.get).toHaveBeenCalledWith('/target-groups', {})
    })

    it('passes config to get', async () => {
      await getTargetGroups({ custom: true })
      expect(testRequest.get).toHaveBeenCalledWith('/target-groups', { custom: true })
    })
  })

  describe('searchTargetGroups', () => {
    it('calls POST with systemGeneratedGroups', async () => {
      await searchTargetGroups({ page: 1 }, true)
      expect(testRequest.post).toHaveBeenCalledWith('/target-groups/search', {
        page: 1,
        systemGeneratedGroups: true
      })
    })
  })

  describe('searchAllTargetGroups', () => {
    it('calls POST search/all', async () => {
      await searchAllTargetGroups({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith('/target-groups/search/all', { page: 1 })
    })
  })

  describe('getTargetGroup', () => {
    it('calls GET with resourceId', async () => {
      await getTargetGroup('grp-1')
      expect(testRequest.get).toHaveBeenCalledWith('/target-groups/grp-1')
    })
  })

  describe('createTargetGroup', () => {
    it('calls POST with snackbar', async () => {
      await createTargetGroup({ name: 'Group1' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-groups',
        { name: 'Group1' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('updateTargetGroup', () => {
    it('calls PUT with resourceId from payload', async () => {
      await updateTargetGroup({ resourceId: 'grp-1', name: 'Updated' })
      expect(testRequest.put).toHaveBeenCalledWith(
        '/target-groups/grp-1',
        { resourceId: 'grp-1', name: 'Updated' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('deleteTargetGroup', () => {
    it('calls DELETE with resourceId', async () => {
      await deleteTargetGroup('grp-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/target-groups/grp-1',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getTargetUserCustomFieldsByCompanyId', () => {
    it('calls GET custom-fields/company', async () => {
      await getTargetUserCustomFieldsByCompanyId()
      expect(testRequest.get).toHaveBeenCalledWith('/custom-fields/company')
    })
  })

  describe('downloadExampleTargetUserFile', () => {
    it('calls POST with blob', async () => {
      await downloadExampleTargetUserFile({ type: 'csv' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-users/example-file',
        { type: 'csv' },
        { responseType: 'blob' }
      )
    })
  })

  describe('exportTargetUsers', () => {
    it('calls POST search/export with blob', async () => {
      await exportTargetUsers({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-users/search/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })
  })

  describe('exportTargetGroups', () => {
    it('calls POST search/export with blob', async () => {
      await exportTargetGroups({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-groups/search/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })
  })

  describe('getAllJobs', () => {
    it('calls GET /jobs', async () => {
      await getAllJobs()
      expect(testRequest.get).toHaveBeenCalledWith('/jobs')
    })
  })

  describe('getJobDetail', () => {
    it('calls GET /jobs/:id', async () => {
      await getJobDetail('job-1')
      expect(testRequest.get).toHaveBeenCalledWith('/jobs/job-1')
    })
  })
})
