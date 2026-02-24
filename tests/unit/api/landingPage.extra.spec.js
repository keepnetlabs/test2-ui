import * as landingPageApi from '@/api/landingPage'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('landingPage API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getLandingPageList', () => {
    it('calls POST search endpoint', async () => {
      await landingPageApi.getLandingPageList({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/search',
        { page: 1 }
      )
    })
  })

  describe('getLandingPageFormDetails', () => {
    it('calls GET form-details', async () => {
      await landingPageApi.getLandingPageFormDetails()
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/landing-page-template/form-details')
    })
  })

  describe('createLandingPage', () => {
    it('calls POST with snackbar', async () => {
      await landingPageApi.createLandingPage({ name: 'Test' })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template',
        { name: 'Test' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('updateLandingPage', () => {
    it('calls PUT with id', async () => {
      await landingPageApi.updateLandingPage({ name: 'Updated' }, 'id-1')
      expect(testRequest.put).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/id-1',
        { name: 'Updated' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('deleteLandingPage', () => {
    it('calls DELETE with id', async () => {
      await landingPageApi.deleteLandingPage('id-1')
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/id-1',
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getLandingPageTemplate', () => {
    it('calls GET with id', async () => {
      await landingPageApi.getLandingPageTemplate('tpl-1')
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/landing-page-template/tpl-1')
    })
  })

  describe('getLandingPageTemplatePreviewContent', () => {
    it('calls GET preview', async () => {
      await landingPageApi.getLandingPageTemplatePreviewContent('tpl-1')
      expect(testRequest.get).toHaveBeenCalledWith('phishing-simulator/landing-page-template/tpl-1')
    })
  })

  describe('exportLandingPage', () => {
    it('calls POST export with blob', async () => {
      await landingPageApi.exportLandingPage({ page: 1 })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/search/export',
        { page: 1 },
        { responseType: 'blob' }
      )
    })
  })

  describe('bulkDeleteLandingPages', () => {
    it('calls DELETE bulk-delete', async () => {
      await landingPageApi.bulkDeleteLandingPages({ ids: ['a', 'b'] })
      expect(testRequest.delete).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/bulk-delete',
        expect.objectContaining({ data: { ids: ['a', 'b'] } })
      )
    })
  })

  describe('generateLandingPageTranslation', () => {
    it('calls POST translate-content', async () => {
      await landingPageApi.generateLandingPageTranslation({ content: 'Hello' })
      expect(testRequest.post).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/translate-content',
        { content: 'Hello' }
      )
    })
  })

  describe('getLandingPageTranslation', () => {
    it('calls GET translated-content', async () => {
      await landingPageApi.getLandingPageTranslation('key-123')
      expect(testRequest.get).toHaveBeenCalledWith(
        'phishing-simulator/landing-page-template/translated-content/key-123'
      )
    })
  })
})
