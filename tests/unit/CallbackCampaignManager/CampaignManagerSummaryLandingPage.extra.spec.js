jest.mock('@/api/landingPage', () => ({
  getCampaignManagerLandingPageTemplatePreviewContent: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {}
      }
    })
  )
}))

import CampaignManagerSummaryLandingPage from '@/components/CallbackCampaignManager/CampaignManagerSummaryLandingPage.vue'
import { getCampaignManagerLandingPageTemplatePreviewContent } from '@/api/landingPage'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerSummaryLandingPage.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('watcher no-ops when formData has neither landingPageTemplates nor resource ids', () => {
    const ctx = {
      selectedTab: '4',
      templates: [{ content: 'keep' }],
      callForTemplate: jest.fn()
    }

    CampaignManagerSummaryLandingPage.watch.formData.handler.call(ctx, {
      name: 'Only Name'
    })

    expect(ctx.selectedTab).toBe('1')
    expect(ctx.templates).toEqual([{ content: 'keep' }])
    expect(ctx.callForTemplate).not.toHaveBeenCalled()
  })

  it('callForTemplate does not force loading when isFetchingSummary is false', async () => {
    const setLoading = jest.fn()
    const ctx = {
      isFetchingSummary: false,
      setLoading,
      templates: [{ content: 'old' }]
    }

    CampaignManagerSummaryLandingPage.methods.callForTemplate.call(ctx, 'r2', 'j2', 'ig2')
    await flushPromises()

    expect(setLoading).toHaveBeenCalledTimes(1)
    expect(setLoading).toHaveBeenCalledWith()
    expect(getCampaignManagerLandingPageTemplatePreviewContent).toHaveBeenCalledWith(
      'r2',
      'j2',
      'ig2'
    )
    expect(ctx.templates).toEqual([])
  })

  it('getCurrentTemplate returns empty string when selectedTab is out of range', () => {
    const result = CampaignManagerSummaryLandingPage.computed.getCurrentTemplate.call({
      templates: [{ content: 'A' }, { content: 'B' }],
      selectedTab: '9'
    })
    expect(result).toBe('')
  })
})
