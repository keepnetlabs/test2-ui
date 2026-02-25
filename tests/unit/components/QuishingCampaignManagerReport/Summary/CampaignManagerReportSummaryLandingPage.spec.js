import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import QuishingService from '@/api/quishing'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import CampaignManagerReportSummaryLandingPage from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryLandingPage.vue'

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn(() =>
      Promise.resolve([
        {
          isoFriendlyName: 'English',
          name: 'English',
          resourceId: '1',
          description: 'en'
        }
      ])
    )
  }
}))

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getCampaignManagerLandingPageTemplatePreviewContent: jest.fn(() =>
      Promise.resolve({ data: { data: {} } })
    )
  }
}))

describe('CampaignManagerReportSummaryLandingPage.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportSummaryLandingPage.name).toBe(
      'CampaignManagerReportSummaryLandingPage'
    )
  })

  it('computed title, isQuishing and preview api func work as expected', async () => {
    const ctx = {
      type: SCENARIO_TYPES.QUISHING,
      formData: { name: 'Landing A' },
      previewSelectedRow: { jobResourceId: 'j1', instanceGroup: 2 }
    }
    expect(CampaignManagerReportSummaryLandingPage.computed.isQuishing.call(ctx)).toBe(true)
    expect(CampaignManagerReportSummaryLandingPage.computed.getTitle.call(ctx)).toBe(
      'Landing Page: Landing A'
    )

    const fn = CampaignManagerReportSummaryLandingPage.computed.getPreviewApiFunc.call(ctx)
    await fn('resource-1')
    expect(QuishingService.getCampaignManagerLandingPageTemplatePreviewContent).toHaveBeenCalledWith(
      'resource-1',
      'j1',
      2
    )
  })

  it('watch isShowLandingPageTemplate maps previewSelectedRow from formData', () => {
    const ctx = {
      previewSelectedRow: null,
      formData: {
        resourceId: 'lp-1',
        name: 'Landing',
        jobResourceId: 'job-1',
        instanceGroup: 'ig-1'
      }
    }
    CampaignManagerReportSummaryLandingPage.watch.isShowLandingPageTemplate.call(ctx, true)
    expect(ctx.previewSelectedRow).toEqual({
      resourceId: 'lp-1',
      name: 'Landing',
      jobResourceId: 'job-1',
      instanceGroup: 'ig-1'
    })
  })

  it('callForLanguages maps lookup response into language options', async () => {
    const ctx = { languageOptions: [] }
    await CampaignManagerReportSummaryLandingPage.methods.callForLanguages.call(ctx)
    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(ctx.languageOptions).toEqual([
      {
        text: 'English',
        languageTypeName: 'English',
        value: '1',
        code: 'en'
      }
    ])
  })
})
