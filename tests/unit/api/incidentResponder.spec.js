jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as incidentResponderApi from '@/api/incidentResponder'

describe('incidentResponder API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('investigation operations', () => {
    it('should call searchNotifiedMail', async () => {
      const payload = { page: 1 }
      await incidentResponderApi.searchNotifiedMail(payload)
      expect(testRequest.post).toHaveBeenCalledWith('notified-emails/search', payload)
    })

    it('should call getMatchingIncidents', async () => {
      const id = 'playbook-123'
      const payload = { page: 1 }
      await incidentResponderApi.getMatchingIncidents(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `notified-emails/matching-playbooks/${id}/search`,
        payload
      )
    })

    it('should call updateNotifiedEmail', async () => {
      const id = 'email-123'
      const payload = { status: 'resolved' }
      await incidentResponderApi.updateNotifiedEmail(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/notified-emails/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateNotifiedEmailBulk', async () => {
      const payload = { emailIds: ['email-1', 'email-2'] }
      await incidentResponderApi.updateNotifiedEmailBulk(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/notified-emails/bulk-update',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call reAnalyzeEmail', async () => {
      const resourceId = 'email-123'
      await incidentResponderApi.reAnalyzeEmail(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/notified-emails/${resourceId}/reanalyze`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call reAnalyzeEmail with default ID', async () => {
      await incidentResponderApi.reAnalyzeEmail()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/notified-emails//reanalyze',
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call confirmationRequiredForEdit', async () => {
      const payload = { stats: {} }
      await incidentResponderApi.confirmationRequiredForEdit(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/notified-emails/bulk-update-email-stats', payload)
    })
  })

  describe('export operations', () => {
    it('should call exportInvestigationList', async () => {
      const payload = { filters: {} }
      await incidentResponderApi.exportInvestigationList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'investigations/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportInvestigationEmailList', async () => {
      const id = 'investigation-123'
      const payload = { filters: {} }
      await incidentResponderApi.exportInvestigationEmailList(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `investigations/${id}/search-email/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportInvestigationUserList', async () => {
      const id = 'investigation-123'
      const payload = { filters: {} }
      await incidentResponderApi.exportInvestigationUserList(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `investigations/${id}/search-user/export`,
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('ROI settings operations', () => {
    it('should call getRoiSettings', async () => {
      await incidentResponderApi.getRoiSettings()
      expect(testRequest.get).toHaveBeenCalledWith('/companies/roi-settings')
    })

    it('should call updateRoiSettings', async () => {
      const payload = { roiValue: 100 }
      await incidentResponderApi.updateRoiSettings(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/companies/roi-settings',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await incidentResponderApi.getRoiSettings()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await incidentResponderApi.searchNotifiedMail(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const id = 'email-123'
      const payload = { status: 'resolved' }
      await incidentResponderApi.updateNotifiedEmail(id, payload)
      expect(testRequest.put).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for email updates', async () => {
      const id = 'email-123'
      const payload = { status: 'resolved' }
      await incidentResponderApi.updateNotifiedEmail(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for bulk updates', async () => {
      const payload = { emailIds: ['email-1'] }
      await incidentResponderApi.updateNotifiedEmailBulk(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for reanalysis', async () => {
      await incidentResponderApi.reAnalyzeEmail('email-123')
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for ROI settings update', async () => {
      const payload = { roiValue: 100 }
      await incidentResponderApi.updateRoiSettings(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type for exports', () => {
    it('should use blob responseType for investigation exports', async () => {
      const payload = { filters: {} }
      await incidentResponderApi.exportInvestigationList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for email list exports', async () => {
      const id = 'investigation-123'
      const payload = { filters: {} }
      await incidentResponderApi.exportInvestigationEmailList(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })

    it('should use blob responseType for user list exports', async () => {
      const id = 'investigation-123'
      const payload = { filters: {} }
      await incidentResponderApi.exportInvestigationUserList(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle bulk updates with multiple emails', async () => {
      const payload = { emailIds: ['email-1', 'email-2', 'email-3'] }
      await incidentResponderApi.updateNotifiedEmailBulk(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle investigation export with multiple email results', async () => {
      const id = 'investigation-123'
      const payload = { filters: { status: ['suspicious', 'malicious'] } }
      await incidentResponderApi.exportInvestigationEmailList(payload, id)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle ROI settings update with complex values', async () => {
      const payload = {
        roiValue: 100,
        currency: 'USD',
        metrics: { emailsProcessed: 1000 }
      }
      await incidentResponderApi.updateRoiSettings(payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should handle email reanalysis with special characters', async () => {
      const resourceId = 'email-123!@#'
      await incidentResponderApi.reAnalyzeEmail(resourceId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/notified-emails/${resourceId}/reanalyze`,
        expect.any(Object)
      )
    })

    it('should handle matching incidents with complex playbook ID', async () => {
      const id = 'playbook-123-complex'
      const payload = { page: 1, search: 'suspicious' }
      await incidentResponderApi.getMatchingIncidents(payload, id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `notified-emails/matching-playbooks/${id}/search`,
        payload
      )
    })

    it('should handle numeric and string email IDs', async () => {
      await incidentResponderApi.updateNotifiedEmail(123, { status: 'resolved' })
      expect(testRequest.put).toHaveBeenCalled()

      testRequest.put.mockClear()
      await incidentResponderApi.updateNotifiedEmail('email-abc', { status: 'resolved' })
      expect(testRequest.put).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        incidentResponderApi.searchNotifiedMail({}),
        incidentResponderApi.getMatchingIncidents({}, 'id'),
        incidentResponderApi.updateNotifiedEmail('id', {}),
        incidentResponderApi.updateNotifiedEmailBulk({}),
        incidentResponderApi.reAnalyzeEmail('id'),
        incidentResponderApi.confirmationRequiredForEdit({}),
        incidentResponderApi.exportInvestigationList({}),
        incidentResponderApi.exportInvestigationEmailList({}, 'id'),
        incidentResponderApi.exportInvestigationUserList({}, 'id'),
        incidentResponderApi.getRoiSettings(),
        incidentResponderApi.updateRoiSettings({})
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof incidentResponderApi.searchNotifiedMail).toBe('function')
      expect(typeof incidentResponderApi.getMatchingIncidents).toBe('function')
      expect(typeof incidentResponderApi.updateNotifiedEmail).toBe('function')
      expect(typeof incidentResponderApi.updateNotifiedEmailBulk).toBe('function')
      expect(typeof incidentResponderApi.reAnalyzeEmail).toBe('function')
      expect(typeof incidentResponderApi.confirmationRequiredForEdit).toBe('function')
      expect(typeof incidentResponderApi.exportInvestigationList).toBe('function')
      expect(typeof incidentResponderApi.exportInvestigationEmailList).toBe('function')
      expect(typeof incidentResponderApi.exportInvestigationUserList).toBe('function')
      expect(typeof incidentResponderApi.getRoiSettings).toBe('function')
      expect(typeof incidentResponderApi.updateRoiSettings).toBe('function')
    })

    it('should export at least 11 functions', () => {
      const functions = Object.values(incidentResponderApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(11)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle incident response workflow', async () => {
      await incidentResponderApi.searchNotifiedMail({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await incidentResponderApi.getMatchingIncidents({}, 'playbook-1')
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await incidentResponderApi.updateNotifiedEmail('email-1', { status: 'resolved' })
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle ROI settings management workflow', async () => {
      await incidentResponderApi.getRoiSettings()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await incidentResponderApi.updateRoiSettings({ roiValue: 100 })
      expect(testRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle email reanalysis workflow', async () => {
      await incidentResponderApi.reAnalyzeEmail('email-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel incident operations', async () => {
      const results = await Promise.all([
        incidentResponderApi.searchNotifiedMail({}),
        incidentResponderApi.getRoiSettings()
      ])

      expect(results).toHaveLength(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle email search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await incidentResponderApi.searchNotifiedMail(payload)
      expect(testRequest.post).toHaveBeenCalledWith('notified-emails/search', payload)
    })

    it('should handle bulk updates with various email counts', async () => {
      const counts = [1, 5, 10, 100]

      for (const count of counts) {
        testRequest.put.mockClear()
        const emailIds = Array.from({ length: count }, (_, i) => `email-${i}`)
        await incidentResponderApi.updateNotifiedEmailBulk({ emailIds })
        expect(testRequest.put).toHaveBeenCalled()
      }
    })

    it('should handle investigation export with complex filters', async () => {
      const payload = {
        filters: {
          status: ['suspicious', 'malicious'],
          dateRange: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await incidentResponderApi.exportInvestigationList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle ROI settings with various configurations', async () => {
      const payloads = [
        { roiValue: 50 },
        { roiValue: 100, currency: 'EUR' },
        { roiValue: 200, currency: 'GBP', metrics: { processed: 500 } }
      ]

      for (const payload of payloads) {
        testRequest.put.mockClear()
        await incidentResponderApi.updateRoiSettings(payload)
        expect(testRequest.put).toHaveBeenCalled()
      }
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchNotifiedMail errors', async () => {
      const error = new Error('Search failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(incidentResponderApi.searchNotifiedMail({})).rejects.toThrow('Search failed')
    })

    it('should propagate getMatchingIncidents errors', async () => {
      const error = new Error('Incidents fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(incidentResponderApi.getMatchingIncidents({}, 'id')).rejects.toThrow('Incidents fetch failed')
    })

    it('should propagate updateNotifiedEmail errors', async () => {
      const error = new Error('Email update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(incidentResponderApi.updateNotifiedEmail('id', {})).rejects.toThrow('Email update failed')
    })

    it('should propagate updateNotifiedEmailBulk errors', async () => {
      const error = new Error('Bulk update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(incidentResponderApi.updateNotifiedEmailBulk({})).rejects.toThrow('Bulk update failed')
    })

    it('should propagate reAnalyzeEmail errors', async () => {
      const error = new Error('Reanalysis failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(incidentResponderApi.reAnalyzeEmail('id')).rejects.toThrow('Reanalysis failed')
    })

    it('should propagate export errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(incidentResponderApi.exportInvestigationList({})).rejects.toThrow('Export failed')
    })

    it('should propagate ROI settings errors', async () => {
      const error = new Error('ROI settings update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(incidentResponderApi.updateRoiSettings({})).rejects.toThrow('ROI settings update failed')
    })
  })
})
