import callbackApi from '@/api/callback'
import testRequest from '@/utils/testRequest'
import vishingRequest from '@/utils/vishingRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

jest.mock('@/utils/vishingRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('callback API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchCallbackTemplates', () => {
    it('calls vishingRequest.post', async () => {
      await callbackApi.searchCallbackTemplates({ page: 1 })
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/callback-template/search',
        { page: 1 }
      )
    })
  })

  describe('getCallbackTemplate', () => {
    it('calls vishingRequest.get', async () => {
      await callbackApi.getCallbackTemplate('res-1')
      expect(vishingRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/callback-template/res-1'
      )
    })
  })

  describe('createCallbackTemplate', () => {
    it('calls vishingRequest.post with snackbar', async () => {
      await callbackApi.createCallbackTemplate({ name: 'Test' })
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/callback-template',
        { name: 'Test' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('searchEmailTemplates', () => {
    it('calls testRequest.post', async () => {
      await callbackApi.searchEmailTemplates({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/email-template/search',
        { page: 1 }
      )
    })
  })

  describe('getMergeTags', () => {
    it('calls testRequest.get', async () => {
      await callbackApi.getMergeTags()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/email-template/merge-tags'
      )
    })
  })

  describe('searchCallbackScenarios', () => {
    it('calls testRequest.post', async () => {
      await callbackApi.searchCallbackScenarios({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/scenario/search',
        { page: 1 }
      )
    })
  })

  describe('getUsedCallbackNumbers', () => {
    it('calls testRequest.get usage', async () => {
      await callbackApi.getUsedCallbackNumbers()
      expect(testRequest.get).toHaveBeenCalledWith('/callback-simulator/settings/usage')
    })
  })

  describe('searchCallbackSettings', () => {
    it('calls testRequest.post', async () => {
      await callbackApi.searchCallbackSettings({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/settings/search',
        { page: 1 }
      )
    })
  })

  describe('getAvailableCallbackNumbers', () => {
    it('calls testRequest.get without companyId', async () => {
      await callbackApi.getAvailableCallbackNumbers()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/settings/available-numbers'
      )
    })

    it('calls testRequest.get with companyId query', async () => {
      await callbackApi.getAvailableCallbackNumbers('comp-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/settings/available-numbers?companyResourceId=comp-1'
      )
    })

    it('encodes companyId query value', async () => {
      await callbackApi.getAvailableCallbackNumbers('company id/1')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/settings/available-numbers?companyResourceId=company%20id%2F1'
      )
    })

    it('does not append company query when companyId is numeric zero', async () => {
      await callbackApi.getAvailableCallbackNumbers(0)
      expect(testRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/settings/available-numbers'
      )
    })

    it('appends company query when companyId is string zero', async () => {
      await callbackApi.getAvailableCallbackNumbers('0')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/settings/available-numbers?companyResourceId=0'
      )
    })
  })

  describe('getCampaignManagerFormDetails', () => {
    it('calls testRequest.get', async () => {
      await callbackApi.getCampaignManagerFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith('/callback-simulator/campaign/form-details')
    })
  })

  describe('searchCallbackCampaigns', () => {
    it('calls testRequest.post', async () => {
      await callbackApi.searchCallbackCampaigns({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/campaign/search',
        { page: 1 }
      )
    })
  })

  describe('getCampaignSummary', () => {
    it('calls testRequest.get', async () => {
      await callbackApi.getCampaignSummary('res-1', 'inst-1')
      expect(testRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/campaign-job-report/summary/res-1/inst-1'
      )
    })
  })

  describe('getTargetGroupsForCurrentCompany', () => {
    it('calls testRequest.post', async () => {
      await callbackApi.getTargetGroupsForCurrentCompany({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/target-groups/search/current-company',
        { page: 1 }
      )
    })
  })

  describe('createEmailTemplate', () => {
    it('calls testRequest.post with snackbar', async () => {
      await callbackApi.createEmailTemplate({ name: 'New Template' })
      expect(testRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/email-template',
        { name: 'New Template' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('updateEmailTemplate', () => {
    it('calls testRequest.put with resourceId', async () => {
      await callbackApi.updateEmailTemplate('res-1', { name: 'Updated' })
      expect(testRequest.put).toHaveBeenCalledWith(
        '/callback-simulator/email-template/res-1',
        { name: 'Updated' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('deleteEmailTemplate', () => {
    it('calls testRequest.delete', async () => {
      await callbackApi.deleteEmailTemplate('res-2')
      expect(testRequest.delete).toHaveBeenCalledWith(
        '/callback-simulator/email-template/res-2',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('exportCallbackTemplates', () => {
    it('calls vishingRequest.post with blob responseType', async () => {
      await callbackApi.exportCallbackTemplates({ filter: {} })
      expect(vishingRequest.post).toHaveBeenCalledWith(
        '/callback-simulator/callback-template/search/export',
        { filter: {} },
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('getCallbackTemplatePreview', () => {
    it('calls vishingRequest.get with resourceId', async () => {
      await callbackApi.getCallbackTemplatePreview('preview-1')
      expect(vishingRequest.get).toHaveBeenCalledWith(
        '/callback-simulator/callback-template/preview/preview-1'
      )
    })
  })
})
