jest.mock('@/api/vishing', () => ({
  getVishingTemplatePreview: jest.fn().mockResolvedValue({
    data: { data: { steps: [], name: 'Template 1' } }
  }),
  getVishingCampaignPreview: jest.fn().mockResolvedValue({
    data: { data: { steps: [], name: 'Campaign 1' } }
  })
}))

import VishingTemplatePreview from '@/components/VishingTemplates/VishingTemplatePreview.vue'
import { getVishingTemplatePreview, getVishingCampaignPreview } from '@/api/vishing'

describe('VishingTemplatePreview.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getTitle returns campaign title when isCampaign', () => {
    expect(
      VishingTemplatePreview.computed.getTitle.call({ isCampaign: true })
    ).toBe('Vishing Campaign Preview')
  })

  it('getTitle returns template title when not campaign', () => {
    expect(
      VishingTemplatePreview.computed.getTitle.call({ isCampaign: false })
    ).toBe('Vishing Template Preview')
  })

  it('getSubtitle returns selectedRow name', () => {
    expect(
      VishingTemplatePreview.computed.getSubtitle.call({
        selectedRow: { name: 'My Template' }
      })
    ).toBe('My Template')
  })

  it('isRenderSteps returns true when templateData has steps', () => {
    expect(
      VishingTemplatePreview.computed.isRenderSteps.call({
        templateData: { steps: [{ order: 1 }] }
      })
    ).toBe(true)
  })

  it('isRenderSteps returns false when no steps', () => {
    expect(
      VishingTemplatePreview.computed.isRenderSteps.call({
        templateData: { steps: [] }
      })
    ).toBe(false)
  })

  it('handleClose emits on-close', () => {
    const emit = jest.fn()
    VishingTemplatePreview.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('callForData fetches template when not campaign', async () => {
    const ctx = {
      isLoading: false,
      selectedRow: { resourceId: 't1' },
      isCampaign: false,
      language: 'en',
      voice: 'Voice1',
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(getVishingTemplatePreview).toHaveBeenCalledWith('t1')
    expect(ctx.isLoading).toBe(false)
  })

  it('callForData fetches campaign when isCampaign', async () => {
    const ctx = {
      isLoading: false,
      selectedRow: { resourceId: 'c1' },
      isCampaign: true,
      languages: [],
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(getVishingCampaignPreview).toHaveBeenCalledWith('c1')
  })
})
