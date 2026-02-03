jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

jest.mock('@/utils/vishingRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import vishingRequest from '@/utils/vishingRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import callbackApi from '@/api/callback'

describe('callback API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('callback template operations', () => {
    it('should call searchCallbackTemplates', async () => {
      const payload = { page: 1 }
      await callbackApi.searchCallbackTemplates(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith('/callback-simulator/callback-template/search', payload)
    })

    it('should call getCallbackTemplate', async () => {
      const id = 'template-123'
      await callbackApi.getCallbackTemplate(id)
      expect(vishingRequest.get).toHaveBeenCalledWith(`/callback-simulator/callback-template/${id}`)
    })

    it('should call createCallbackTemplate', async () => {
      const payload = { name: 'Callback Template' }
      await callbackApi.createCallbackTemplate(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/callback-template',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateCallbackTemplate', async () => {
      const payload = { name: 'Updated Template' }
      const id = 'template-123'
      await callbackApi.updateCallbackTemplate(id, payload)
      expect(vishingRequest.put).toHaveBeenCalledWith(
        `/callback-simulator/callback-template/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteCallbackTemplate', async () => {
      const id = 'template-123'
      await callbackApi.deleteCallbackTemplate(id)
      expect(vishingRequest.delete).toHaveBeenCalledWith(
        `/callback-simulator/callback-template/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteCallbackTemplates', async () => {
      const payload = { ids: ['template-1', 'template-2'] }
      await callbackApi.bulkDeleteCallbackTemplates(payload)
      expect(vishingRequest.delete).toHaveBeenCalledWith(
        '/callback-simulator/callback-template/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call exportCallbackTemplates', async () => {
      const payload = { filters: {} }
      await callbackApi.exportCallbackTemplates(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/callback-template/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getCallbackTemplateLanguages', async () => {
      await callbackApi.getCallbackTemplateLanguages()
      expect(vishingRequest.get).toHaveBeenCalledWith('/callback-simulator/callback-template/language')
    })

    it('should call getCallbackTemplatePreview', async () => {
      const id = 'template-123'
      await callbackApi.getCallbackTemplatePreview(id)
      expect(vishingRequest.get).toHaveBeenCalledWith(
        `/callback-simulator/callback-template/preview/${id}`
      )
    })

    it('should call getVoiceUrl', async () => {
      const payload = { templateId: 'template-123' }
      await callbackApi.getVoiceUrl(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/callback-template/get-voice-url',
        payload
      )
    })
  })

  describe('email template operations', () => {
    it('should call searchEmailTemplates', async () => {
      const payload = { page: 1 }
      await callbackApi.searchEmailTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/callback-simulator/email-template/search', payload)
    })

    it('should call getEmailTemplate', async () => {
      const id = 'email-123'
      await callbackApi.getEmailTemplate(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/callback-simulator/email-template/${id}`)
    })

    it('should call createEmailTemplate', async () => {
      const payload = { name: 'Email Template' }
      await callbackApi.createEmailTemplate(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/email-template',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateEmailTemplate', async () => {
      const payload = { name: 'Updated Email' }
      const id = 'email-123'
      await callbackApi.updateEmailTemplate(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/callback-simulator/email-template/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteEmailTemplate', async () => {
      const id = 'email-123'
      await callbackApi.deleteEmailTemplate(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/callback-simulator/email-template/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteEmailTemplates', async () => {
      const payload = { ids: ['email-1', 'email-2'] }
      await callbackApi.bulkDeleteEmailTemplates(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/callback-simulator/email-template/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call exportEmailTemplates', async () => {
      const payload = { filters: {} }
      await callbackApi.exportEmailTemplates(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/email-template/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getMergeTags', async () => {
      await callbackApi.getMergeTags()
      expect(testRequest.get).toHaveBeenCalledWith('/callback-simulator/email-template/merge-tags')
    })
  })

  describe('scenario operations', () => {
    it('should call searchCallbackScenarios', async () => {
      const payload = { page: 1 }
      await callbackApi.searchCallbackScenarios(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/callback-simulator/scenario/search', payload)
    })

    it('should call getCallbackScenario', async () => {
      const id = 'scenario-123'
      await callbackApi.getCallbackScenario(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/callback-simulator/scenario/${id}`)
    })

    it('should call createCallbackScenario', async () => {
      const payload = { name: 'Callback Scenario' }
      await callbackApi.createCallbackScenario(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/scenario',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateCallbackScenario', async () => {
      const payload = { name: 'Updated Scenario' }
      const id = 'scenario-123'
      await callbackApi.updateCallbackScenario(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/callback-simulator/scenario/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteCallbackScenario', async () => {
      const id = 'scenario-123'
      await callbackApi.deleteCallbackScenario(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/callback-simulator/scenario/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteCallbackScenarios', async () => {
      const payload = { ids: ['scenario-1', 'scenario-2'] }
      await callbackApi.bulkDeleteCallbackScenarios(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/callback-simulator/scenario/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })

    it('should call exportCallbackScenarios', async () => {
      const payload = { filters: {} }
      await callbackApi.exportCallbackScenarios(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/scenario/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call getCallbackScenarioPreview', async () => {
      const id = 'scenario-123'
      await callbackApi.getCallbackScenarioPreview(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/callback-simulator/scenario/preview/${id}`
      )
    })
  })

  describe('settings operations', () => {
    it('should call searchCallbackSettings', async () => {
      const payload = { page: 1 }
      await callbackApi.searchCallbackSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith('/callback-simulator/settings/search', payload)
    })

    it('should call getUsedCallbackNumbers', async () => {
      await callbackApi.getUsedCallbackNumbers()
      expect(testRequest.get).toHaveBeenCalledWith('/callback-simulator/settings/usage')
    })

    it('should call exportCallbackSettings', async () => {
      const payload = { filters: {} }
      await callbackApi.exportCallbackSettings(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/settings/search/export',
        payload,
        { responseType: 'blob' }
      )
    })

    it('should call mapCallbackNumbers', async () => {
      const payload = { numbers: [] }
      await callbackApi.mapCallbackNumbers(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/settings/map-numbers',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call exchangeCallbackNumbers', async () => {
      const oldId = 'old-123'
      const newId = 'new-456'
      await callbackApi.exchangeCallbackNumbers(oldId, newId)
      expect(testRequest.post).toHaveBeenCalledWith(
        `/callback-simulator/settings/exchange-number/${oldId}/${newId}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getAvailableCallbackNumbers with company ID', async () => {
      const companyId = 'company-123'
      await callbackApi.getAvailableCallbackNumbers(companyId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/callback-simulator/settings/available-numbers?companyResourceId=${encodeURIComponent(companyId)}`
      )
    })

    it('should call getAvailableCallbackNumbers without company ID', async () => {
      await callbackApi.getAvailableCallbackNumbers()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/settings/available-numbers'
      )
    })

    it('should call deselectPhoneNumber', async () => {
      const id = 'number-123'
      await callbackApi.deselectPhoneNumber(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/callback-simulator/settings/number-delete/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('campaign operations', () => {
    it('should call getCampaignManagerFormDetails', async () => {
      await callbackApi.getCampaignManagerFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith('/callback-simulator/campaign/form-details')
    })

    it('should call getCallbackCampaign', async () => {
      const id = 'campaign-123'
      await callbackApi.getCallbackCampaign(id)
      expect(testRequest.get).toHaveBeenCalledWith(`/callback-simulator/campaign/${id}`)
    })

    it('should call createCallbackCampaign', async () => {
      const payload = { name: 'Callback Campaign' }
      await callbackApi.createCallbackCampaign(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/campaign',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteCallbackCampaign', async () => {
      const id = 'campaign-123'
      await callbackApi.deleteCallbackCampaign(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `/callback-simulator/campaign/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await callbackApi.getCallbackTemplate('id')
      expect(vishingRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search operations', async () => {
      await callbackApi.searchCallbackTemplates({})
      expect(vishingRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for update operations', async () => {
      await callbackApi.updateCallbackTemplate('id', {})
      expect(vishingRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for delete operations', async () => {
      await callbackApi.deleteCallbackTemplate('id')
      expect(vishingRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for mutations', async () => {
      await callbackApi.createCallbackTemplate({})
      expect(vishingRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await callbackApi.deleteCallbackTemplate('id')
      expect(vishingRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('export operations', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await callbackApi.exportCallbackTemplates(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle default empty payloads', async () => {
      await callbackApi.createCallbackTemplate()
      expect(vishingRequest.post).toHaveBeenCalled()
    })

    it('should handle special characters in ids', async () => {
      const specialId = 'template-123!@#$'
      await callbackApi.getCallbackTemplate(specialId)
      expect(vishingRequest.get).toHaveBeenCalledWith(`/callback-simulator/callback-template/${specialId}`)
    })

    it('should properly encode company ID in query string', async () => {
      const companyId = 'company/with/slashes'
      await callbackApi.getAvailableCallbackNumbers(companyId)
      expect(testRequest.get).toHaveBeenCalledWith(
        `/callback-simulator/settings/available-numbers?companyResourceId=${encodeURIComponent(companyId)}`
      )
    })
  })
})
