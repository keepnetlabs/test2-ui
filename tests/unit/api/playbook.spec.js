jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as playbookApi from '@/api/playbook'

describe('playbook API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('playbook operations', () => {
    it('should call searchPlaybook', async () => {
      const payload = { page: 1 }
      await playbookApi.searchPlaybook(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/playbooks/search', payload)
    })

    it('should call createPlaybook', async () => {
      const payload = { name: 'New Playbook' }
      await playbookApi.createPlaybook(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/playbooks',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getPlaybook', async () => {
      const id = 'playbook-123'
      await playbookApi.getPlaybook(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/playbooks/${id}`)
    })

    it('should call updatePlaybook', async () => {
      const payload = { resourceId: 'playbook-123', name: 'Updated Playbook' }
      await playbookApi.updatePlaybook(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/playbooks/${payload.resourceId}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deletePlaybookRule', async () => {
      const id = 'rule-123'
      await playbookApi.deletePlaybookRule(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `playbooks/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('export operations', () => {
    it('should call exportPlaybookRules', async () => {
      const payload = { filters: {} }
      await playbookApi.exportPlaybookRules(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'playbooks/search/export',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('analysis engine operations', () => {
    it('should call getAnalysisEngine', async () => {
      const payload = { page: 1 }
      await playbookApi.getAnalysisEngine(payload)
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines/search', payload)
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const id = 'playbook-123'
      await playbookApi.getPlaybook(id)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await playbookApi.searchPlaybook(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { resourceId: 'playbook-123', name: 'Updated' }
      await playbookApi.updatePlaybook(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await playbookApi.deletePlaybookRule('rule-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for playbook creation', async () => {
      const payload = { name: 'New Playbook' }
      await playbookApi.createPlaybook(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { resourceId: 'playbook-123', name: 'Updated' }
      await playbookApi.updatePlaybook(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for rule deletion', async () => {
      await playbookApi.deletePlaybookRule('rule-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for playbook export', async () => {
      const payload = { filters: {} }
      await playbookApi.exportPlaybookRules(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle playbook creation with rules', async () => {
      const payload = {
        name: 'Complex Playbook',
        rules: [
          { condition: 'sender match', action: 'block' },
          { condition: 'subject contains', action: 'alert' }
        ]
      }
      await playbookApi.createPlaybook(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle playbook update with new rules', async () => {
      const payload = {
        resourceId: 'playbook-123',
        name: 'Updated Playbook',
        rules: [{ condition: 'new', action: 'block' }]
      }
      await playbookApi.updatePlaybook(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle analysis engine search with filters', async () => {
      const payload = { page: 1, type: 'sandbox', status: 'active' }
      await playbookApi.getAnalysisEngine(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle playbook export with complex filters', async () => {
      const payload = {
        filters: {
          status: ['active', 'inactive'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await playbookApi.exportPlaybookRules(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('searchPlaybook should return thenable', () => {
      const result = playbookApi.searchPlaybook({})
      expect(typeof result.then).toBe('function')
    })

    it('createPlaybook should return thenable', () => {
      const result = playbookApi.createPlaybook({})
      expect(typeof result.then).toBe('function')
    })

    it('getPlaybook should return thenable', () => {
      const result = playbookApi.getPlaybook('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('updatePlaybook should return thenable', () => {
      const result = playbookApi.updatePlaybook({ resourceId: 'id-1' })
      expect(typeof result.then).toBe('function')
    })

    it('deletePlaybookRule should return thenable', () => {
      const result = playbookApi.deletePlaybookRule('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('exportPlaybookRules should return thenable', () => {
      const result = playbookApi.exportPlaybookRules({})
      expect(typeof result.then).toBe('function')
    })

    it('getAnalysisEngine should return thenable', () => {
      const result = playbookApi.getAnalysisEngine({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 7 functions', () => {
      const functions = Object.values(playbookApi).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(7)
    })

    it('should have all playbook functions', () => {
      expect(typeof playbookApi.searchPlaybook).toBe('function')
      expect(typeof playbookApi.createPlaybook).toBe('function')
      expect(typeof playbookApi.getPlaybook).toBe('function')
      expect(typeof playbookApi.updatePlaybook).toBe('function')
      expect(typeof playbookApi.deletePlaybookRule).toBe('function')
      expect(typeof playbookApi.exportPlaybookRules).toBe('function')
      expect(typeof playbookApi.getAnalysisEngine).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle playbook CRUD workflow', async () => {
      // Search playbooks
      await playbookApi.searchPlaybook({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Create playbook
      testRequest.post.mockClear()
      await playbookApi.createPlaybook({ name: 'Test Playbook' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Get playbook details
      testRequest.get.mockClear()
      await playbookApi.getPlaybook('playbook-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      // Update playbook
      testRequest.put.mockClear()
      await playbookApi.updatePlaybook({ resourceId: 'playbook-1', name: 'Updated' })
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      // Delete playbook rule
      testRequest.delete.mockClear()
      await playbookApi.deletePlaybookRule('rule-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle playbook search and export workflow', async () => {
      // Search playbooks
      await playbookApi.searchPlaybook({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Export results
      testRequest.post.mockClear()
      await playbookApi.exportPlaybookRules({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle analysis engine search workflow', async () => {
      // Search analysis engines
      await playbookApi.getAnalysisEngine({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel playbook operations', async () => {
      const results = await Promise.all([
        playbookApi.searchPlaybook({}),
        playbookApi.getAnalysisEngine({}),
        playbookApi.getPlaybook('playbook-1')
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple search and export operations', async () => {
      // First search
      await playbookApi.searchPlaybook({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Second search with filters
      testRequest.post.mockClear()
      await playbookApi.searchPlaybook({ page: 2, status: 'active' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      // Export
      testRequest.post.mockClear()
      await playbookApi.exportPlaybookRules({ filters: {} })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle empty search payload', async () => {
      await playbookApi.searchPlaybook({})
      expect(testRequest.post).toHaveBeenCalledWith('/playbooks/search', {})
    })

    it('should handle complex search payload', async () => {
      const payload = {
        page: 1,
        pageSize: 50,
        filters: { status: ['active'], created: { start: '2024-01-01' } }
      }
      await playbookApi.searchPlaybook(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/playbooks/search', payload)
    })

    it('should handle playbook creation with minimal payload', async () => {
      const payload = { name: 'Playbook' }
      await playbookApi.createPlaybook(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/playbooks', payload, expect.any(Object))
    })

    it('should handle playbook creation with complex rules', async () => {
      const payload = {
        name: 'Advanced Playbook',
        description: 'Description',
        rules: [
          { id: '1', condition: 'sender=test@example.com', action: 'block', priority: 1 },
          { id: '2', condition: 'subject:urgent', action: 'alert', priority: 2 }
        ],
        enabled: true
      }
      await playbookApi.createPlaybook(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/playbooks', payload, expect.any(Object))
    })

    it('should handle numeric and string IDs for getPlaybook', async () => {
      await playbookApi.getPlaybook(123)
      expect(testRequest.get).toHaveBeenCalledWith('/playbooks/123')

      testRequest.get.mockClear()
      await playbookApi.getPlaybook('playbook-abc')
      expect(testRequest.get).toHaveBeenCalledWith('/playbooks/playbook-abc')
    })

    it('should handle playbook update with resourceId extraction', async () => {
      const payload = {
        resourceId: 'playbook-456',
        name: 'Updated Name',
        description: 'Updated Description'
      }
      await playbookApi.updatePlaybook(payload)
      expect(testRequest.put).toHaveBeenCalledWith('/playbooks/playbook-456', payload, expect.any(Object))
    })

    it('should handle rule deletion with numeric and string IDs', async () => {
      await playbookApi.deletePlaybookRule(789)
      expect(testRequest.delete).toHaveBeenCalledWith('playbooks/789', expect.any(Object))

      testRequest.delete.mockClear()
      await playbookApi.deletePlaybookRule('rule-xyz')
      expect(testRequest.delete).toHaveBeenCalledWith('playbooks/rule-xyz', expect.any(Object))
    })

    it('should handle empty export payload', async () => {
      await playbookApi.exportPlaybookRules({})
      expect(testRequest.post).toHaveBeenCalledWith('playbooks/search/export', {}, expect.any(Object))
    })

    it('should handle complex export payload with filters', async () => {
      const payload = {
        filters: {
          status: ['active', 'inactive'],
          created: { start: '2024-01-01', end: '2024-12-31' },
          modified: { start: '2024-06-01' }
        },
        page: 1,
        pageSize: 100
      }
      await playbookApi.exportPlaybookRules(payload)
      expect(testRequest.post).toHaveBeenCalledWith('playbooks/search/export', payload, expect.any(Object))
    })

    it('should handle analysis engine search with minimal payload', async () => {
      await playbookApi.getAnalysisEngine({})
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines/search', {})
    })

    it('should handle analysis engine search with filters', async () => {
      const payload = {
        page: 1,
        pageSize: 25,
        type: 'sandbox',
        status: 'active',
        sort: { field: 'name', direction: 'asc' }
      }
      await playbookApi.getAnalysisEngine(payload)
      expect(testRequest.post).toHaveBeenCalledWith('analysis-engines/search', payload)
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchPlaybook errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(playbookApi.searchPlaybook({})).rejects.toThrow('Search failed')
    })

    it('should propagate createPlaybook errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(playbookApi.createPlaybook({})).rejects.toThrow('Creation failed')
    })

    it('should propagate getPlaybook errors', async () => {
      const error = new Error('Fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(playbookApi.getPlaybook('id-1')).rejects.toThrow('Fetch failed')
    })

    it('should propagate updatePlaybook errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(playbookApi.updatePlaybook({ resourceId: 'id-1' })).rejects.toThrow('Update failed')
    })

    it('should propagate deletePlaybookRule errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(playbookApi.deletePlaybookRule('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate exportPlaybookRules errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(playbookApi.exportPlaybookRules({})).rejects.toThrow('Export failed')
    })

    it('should propagate getAnalysisEngine errors', async () => {
      const error = new Error('Engine search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(playbookApi.getAnalysisEngine({})).rejects.toThrow('Engine search failed')
    })
  })
})
