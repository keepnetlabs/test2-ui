jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as investigationsApi from '@/api/investigations'

describe('investigations API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('investigation search and retrieval', () => {
    it('should call investigationList', async () => {
      const obj = { page: 1 }
      await investigationsApi.investigationList(obj)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/search', obj)
    })

    it('should call getInvestigationDetailsDataFunction', async () => {
      const id = 'investigation-123'
      await investigationsApi.getInvestigationDetailsDataFunction(id)
      expect(testRequest.get).toHaveBeenCalledWith(`investigations/${id}`)
    })

    it('should call getStatsAndMenuDataFunction', async () => {
      const id = 'investigation-123'
      await investigationsApi.getStatsAndMenuDataFunction(id)
      expect(testRequest.get).toHaveBeenCalledWith(`investigations/${id}/summary`)
    })

    it('should call getTargetUsers', async () => {
      await investigationsApi.getTargetUsers()
      expect(testRequest.get).toHaveBeenCalledWith('target-groups')
    })

    it('should call getInvestigationScanTypes', async () => {
      await investigationsApi.getInvestigationScanTypes()
      expect(testRequest.get).toHaveBeenCalledWith('/investigations/scan-types')
    })
  })

  describe('investigation creation and management', () => {
    it('should call saveNewInvestigation', async () => {
      const obj = { name: 'New Investigation' }
      await investigationsApi.saveNewInvestigation(obj)
      expect(testRequest.post).toHaveBeenCalledWith(
        'investigations',
        obj,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call cancelInvestigation', async () => {
      const id = 'investigation-123'
      await investigationsApi.cancelInvestigation(id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `investigations/${id}/cancel`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('investigation actions', () => {
    it('should call sendInvestigationWarningMessage', async () => {
      const id = 'investigation-123'
      const obj = { message: 'Warning message' }
      await investigationsApi.sendInvestigationWarningMessage(obj, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `investigations/${id}/actions-warning`,
        obj,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteInvestigationDetailsItem', async () => {
      const id = 'investigation-123'
      const obj = { itemIds: ['item-1'] }
      await investigationsApi.deleteInvestigationDetailsItem(obj, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `investigations/${id}/actions-delete`,
        obj,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteAndMessageInvestigationDetailsItem', async () => {
      const id = 'investigation-123'
      const obj = { itemIds: ['item-1'], message: 'Deleted' }
      await investigationsApi.deleteAndMessageInvestigationDetailsItem(obj, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `investigations/${id}/actions-delete-and-notify`,
        obj,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('investigation details search', () => {
    it('should call investigationDetailsListFunction', async () => {
      const id = 'investigation-123'
      const obj = { page: 1 }
      await investigationsApi.investigationDetailsListFunction(obj, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `investigations/${id}/search-email`,
        obj
      )
    })

    it('should call investigationDetailsTargetUsersListFunction', async () => {
      const id = 'investigation-123'
      const obj = { page: 1 }
      await investigationsApi.investigationDetailsTargetUsersListFunction(obj, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `investigations/${id}/search-user`,
        obj
      )
    })
  })

  describe('dashboard operations', () => {
    it('should call irSummary', async () => {
      await investigationsApi.irSummary()
      expect(testRequest.get).toHaveBeenCalledWith('ir/dashboard/summary')
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const id = 'investigation-123'
      await investigationsApi.getInvestigationDetailsDataFunction(id)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const obj = { page: 1 }
      await investigationsApi.investigationList(obj)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      await investigationsApi.cancelInvestigation('investigation-123')
      expect(testRequest.put).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for investigation creation', async () => {
      const obj = { name: 'New Investigation' }
      await investigationsApi.saveNewInvestigation(obj)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        obj,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for investigation cancellation', async () => {
      const id = 'investigation-123'
      await investigationsApi.cancelInvestigation(id)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for warning messages', async () => {
      const id = 'investigation-123'
      const obj = { message: 'Warning' }
      await investigationsApi.sendInvestigationWarningMessage(obj, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        obj,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for delete actions', async () => {
      const id = 'investigation-123'
      const obj = { itemIds: ['item-1'] }
      await investigationsApi.deleteInvestigationDetailsItem(obj, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        obj,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle investigation creation with complex payload', async () => {
      const obj = {
        name: 'Complex Investigation',
        emailIds: ['email-1', 'email-2'],
        userIds: ['user-1', 'user-2'],
        priority: 'high'
      }
      await investigationsApi.saveNewInvestigation(obj)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle investigation cancellation with reason', async () => {
      const id = 'investigation-123'
      await investigationsApi.cancelInvestigation(id)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle warning message to multiple items', async () => {
      const id = 'investigation-123'
      const obj = {
        message: 'This is a warning',
        itemIds: ['item-1', 'item-2', 'item-3'],
        type: 'email'
      }
      await investigationsApi.sendInvestigationWarningMessage(obj, id)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle delete and notify with message', async () => {
      const id = 'investigation-123'
      const obj = {
        itemIds: ['item-1', 'item-2'],
        message: 'Items have been deleted',
        notifyUsers: true
      }
      await investigationsApi.deleteAndMessageInvestigationDetailsItem(obj, id)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle investigation details search with filters', async () => {
      const id = 'investigation-123'
      const obj = {
        page: 1,
        filters: { status: ['suspicious', 'malicious'] },
        sort: { field: 'date', direction: 'desc' }
      }
      await investigationsApi.investigationDetailsListFunction(obj, id)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle target users search with pagination', async () => {
      const id = 'investigation-123'
      const obj = {
        page: 1,
        pageSize: 50,
        search: 'john'
      }
      await investigationsApi.investigationDetailsTargetUsersListFunction(obj, id)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })
})
