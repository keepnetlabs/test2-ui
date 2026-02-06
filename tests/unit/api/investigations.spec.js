import * as InvestigationsAPI from '@/api/investigations'
import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} })
}))

jest.mock('@/model/constants/commonConstants', () => ({
  COMMON_SNACKBAR: { color: 'red', duration: 5000 }
}))

describe('Investigations API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('investigationList', () => {
    it('should call POST with search payload', async () => {
      const payload = { page: 1, pageSize: 10 }
      await InvestigationsAPI.investigationList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/search', payload)
    })

    it('should handle search filters', async () => {
      const payload = { filter: { status: 'active' } }
      await InvestigationsAPI.investigationList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/search', payload)
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.investigationList({})
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with list data', async () => {
      const mockData = { data: [{ id: '1', name: 'Investigation 1' }] }
      testRequest.post.mockResolvedValueOnce(mockData)

      const result = await InvestigationsAPI.investigationList({})
      expect(result).toEqual(mockData)
    })
  })

  describe('getTargetUsers', () => {
    it('should call GET endpoint', async () => {
      await InvestigationsAPI.getTargetUsers()
      expect(testRequest.get).toHaveBeenCalledWith('target-groups')
    })

    it('should not require parameters', async () => {
      await InvestigationsAPI.getTargetUsers()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.getTargetUsers()
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with target users data', async () => {
      const mockData = { data: { targetGroups: [] } }
      testRequest.get.mockResolvedValueOnce(mockData)

      const result = await InvestigationsAPI.getTargetUsers()
      expect(result).toEqual(mockData)
    })
  })

  describe('saveNewInvestigation', () => {
    it('should call POST with COMMON_SNACKBAR', async () => {
      const payload = { name: 'New Investigation', target: 'user@example.com' }
      await InvestigationsAPI.saveNewInvestigation(payload)
      expect(testRequest.post).toHaveBeenCalledWith('investigations', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should include snackbar config', async () => {
      await InvestigationsAPI.saveNewInvestigation({ name: 'Test' })
      const calls = testRequest.post.mock.calls
      expect(calls[0][2]).toHaveProperty('snackbar')
      expect(calls[0][2].snackbar).toEqual(COMMON_SNACKBAR)
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.saveNewInvestigation({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('cancelInvestigation', () => {
    it('should call PUT with id and COMMON_SNACKBAR', async () => {
      const id = 'inv-123'
      await InvestigationsAPI.cancelInvestigation(id)
      expect(testRequest.put).toHaveBeenCalledWith('investigations/inv-123/cancel', {}, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle numeric id', async () => {
      const id = 123
      await InvestigationsAPI.cancelInvestigation(id)
      expect(testRequest.put).toHaveBeenCalledWith('investigations/123/cancel', {}, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.cancelInvestigation('id-1')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('sendInvestigationWarningMessage', () => {
    it('should call POST with payload, id and COMMON_SNACKBAR', async () => {
      const id = 'inv-456'
      const payload = { message: 'Warning message', recipients: ['user1'] }
      await InvestigationsAPI.sendInvestigationWarningMessage(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/inv-456/actions-warning', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle different payload structures', async () => {
      const id = '1'
      const payload = { severity: 'high', details: 'test' }
      await InvestigationsAPI.sendInvestigationWarningMessage(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/1/actions-warning', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.sendInvestigationWarningMessage({}, 'id-2')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('deleteInvestigationDetailsItem', () => {
    it('should call POST with payload, id and COMMON_SNACKBAR', async () => {
      const id = 'inv-789'
      const payload = { itemId: 'item-1' }
      await InvestigationsAPI.deleteInvestigationDetailsItem(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/inv-789/actions-delete', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle complex delete payloads', async () => {
      const id = '1'
      const payload = { itemIds: ['item-1', 'item-2'], force: true }
      await InvestigationsAPI.deleteInvestigationDetailsItem(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/1/actions-delete', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.deleteInvestigationDetailsItem({}, 'id-3')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('deleteAndMessageInvestigationDetailsItem', () => {
    it('should call POST with payload, id and COMMON_SNACKBAR', async () => {
      const id = 'inv-abc'
      const payload = { itemId: 'item-1', message: 'Item removed' }
      await InvestigationsAPI.deleteAndMessageInvestigationDetailsItem(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/inv-abc/actions-delete-and-notify', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should handle complex payloads with notifications', async () => {
      const id = '1'
      const payload = {
        itemIds: ['item-1', 'item-2'],
        notifyUsers: true,
        message: 'Items removed and users notified'
      }
      await InvestigationsAPI.deleteAndMessageInvestigationDetailsItem(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/1/actions-delete-and-notify', payload, {
        snackbar: COMMON_SNACKBAR
      })
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.deleteAndMessageInvestigationDetailsItem({}, 'id-4')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('getStatsAndMenuDataFunction', () => {
    it('should call GET with investigation id', async () => {
      const id = 'inv-summary-1'
      await InvestigationsAPI.getStatsAndMenuDataFunction(id)
      expect(testRequest.get).toHaveBeenCalledWith('investigations/inv-summary-1/summary')
    })

    it('should handle numeric id', async () => {
      const id = 999
      await InvestigationsAPI.getStatsAndMenuDataFunction(id)
      expect(testRequest.get).toHaveBeenCalledWith('investigations/999/summary')
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.getStatsAndMenuDataFunction('id-5')
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with summary data', async () => {
      const mockData = { data: { stats: {}, menu: [] } }
      testRequest.get.mockResolvedValueOnce(mockData)

      const result = await InvestigationsAPI.getStatsAndMenuDataFunction('1')
      expect(result).toEqual(mockData)
    })
  })

  describe('getInvestigationDetailsDataFunction', () => {
    it('should call GET with investigation id', async () => {
      const id = 'inv-detail-1'
      await InvestigationsAPI.getInvestigationDetailsDataFunction(id)
      expect(testRequest.get).toHaveBeenCalledWith('investigations/inv-detail-1')
    })

    it('should handle numeric id', async () => {
      const id = 888
      await InvestigationsAPI.getInvestigationDetailsDataFunction(id)
      expect(testRequest.get).toHaveBeenCalledWith('investigations/888')
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.getInvestigationDetailsDataFunction('id-6')
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with details data', async () => {
      const mockData = { data: { id: '1', name: 'Investigation', details: {} } }
      testRequest.get.mockResolvedValueOnce(mockData)

      const result = await InvestigationsAPI.getInvestigationDetailsDataFunction('1')
      expect(result).toEqual(mockData)
    })
  })

  describe('investigationDetailsListFunction', () => {
    it('should call POST for email search with payload and id', async () => {
      const id = 'inv-email-1'
      const payload = { filter: 'all' }
      await InvestigationsAPI.investigationDetailsListFunction(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/inv-email-1/search-email', payload)
    })

    it('should handle complex email filters', async () => {
      const id = '1'
      const payload = { filter: { sender: 'user@example.com', subject: 'test' } }
      await InvestigationsAPI.investigationDetailsListFunction(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/1/search-email', payload)
    })

    it('should not include snackbar config', async () => {
      await InvestigationsAPI.investigationDetailsListFunction({}, '1')
      const calls = testRequest.post.mock.calls
      expect(calls[0][2]).toBeUndefined()
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.investigationDetailsListFunction({}, 'id-7')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('investigationDetailsTargetUsersListFunction', () => {
    it('should call POST for user search with payload and id', async () => {
      const id = 'inv-users-1'
      const payload = { filter: 'active' }
      await InvestigationsAPI.investigationDetailsTargetUsersListFunction(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/inv-users-1/search-user', payload)
    })

    it('should handle user filter payloads', async () => {
      const id = '1'
      const payload = { filter: { role: 'admin', status: 'active' } }
      await InvestigationsAPI.investigationDetailsTargetUsersListFunction(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith('investigations/1/search-user', payload)
    })

    it('should not include snackbar config', async () => {
      await InvestigationsAPI.investigationDetailsTargetUsersListFunction({}, '1')
      const calls = testRequest.post.mock.calls
      expect(calls[0][2]).toBeUndefined()
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.investigationDetailsTargetUsersListFunction({}, 'id-8')
      expect(typeof result.then).toBe('function')
    })
  })

  describe('irSummary', () => {
    it('should call GET endpoint', async () => {
      await InvestigationsAPI.irSummary()
      expect(testRequest.get).toHaveBeenCalledWith('ir/dashboard/summary')
    })

    it('should not require parameters', async () => {
      await InvestigationsAPI.irSummary()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.irSummary()
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with summary data', async () => {
      const mockData = { data: { metrics: {}, stats: {} } }
      testRequest.get.mockResolvedValueOnce(mockData)

      const result = await InvestigationsAPI.irSummary()
      expect(result).toEqual(mockData)
    })
  })

  describe('getInvestigationScanTypes', () => {
    it('should call GET endpoint', async () => {
      await InvestigationsAPI.getInvestigationScanTypes()
      expect(testRequest.get).toHaveBeenCalledWith('/investigations/scan-types')
    })

    it('should not require parameters', async () => {
      await InvestigationsAPI.getInvestigationScanTypes()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should return thenable', () => {
      const result = InvestigationsAPI.getInvestigationScanTypes()
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with scan types', async () => {
      const mockData = { data: { scanTypes: ['type1', 'type2'] } }
      testRequest.get.mockResolvedValueOnce(mockData)

      const result = await InvestigationsAPI.getInvestigationScanTypes()
      expect(result).toEqual(mockData)
    })
  })

  describe('HTTP Method Consistency', () => {
    it('should use POST for list and mutations', async () => {
      await InvestigationsAPI.investigationList({})
      await InvestigationsAPI.saveNewInvestigation({})
      await InvestigationsAPI.sendInvestigationWarningMessage({}, '1')
      expect(testRequest.post).toHaveBeenCalledTimes(3)
    })

    it('should use GET for read operations', async () => {
      await InvestigationsAPI.getTargetUsers()
      await InvestigationsAPI.getStatsAndMenuDataFunction('1')
      await InvestigationsAPI.getInvestigationDetailsDataFunction('1')
      await InvestigationsAPI.irSummary()
      await InvestigationsAPI.getInvestigationScanTypes()
      expect(testRequest.get).toHaveBeenCalledTimes(5)
    })

    it('should use PUT for cancel operations', async () => {
      await InvestigationsAPI.cancelInvestigation('1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })
  })

  describe('Snackbar Configuration', () => {
    it('should include snackbar for create, cancel and action operations', async () => {
      testRequest.post.mockClear()
      testRequest.put.mockClear()

      await InvestigationsAPI.saveNewInvestigation({})
      expect(testRequest.post.mock.calls[0][2]).toHaveProperty('snackbar')

      await InvestigationsAPI.cancelInvestigation('1')
      expect(testRequest.put.mock.calls[0][2]).toHaveProperty('snackbar')

      await InvestigationsAPI.sendInvestigationWarningMessage({}, '1')
      expect(testRequest.post.mock.calls[1][2]).toHaveProperty('snackbar')
    })

    it('should not include snackbar for search operations', async () => {
      testRequest.post.mockClear()

      await InvestigationsAPI.investigationDetailsListFunction({}, '1')
      expect(testRequest.post.mock.calls[0][2]).toBeUndefined()

      await InvestigationsAPI.investigationDetailsTargetUsersListFunction({}, '1')
      expect(testRequest.post.mock.calls[1][2]).toBeUndefined()
    })
  })

  describe('All Exported Functions', () => {
    it('should export 13 functions', () => {
      const functions = Object.values(InvestigationsAPI).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(13)
    })

    it('should have all investigation functions', () => {
      expect(typeof InvestigationsAPI.investigationList).toBe('function')
      expect(typeof InvestigationsAPI.getTargetUsers).toBe('function')
      expect(typeof InvestigationsAPI.saveNewInvestigation).toBe('function')
      expect(typeof InvestigationsAPI.cancelInvestigation).toBe('function')
      expect(typeof InvestigationsAPI.sendInvestigationWarningMessage).toBe('function')
      expect(typeof InvestigationsAPI.deleteInvestigationDetailsItem).toBe('function')
      expect(typeof InvestigationsAPI.deleteAndMessageInvestigationDetailsItem).toBe('function')
      expect(typeof InvestigationsAPI.getStatsAndMenuDataFunction).toBe('function')
      expect(typeof InvestigationsAPI.getInvestigationDetailsDataFunction).toBe('function')
      expect(typeof InvestigationsAPI.investigationDetailsListFunction).toBe('function')
      expect(typeof InvestigationsAPI.investigationDetailsTargetUsersListFunction).toBe('function')
      expect(typeof InvestigationsAPI.irSummary).toBe('function')
      expect(typeof InvestigationsAPI.getInvestigationScanTypes).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle investigation creation and retrieval', async () => {
      await InvestigationsAPI.saveNewInvestigation({ name: 'New' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await InvestigationsAPI.getInvestigationDetailsDataFunction('1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle investigation workflow', async () => {
      // Create investigation
      await InvestigationsAPI.saveNewInvestigation({ name: 'Test' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get details
      testRequest.get.mockClear()
      await InvestigationsAPI.getInvestigationDetailsDataFunction('1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Send warning
      testRequest.post.mockClear()
      await InvestigationsAPI.sendInvestigationWarningMessage({}, '1')
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Cancel
      testRequest.put.mockClear()
      await InvestigationsAPI.cancelInvestigation('1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel requests', async () => {
      const results = await Promise.all([
        InvestigationsAPI.investigationList({}),
        InvestigationsAPI.getTargetUsers(),
        InvestigationsAPI.irSummary(),
        InvestigationsAPI.getInvestigationScanTypes()
      ])

      expect(results).toHaveLength(4)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(3)
    })

    it('should handle investigation details operations', async () => {
      testRequest.post.mockClear()

      await InvestigationsAPI.investigationDetailsListFunction({}, '1')
      await InvestigationsAPI.investigationDetailsTargetUsersListFunction({}, '1')

      expect(testRequest.post).toHaveBeenCalledTimes(2)
    })
  })

  describe('Error Handling', () => {
    it('should propagate POST errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(InvestigationsAPI.investigationList({})).rejects.toThrow('Search failed')
    })

    it('should propagate GET errors', async () => {
      const error = new Error('Not found')
      testRequest.get.mockRejectedValueOnce(error)

      await expect(InvestigationsAPI.getTargetUsers()).rejects.toThrow('Not found')
    })

    it('should propagate PUT errors', async () => {
      const error = new Error('Cancel failed')
      testRequest.put.mockRejectedValueOnce(error)

      await expect(InvestigationsAPI.cancelInvestigation('1')).rejects.toThrow('Cancel failed')
    })

    it('should handle errors from action operations', async () => {
      const error = new Error('Action failed')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(
        InvestigationsAPI.sendInvestigationWarningMessage({}, '1')
      ).rejects.toThrow('Action failed')
    })
  })
})
