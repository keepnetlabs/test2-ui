jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({})),
  put: jest.fn().mockReturnValue(Promise.resolve({})),
  delete: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as landingPageApi from '@/api/landingPage'

describe('landingPage API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('landing page operations', () => {
    it('should call createLandingPage', async () => {
      const payload = { name: 'New Landing Page', content: '<html></html>' }
      await landingPageApi.createLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateLandingPage', async () => {
      const id = 'landing-123'
      const payload = { name: 'Updated Landing Page' }
      await landingPageApi.updateLandingPage(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `phishing-simulator/landing-page-template/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteLandingPage', async () => {
      const id = 'landing-123'
      await landingPageApi.deleteLandingPage(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `phishing-simulator/landing-page-template/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call bulkDeleteLandingPages', async () => {
      const payload = { ids: ['landing-1', 'landing-2'] }
      await landingPageApi.bulkDeleteLandingPages(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/bulk-delete',
        { snackbar: COMMON_SNACKBAR, data: payload }
      )
    })
  })

  describe('landing page retrieval', () => {
    it('should call getLandingPageList', async () => {
      const payload = { page: 1 }
      await landingPageApi.getLandingPageList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/search',
        payload
      )
    })

    it('should call getLandingPageTemplate', async () => {
      const id = 'landing-123'
      await landingPageApi.getLandingPageTemplate(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/landing-page-template/${id}`
      )
    })

    it('should call getLandingPageTemplatePreviewContent', async () => {
      const id = 'landing-123'
      await landingPageApi.getLandingPageTemplatePreviewContent(id)
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/landing-page-template/${id}`
      )
    })

    it('should call getLandingPageFormDetails', async () => {
      await landingPageApi.getLandingPageFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/form-details'
      )
    })

    it('should call getCampaignManagerLandingPageTemplatePreviewContent', async () => {
      const id = 'landing-123'
      const campaignResourceId = 'campaign-456'
      const instanceGroup = 'group-789'
      await landingPageApi.getCampaignManagerLandingPageTemplatePreviewContent(
        id,
        campaignResourceId,
        instanceGroup
      )
      expect(testRequest.get).toHaveBeenCalledWith(
        `phishing-simulator/phishing-campaign-job-report/summary/${campaignResourceId}/${instanceGroup}/landing-page-template/${id}`
      )
    })

    it('should call getCampaignManagerLandingPageTemplatePreviewContent with defaults', async () => {
      await landingPageApi.getCampaignManagerLandingPageTemplatePreviewContent()
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-simulator/phishing-campaign-job-report/summary///landing-page-template/'
      )
    })
  })

  describe('export operations', () => {
    it('should call exportLandingPage', async () => {
      const payload = { filters: {} }
      await landingPageApi.exportLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/search/export',
        payload,
        { responseType: 'blob' }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const id = 'landing-123'
      await landingPageApi.getLandingPageTemplate(id)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await landingPageApi.getLandingPageList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const payload = { name: 'Updated' }
      await landingPageApi.updateLandingPage(payload, 'landing-123')
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await landingPageApi.deleteLandingPage('landing-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for creation', async () => {
      const payload = { name: 'New' }
      await landingPageApi.createLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for updates', async () => {
      const payload = { name: 'Updated' }
      await landingPageApi.updateLandingPage(payload, 'landing-123')
      expect(testRequest.put).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })

    it('should use COMMON_SNACKBAR for deletes', async () => {
      await landingPageApi.deleteLandingPage('landing-123')
      expect(testRequest.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('blob response type', () => {
    it('should use blob responseType for exports', async () => {
      const payload = { filters: {} }
      await landingPageApi.exportLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ responseType: 'blob' })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle landing page creation with HTML content', async () => {
      const payload = {
        name: 'Phishing Landing Page',
        content: '<html><body><form></form></body></html>',
        cssStyles: 'body { background: white; }',
        javascript: 'console.log("test");'
      }
      await landingPageApi.createLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle bulk delete with multiple landing pages', async () => {
      const payload = { ids: ['landing-1', 'landing-2', 'landing-3'] }
      await landingPageApi.bulkDeleteLandingPages(payload)
      expect(testRequest.delete).toHaveBeenCalled()
    })

    it('should handle campaign manager preview with all parameters', async () => {
      const id = 'landing-123'
      const campaignResourceId = 'campaign-456'
      const instanceGroup = 'group-789'
      await landingPageApi.getCampaignManagerLandingPageTemplatePreviewContent(
        id,
        campaignResourceId,
        instanceGroup
      )
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should handle landing page export with filters', async () => {
      const payload = {
        filters: {
          status: ['active', 'inactive'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await landingPageApi.exportLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle landing page update with form data', async () => {
      const payload = {
        name: 'Updated Page',
        formFields: [
          { name: 'username', type: 'text', required: true },
          { name: 'password', type: 'password', required: true }
        ]
      }
      await landingPageApi.updateLandingPage(payload, 'landing-123')
      expect(testRequest.put).toHaveBeenCalled()
    })
  })
})
