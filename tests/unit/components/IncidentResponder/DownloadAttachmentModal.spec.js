jest.mock('@/api/notifiedEmail', () => ({
  downloadAttachment: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

const createObjectURL = jest.fn(() => 'blob:mock-url')

beforeAll(() => {
  globalThis.URL = { createObjectURL }
})

afterAll(() => {
  delete globalThis.URL
})

import DownloadAttachmentModal from '@/components/IncidentResponder/DownloadAttachmentModal.vue'

describe('DownloadAttachmentModal.vue', () => {
  it('data returns zipPassword and validations', () => {
    const data = DownloadAttachmentModal.data()
    expect(data.zipPassword).toBe('infected')
    expect(data.validations.required).toBeDefined()
  })

  it('handleDownload calls downloadAttachment with payload', async () => {
    const downloadAttachment = require('@/api/notifiedEmail').downloadAttachment
    const ctx = {
      id: 'att1',
      zipPassword: 'pass123',
      attachment: { name: 'file.zip' },
      $emit: jest.fn()
    }
    await DownloadAttachmentModal.methods.handleDownload.call(ctx)
    expect(downloadAttachment).toHaveBeenCalledWith({
      resourceId: 'att1',
      zipPassword: 'pass123'
    })
  })
})
