jest.mock('@/api/landingPage', () => ({
  getCampaignManagerLandingPageTemplatePreviewContent: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          landingPages: [{ content: '<html>LP1</html>' }, { content: '<html>LP2</html>' }]
        }
      }
    })
  )
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDifficultyBadgeColor: jest.fn(() => '#111111')
  }
})

import CampaignManagerSummaryLandingPage from '@/components/CallbackCampaignManager/CampaignManagerSummaryLandingPage.vue'
import { getCampaignManagerLandingPageTemplatePreviewContent } from '@/api/landingPage'
import { getDifficultyBadgeColor } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerSummaryLandingPage.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed isFormData and getCurrentTemplate handle different states', () => {
    expect(
      CampaignManagerSummaryLandingPage.computed.isFormData.call({
        formData: { name: 'A' }
      })
    ).toBe(1)
    expect(
      CampaignManagerSummaryLandingPage.computed.isFormData.call({
        formData: {}
      })
    ).toBe(0)

    expect(
      CampaignManagerSummaryLandingPage.computed.getCurrentTemplate.call({
        templates: [{ content: 'A' }, { content: 'B' }],
        selectedTab: '2'
      })
    ).toBe('B')
    expect(
      CampaignManagerSummaryLandingPage.computed.getCurrentTemplate.call({
        templates: [{ content: 'A' }],
        selectedTab: '1'
      })
    ).toBe('A')
    expect(
      CampaignManagerSummaryLandingPage.computed.getCurrentTemplate.call({
        templates: [],
        selectedTab: '1'
      })
    ).toBe('')
  })

  it('formData watcher resets tab and sets templates directly when landingPageTemplates exists', () => {
    const ctx = {
      selectedTab: '3',
      templates: [],
      callForTemplate: jest.fn()
    }
    CampaignManagerSummaryLandingPage.watch.formData.handler.call(ctx, {
      landingPageTemplates: [{ content: 'X' }]
    })

    expect(ctx.selectedTab).toBe('1')
    expect(ctx.templates).toEqual([{ content: 'X' }])
    expect(ctx.callForTemplate).not.toHaveBeenCalled()
  })

  it('formData watcher calls template api when resource/job ids exist', () => {
    const callForTemplate = jest.fn()
    const ctx = {
      selectedTab: '2',
      templates: [],
      callForTemplate
    }

    CampaignManagerSummaryLandingPage.watch.formData.handler.call(ctx, {
      resourceId: 'r1',
      jobResourceId: 'j1',
      instanceGroup: 'ig1'
    })

    expect(ctx.selectedTab).toBe('1')
    expect(callForTemplate).toHaveBeenCalledWith('r1', 'j1', 'ig1')
  })

  it('callForTemplate toggles loading for fetching summary and maps api templates', async () => {
    const setLoading = jest.fn()
    const ctx = {
      isFetchingSummary: true,
      setLoading,
      templates: []
    }

    CampaignManagerSummaryLandingPage.methods.callForTemplate.call(ctx, 'r1', 'j1', 'ig1')
    await flushPromises()

    expect(setLoading).toHaveBeenCalledWith(true)
    expect(getCampaignManagerLandingPageTemplatePreviewContent).toHaveBeenCalledWith('r1', 'j1', 'ig1')
    expect(ctx.templates).toEqual([{ content: '<html>LP1</html>' }, { content: '<html>LP2</html>' }])
    expect(setLoading).toHaveBeenLastCalledWith()
  })

  it('badge helper methods return expected values', () => {
    expect(CampaignManagerSummaryLandingPage.methods.getBadgeText('Hard')).toBe('Hard')
    expect(CampaignManagerSummaryLandingPage.methods.getBadgeColor('Hard')).toBe('#111111')
    expect(getDifficultyBadgeColor).toHaveBeenCalledWith('Hard')
  })
})
