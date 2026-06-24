// Full-branch tests for the Double Barrel Lure/Payload preview toggle across every
// phishing email-template preview renderer. Each renderer exposes the same trio of
// barrel computeds; we exercise both modes (lure / payload) and the empty-payload edge.
//
// NOTE: displayedSubject / displayedTemplateHtml / displayedEmailTemplate depend on the
// `isBarrelPayloadMode` computed (not the raw flags), so when invoking them via .call(ctx)
// we provide `isBarrelPayloadMode` directly. The isBarrelPayloadMode computed itself is
// covered separately from its raw inputs (isBarrelTemplate + barrelPreviewMode).
jest.mock('@/api/phishingsimulator', () => ({
  getEmailTemplatePreviewContent: jest.fn(),
  getCampaignManagerEmailTemplatePreviewContent: jest.fn(),
  getPhishingScenarioLandingPageAndEmailTemplate: jest.fn(),
  checkRedFlags: jest.fn(),
  checkQuishingRedFlags: jest.fn()
}))

import EmailTemplateMultipleLanguagePreviewDialog from '@/components/Common/Simulator/EmailTemplates/EmailTemplateMultipleLanguagePreviewDialog.vue'
import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog.vue'
import CommonSimulatorPreviewDialog from '@/components/Common/Simulator/CommonSimulatorPreviewDialog.vue'
import CampaignManagerPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenarios.vue'
import CampaignManagerPhishingScenariosPreviewDialog from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosPreviewDialog.vue'
import CampaignManagerReportSummaryEmail from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryEmail.vue'
import PhishingScenarioPreview from '@/components/PhishingScenarios/PhishingScenarioPreview.vue'
import EmailTemplateListPreview from '@/components/workshop/EmailTemplateListPreview.vue'

const LURE_HTML = '<p>lure body</p>'
const PAYLOAD_HTML = '<p>payload {PHISHINGURL}</p>'
const LURE_SUBJECT = 'Lure subject'
const PAYLOAD_SUBJECT = 'Payload subject'
const PAYLOAD = { subject: PAYLOAD_SUBJECT, template: PAYLOAD_HTML }

describe('Barrel preview — isBarrelPayloadMode (shared across renderers)', () => {
  const renderers = [
    ['EmailTemplateMultipleLanguagePreviewDialog', EmailTemplateMultipleLanguagePreviewDialog],
    ['CommonSimulatorEmailTemplatePreviewDialog', CommonSimulatorEmailTemplatePreviewDialog],
    ['CommonSimulatorPreviewDialog', CommonSimulatorPreviewDialog],
    ['CampaignManagerPhishingScenarios', CampaignManagerPhishingScenarios],
    ['CampaignManagerReportSummaryEmail', CampaignManagerReportSummaryEmail],
    ['PhishingScenarioPreview', PhishingScenarioPreview],
    ['EmailTemplateListPreview', EmailTemplateListPreview]
  ]

  it.each(renderers)('%s: true only when barrel AND payload mode', (_name, Comp) => {
    const fn = Comp.computed.isBarrelPayloadMode
    expect(fn.call({ isBarrelTemplate: true, barrelPreviewMode: 'payload' })).toBe(true)
    expect(fn.call({ isBarrelTemplate: true, barrelPreviewMode: 'lure' })).toBe(false)
    expect(fn.call({ isBarrelTemplate: false, barrelPreviewMode: 'payload' })).toBe(false)
    expect(fn.call({ isBarrelTemplate: false, barrelPreviewMode: 'lure' })).toBe(false)
  })
})

describe('Barrel preview — EmailTemplateMultipleLanguagePreviewDialog', () => {
  const C = EmailTemplateMultipleLanguagePreviewDialog.computed
  // Both bodies are stored (mutable) vars so red-flag styling persists per tab.
  const ctx = (payloadMode) => ({
    isBarrelPayloadMode: payloadMode,
    emailTemplateParams: { subject: LURE_SUBJECT, barrelPayload: PAYLOAD },
    templateHTML: LURE_HTML,
    payloadTemplateHTML: PAYLOAD_HTML
  })

  it('displayedSubject switches lure/payload', () => {
    expect(C.displayedSubject.call(ctx(false))).toBe(LURE_SUBJECT)
    expect(C.displayedSubject.call(ctx(true))).toBe(PAYLOAD_SUBJECT)
  })

  it('displayedSubject falls back to empty string when payload subject missing', () => {
    expect(
      C.displayedSubject.call({
        isBarrelPayloadMode: true,
        emailTemplateParams: { subject: LURE_SUBJECT, barrelPayload: {} }
      })
    ).toBe('')
  })

  it('displayedTemplateHtml switches between stored lure/payload bodies', () => {
    expect(C.displayedTemplateHtml.call(ctx(false))).toBe(LURE_HTML)
    expect(C.displayedTemplateHtml.call(ctx(true))).toBe(PAYLOAD_HTML)
  })

  it('redFlagCacheKey encodes language + mode', () => {
    expect(C.redFlagCacheKey.call({ activeLanguage: 'en', barrelPreviewMode: 'lure' })).toBe('en__lure')
    expect(C.redFlagCacheKey.call({ activeLanguage: 'tr', barrelPreviewMode: 'payload' })).toBe(
      'tr__payload'
    )
  })

  it('getActiveBodyHtml / setActiveBodyHtml target the active mode body', () => {
    const get = EmailTemplateMultipleLanguagePreviewDialog.methods.getActiveBodyHtml
    const set = EmailTemplateMultipleLanguagePreviewDialog.methods.setActiveBodyHtml
    const lureCtx = { isBarrelPayloadMode: false, templateHTML: LURE_HTML, payloadTemplateHTML: PAYLOAD_HTML }
    const payloadCtx = { isBarrelPayloadMode: true, templateHTML: LURE_HTML, payloadTemplateHTML: PAYLOAD_HTML }
    expect(get.call(lureCtx)).toBe(LURE_HTML)
    expect(get.call(payloadCtx)).toBe(PAYLOAD_HTML)
    set.call(lureCtx, '<p>new-lure</p>')
    expect(lureCtx.templateHTML).toBe('<p>new-lure</p>')
    expect(lureCtx.payloadTemplateHTML).toBe(PAYLOAD_HTML)
    set.call(payloadCtx, '<p>new-pay</p>')
    expect(payloadCtx.payloadTemplateHTML).toBe('<p>new-pay</p>')
    expect(payloadCtx.templateHTML).toBe(LURE_HTML)
  })
})

describe('Barrel preview — CommonSimulatorEmailTemplatePreviewDialog', () => {
  const C = CommonSimulatorEmailTemplatePreviewDialog.computed
  const ctx = (payloadMode) => ({
    isBarrelPayloadMode: payloadMode,
    emailTemplateParams: { subject: LURE_SUBJECT },
    barrelPayload: PAYLOAD,
    templateHTML: LURE_HTML
  })

  it('displayedSubject switches lure/payload', () => {
    expect(C.displayedSubject.call(ctx(false))).toBe(LURE_SUBJECT)
    expect(C.displayedSubject.call(ctx(true))).toBe(PAYLOAD_SUBJECT)
  })

  it('displayedTemplateHtml switches lure/payload', () => {
    expect(C.displayedTemplateHtml.call(ctx(false))).toBe(LURE_HTML)
    expect(C.displayedTemplateHtml.call(ctx(true))).toBe(PAYLOAD_HTML)
  })

  it('payload mode tolerates empty barrelPayload', () => {
    const c = { isBarrelPayloadMode: true, emailTemplateParams: {}, barrelPayload: {}, templateHTML: LURE_HTML }
    expect(C.displayedSubject.call(c)).toBe('')
    expect(C.displayedTemplateHtml.call(c)).toBe('')
  })
})

describe('Barrel preview — CommonSimulatorPreviewDialog', () => {
  const C = CommonSimulatorPreviewDialog.computed
  // displayedEmailTemplate reads the stored lure/payload body vars (mutable for red-flag styling).
  const ctx = (payloadMode) => ({
    isBarrelPayloadMode: payloadMode,
    emailTemplateParams: { subject: LURE_SUBJECT, barrelPayload: PAYLOAD },
    emailTemplate: LURE_HTML,
    payloadEmailTemplate: PAYLOAD_HTML
  })

  it('displayedSubject switches lure/payload', () => {
    expect(C.displayedSubject.call(ctx(false))).toBe(LURE_SUBJECT)
    expect(C.displayedSubject.call(ctx(true))).toBe(PAYLOAD_SUBJECT)
  })

  it('displayedEmailTemplate switches between stored lure/payload bodies', () => {
    expect(C.displayedEmailTemplate.call(ctx(false))).toBe(LURE_HTML)
    expect(C.displayedEmailTemplate.call(ctx(true))).toBe(PAYLOAD_HTML)
  })

  it('displayedSubject tolerates empty barrelPayload', () => {
    const c = { isBarrelPayloadMode: true, emailTemplateParams: { barrelPayload: {} } }
    expect(C.displayedSubject.call(c)).toBe('')
  })

  it('redFlagCacheKey encodes language + mode', () => {
    expect(C.redFlagCacheKey.call({ languagePreview: 'en', barrelPreviewMode: 'payload' })).toBe(
      'en__payload'
    )
  })

  it('isBarrelPayloadMode computed reads raw flags', () => {
    expect(C.isBarrelPayloadMode.call({ isBarrelTemplate: true, barrelPreviewMode: 'payload' })).toBe(true)
    expect(C.isBarrelPayloadMode.call({ isBarrelTemplate: true, barrelPreviewMode: 'lure' })).toBe(false)
  })
})

describe('Barrel preview — CampaignManagerPhishingScenarios (inline)', () => {
  const C = CampaignManagerPhishingScenarios.computed
  const ctx = (payloadMode) => ({
    isBarrelPayloadMode: payloadMode,
    emailTemplateParams: { subject: LURE_SUBJECT, barrelPayload: PAYLOAD },
    emailTemplate: LURE_HTML
  })

  it('displayedSubject switches lure/payload', () => {
    expect(C.displayedSubject.call(ctx(false))).toBe(LURE_SUBJECT)
    expect(C.displayedSubject.call(ctx(true))).toBe(PAYLOAD_SUBJECT)
  })

  it('displayedEmailTemplate switches lure/payload', () => {
    expect(C.displayedEmailTemplate.call(ctx(false))).toBe(LURE_HTML)
    expect(C.displayedEmailTemplate.call(ctx(true))).toBe(PAYLOAD_HTML)
  })

  it('handles missing emailTemplateParams without throwing (lure mode)', () => {
    const c = { isBarrelPayloadMode: false, emailTemplateParams: null, emailTemplate: LURE_HTML }
    expect(C.displayedSubject.call(c)).toBeUndefined()
    expect(C.displayedEmailTemplate.call(c)).toBe(LURE_HTML)
  })
})

describe('Barrel preview — CampaignManagerReportSummaryEmail', () => {
  const C = CampaignManagerReportSummaryEmail.computed
  const ctx = (payloadMode) => ({
    isBarrelPayloadMode: payloadMode,
    barrelPayload: PAYLOAD,
    emailTemplate: LURE_HTML
  })

  it('displayedEmailTemplate switches lure/payload', () => {
    expect(C.displayedEmailTemplate.call(ctx(false))).toBe(LURE_HTML)
    expect(C.displayedEmailTemplate.call(ctx(true))).toBe(PAYLOAD_HTML)
  })

  it('payload mode tolerates empty barrelPayload', () => {
    expect(
      C.displayedEmailTemplate.call({ isBarrelPayloadMode: true, barrelPayload: {}, emailTemplate: LURE_HTML })
    ).toBe('')
  })
})

describe('Barrel preview — PhishingScenarioPreview', () => {
  const C = PhishingScenarioPreview.computed
  const ctx = (payloadMode) => ({
    isBarrelPayloadMode: payloadMode,
    barrelPayload: PAYLOAD,
    emailTemplateParams: { subject: LURE_SUBJECT },
    emailTemplate: LURE_HTML
  })

  it('displayedSubject switches lure/payload', () => {
    expect(C.displayedSubject.call(ctx(false))).toBe(LURE_SUBJECT)
    expect(C.displayedSubject.call(ctx(true))).toBe(PAYLOAD_SUBJECT)
  })

  it('displayedEmailTemplate switches lure/payload', () => {
    expect(C.displayedEmailTemplate.call(ctx(false))).toBe(LURE_HTML)
    expect(C.displayedEmailTemplate.call(ctx(true))).toBe(PAYLOAD_HTML)
  })
})

describe('Barrel preview — EmailTemplateListPreview (inline, new-scenario step 2)', () => {
  const C = EmailTemplateListPreview.computed
  const ctx = (payloadMode) => ({
    isBarrelPayloadMode: payloadMode,
    templateSubject: LURE_SUBJECT,
    templateHTML: LURE_HTML,
    templateBarrelSubject: PAYLOAD_SUBJECT,
    templateBarrelHTML: PAYLOAD_HTML
  })

  it('displayedSubject switches lure/payload', () => {
    expect(C.displayedSubject.call(ctx(false))).toBe(LURE_SUBJECT)
    expect(C.displayedSubject.call(ctx(true))).toBe(PAYLOAD_SUBJECT)
  })

  it('displayedTemplateHtml switches lure/payload', () => {
    expect(C.displayedTemplateHtml.call(ctx(false))).toBe(LURE_HTML)
    expect(C.displayedTemplateHtml.call(ctx(true))).toBe(PAYLOAD_HTML)
  })
})

describe('Barrel red-flags — mode switch clears overlay (watch barrelPreviewMode)', () => {
  const renderers = [
    ['EmailTemplateMultipleLanguagePreviewDialog', EmailTemplateMultipleLanguagePreviewDialog, 'templateHTML', 'payloadTemplateHTML'],
    ['CommonSimulatorPreviewDialog', CommonSimulatorPreviewDialog, 'emailTemplate', 'payloadEmailTemplate']
  ]

  it.each(renderers)('%s: resets flags + cleans both bodies when active', (_n, Comp, lureKey, payKey) => {
    const remove = jest.fn((h) => h.replace('FLAG', ''))
    const ctx = {
      isShowRedFlags: true,
      isFlaggedStylesEnabled: true,
      redFlags: { subject: {} },
      [lureKey]: 'lureFLAG',
      [payKey]: 'payFLAG',
      _removeFlaggedStylesFromTemplate: remove
    }
    Comp.watch.barrelPreviewMode.call(ctx)
    expect(ctx.isShowRedFlags).toBe(false)
    expect(ctx.isFlaggedStylesEnabled).toBe(false)
    expect(ctx[lureKey]).toBe('lure')
    expect(ctx[payKey]).toBe('pay')
  })

  it.each(renderers)('%s: no-op when red flags already off', (_n, Comp) => {
    const remove = jest.fn()
    Comp.watch.barrelPreviewMode.call({ isShowRedFlags: false, _removeFlaggedStylesFromTemplate: remove })
    expect(remove).not.toHaveBeenCalled()
  })
})

describe('Barrel red-flags — CommonSimulatorPreviewDialog active-body helpers', () => {
  const get = CommonSimulatorPreviewDialog.methods.getActiveBodyHtml
  const set = CommonSimulatorPreviewDialog.methods.setActiveBodyHtml

  it('reads/writes the active mode body', () => {
    const lureCtx = { isBarrelPayloadMode: false, emailTemplate: LURE_HTML, payloadEmailTemplate: PAYLOAD_HTML }
    const payCtx = { isBarrelPayloadMode: true, emailTemplate: LURE_HTML, payloadEmailTemplate: PAYLOAD_HTML }
    expect(get.call(lureCtx)).toBe(LURE_HTML)
    expect(get.call(payCtx)).toBe(PAYLOAD_HTML)
    set.call(payCtx, '<p>styled-pay</p>')
    expect(payCtx.payloadEmailTemplate).toBe('<p>styled-pay</p>')
    expect(payCtx.emailTemplate).toBe(LURE_HTML)
  })
})

describe('Barrel preview — CampaignManagerPhishingScenariosPreviewDialog (prop-fed)', () => {
  const C = CampaignManagerPhishingScenariosPreviewDialog.computed
  const withPayload = { barrelPayload: PAYLOAD }

  it('isBarrelTemplate true only on email tab with payload content', () => {
    expect(C.isBarrelTemplate.call({ tab: 'email', emailTemplateParams: withPayload })).toBe(true)
    expect(C.isBarrelTemplate.call({ tab: 'individual-printout', emailTemplateParams: withPayload })).toBe(true)
    expect(C.isBarrelTemplate.call({ tab: 'landing-page', emailTemplateParams: withPayload })).toBe(false)
    expect(C.isBarrelTemplate.call({ tab: 'email', emailTemplateParams: { barrelPayload: {} } })).toBe(false)
    expect(C.isBarrelTemplate.call({ tab: 'email', emailTemplateParams: {} })).toBe(false)
  })

  it('isBarrelPayloadMode reads isBarrelTemplate + barrelPreviewMode', () => {
    expect(C.isBarrelPayloadMode.call({ isBarrelTemplate: true, barrelPreviewMode: 'payload' })).toBe(true)
    expect(C.isBarrelPayloadMode.call({ isBarrelTemplate: true, barrelPreviewMode: 'lure' })).toBe(false)
    expect(C.isBarrelPayloadMode.call({ isBarrelTemplate: false, barrelPreviewMode: 'payload' })).toBe(false)
  })

  it('getTemplatePreviewContent returns payload html in payload mode, lure otherwise', () => {
    const base = {
      tab: 'email',
      emailTemplate: LURE_HTML,
      emailTemplateParams: withPayload,
      getCurrentLandingPageTemplate: '<p>lp</p>'
    }
    expect(C.getTemplatePreviewContent.call({ ...base, isBarrelPayloadMode: false })).toBe(LURE_HTML)
    expect(C.getTemplatePreviewContent.call({ ...base, isBarrelPayloadMode: true })).toBe(PAYLOAD_HTML)
    expect(
      C.getTemplatePreviewContent.call({ ...base, tab: 'landing-page', isBarrelPayloadMode: true })
    ).toBe('<p>lp</p>')
  })
})
