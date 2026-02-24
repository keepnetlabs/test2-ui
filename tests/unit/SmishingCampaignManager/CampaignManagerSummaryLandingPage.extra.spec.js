jest.mock('@/api/landingPage', () => ({
  getCampaignManagerLandingPageTemplatePreviewContent: jest.fn(() =>
    Promise.resolve({ data: { data: { landingPages: [] } } })
  )
}))

import CampaignManagerSummaryLandingPage from '@/components/SmishingCampaignManager/CampaignManagerSummaryLandingPage.vue'

describe('CampaignManagerSummaryLandingPage.vue (extra branch coverage)', () => {
  describe('getCurrentTemplate', () => {
    it('returns template for single template when selectedTab is 1', () => {
      const ctx = {
        templates: [{ content: '<html>Single</html>' }],
        selectedTab: '1'
      }
      expect(CampaignManagerSummaryLandingPage.computed.getCurrentTemplate.call(ctx)).toBe(
        '<html>Single</html>'
      )
    })

    it('returns second template when templates.length > 1 and selectedTab is 2', () => {
      const ctx = {
        templates: [{ content: 'A' }, { content: 'B' }],
        selectedTab: '2'
      }
      expect(CampaignManagerSummaryLandingPage.computed.getCurrentTemplate.call(ctx)).toBe('B')
    })

    it('returns empty string when templates array is empty', () => {
      const ctx = {
        templates: [],
        selectedTab: '1'
      }
      expect(CampaignManagerSummaryLandingPage.computed.getCurrentTemplate.call(ctx)).toBe('')
    })

    it('returns empty when templates[0] has no content', () => {
      const ctx = {
        templates: [{}],
        selectedTab: '1'
      }
      expect(CampaignManagerSummaryLandingPage.computed.getCurrentTemplate.call(ctx)).toBe('')
    })
  })

  describe('isFormData', () => {
    it('returns 0 when formData is null', () => {
      const ctx = { formData: null }
      expect(CampaignManagerSummaryLandingPage.computed.isFormData.call(ctx)).toBe(0)
    })

    it('returns truthy when formData has keys', () => {
      const ctx = { formData: { name: 'A' } }
      expect(CampaignManagerSummaryLandingPage.computed.isFormData.call(ctx)).toBeTruthy()
    })
  })

  describe('callForTemplate', () => {
    it('does not set loading when isFetchingSummary is false', async () => {
      const setLoading = jest.fn()
      const ctx = {
        isFetchingSummary: false,
        setLoading,
        templates: []
      }
      CampaignManagerSummaryLandingPage.methods.callForTemplate.call(ctx, 'r1', 'j1', 'ig1')
      expect(setLoading).not.toHaveBeenCalledWith(true)
    })
  })
})
