import CommonCampaignManagerPreviewDialog from '@/components/Common/CampaignManager/CommonCampaignManagerPreviewDialog.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'

describe('CommonCampaignManagerPreviewDialog.vue (extra computed branching)', () => {
  const comp = CommonCampaignManagerPreviewDialog

  describe('getEmailTemplatePreviewLanguageHint', () => {
    it('uses singular language for 0 and 1 selected templates', () => {
      expect(
        comp.computed.getEmailTemplatePreviewLanguageHint.call({
          selectedTemplateLanguages: []
        })
      ).toBe('This template is available in 0 language.')

      expect(
        comp.computed.getEmailTemplatePreviewLanguageHint.call({
          selectedTemplateLanguages: [{}]
        })
      ).toBe('This template is available in 1 language.')
    })
  })

  describe('templateLanguageLabel', () => {
    it('uses singular Template Language when exactly one is selected', () => {
      expect(
        comp.computed.templateLanguageLabel.call({
          selectedTemplateLanguages: [{}]
        })
      ).toBe('Template Language (1)')
    })
  })

  describe('getIndividualPrintoutStyle', () => {
    it('returns only capitalize when printout button is not disabled', () => {
      expect(
        comp.computed.getIndividualPrintoutStyle.call({
          isIndividualPrintoutButtonDisabled: false
        })
      ).toEqual({ textTransform: 'capitalize' })
    })
  })

  describe('isQuishingTypeIndividualPrintOut', () => {
    it('is false when not quishing even if template type looks individual', () => {
      expect(
        comp.computed.isQuishingTypeIndividualPrintOut.call({
          type: PREVIEW_DIALOG_TYPES.PHISHING,
          isQuishing: false,
          selectedRow: { templateType: 'individual' }
        })
      ).toBe(false)
    })

    it('is false for quishing when templateType is not individual printout', () => {
      expect(
        comp.computed.isQuishingTypeIndividualPrintOut.call({
          type: PREVIEW_DIALOG_TYPES.QUISHING,
          isQuishing: true,
          selectedRow: { templateType: 'EMAIL' }
        })
      ).toBe(false)
    })

    it('is true for quishing when templateType matches individual printout code', () => {
      expect(
        comp.computed.isQuishingTypeIndividualPrintOut.call({
          type: PREVIEW_DIALOG_TYPES.QUISHING,
          isQuishing: true,
          selectedRow: { templateType: 'Individual' }
        })
      ).toBe(true)
    })
  })

  describe('barrel Lure/Payload preview', () => {
    it('isBarrelPayloadMode is true only when a barrel template is in payload mode', () => {
      expect(
        comp.computed.isBarrelPayloadMode.call({
          isBarrelTemplate: true,
          barrelPreviewMode: 'payload'
        })
      ).toBe(true)
      expect(
        comp.computed.isBarrelPayloadMode.call({
          isBarrelTemplate: true,
          barrelPreviewMode: 'lure'
        })
      ).toBe(false)
      expect(
        comp.computed.isBarrelPayloadMode.call({
          isBarrelTemplate: false,
          barrelPreviewMode: 'payload'
        })
      ).toBe(false)
    })

    it('getEmailPreviewHtml returns payload body in payload mode, lure otherwise', () => {
      const ctx = {
        isBarrelPayloadMode: true,
        emailTemplate: '<p>lure</p>',
        payloadEmailTemplate: '<p>payload</p>'
      }
      expect(comp.computed.getEmailPreviewHtml.call(ctx)).toBe('<p>payload</p>')
      expect(
        comp.computed.getEmailPreviewHtml.call({ ...ctx, isBarrelPayloadMode: false })
      ).toBe('<p>lure</p>')
    })

    it('getPreviewSubject returns the payload subject in payload mode, lure otherwise', () => {
      const ctx = {
        isBarrelPayloadMode: true,
        emailTemplateParams: { subject: 'Lure subject', barrelPayload: { subject: 'Payload subject' } }
      }
      expect(comp.computed.getPreviewSubject.call(ctx)).toBe('Payload subject')
      expect(
        comp.computed.getPreviewSubject.call({ ...ctx, isBarrelPayloadMode: false })
      ).toBe('Lure subject')
    })
  })
})
