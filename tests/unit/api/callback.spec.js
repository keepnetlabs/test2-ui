jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

jest.mock('@/utils/vishingRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
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

    it('should handle numeric and string template IDs', async () => {
      await callbackApi.getCallbackTemplate(123)
      expect(vishingRequest.get).toHaveBeenCalledWith('/callback-simulator/callback-template/123')

      vishingRequest.get.mockClear()
      await callbackApi.getCallbackTemplate('template-abc')
      expect(vishingRequest.get).toHaveBeenCalledWith('/callback-simulator/callback-template/template-abc')
    })

    it('should handle bulk delete with multiple IDs', async () => {
      const payload = { ids: Array.from({ length: 10 }, (_, i) => `template-${i}`) }
      await callbackApi.bulkDeleteCallbackTemplates(payload)
      expect(vishingRequest.delete).toHaveBeenCalled()
    })

    it('should handle language selection in preview', async () => {
      const id = 'template-123'
      await callbackApi.getCallbackTemplatePreview(id, 'en')
      expect(vishingRequest.get).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        callbackApi.searchCallbackTemplates({}),
        callbackApi.getCallbackTemplate('id'),
        callbackApi.createCallbackTemplate({}),
        callbackApi.updateCallbackTemplate('id', {}),
        callbackApi.deleteCallbackTemplate('id'),
        callbackApi.bulkDeleteCallbackTemplates({ ids: [] }),
        callbackApi.exportCallbackTemplates({}),
        callbackApi.getCallbackTemplatePreview('id'),
        callbackApi.getVoiceUrl({}),
        callbackApi.searchEmailTemplates({}),
        callbackApi.getEmailTemplate('id'),
        callbackApi.createEmailTemplate({}),
        callbackApi.updateEmailTemplate('id', {}),
        callbackApi.deleteEmailTemplate('id'),
        callbackApi.bulkDeleteEmailTemplates({ ids: [] }),
        callbackApi.exportEmailTemplates({}),
        callbackApi.getMergeTags(),
        callbackApi.searchCallbackScenarios({}),
        callbackApi.getCallbackScenario('id'),
        callbackApi.createCallbackScenario({}),
        callbackApi.getAvailableCallbackNumbers('company-id'),
        callbackApi.createCallbackCampaign({})
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required callback template functions', () => {
      expect(typeof callbackApi.searchCallbackTemplates).toBe('function')
      expect(typeof callbackApi.getCallbackTemplate).toBe('function')
      expect(typeof callbackApi.createCallbackTemplate).toBe('function')
      expect(typeof callbackApi.updateCallbackTemplate).toBe('function')
      expect(typeof callbackApi.deleteCallbackTemplate).toBe('function')
      expect(typeof callbackApi.bulkDeleteCallbackTemplates).toBe('function')
      expect(typeof callbackApi.exportCallbackTemplates).toBe('function')
      expect(typeof callbackApi.getCallbackTemplatePreview).toBe('function')
      expect(typeof callbackApi.getVoiceUrl).toBe('function')
    })

    it('should export all required email template functions', () => {
      expect(typeof callbackApi.searchEmailTemplates).toBe('function')
      expect(typeof callbackApi.getEmailTemplate).toBe('function')
      expect(typeof callbackApi.createEmailTemplate).toBe('function')
      expect(typeof callbackApi.updateEmailTemplate).toBe('function')
      expect(typeof callbackApi.deleteEmailTemplate).toBe('function')
      expect(typeof callbackApi.bulkDeleteEmailTemplates).toBe('function')
      expect(typeof callbackApi.exportEmailTemplates).toBe('function')
      expect(typeof callbackApi.getMergeTags).toBe('function')
    })

    it('should export all required scenario and campaign functions', () => {
      expect(typeof callbackApi.searchCallbackScenarios).toBe('function')
      expect(typeof callbackApi.getCallbackScenario).toBe('function')
      expect(typeof callbackApi.createCallbackScenario).toBe('function')
      expect(typeof callbackApi.getAvailableCallbackNumbers).toBe('function')
      expect(typeof callbackApi.createCallbackCampaign).toBe('function')
    })

    it('should export at least 25 functions', () => {
      const functions = Object.values(callbackApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(25)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle callback template full CRUD workflow', async () => {
      await callbackApi.searchCallbackTemplates({})
      expect(vishingRequest.post).toHaveBeenCalledTimes(1)

      vishingRequest.post.mockClear()
      await callbackApi.createCallbackTemplate({ name: 'New Template' })
      expect(vishingRequest.post).toHaveBeenCalledTimes(1)

      vishingRequest.get.mockClear()
      await callbackApi.getCallbackTemplate('template-1')
      expect(vishingRequest.get).toHaveBeenCalledTimes(1)

      vishingRequest.put.mockClear()
      await callbackApi.updateCallbackTemplate('template-1', { name: 'Updated' })
      expect(vishingRequest.put).toHaveBeenCalledTimes(1)

      vishingRequest.delete.mockClear()
      await callbackApi.deleteCallbackTemplate('template-1')
      expect(vishingRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle email template workflow', async () => {
      await callbackApi.searchEmailTemplates({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await callbackApi.createEmailTemplate({ name: 'Email Template' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle scenario creation workflow', async () => {
      await callbackApi.searchCallbackScenarios({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await callbackApi.createCallbackScenario({ name: 'Scenario' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel callback operations', async () => {
      const results = await Promise.all([
        callbackApi.searchCallbackTemplates({}),
        callbackApi.getMergeTags(),
        callbackApi.getAvailableCallbackNumbers('company-1')
      ])

      expect(results).toHaveLength(3)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle template search with pagination', async () => {
      const payload = { page: 2, pageSize: 50 }
      await callbackApi.searchCallbackTemplates(payload)
      expect(vishingRequest.post).toHaveBeenCalledWith('/callback-simulator/callback-template/search', payload)
    })

    it('should handle template creation with various fields', async () => {
      const payload = {
        name: 'Template',
        description: 'Description',
        language: 'en',
        content: 'Template content'
      }
      await callbackApi.createCallbackTemplate(payload)
      expect(vishingRequest.post).toHaveBeenCalled()
    })

    it('should handle email template search with filters', async () => {
      const payload = {
        page: 1,
        filters: { status: ['active'], type: ['email'] }
      }
      await callbackApi.searchEmailTemplates(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle campaign creation with complex payload', async () => {
      const payload = {
        name: 'Campaign',
        templateId: 'template-1',
        targets: ['user-1', 'user-2'],
        schedule: { startDate: '2024-01-01', endDate: '2024-12-31' }
      }
      await callbackApi.createCallbackCampaign(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle bulk delete with various ID formats', async () => {
      const idSets = [
        { ids: ['template-1'] },
        { ids: ['template-1', 'template-2', 'template-3'] },
        { ids: Array.from({ length: 20 }, (_, i) => `template-${i}`) }
      ]

      for (const idSet of idSets) {
        vishingRequest.delete.mockClear()
        await callbackApi.bulkDeleteCallbackTemplates(idSet)
        expect(vishingRequest.delete).toHaveBeenCalled()
      }
    })
  })

  describe('Error Handling', () => {
    it('should propagate searchCallbackTemplates errors', async () => {
      const error = new Error('Search failed')
      vishingRequest.post.mockRejectedValueOnce(error)
      await expect(callbackApi.searchCallbackTemplates({})).rejects.toThrow('Search failed')
    })

    it('should propagate getCallbackTemplate errors', async () => {
      const error = new Error('Fetch failed')
      vishingRequest.get.mockRejectedValueOnce(error)
      await expect(callbackApi.getCallbackTemplate('id')).rejects.toThrow('Fetch failed')
    })

    it('should propagate createCallbackTemplate errors', async () => {
      const error = new Error('Creation failed')
      vishingRequest.post.mockRejectedValueOnce(error)
      await expect(callbackApi.createCallbackTemplate({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateCallbackTemplate errors', async () => {
      const error = new Error('Update failed')
      vishingRequest.put.mockRejectedValueOnce(error)
      await expect(callbackApi.updateCallbackTemplate('id', {})).rejects.toThrow('Update failed')
    })

    it('should propagate deleteCallbackTemplate errors', async () => {
      const error = new Error('Deletion failed')
      vishingRequest.delete.mockRejectedValueOnce(error)
      await expect(callbackApi.deleteCallbackTemplate('id')).rejects.toThrow('Deletion failed')
    })

    it('should propagate bulkDeleteCallbackTemplates errors', async () => {
      const error = new Error('Bulk delete failed')
      vishingRequest.delete.mockRejectedValueOnce(error)
      await expect(callbackApi.bulkDeleteCallbackTemplates({ ids: [] })).rejects.toThrow('Bulk delete failed')
    })

    it('should propagate createEmailTemplate errors', async () => {
      const error = new Error('Email template creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(callbackApi.createEmailTemplate({})).rejects.toThrow('Email template creation failed')
    })

    it('should propagate getMergeTags errors', async () => {
      const error = new Error('Merge tags fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(callbackApi.getMergeTags()).rejects.toThrow('Merge tags fetch failed')
    })

    it('should propagate createCallbackScenario errors', async () => {
      const error = new Error('Scenario creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(callbackApi.createCallbackScenario({})).rejects.toThrow('Scenario creation failed')
    })

    it('should propagate getAvailableCallbackNumbers errors', async () => {
      const error = new Error('Available numbers fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(callbackApi.getAvailableCallbackNumbers('company-1')).rejects.toThrow('Available numbers fetch failed')
    })

    it('should propagate createCallbackCampaign errors', async () => {
      const error = new Error('Campaign creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(callbackApi.createCallbackCampaign({})).rejects.toThrow('Campaign creation failed')
    })
  })
})
