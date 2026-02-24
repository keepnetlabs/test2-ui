jest.mock('@/utils/vishingRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
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

    it('should call getVishingTemplatePreview with default resourceId', async () => {
      await vishingApi.getVishingTemplatePreview()
      expect(vishingRequest.get).toHaveBeenCalledWith('/vishing-template/preview/')
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

    it('should call getVishingCampaignPreview with default resourceId', async () => {
      await vishingApi.getVishingCampaignPreview()
      expect(vishingRequest.get).toHaveBeenCalledWith('/vishing-campaign/preview/')
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

  describe('return values', () => {
    it('all functions should return thenables', async () => {
      expect(typeof vishingApi.getVishingTemplates().then).toBe('function')
      expect(typeof vishingApi.getVishingTemplate('id').then).toBe('function')
      expect(typeof vishingApi.createVishingTemplate({}).then).toBe('function')
      expect(typeof vishingApi.updateVishingTemplate('id', {}).then).toBe('function')
      expect(typeof vishingApi.deleteVishingTemplate('id').then).toBe('function')
      expect(typeof vishingApi.exportVishingTemplates().then).toBe('function')
      expect(typeof vishingApi.getVishingCampaigns().then).toBe('function')
      expect(typeof vishingApi.getVishingCampaign('id').then).toBe('function')
      expect(typeof vishingApi.createVishingCampaign({}).then).toBe('function')
      expect(typeof vishingApi.exportVishingCampaigns().then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 33 functions', () => {
      const functions = Object.values(vishingApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThan(30)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle template CRUD workflow', async () => {
      await vishingApi.getVishingTemplates({})
      expect(vishingRequest.post).toHaveBeenCalledTimes(1)

      vishingRequest.post.mockClear()
      await vishingApi.createVishingTemplate({ name: 'New Template' })
      expect(vishingRequest.post).toHaveBeenCalledTimes(1)

      vishingRequest.get.mockClear()
      await vishingApi.getVishingTemplate('template-1')
      expect(vishingRequest.get).toHaveBeenCalledTimes(1)

      vishingRequest.put.mockClear()
      await vishingApi.updateVishingTemplate('template-1', { name: 'Updated' })
      expect(vishingRequest.put).toHaveBeenCalledTimes(1)

      vishingRequest.delete.mockClear()
      await vishingApi.deleteVishingTemplate('template-1')
      expect(vishingRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle campaign lifecycle workflow', async () => {
      vishingRequest.post.mockClear()
      await vishingApi.createVishingCampaign({ name: 'Campaign' })
      expect(vishingRequest.post).toHaveBeenCalledTimes(1)

      vishingRequest.put.mockClear()
      await vishingApi.launchVishingCampaign('campaign-1')
      expect(vishingRequest.put).toHaveBeenCalledTimes(1)

      vishingRequest.get.mockClear()
      await vishingApi.getVishingReportSummary('campaign-1')
      expect(vishingRequest.get).toHaveBeenCalledTimes(1)

      vishingRequest.put.mockClear()
      await vishingApi.stopVishingCampaign('campaign-1')
      expect(vishingRequest.put).toHaveBeenCalledTimes(1)
    })

    it('should handle report retrieval workflow', async () => {
      const campaignId = 'campaign-1'

      vishingRequest.get.mockClear()
      await vishingApi.getVishingReportSummary(campaignId)
      expect(vishingRequest.get).toHaveBeenCalledTimes(1)

      vishingRequest.post.mockClear()
      await vishingApi.getVishingReportUsers({}, campaignId)
      expect(vishingRequest.post).toHaveBeenCalledTimes(1)

      vishingRequest.post.mockClear()
      await vishingApi.getVishingReportAnswered({}, campaignId)
      expect(vishingRequest.post).toHaveBeenCalledTimes(1)

      vishingRequest.post.mockClear()
      await vishingApi.getVishingReportNoResponse({}, campaignId)
      expect(vishingRequest.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle default empty payloads', async () => {
      await vishingApi.getVishingTemplates()
      expect(vishingRequest.post).toHaveBeenCalledWith('/vishing-template/search', {})
    })

    it('should handle campaign ID variations', async () => {
      await vishingApi.getVishingCampaign(123)
      expect(vishingRequest.get).toHaveBeenCalledWith(`/vishing-campaign/${123}`)

      vishingRequest.get.mockClear()
      await vishingApi.getVishingCampaign('campaign-abc')
      expect(vishingRequest.get).toHaveBeenCalledWith(`/vishing-campaign/campaign-abc`)
    })

    it('should handle complex payloads', async () => {
      const payload = {
        name: 'Complex Campaign',
        templateId: 'template-1',
        targetGroups: ['group-1', 'group-2'],
        schedule: { startDate: '2024-01-01', endDate: '2024-12-31' }
      }
      await vishingApi.createVishingCampaign(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith('/vishing-campaign', payload, expect.any(Object))
    })
  })

  describe('Error Handling', () => {
    it('should propagate GET errors', async () => {
      const error = new Error('GET failed')
      vishingRequest.get.mockRejectedValueOnce(error)
      await expect(vishingApi.getVishingTemplate('id')).rejects.toThrow('GET failed')
    })

    it('should propagate POST errors', async () => {
      const error = new Error('POST failed')
      vishingRequest.post.mockRejectedValueOnce(error)
      await expect(vishingApi.createVishingTemplate({})).rejects.toThrow('POST failed')
    })

    it('should propagate PUT errors', async () => {
      const error = new Error('PUT failed')
      vishingRequest.put.mockRejectedValueOnce(error)
      await expect(vishingApi.updateVishingTemplate('id', {})).rejects.toThrow('PUT failed')
    })

    it('should propagate DELETE errors', async () => {
      const error = new Error('DELETE failed')
      vishingRequest.delete.mockRejectedValueOnce(error)
      await expect(vishingApi.deleteVishingTemplate('id')).rejects.toThrow('DELETE failed')
    })

    it('should handle export errors', async () => {
      const error = new Error('Export failed')
      vishingRequest.post.mockRejectedValueOnce(error)
      await expect(vishingApi.exportVishingTemplates()).rejects.toThrow('Export failed')
    })

    it('should handle report errors', async () => {
      const error = new Error('Report fetch failed')
      vishingRequest.get.mockRejectedValueOnce(error)
      await expect(vishingApi.getVishingReportSummary('id')).rejects.toThrow('Report fetch failed')
    })
  })

  describe('default parameter branch coverage', () => {
    it('calls with default payload when no arg', async () => {
      await vishingApi.exportVishingTemplates()
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-template/search/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('calls with default resourceId when no arg', async () => {
      await vishingApi.getVishingTemplate()
      expect(vishingRequest.get).toHaveBeenCalledWith('/vishing-template/')
    })

    it('calls updateVishingTemplate with defaults when no args', async () => {
      await vishingApi.updateVishingTemplate()
      expect(vishingRequest.put).toHaveBeenCalledWith('/vishing-template/', {}, expect.any(Object))
    })

    it('calls createVishingTemplate with default payload', async () => {
      await vishingApi.createVishingTemplate()
      expect(vishingRequest.post).toHaveBeenCalledWith('/vishing-template', {}, expect.any(Object))
    })

    it('calls getVishingCampaign with default resourceId', async () => {
      await vishingApi.getVishingCampaign()
      expect(vishingRequest.get).toHaveBeenCalledWith('/vishing-campaign/')
    })

    it('calls updateVishingCampaign with default payload and resourceId', async () => {
      await vishingApi.updateVishingCampaign()
      expect(vishingRequest.put).toHaveBeenCalledWith('/vishing-campaign/', {}, expect.any(Object))
    })

    it('calls getVishingReportUsers with default payload and resourceId', async () => {
      await vishingApi.getVishingReportUsers()
      expect(vishingRequest.post).toHaveBeenCalledWith('/vishing-report//users/search', {})
    })

    it('calls getVishingReportAnswered with default payload and resourceId', async () => {
      await vishingApi.getVishingReportAnswered()
      expect(vishingRequest.post).toHaveBeenCalledWith('/vishing-report//answered/search', {})
    })

    it('calls playTextToSpeech with default payload', async () => {
      await vishingApi.playTextToSpeech()
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-template/language/get-voice-url',
        {}
      )
    })

    it('calls exportVishingUsers with default payload and resourceId', async () => {
      await vishingApi.exportVishingUsers()
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-report//users/search/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('calls exportVishingAnsweredUsers with default payload and resourceId', async () => {
      await vishingApi.exportVishingAnsweredUsers()
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-report//answered/search/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('calls getVishingReportDialedNumber with default payload and resourceId', async () => {
      await vishingApi.getVishingReportDialedNumber()
      expect(vishingRequest.post).toHaveBeenCalledWith('/vishing-report//dialed-number/search', {})
    })

    it('calls exportVishingReportDialedNumbers with default payload and resourceId', async () => {
      await vishingApi.exportVishingReportDialedNumbers()
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-report//dialed-number/search/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('calls getVishingReportNoResponse with default payload and resourceId', async () => {
      await vishingApi.getVishingReportNoResponse()
      expect(vishingRequest.post).toHaveBeenCalledWith('/vishing-report//no-response/search', {})
    })

    it('calls exportVishingReportNoResponse with default payload and resourceId', async () => {
      await vishingApi.exportVishingReportNoResponse()
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-report//no-response/search/export',
        {},
        { responseType: 'blob' }
      )
    })

    it('calls exportVishingReportSummary with default resourceId', async () => {
      await vishingApi.exportVishingReportSummary()
      expect(vishingRequest.get).toHaveBeenCalledWith(
        '/vishing-report//export',
        { responseType: 'blob' }
      )
    })

    it('calls resendVishingReport with default resourceId and payload', async () => {
      await vishingApi.resendVishingReport()
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/vishing-report/resend/',
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })
})
