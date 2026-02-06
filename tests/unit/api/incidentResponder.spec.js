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
  })
})
