jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
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
})
