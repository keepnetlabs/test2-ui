jest.mock('@/api/callback', () => ({
  getCallbackTemplatePreview: jest.fn().mockResolvedValue({
    data: { data: { steps: [], vishingLanguageResourceId: '' } }
  })
}))

jest.mock('@/api/vishing', () => ({
  getVishingCampaignPreview: jest.fn().mockResolvedValue({
    data: { data: { steps: [], vishingLanguageResourceId: '' } }
  })
}))

import CallbackTemplatePreview from '@/components/CallbackScenarios/CallbackTemplatePreview.vue'

describe('CallbackTemplatePreview.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('getTitle returns campaign title when isCampaign', () => {
      expect(
        CallbackTemplatePreview.computed.getTitle.call({ isCampaign: true })
      ).toBe('Callback Campaign Preview')
    })

    it('getTitle returns template title when not isCampaign', () => {
      expect(
        CallbackTemplatePreview.computed.getTitle.call({ isCampaign: false })
      ).toBe('Callback Template Preview')
    })

    it('getSubtitle returns selectedRow name', () => {
      expect(
        CallbackTemplatePreview.computed.getSubtitle.call({
          selectedRow: { name: 'Template A' }
        })
      ).toBe('Template A')
    })

    it('isRenderSteps returns true when templateData has steps', () => {
      expect(
        CallbackTemplatePreview.computed.isRenderSteps.call({
          templateData: { steps: [1, 2, 3] }
        })
      ).toBe(true)
    })

    it('isRenderSteps returns false when templateData has no steps', () => {
      expect(
        CallbackTemplatePreview.computed.isRenderSteps.call({
          templateData: { steps: [] }
        })
      ).toBe(false)
    })
  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const emit = jest.fn()
      CallbackTemplatePreview.methods.handleClose.call({ $emit: emit })
      expect(emit).toHaveBeenCalledWith('on-close')
    })
  })
})
