// Barrel branches in createCommonFormDataForPhishingTemplate (exercised through the exported
// createPhishingEmailTemplate). The nested barrelPayload must be appended explicitly (never as
// [object Object]) and ONLY for the Barrel category, for both primary and additional languages.
jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  patch: jest.fn().mockResolvedValue({})
}))
jest.mock('axios', () => ({ post: jest.fn().mockResolvedValue({}) }))
jest.mock('@/services/authentication', () => ({ getToken: jest.fn().mockReturnValue('mock-token') }))

import testRequest from '@/utils/testRequest'
import * as phishingApi from '@/api/phishingsimulator'

const BARREL = 'BrLr4x7Km2Nw'
const CLICK_ONLY = 'WNZt0sCVCWB3'

const lang = (over = {}) => ({
  fromName: 'From',
  fromAddress: 'from@example.com',
  subject: 'Lure subject',
  template: '<p>lure</p>',
  ccAddresses: [],
  languageTypeResourceId: 'en',
  prompt: '',
  toneResourceId: '',
  localizationResourceId: '',
  ...over
})

const payload = (over = {}) => ({
  name: 'T',
  description: '',
  categoryResourceId: BARREL,
  difficultyResourceId: 'd1',
  availableForRequests: [],
  isAttachmentBasedTemplate: false,
  languages: [lang()],
  ...over
})

const lastFormData = () => testRequest.post.mock.calls[0][1]

describe('Barrel FormData — createCommonFormDataForPhishingTemplate', () => {
  beforeEach(() => jest.clearAllMocks())

  it('appends primary-language barrelPayload for the Barrel category', async () => {
    await phishingApi.createPhishingEmailTemplate(
      payload({
        languages: [lang({ barrelPayload: { subject: 'PS', template: '<p>pay {PHISHINGURL}</p>' } })]
      })
    )
    const fd = lastFormData()
    expect(fd.get('barrelPayload.subject')).toBe('PS')
    expect(fd.get('barrelPayload.template')).toBe('<p>pay {PHISHINGURL}</p>')
  })

  it('appends additional-language barrelPayload under languages[i-1]', async () => {
    await phishingApi.createPhishingEmailTemplate(
      payload({
        languages: [
          lang({ barrelPayload: { subject: 'PS-en', template: '<p>en</p>' } }),
          lang({
            languageTypeResourceId: 'tr',
            barrelPayload: { subject: 'PS-tr', template: '<p>tr</p>' }
          })
        ]
      })
    )
    const fd = lastFormData()
    expect(fd.get('barrelPayload.subject')).toBe('PS-en')
    expect(fd.get('languages[0].barrelPayload.subject')).toBe('PS-tr')
    expect(fd.get('languages[0].barrelPayload.template')).toBe('<p>tr</p>')
    // must NOT be serialized as [object Object]
    expect(fd.get('languages[0].barrelPayload')).toBeNull()
  })

  it('does NOT append barrelPayload for a non-barrel category (even if present in payload)', async () => {
    await phishingApi.createPhishingEmailTemplate(
      payload({
        categoryResourceId: CLICK_ONLY,
        languages: [
          lang({ barrelPayload: { subject: 'PS-en', template: '<p>en</p>' } }),
          lang({
            languageTypeResourceId: 'tr',
            barrelPayload: { subject: 'PS-tr', template: '<p>tr</p>' }
          })
        ]
      })
    )
    const fd = lastFormData()
    expect(fd.get('barrelPayload.subject')).toBeNull()
    expect(fd.get('languages[0].barrelPayload.subject')).toBeNull()
    // and never as [object Object]
    expect(fd.get('languages[0].barrelPayload')).toBeNull()
  })

  it('skips primary barrelPayload when the Barrel template has no payload object', async () => {
    await phishingApi.createPhishingEmailTemplate(payload({ languages: [lang()] }))
    const fd = lastFormData()
    expect(fd.get('barrelPayload.subject')).toBeNull()
    expect(fd.get('barrelPayload.template')).toBeNull()
  })

  it('appends empty strings when barrel payload fields are missing', async () => {
    await phishingApi.createPhishingEmailTemplate(
      payload({ languages: [lang({ barrelPayload: {} })] })
    )
    const fd = lastFormData()
    expect(fd.get('barrelPayload.subject')).toBe('')
    expect(fd.get('barrelPayload.template')).toBe('')
  })

  describe('barrel payload attachments', () => {
    const phishingFile = () =>
      new File(['x'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    const decoyFile = () =>
      new File(['y'], 'test_word.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })

    it('appends the primary-language payload phishing file + type/name and the decoy attachment', async () => {
      await phishingApi.createPhishingEmailTemplate(
        payload({
          languages: [
            lang({
              barrelPayload: {
                subject: 'PS',
                template: '<p>pay {PHISHINGURL}</p>',
                attachmentFiles: [phishingFile()],
                importedEmailAttachments: [decoyFile()],
                isAddedNewPhishingFile: true,
                phishingFileName: 'test.xlsx'
              }
            })
          ]
        })
      )
      const fd = lastFormData()
      const sentPhishing = fd.get('barrelPayload.phishingFile')
      const sentAttachment = fd.get('barrelPayload.attachmentFiles')
      expect(sentPhishing).toBeInstanceOf(File)
      expect(sentPhishing.name).toBe('test.xlsx')
      expect(fd.get('barrelPayload.phishingFileType')).toBe('xlsx')
      expect(fd.get('barrelPayload.phishingFileName')).toBe('test.xlsx')
      expect(sentAttachment).toBeInstanceOf(File)
      expect(sentAttachment.name).toBe('test_word.docx')
    })

    it('appends additional-language payload attachment fields under languages[i-1]', async () => {
      await phishingApi.createPhishingEmailTemplate(
        payload({
          languages: [
            lang({ barrelPayload: { subject: 'PS-en', template: '<p>en</p>' } }),
            lang({
              languageTypeResourceId: 'tr',
              barrelPayload: {
                subject: 'PS-tr',
                template: '<p>tr</p>',
                attachmentFiles: [phishingFile()],
                isAddedNewPhishingFile: true,
                phishingFileName: 'test.xlsx'
              }
            })
          ]
        })
      )
      const fd = lastFormData()
      expect(fd.get('languages[0].barrelPayload.phishingFile')).toBeInstanceOf(File)
      expect(fd.get('languages[0].barrelPayload.phishingFileType')).toBe('xlsx')
      expect(fd.get('languages[0].barrelPayload.phishingFileName')).toBe('test.xlsx')
    })

    it('does NOT append attachment fields when the payload has no attachment data', async () => {
      await phishingApi.createPhishingEmailTemplate(
        payload({
          languages: [lang({ barrelPayload: { subject: 'PS', template: '<p>pay</p>' } })]
        })
      )
      const fd = lastFormData()
      // subject/template still present, but no attachment keys are added
      expect(fd.get('barrelPayload.subject')).toBe('PS')
      expect(fd.get('barrelPayload.phishingFile')).toBeNull()
      expect(fd.get('barrelPayload.phishingFileName')).toBeNull()
      expect(fd.get('barrelPayload.attachmentFiles')).toBeNull()
    })

    it('sends a null phishing file when present-from-API but not newly added (isAddedNewPhishingFile false)', async () => {
      await phishingApi.createPhishingEmailTemplate(
        payload({
          languages: [
            lang({
              barrelPayload: {
                subject: 'PS',
                template: '<p>pay</p>',
                attachmentFiles: [{ fileName: 'test.xlsx', url: 'http://x/test.xlsx' }],
                isAddedNewPhishingFile: false,
                phishingFileName: 'test.xlsx'
              }
            })
          ]
        })
      )
      const fd = lastFormData()
      // not a File (kept as-is on backend); name/type still sent so backend keeps the reference
      expect(fd.get('barrelPayload.phishingFile')).toBe('null')
      expect(fd.get('barrelPayload.phishingFileName')).toBe('test.xlsx')
      expect(fd.get('barrelPayload.phishingFileType')).toBe('xlsx')
    })

    it('does NOT append payload attachment fields for a non-barrel category', async () => {
      await phishingApi.createPhishingEmailTemplate(
        payload({
          categoryResourceId: CLICK_ONLY,
          languages: [
            lang({
              barrelPayload: {
                subject: 'PS',
                template: '<p>pay</p>',
                attachmentFiles: [phishingFile()],
                isAddedNewPhishingFile: true,
                phishingFileName: 'test.xlsx'
              }
            })
          ]
        })
      )
      const fd = lastFormData()
      expect(fd.get('barrelPayload.phishingFile')).toBeNull()
      expect(fd.get('barrelPayload.attachmentFiles')).toBeNull()
    })
  })
})
