// Double Barrel payload attachments: the payload editor carries its own per-language
// attachment state (mirroring the lure — attachmentFiles[0] is the tracked phishing file,
// importedEmailAttachments are decoys). These cover the factory, the API->model mapper,
// and the payload-scoped attachment handlers.
jest.mock('@/utils/functions', () => ({
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  FLAGGED_AREA_CSS: '',
  cancellableAxiosRequest: jest.fn((fn) => fn),
  createRandomCryptStringNumber: jest.fn(() => 'rnd'),
  getDefaultAxiosPayload: jest.fn((payload = {}) => ({ ...payload }))
}))
jest.mock('@/api/file', () => ({ parseEmailOrMessageFile: jest.fn() }))

import NewEmailTemplates from '@/components/PhishingScenarios/NewEmailTemplates.vue'

const { emptyBarrelPayload, barrelPayloadFromApi } = NewEmailTemplates.methods
const {
  setBarrelPayloadAttachmentFile,
  handleBarrelPayloadDeleteAttachment,
  handleBarrelPayloadAttachmentRemove
} = NewEmailTemplates.methods

describe('emptyBarrelPayload', () => {
  it('returns a shape-complete payload with attachment arrays and flags', () => {
    const bp = emptyBarrelPayload()
    expect(bp).toEqual({
      subject: '',
      template: '',
      attachmentFiles: [],
      importedEmailAttachments: [],
      attachmentFilesFromApi: [],
      isPhishingFileModified: false,
      isAddedNewPhishingFile: false,
      phishingFileName: ''
    })
  })

  it('applies overrides', () => {
    const bp = emptyBarrelPayload({ subject: 'S', template: 'T' })
    expect(bp.subject).toBe('S')
    expect(bp.template).toBe('T')
    expect(bp.attachmentFiles).toEqual([])
  })
})

describe('barrelPayloadFromApi', () => {
  it('restores the phishing file into attachmentFiles[0] and decoys into importedEmailAttachments', () => {
    const bp = barrelPayloadFromApi.call(
      { emptyBarrelPayload },
      {
        subject: 'Pay subject',
        template: '<p>pay</p>',
        phishingFileName: 'test.xlsx',
        phishingFileUrl: 'http://x/test.xlsx',
        attachments: [{ resourceId: 'a1', fileName: 'test_word.docx', url: 'http://x/d.docx' }]
      }
    )
    expect(bp.subject).toBe('Pay subject')
    expect(bp.template).toBe('<p>pay</p>')
    expect(bp.phishingFileName).toBe('test.xlsx')
    expect(bp.attachmentFiles).toEqual([{ fileName: 'test.xlsx', url: 'http://x/test.xlsx' }])
    expect(bp.importedEmailAttachments).toEqual([
      { resourceId: 'a1', fileName: 'test_word.docx', url: 'http://x/d.docx', isDeletable: true }
    ])
    expect(bp.attachmentFilesFromApi).toHaveLength(1)
  })

  it('handles an empty/undefined api payload without throwing', () => {
    const bp = barrelPayloadFromApi.call({ emptyBarrelPayload }, undefined)
    expect(bp.attachmentFiles).toEqual([])
    expect(bp.importedEmailAttachments).toEqual([])
    expect(bp.phishingFileName).toBe('')
  })
})

describe('payload attachment handlers (scoped to the active barrel payload)', () => {
  it('setBarrelPayloadAttachmentFile stores the file and flags it as a new phishing file', () => {
    const bp = { attachmentFiles: [], isPhishingFileModified: false, isAddedNewPhishingFile: false }
    const file = { name: 'test.xlsx' }
    setBarrelPayloadAttachmentFile.call({ getSelectedBarrelPayload: bp }, file)
    expect(bp.attachmentFiles).toEqual([file])
    expect(bp.isPhishingFileModified).toBe(true)
    expect(bp.isAddedNewPhishingFile).toBe(true)
  })

  it('setBarrelPayloadAttachmentFile accepts an array and drops empties', () => {
    const bp = { attachmentFiles: [] }
    setBarrelPayloadAttachmentFile.call({ getSelectedBarrelPayload: bp }, [null, { name: 'a.docx' }])
    expect(bp.attachmentFiles).toEqual([{ name: 'a.docx' }])
  })

  it('handleBarrelPayloadDeleteAttachment clears the phishing file and the new-file flag', () => {
    const bp = { attachmentFiles: [{ name: 'x' }], isAddedNewPhishingFile: true }
    handleBarrelPayloadDeleteAttachment.call({ getSelectedBarrelPayload: bp })
    expect(bp.attachmentFiles).toEqual([])
    expect(bp.isAddedNewPhishingFile).toBe(false)
  })

  it('handleBarrelPayloadAttachmentRemove removes the matching file by name from both lists', () => {
    const bp = {
      attachmentFiles: [{ fileName: 'test.xlsx' }],
      importedEmailAttachments: [{ fileName: 'test_word.docx' }],
      isAddedNewPhishingFile: true
    }
    handleBarrelPayloadAttachmentRemove.call(
      { getSelectedBarrelPayload: bp },
      { item: { fileName: 'test.xlsx' } }
    )
    expect(bp.attachmentFiles).toEqual([])
    expect(bp.importedEmailAttachments).toEqual([{ fileName: 'test_word.docx' }])
    expect(bp.isAddedNewPhishingFile).toBe(false)
  })

  it('handlers no-op safely when there is no active payload', () => {
    expect(() =>
      setBarrelPayloadAttachmentFile.call({ getSelectedBarrelPayload: null }, { name: 'x' })
    ).not.toThrow()
    expect(() =>
      handleBarrelPayloadAttachmentRemove.call({ getSelectedBarrelPayload: null }, { item: {} })
    ).not.toThrow()
  })
})
