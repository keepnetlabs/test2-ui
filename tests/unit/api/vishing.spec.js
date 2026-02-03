jest.mock('@/utils/vishingRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import vishingRequest from '@/utils/vishingRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as vishingApi from '@/api/vishing'

describe('vishing API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('template operations', () => {
    it('should call getVishingTemplates', async () => {
      const payload = { page: 1 }
      await vishingApi.getVishingTemplates(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith('/vishing-template/search', payload)
    })

    it('should call getVishingTemplate', async () => {
      const id = 'template-123'
      await vishingApi.getVishingTemplate(id)
      expect(vishingRequest.get).toHaveBeenCalledWith(`/vishing-template/${id}`)
    })

    it('should call createVishingTemplate', async () => {
      const payload = { name: 'Vishing Template' }
      await vishingApi.createVishingTemplate(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-template',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateVishingTemplate', async () => {
      const payload = { name: 'Updated' }
      const id = 'template-123'
      await vishingApi.updateVishingTemplate(id, payload)
      expect(vishingRequest.put).toHaveBeenCalledWith(
        `/vishing-template/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteVishingTemplate', async () => {
      const id = 'template-123'
      await vishingApi.deleteVishingTemplate(id)
      expect(vishingRequest.delete).toHaveBeenCalledWith(
        `/vishing-template/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteVishingTemplates', async () => {
      const payload = { ids: ['template-1', 'template-2'] }
      await vishingApi.bulkDeleteVishingTemplates(payload)
      expect(vishingRequest.delete).toHaveBeenCalledWith(
        '/vishing-template/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call exportVishingTemplates', async () => {
      const payload = { filters: {} }
      await vishingApi.exportVishingTemplates(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-template/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getVishingTemplatePreview', async () => {
      const id = 'template-123'
      await vishingApi.getVishingTemplatePreview(id)
      expect(vishingRequest.get).toHaveBeenCalledWith(`/vishing-template/preview/${id}`)
    })

    it('should call getVishingTemplateLanguages', async () => {
      await vishingApi.getVishingTemplateLanguages()
      expect(vishingRequest.get).toHaveBeenCalledWith('/vishing-template/language')
    })

    it('should call playTextToSpeech', async () => {
      const payload = { text: 'Hello' }
      await vishingApi.playTextToSpeech(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-template/language/get-voice-url',
        payload
      )
    })
  })

  describe('campaign operations', () => {
    it('should call getVishingCampaigns', async () => {
      const payload = { page: 1 }
      await vishingApi.getVishingCampaigns(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith('/vishing-campaign/search', payload)
    })

    it('should call getVishingCampaign', async () => {
      const id = 'campaign-123'
      await vishingApi.getVishingCampaign(id)
      expect(vishingRequest.get).toHaveBeenCalledWith(`/vishing-campaign/${id}`)
    })

    it('should call createVishingCampaign', async () => {
      const payload = { name: 'Campaign' }
      await vishingApi.createVishingCampaign(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-campaign',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateVishingCampaign', async () => {
      const payload = { name: 'Updated' }
      const id = 'campaign-123'
      await vishingApi.updateVishingCampaign(payload, id)
      expect(vishingRequest.put).toHaveBeenCalledWith(
        `/vishing-campaign/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteVishingCampaign', async () => {
      const id = 'campaign-123'
      await vishingApi.deleteVishingCampaign(id)
      expect(vishingRequest.delete).toHaveBeenCalledWith(
        `vishing-campaign/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call stopVishingCampaign', async () => {
      const id = 'campaign-123'
      await vishingApi.stopVishingCampaign(id)
      expect(vishingRequest.put).toHaveBeenCalledWith(
        `/vishing-campaign/stop/${id}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call launchVishingCampaign', async () => {
      const id = 'campaign-123'
      await vishingApi.launchVishingCampaign(id)
      expect(vishingRequest.put).toHaveBeenCalledWith(
        `/vishing-campaign/launch/${id}`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exportVishingCampaigns', async () => {
      const payload = { filters: {} }
      await vishingApi.exportVishingCampaigns(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-campaign/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getVishingCampaignPreview', async () => {
      const id = 'campaign-123'
      await vishingApi.getVishingCampaignPreview(id)
      expect(vishingRequest.get).toHaveBeenCalledWith(`/vishing-campaign/preview/${id}`)
    })

    it('should call getVishingCampaignDistributionCalculation', async () => {
      const payload = { distribution: 'sequential' }
      await vishingApi.getVishingCampaignDistributionCalculation(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-campaign/calculate-distribution',
        payload
      )
    })
  })

  describe('report operations', () => {
    it('should call getVishingReportSummary', async () => {
      const id = 'campaign-123'
      await vishingApi.getVishingReportSummary(id)
      expect(vishingRequest.get).toHaveBeenCalledWith(`/vishing-report/${id}`)
    })

    it('should call getVishingReportUsers', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      await vishingApi.getVishingReportUsers(payload, id)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/${id}/users/search`,
        payload
      )
    })

    it('should call getVishingReportUsersInteractions', async () => {
      const payload = { userId: 'user-123' }
      await vishingApi.getVishingReportUsersInteractions(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-report/user/answer-detail',
        payload
      )
    })

    it('should call exportVishingUsers', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      await vishingApi.exportVishingUsers(payload, id)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/${id}/users/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getVishingReportAnswered', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      await vishingApi.getVishingReportAnswered(payload, id)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/${id}/answered/search`,
        payload
      )
    })

    it('should call exportVishingAnsweredUsers', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      await vishingApi.exportVishingAnsweredUsers(payload, id)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/${id}/answered/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getVishingReportDialedNumber', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      await vishingApi.getVishingReportDialedNumber(payload, id)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/${id}/dialed-number/search`,
        payload
      )
    })

    it('should call exportVishingReportDialedNumbers', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      await vishingApi.exportVishingReportDialedNumbers(payload, id)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/${id}/dialed-number/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getVishingReportNoResponse', async () => {
      const payload = { page: 1 }
      const id = 'campaign-123'
      await vishingApi.getVishingReportNoResponse(payload, id)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/${id}/no-response/search`,
        payload
      )
    })

    it('should call exportVishingReportNoResponse', async () => {
      const payload = { filters: {} }
      const id = 'campaign-123'
      await vishingApi.exportVishingReportNoResponse(payload, id)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/${id}/no-response/search/export`,
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call exportVishingReportSummary', async () => {
      const id = 'campaign-123'
      await vishingApi.exportVishingReportSummary(id)
      expect(vishingRequest.get).toHaveBeenCalledWith(
        `/vishing-report/${id}/export`,
        { responseType: 'blob' }
      )
    })

    it('should call resendVishingReport', async () => {
      const id = 'campaign-123'
      const payload = { userIds: ['user-1'] }
      await vishingApi.resendVishingReport(id, payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/resend/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('configuration', () => {
    it('should call getPhoneNumbers', async () => {
      await vishingApi.getPhoneNumbers()
      expect(vishingRequest.get).toHaveBeenCalledWith('/voice/phone-numbers')
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await vishingApi.getVishingTemplate('id')
      expect(vishingRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search', async () => {
      await vishingApi.getVishingTemplates({})
      expect(vishingRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      await vishingApi.updateVishingTemplate('id', {})
      expect(vishingRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await vishingApi.deleteVishingTemplate('id')
      expect(vishingRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for mutations', async () => {
      await vishingApi.createVishingTemplate({})
      expect(vishingRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('export operations', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await vishingApi.exportVishingTemplates(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle default empty payloads', async () => {
      await vishingApi.getVishingTemplates()
      expect(vishingRequest.post).toHaveBeenCalled()
    })

    it('should handle special characters in ids', async () => {
      const specialId = 'template-123!@#$'
      await vishingApi.getVishingTemplate(specialId)
      expect(vishingRequest.get).toHaveBeenCalledWith(`/vishing-template/${specialId}`)
    })

    it('should handle complex report queries', async () => {
      const payload = { page: 1, filters: { status: 'answered' } }
      const id = 'campaign-123'
      await vishingApi.getVishingReportAnswered(payload, id)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        `/vishing-report/${id}/answered/search`,
        payload
      )
    })
  })
})
