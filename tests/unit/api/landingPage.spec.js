jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
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

    it('should handle numeric and string IDs', async () => {
      await landingPageApi.getLandingPageTemplate(123)
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/landing-page-template/123')

      testRequest.get.mockClear()
      await landingPageApi.getLandingPageTemplate('landing-abc')
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/landing-page-template/landing-abc')
    })

    it('should handle landing page creation with special characters in name', async () => {
      const payload = { name: 'Landing Page @#$%' }
      await landingPageApi.createLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle large content in landing page creation', async () => {
      const largeContent = '<html>' + '<div>content</div>'.repeat(1000) + '</html>'
      const payload = { name: 'Large Page', content: largeContent }
      await landingPageApi.createLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('createLandingPage should return thenable', () => {
      const result = landingPageApi.createLandingPage({})
      expect(typeof result.then).toBe('function')
    })

    it('updateLandingPage should return thenable', () => {
      const result = landingPageApi.updateLandingPage({}, 'id-1')
      expect(typeof result.then).toBe('function')
    })

    it('deleteLandingPage should return thenable', () => {
      const result = landingPageApi.deleteLandingPage('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('bulkDeleteLandingPages should return thenable', () => {
      const result = landingPageApi.bulkDeleteLandingPages({})
      expect(typeof result.then).toBe('function')
    })

    it('getLandingPageList should return thenable', () => {
      const result = landingPageApi.getLandingPageList({})
      expect(typeof result.then).toBe('function')
    })

    it('getLandingPageTemplate should return thenable', () => {
      const result = landingPageApi.getLandingPageTemplate('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('getLandingPageTemplatePreviewContent should return thenable', () => {
      const result = landingPageApi.getLandingPageTemplatePreviewContent('id-1')
      expect(typeof result.then).toBe('function')
    })

    it('getLandingPageFormDetails should return thenable', () => {
      const result = landingPageApi.getLandingPageFormDetails()
      expect(typeof result.then).toBe('function')
    })

    it('getCampaignManagerLandingPageTemplatePreviewContent should return thenable', () => {
      const result = landingPageApi.getCampaignManagerLandingPageTemplatePreviewContent()
      expect(typeof result.then).toBe('function')
    })

    it('exportLandingPage should return thenable', () => {
      const result = landingPageApi.exportLandingPage({})
      expect(typeof result.then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export all required functions', () => {
      expect(typeof landingPageApi.createLandingPage).toBe('function')
      expect(typeof landingPageApi.updateLandingPage).toBe('function')
      expect(typeof landingPageApi.deleteLandingPage).toBe('function')
      expect(typeof landingPageApi.bulkDeleteLandingPages).toBe('function')
      expect(typeof landingPageApi.getLandingPageList).toBe('function')
      expect(typeof landingPageApi.getLandingPageTemplate).toBe('function')
      expect(typeof landingPageApi.getLandingPageTemplatePreviewContent).toBe('function')
      expect(typeof landingPageApi.getLandingPageFormDetails).toBe('function')
      expect(typeof landingPageApi.getCampaignManagerLandingPageTemplatePreviewContent).toBe('function')
      expect(typeof landingPageApi.exportLandingPage).toBe('function')
    })

    it('should export at least 10 functions', () => {
      const functions = Object.values(landingPageApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThanOrEqual(10)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle landing page CRUD workflow', async () => {
      await landingPageApi.getLandingPageList({})
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await landingPageApi.createLandingPage({ name: 'New Page' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await landingPageApi.getLandingPageTemplate('page-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.put.mockClear()
      await landingPageApi.updateLandingPage({ name: 'Updated' }, 'page-1')
      expect(testRequest.put).toHaveBeenCalledTimes(1)

      testRequest.delete.mockClear()
      await landingPageApi.deleteLandingPage('page-1')
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle landing page preview workflow', async () => {
      await landingPageApi.getLandingPageTemplate('page-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      testRequest.get.mockClear()
      await landingPageApi.getLandingPageTemplatePreviewContent('page-1')
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle campaign manager preview workflow', async () => {
      await landingPageApi.getCampaignManagerLandingPageTemplatePreviewContent(
        'page-1',
        'campaign-456',
        'group-789'
      )
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })

    it('should handle bulk delete workflow', async () => {
      await landingPageApi.bulkDeleteLandingPages({ ids: ['p1', 'p2', 'p3'] })
      expect(testRequest.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel landing page operations', async () => {
      const results = await Promise.all([
        landingPageApi.getLandingPageList({}),
        landingPageApi.getLandingPageFormDetails(),
        landingPageApi.getLandingPageTemplate('page-1')
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle landing page creation with full configuration', async () => {
      const payload = {
        name: 'Complete Landing Page',
        content: '<html><body>Content</body></html>',
        cssStyles: 'body { color: black; }',
        javascript: 'console.log("loaded");'
      }
      await landingPageApi.createLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template',
        payload,
        expect.any(Object)
      )
    })

    it('should handle landing page update with ID', async () => {
      const payload = { name: 'Updated Page' }
      const id = 'landing-123'
      await landingPageApi.updateLandingPage(payload, id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `phishing-simulator/landing-page-template/${id}`,
        payload,
        expect.any(Object)
      )
    })

    it('should handle list search with pagination', async () => {
      const payload = { page: 2, pageSize: 25 }
      await landingPageApi.getLandingPageList(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/search',
        payload
      )
    })

    it('should handle export with complex filters', async () => {
      const payload = {
        filters: {
          status: ['active'],
          created: { start: '2024-01-01', end: '2024-12-31' }
        }
      }
      await landingPageApi.exportLandingPage(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/search/export',
        payload,
        expect.any(Object)
      )
    })

    it('should handle bulk delete with IDs', async () => {
      const payload = { ids: ['page-1', 'page-2', 'page-3'] }
      await landingPageApi.bulkDeleteLandingPages(payload)
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/bulk-delete',
        expect.objectContaining({ data: payload })
      )
    })

    it('should handle campaign manager preview with parameters', async () => {
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

    it('should handle different ID formats', async () => {
      await landingPageApi.deleteLandingPage(456)
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/456',
        expect.any(Object)
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate createLandingPage errors', async () => {
      const error = new Error('Creation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(landingPageApi.createLandingPage({})).rejects.toThrow('Creation failed')
    })

    it('should propagate updateLandingPage errors', async () => {
      const error = new Error('Update failed')
      testRequest.put.mockRejectedValueOnce(error)
      await expect(landingPageApi.updateLandingPage({}, 'id-1')).rejects.toThrow('Update failed')
    })

    it('should propagate deleteLandingPage errors', async () => {
      const error = new Error('Deletion failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(landingPageApi.deleteLandingPage('id-1')).rejects.toThrow('Deletion failed')
    })

    it('should propagate bulkDeleteLandingPages errors', async () => {
      const error = new Error('Bulk delete failed')
      testRequest.delete.mockRejectedValueOnce(error)
      await expect(landingPageApi.bulkDeleteLandingPages({})).rejects.toThrow('Bulk delete failed')
    })

    it('should propagate getLandingPageList errors', async () => {
      const error = new Error('List fetch failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(landingPageApi.getLandingPageList({})).rejects.toThrow('List fetch failed')
    })

    it('should propagate getLandingPageTemplate errors', async () => {
      const error = new Error('Template fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(landingPageApi.getLandingPageTemplate('id-1')).rejects.toThrow('Template fetch failed')
    })

    it('should propagate getLandingPageTemplatePreviewContent errors', async () => {
      const error = new Error('Preview fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(landingPageApi.getLandingPageTemplatePreviewContent('id-1')).rejects.toThrow('Preview fetch failed')
    })

    it('should propagate getLandingPageFormDetails errors', async () => {
      const error = new Error('Form details fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(landingPageApi.getLandingPageFormDetails()).rejects.toThrow('Form details fetch failed')
    })

    it('should propagate getCampaignManagerLandingPageTemplatePreviewContent errors', async () => {
      const error = new Error('Campaign preview fetch failed')
      testRequest.get.mockRejectedValueOnce(error)
      await expect(landingPageApi.getCampaignManagerLandingPageTemplatePreviewContent()).rejects.toThrow('Campaign preview fetch failed')
    })

    it('should propagate exportLandingPage errors', async () => {
      const error = new Error('Export failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(landingPageApi.exportLandingPage({})).rejects.toThrow('Export failed')
    })
  })
})
