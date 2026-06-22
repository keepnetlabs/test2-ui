// Full-branch tests for the Double Barrel payload-attachment display across every preview
// renderer. In Payload mode each renderer must surface the PAYLOAD's own attachment
// (barrelPayload.phishingFileName); in Lure mode it must surface the unchanged lure
// attachment exactly as before. We exercise both modes plus the empty/missing edge so the
// non-barrel (lure) path is provably untouched.
//
// NOTE: every attachment computed depends on the `isBarrelPayloadMode` computed (not the
// raw flags), so when invoking via .call(ctx) we provide `isBarrelPayloadMode` directly.
// isBarrelPayloadMode itself is covered from its raw inputs in barrelPreviewToggle.spec.js.
jest.mock('@/api/phishingsimulator', () => ({
  getEmailTemplatePreviewContent: jest.fn(),
  getCampaignManagerEmailTemplatePreviewContent: jest.fn(),
  getPhishingScenarioLandingPageAndEmailTemplate: jest.fn(),
  checkRedFlags: jest.fn(),
  checkQuishingRedFlags: jest.fn()
}))

import CommonCampaignManagerPreviewDialog from '@/components/Common/CampaignManager/CommonCampaignManagerPreviewDialog.vue'
import CommonSimulatorPreviewDialog from '@/components/Common/Simulator/CommonSimulatorPreviewDialog.vue'
import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog.vue'
import EmailTemplateMultipleLanguagePreviewDialog from '@/components/Common/Simulator/EmailTemplates/EmailTemplateMultipleLanguagePreviewDialog.vue'
import CampaignManagerPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenarios.vue'
import PhishingScenarioPreview from '@/components/PhishingScenarios/PhishingScenarioPreview.vue'
import EmailTemplateListPreview from '@/components/workshop/EmailTemplateListPreview.vue'

const LURE_FILE = 'lure-invoice.html'
const PAYLOAD_FILE = 'payload-statement.docx'
const LURE_ATTACHMENT = { name: LURE_FILE }

describe('Barrel payload attachment — CommonCampaignManagerPreviewDialog.getPreviewAttachment', () => {
  const C = CommonCampaignManagerPreviewDialog.computed.getPreviewAttachment

  it('lure mode returns the lure attachment unchanged', () => {
    expect(
      C.call({
        isBarrelPayloadMode: false,
        emailTemplateParams: { attachment: LURE_ATTACHMENT, barrelPayload: { phishingFileName: PAYLOAD_FILE } }
      })
    ).toBe(LURE_ATTACHMENT)
  })

  it('payload mode returns the payload attachment', () => {
    expect(
      C.call({
        isBarrelPayloadMode: true,
        emailTemplateParams: { attachment: LURE_ATTACHMENT, barrelPayload: { phishingFileName: PAYLOAD_FILE } }
      })
    ).toEqual({ name: PAYLOAD_FILE })
  })

  it('payload mode returns null when the payload has no attachment', () => {
    expect(
      C.call({ isBarrelPayloadMode: true, emailTemplateParams: { attachment: LURE_ATTACHMENT, barrelPayload: {} } })
    ).toBe(null)
  })
})

describe('Barrel payload attachment — CommonSimulatorPreviewDialog.displayedAttachment', () => {
  const C = CommonSimulatorPreviewDialog.computed.displayedAttachment

  it('lure mode returns the lure attachment unchanged', () => {
    expect(
      C.call({
        isBarrelPayloadMode: false,
        emailTemplateParams: { attachment: LURE_ATTACHMENT, barrelPayload: { phishingFileName: PAYLOAD_FILE } }
      })
    ).toBe(LURE_ATTACHMENT)
  })

  it('payload mode returns the payload attachment', () => {
    expect(
      C.call({
        isBarrelPayloadMode: true,
        emailTemplateParams: { attachment: LURE_ATTACHMENT, barrelPayload: { phishingFileName: PAYLOAD_FILE } }
      })
    ).toEqual({ name: PAYLOAD_FILE })
  })

  it('payload mode returns null when payload attachment missing (and barrelPayload undefined)', () => {
    expect(C.call({ isBarrelPayloadMode: true, emailTemplateParams: {} })).toBe(null)
  })
})

describe('Barrel payload attachment — CommonSimulatorEmailTemplatePreviewDialog.displayedAttachment', () => {
  const C = CommonSimulatorEmailTemplatePreviewDialog.computed.displayedAttachment

  it('lure mode returns the lure attachment unchanged', () => {
    expect(
      C.call({
        isBarrelPayloadMode: false,
        emailTemplateParams: { attachment: LURE_ATTACHMENT },
        barrelPayload: { phishingFileName: PAYLOAD_FILE }
      })
    ).toBe(LURE_ATTACHMENT)
  })

  it('payload mode returns the payload attachment (reads barrelPayload data prop)', () => {
    expect(
      C.call({
        isBarrelPayloadMode: true,
        emailTemplateParams: { attachment: LURE_ATTACHMENT },
        barrelPayload: { phishingFileName: PAYLOAD_FILE }
      })
    ).toEqual({ name: PAYLOAD_FILE })
  })

  it('payload mode returns null when payload attachment missing', () => {
    expect(
      C.call({ isBarrelPayloadMode: true, emailTemplateParams: { attachment: LURE_ATTACHMENT }, barrelPayload: {} })
    ).toBe(null)
  })
})

describe('Barrel payload attachment — EmailTemplateMultipleLanguagePreviewDialog.displayedAttachment', () => {
  const C = EmailTemplateMultipleLanguagePreviewDialog.computed.displayedAttachment

  it('lure mode returns the lure attachment unchanged', () => {
    expect(
      C.call({
        isBarrelPayloadMode: false,
        emailTemplateParams: { attachment: LURE_ATTACHMENT, barrelPayload: { phishingFileName: PAYLOAD_FILE } }
      })
    ).toBe(LURE_ATTACHMENT)
  })

  it('payload mode returns the payload attachment', () => {
    expect(
      C.call({
        isBarrelPayloadMode: true,
        emailTemplateParams: { attachment: LURE_ATTACHMENT, barrelPayload: { phishingFileName: PAYLOAD_FILE } }
      })
    ).toEqual({ name: PAYLOAD_FILE })
  })

  it('payload mode returns null when the payload has no attachment', () => {
    expect(
      C.call({ isBarrelPayloadMode: true, emailTemplateParams: { barrelPayload: {} } })
    ).toBe(null)
  })
})

describe('Barrel payload attachment — CampaignManagerPhishingScenarios.getPhishingFile (inline)', () => {
  const C = CampaignManagerPhishingScenarios.computed.getPhishingFile

  it('lure mode returns the lure phishing file', () => {
    expect(
      C.call({
        isBarrelPayloadMode: false,
        emailTemplateParams: { phishingFileName: LURE_FILE, barrelPayload: { phishingFileName: PAYLOAD_FILE } }
      })
    ).toEqual({ name: LURE_FILE })
  })

  it('payload mode returns the payload phishing file', () => {
    expect(
      C.call({
        isBarrelPayloadMode: true,
        emailTemplateParams: { phishingFileName: LURE_FILE, barrelPayload: { phishingFileName: PAYLOAD_FILE } }
      })
    ).toEqual({ name: PAYLOAD_FILE })
  })

  it('returns null when the active mode has no phishing file', () => {
    expect(C.call({ isBarrelPayloadMode: true, emailTemplateParams: { phishingFileName: LURE_FILE, barrelPayload: {} } })).toBe(
      null
    )
    expect(C.call({ isBarrelPayloadMode: false, emailTemplateParams: {} })).toBe(null)
  })
})

describe('Barrel payload attachment — PhishingScenarioPreview.displayedAttachment', () => {
  const C = PhishingScenarioPreview.computed.displayedAttachment

  it('lure mode returns the lure attachment unchanged', () => {
    expect(
      C.call({
        isBarrelPayloadMode: false,
        barrelPayload: { phishingFileName: PAYLOAD_FILE },
        emailTemplateParams: { attachment: LURE_ATTACHMENT }
      })
    ).toBe(LURE_ATTACHMENT)
  })

  it('payload mode returns the payload attachment (reads barrelPayload data prop)', () => {
    expect(
      C.call({
        isBarrelPayloadMode: true,
        barrelPayload: { phishingFileName: PAYLOAD_FILE },
        emailTemplateParams: { attachment: LURE_ATTACHMENT }
      })
    ).toEqual({ name: PAYLOAD_FILE })
  })

  it('payload mode returns null when the payload has no attachment', () => {
    expect(C.call({ isBarrelPayloadMode: true, barrelPayload: {}, emailTemplateParams: { attachment: LURE_ATTACHMENT } })).toBe(
      null
    )
  })
})

describe('Barrel payload attachment — EmailTemplateListPreview.displayedPhishingFile (workshop)', () => {
  const C = EmailTemplateListPreview.computed.displayedPhishingFile
  const LURE_LIST = [{ name: LURE_FILE }]

  it('lure mode returns the lure phishing file list unchanged', () => {
    expect(
      C.call({ isBarrelPayloadMode: false, phishingFile: LURE_LIST, templateBarrelPhishingFileName: PAYLOAD_FILE })
    ).toBe(LURE_LIST)
  })

  it('payload mode returns a single-item list with the payload file name', () => {
    expect(
      C.call({ isBarrelPayloadMode: true, phishingFile: LURE_LIST, templateBarrelPhishingFileName: PAYLOAD_FILE })
    ).toEqual([{ name: PAYLOAD_FILE }])
  })

  it('payload mode returns an empty list when the payload has no attachment', () => {
    expect(C.call({ isBarrelPayloadMode: true, phishingFile: LURE_LIST, templateBarrelPhishingFileName: '' })).toEqual([])
  })
})
