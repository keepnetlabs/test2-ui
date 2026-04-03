jest.mock('@/api/smishing', () => ({
  getTextMessageTemplate: jest.fn(() =>
    Promise.resolve({ data: { data: { template: 'Hello SMS' } } })
  )
}))

import CampaignManagerReportSummaryTextTemplate from '@/components/SmishingReport/Summary/CampaignManagerReportSummaryTextTemplate.vue'
import SmishingService from '@/api/smishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSummaryTextTemplate.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getTitle prefixes template name', () => {
    const title = CampaignManagerReportSummaryTextTemplate.computed.getTitle.call({
      formData: { name: 'Morning SMS' }
    })
    expect(title).toBe('Text Message: Morning SMS')
  })

  it('getTitle handles missing name', () => {
    const title = CampaignManagerReportSummaryTextTemplate.computed.getTitle.call({
      formData: {}
    })
    expect(title).toBe('Text Message: ')
  })

  it('loadTextPreview fetches template body', async () => {
    const ctx = {
      formData: { resourceId: 'r1', name: 'T1' },
      previewName: '',
      previewTemplate: ''
    }
    await CampaignManagerReportSummaryTextTemplate.methods.loadTextPreview.call(ctx)
    await flushPromises()
    expect(SmishingService.getTextMessageTemplate).toHaveBeenCalledWith('r1')
    expect(ctx.previewName).toBe('T1')
    expect(ctx.previewTemplate).toBe('Hello SMS')
  })

  it('clears preview cache when resourceId changes', () => {
    const handler =
      CampaignManagerReportSummaryTextTemplate.watch['formData.resourceId'].handler
    const ctx = { previewName: 'x', previewTemplate: 'y' }
    handler.call(ctx)
    expect(ctx.previewName).toBe('')
    expect(ctx.previewTemplate).toBe('')
  })
})
