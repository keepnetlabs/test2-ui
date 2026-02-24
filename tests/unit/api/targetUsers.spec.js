jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

jest.mock('@/utils/uploadRequest', () => ({
  post: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import uploadRequest from '@/utils/uploadRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as targetUsersApi from '@/api/targetUsers'

describe('targetUsers API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('target user operations', () => {
    it('should call getTargetUsers', async () => {
      const payload = { page: 1 }
      await targetUsersApi.getTargetUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/target-users/search', payload)
    })

    it('should call getTargetUsersCountSummary', async () => {
      await targetUsersApi.getTargetUsersCountSummary()
      expect(testRequest.get).toHaveBeenCalledWith('/target-users/count-summary')
    })

    it('should call createTargetUser', async () => {
      const payload = { email: 'user@example.com', name: 'John Doe' }
      await targetUsersApi.createTargetUser(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-users',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateTargetUser', async () => {
      const payload = { resourceId: 'user-123', email: 'updated@example.com' }
      await targetUsersApi.updateTargetUser(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/target-users/user-123',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteTargetUser', async () => {
      const id = 'user-123'
      await targetUsersApi.deleteTargetUser(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/target-users/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteTargetUsers', async () => {
      const payload = { userIds: ['user-1', 'user-2'] }
      await targetUsersApi.bulkDeleteTargetUsers(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/target-users/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call bulkImportTargetUsersToGroups with default payload', async () => {
      await targetUsersApi.bulkImportTargetUsersToGroups()
      expect(testRequest.put).toHaveBeenCalledWith(
        '/target-groups/users',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call downloadExampleTargetUserFile', async () => {
      const payload = { format: 'csv' }
      await targetUsersApi.downloadExampleTargetUserFile(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-users/example-file',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportTargetUsers', async () => {
      const payload = { filters: {} }
      await targetUsersApi.exportTargetUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-users/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportTargetUsers with default payload', async () => {
      await targetUsersApi.exportTargetUsers()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-users/search/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call exportTargetUserBulk', async () => {
      const id = 'bulk-123'
      const payload = { filters: {} }
      await targetUsersApi.exportTargetUserBulk(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/target-users/${id}/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getUploadedFileData', async () => {
      const id = 'file-123'
      await targetUsersApi.getUploadedFileData(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/target-users/upload/${id}`)
    })

    it('should call searchTmp', async () => {
      const id = 'tmp-123'
      const payload = { page: 1 }
      await targetUsersApi.searchTmp(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(`/target-users/${id}/search`, payload)
    })

    it('should call createMapping', async () => {
      const payload = { columnMappings: {} }
      await targetUsersApi.createMapping(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/target-users/create-mapping', payload)
    })

    it('should call importTmpUsers', async () => {
      const id = 'tmp-123'
      const payload = { userIds: ['user-1'] }
      await targetUsersApi.importTmpUsers(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(`/target-users/${id}/import`, payload)
    })

    it('should call getMappingStatus', async () => {
      const id = 'job-123'
      await targetUsersApi.getMappingStatus(id)
      expect(testRequest.get).toHaveBeenCalledWith(`target-users/mapping-job/${id}`)
    })

    it('should call updateTransactionId', async () => {
      const id = 'user-123'
      await targetUsersApi.updateTransactionId(id)
      expect(testRequest.put).toHaveBeenCalledWith(`/target-users/${id}/update`)
    })

    it('should call updateTransactionId with default id', async () => {
      await targetUsersApi.updateTransactionId()
      expect(testRequest.put).toHaveBeenCalledWith('/target-users//update')
    })

    it('should call getTargetUserViewUserGroups', async () => {
      const resourceId = 'user-123'
      const payload = {}
      await targetUsersApi.getTargetUserViewUserGroups(resourceId, payload)
      expect(testRequest.post).toHaveBeenCalledWith(`target-users/${resourceId}/groups`, payload)
    })

    it('should call getTargetUserViewUserGroups with default resourceId and payload', async () => {
      await targetUsersApi.getTargetUserViewUserGroups()
      expect(testRequest.post).toHaveBeenCalledWith('target-users//groups', {})
    })

    it('should call uploadExcelOrCsvForTargetUsers', async () => {
      const file = new File(['content'], 'users.csv')
      const callback = jest.fn()
      await targetUsersApi.uploadExcelOrCsvForTargetUsers(file, callback)
      expect(uploadRequest.post).toHaveBeenCalledWith(
        '/target-users/upload',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: callback
        })
      )
    })
  })

  describe('target group operations', () => {
    it('should call getTargetGroups', async () => {
      const config = { timeout: 5000 }
      await targetUsersApi.getTargetGroups(config)
      expect(testRequest.get).toHaveBeenCalledWith('/target-groups', config)
    })

    it('should call getTargetGroups with default config', async () => {
      await targetUsersApi.getTargetGroups()
      expect(testRequest.get).toHaveBeenCalledWith('/target-groups', {})
    })

    it('should call searchTargetGroups with systemGeneratedGroups', async () => {
      const payload = { page: 1 }
      await targetUsersApi.searchTargetGroups(payload, true)
      expect(testRequest.post).toHaveBeenCalledWith('/target-groups/search', {
        ...payload,
        systemGeneratedGroups: true
      })
    })

    it('should call searchTargetGroups without systemGeneratedGroups', async () => {
      const payload = { page: 1 }
      await targetUsersApi.searchTargetGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/target-groups/search', {
        ...payload,
        systemGeneratedGroups: false
      })
    })

    it('should call searchAllTargetGroups', async () => {
      const payload = { search: 'text' }
      await targetUsersApi.searchAllTargetGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/target-groups/search/all', payload)
    })

    it('should call createTargetGroup', async () => {
      const payload = { name: 'New Group' }
      await targetUsersApi.createTargetGroup(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-groups',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateTargetGroup', async () => {
      const payload = { resourceId: 'group-123', name: 'Updated Group' }
      await targetUsersApi.updateTargetGroup(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/target-groups/group-123',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getTargetGroup', async () => {
      const id = 'group-123'
      await targetUsersApi.getTargetGroup(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/target-groups/${id}`)
    })

    it('should call deleteTargetGroup', async () => {
      const id = 'group-123'
      await targetUsersApi.deleteTargetGroup(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/target-groups/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getTargetGroupCountDetail', async () => {
      const payload = { groupIds: ['group-1'] }
      await targetUsersApi.getTargetGroupCountDetail(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/target-groups/targetgroupusercountdetail', payload)
    })

    it('should call getTargetGroupCountDetailExt', async () => {
      const payload = { groupIds: ['group-1'] }
      await targetUsersApi.getTargetGroupCountDetailExt(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/target-groups/targetgroupusercountdetailext', payload)
    })

    it('should call searchTargetGroupUsers', async () => {
      const id = 'group-123'
      const payload = { page: 1 }
      const options = { timeout: 5000 }
      await targetUsersApi.searchTargetGroupUsers(id, payload, options)
      expect(testRequest.post).toHaveBeenCalledWith(`/target-groups/${id}/users`, payload, options)
    })

    it('should call searchTargetGroupUsers with defaults', async () => {
      await targetUsersApi.searchTargetGroupUsers()
      expect(testRequest.post).toHaveBeenCalledWith('/target-groups//users', {}, {})
    })

    it('should call createTargetGroupUsers with snackbar', async () => {
      const id = 'group-123'
      const payload = { userIds: ['user-1'] }
      await targetUsersApi.createTargetGroupUsers(id, payload, true)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/target-groups/${id}/users`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call createTargetGroupUsers without snackbar', async () => {
      const id = 'group-123'
      const payload = { userIds: ['user-1'] }
      await targetUsersApi.createTargetGroupUsers(id, payload, false)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/target-groups/${id}/users`,
        payload,
        {}
      )
    })

    it('should call bulkImportTargetUsersToGroups', async () => {
      const payload = { mappings: {} }
      await targetUsersApi.bulkImportTargetUsersToGroups(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/target-groups/users',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportTargetGroupUsers', async () => {
      const id = 'group-123'
      const payload = { filters: {} }
      await targetUsersApi.exportTargetGroupUsers(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/target-groups/${id}/users/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportTargetGroupUsers with default id and payload', async () => {
      await targetUsersApi.exportTargetGroupUsers()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-groups//users/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call exportTargetGroups', async () => {
      const payload = { filters: {} }
      await targetUsersApi.exportTargetGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-groups/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportTargetGroups with default payload', async () => {
      await targetUsersApi.exportTargetGroups()
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-groups/search/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('should call deleteTargetGroupUsers', async () => {
      const id = 'group-123'
      const payload = { userIds: ['user-1'] }
      await targetUsersApi.deleteTargetGroupUsers(id, payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/target-groups/${id}/users`,
        { data: payload, snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteTargetGroupUsers with default id and payload', async () => {
      await targetUsersApi.deleteTargetGroupUsers()
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/target-groups//users',
        { data: {}, snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('custom field operations', () => {
    it('should call getTargetUserCustomFieldsByCompanyId', async () => {
      await targetUsersApi.getTargetUserCustomFieldsByCompanyId()
      expect(testRequest.get).toHaveBeenCalledWith('/custom-fields/company')
    })

    it('should call createTargetUserCustomField', async () => {
      const payload = { name: 'Field', type: 'text' }
      await targetUsersApi.createTargetUserCustomField(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/custom-fields', payload)
    })

    it('should call bulkUpdateOfCustomFields', async () => {
      const payload = { fieldUpdates: {} }
      await targetUsersApi.bulkUpdateOfCustomFields(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/custom-fields/bulk-update',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('job operations', () => {
    it('should call getAllJobs', async () => {
      await targetUsersApi.getAllJobs()
      expect(testRequest.get).toHaveBeenCalledWith('/jobs')
    })

    it('should call getJobDetail', async () => {
      const id = 'job-123'
      await targetUsersApi.getJobDetail(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/jobs/${id}`)
    })

    it('should call getJobDetail with default id', async () => {
      await targetUsersApi.getJobDetail()
      expect(testRequest.get).toHaveBeenCalledWith('/jobs/')
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await targetUsersApi.getTargetUsersCountSummary()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await targetUsersApi.getTargetUsers(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { resourceId: 'group-123', name: 'Updated' }
      await targetUsersApi.updateTargetGroup(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await targetUsersApi.deleteTargetUser('user-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for mutations', async () => {
      const payload = { email: 'user@example.com' }
      await targetUsersApi.createTargetUser(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for group operations', async () => {
      const payload = { resourceId: 'group-123', name: 'Updated' }
      await targetUsersApi.updateTargetGroup(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type for exports', () => {
    it('should use blob responseType for user exports', async () => {
      const payload = { filters: {} }
      await targetUsersApi.exportTargetUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for group exports', async () => {
      const payload = { filters: {} }
      await targetUsersApi.exportTargetGroups(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle target group creation with empty payload', async () => {
      await targetUsersApi.createTargetGroup({})
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle bulk delete with multiple user IDs', async () => {
      const payload = { userIds: ['user-1', 'user-2', 'user-3'] }
      await targetUsersApi.bulkDeleteTargetUsers(payload)
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle upload with progress callback', async () => {
      const file = new File(['data'], 'test.csv')
      const onProgress = jest.fn()
      await targetUsersApi.uploadExcelOrCsvForTargetUsers(file, onProgress)
      expect(uploadRequest.post).toHaveBeenCalled()
    })

    it('should handle target group user import with mapping', async () => {
      const id = 'tmp-123'
      const payload = { userIds: ['user-1', 'user-2'] }
      await targetUsersApi.importTmpUsers(payload, id)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle search with all optional parameters', async () => {
      const id = 'group-123'
      const payload = { page: 1, search: 'text' }
      const options = { timeout: 5000 }
      await targetUsersApi.searchTargetGroupUsers(id, payload, options)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('all functions should return thenables or promises', async () => {
      expect(typeof targetUsersApi.getTargetUsers({}).then).toBe('function')
      expect(typeof targetUsersApi.getTargetUsersCountSummary().then).toBe('function')
      expect(typeof targetUsersApi.createTargetUser({}).then).toBe('function')
      expect(typeof targetUsersApi.exportTargetUsers().then).toBe('function')
      expect(typeof targetUsersApi.uploadExcelOrCsvForTargetUsers(new File([], '')).then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 37+ functions', () => {
      const functions = Object.values(targetUsersApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThan(35)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle user import and group workflow', async () => {
      const file = new File(['data'], 'test.csv')
      await targetUsersApi.uploadExcelOrCsvForTargetUsers(file)
      expect(uploadRequest.post).toHaveBeenCalledTimes(1)

      uploadRequest.post.mockClear()
      await targetUsersApi.createTargetGroup({ name: 'Group' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle target user CRUD with groups', async () => {
      testRequest.post.mockClear()
      await targetUsersApi.getTargetUsers({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await targetUsersApi.createTargetUser({ email: 'user@test.com' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await targetUsersApi.bulkDeleteTargetUsers({ userIds: ['u1'] })
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle complex search payloads', async () => {
      const payload = {
        page: 1,
        pageSize: 50,
        filters: { status: 'active', groups: ['g1', 'g2'] }
      }
      await targetUsersApi.getTargetUsers(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/target-users/search', payload)
    })

    it('should handle file uploads with callbacks', async () => {
      const file = new File(['test data'], 'data.csv')
      const onProgress = jest.fn()
      await targetUsersApi.uploadExcelOrCsvForTargetUsers(file, onProgress)
      expect(uploadRequest.post).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should propagate API errors from all methods', async () => {
      const error = new Error('API Error')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(targetUsersApi.getTargetUsers({})).rejects.toThrow('API Error')

      testRequest.get.mockRejectedValueOnce(error)
      await expect(targetUsersApi.getTargetUsersCountSummary()).rejects.toThrow('API Error')

      testRequest.delete.mockRejectedValueOnce(error)
      await expect(targetUsersApi.deleteTargetUser('id')).rejects.toThrow('API Error')
    })

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed')
      uploadRequest.post.mockRejectedValueOnce(error)
      const file = new File([], 'test.csv')
      await expect(targetUsersApi.uploadExcelOrCsvForTargetUsers(file)).rejects.toThrow('Upload failed')
    })
  })
})
