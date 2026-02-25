import SmishingService from '@/api/smishing'
import CampaignManagerReportSummaryLandingPage from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryLandingPage.vue'

jest.mock('@/api/smishing', () => ({
  getSmishingCampaignLandingPageTemplatePreviewContent: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

jest.mock('@/utils/functions', () => ({
  getDifficultyBadgeColor: jest.fn(() => '#abcdef')
}))

describe('CampaignManagerReportSummaryLandingPage.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('isFormData and getCurrentTemplate computed branches', () => {
    expect(CampaignManagerReportSummaryLandingPage.computed.isFormData.call({ formData: {} })).toBe(0)

    const singleCtx = { templates: [{ content: 'one' }], selectedTab: '1' }
    const multiCtx = { templates: [{ content: 'one' }, { content: 'two' }], selectedTab: '2' }

    expect(CampaignManagerReportSummaryLandingPage.computed.getCurrentTemplate.call(singleCtx)).toBe(
      'one'
    )
    expect(CampaignManagerReportSummaryLandingPage.computed.getCurrentTemplate.call(multiCtx)).toBe(
      'two'
    )
  })

  it('callForTemplate maps template list and url', async () => {
    SmishingService.getSmishingCampaignLandingPageTemplatePreviewContent.mockResolvedValueOnce({
      data: {
        data: {
          landingPages: [{ content: '<h1>x</h1>' }],
          urlTemplate: 'https://x'
        }
      }
    })

    const ctx = {
      isFetchingSummary: true,
      setLoading: jest.fn(),
      templates: [],
      urlTemplate: ''
    }

    await CampaignManagerReportSummaryLandingPage.methods.callForTemplate.call(ctx, 'r1', 'j1', 2)

    expect(SmishingService.getSmishingCampaignLandingPageTemplatePreviewContent).toHaveBeenCalledWith(
      'r1',
      'j1',
      2
    )
    expect(ctx.templates).toEqual([{ content: '<h1>x</h1>' }])
    expect(ctx.urlTemplate).toBe('https://x')
  })

  it('getBadgeText and getBadgeColor methods', () => {
    expect(CampaignManagerReportSummaryLandingPage.methods.getBadgeText('Low')).toBe('Low')
    expect(CampaignManagerReportSummaryLandingPage.methods.getBadgeColor('Low')).toBe('#abcdef')
  })
})
