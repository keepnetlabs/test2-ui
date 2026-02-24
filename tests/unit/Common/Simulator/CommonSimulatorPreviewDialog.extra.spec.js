import CommonSimulatorPreviewDialog from '@/components/Common/Simulator/CommonSimulatorPreviewDialog.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'

describe('CommonSimulatorPreviewDialog.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('getEmailTemplatePreviewLanguageHint uses singular when 1 language', () => {
      expect(
        CommonSimulatorPreviewDialog.computed.getEmailTemplatePreviewLanguageHint.call({
          selectedTemplateLanguages: [{ value: 'en' }]
        })
      ).toBe('This template is available in 1 language.')
    })

    it('templateLanguageLabel uses singular when 1 language', () => {
      expect(
        CommonSimulatorPreviewDialog.computed.templateLanguageLabel.call({
          selectedTemplateLanguages: [{ value: 'en' }]
        })
      ).toBe('Template Language (1)')
    })

    it('templateLanguageLabel format when 0 languages', () => {
      expect(
        CommonSimulatorPreviewDialog.computed.templateLanguageLabel.call({
          selectedTemplateLanguages: []
        })
      ).toBe('Template Language (0)')
    })

    it('getCurrentLandingPageTemplate returns undefined when index out of bounds', () => {
      expect(
        CommonSimulatorPreviewDialog.computed.getCurrentLandingPageTemplate.call({
          selectedLandingPageIndex: 5,
          landingPageTemplates: [{ content: '<p>A</p>' }]
        })
      ).toBeUndefined()
    })

    it('isAttachmentBasedScenario returns false when selectedRow.method is undefined', () => {
      expect(
        CommonSimulatorPreviewDialog.computed.isAttachmentBasedScenario.call({
          selectedRow: {}
        })
      ).toBe(false)
    })

    it('isQuishingTypeIndividualPrintOut returns false when type does not match', () => {
      expect(
        CommonSimulatorPreviewDialog.computed.isQuishingTypeIndividualPrintOut.call({
          type: PREVIEW_DIALOG_TYPES.QUISHING,
          emailTemplateParams: { type: 'Email' }
        })
      ).toBe(false)
    })
  })
})
