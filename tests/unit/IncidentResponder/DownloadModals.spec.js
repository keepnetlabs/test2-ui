jest.mock('@/api/notifiedEmail', () => ({
  downloadAttachment: jest.fn(),
  downloadMsgFiles: jest.fn()
}))

import DownloadAttachmentModal from '@/components/IncidentResponder/DownloadAttachmentModal.vue'
import DownloadModal from '@/components/IncidentResponder/DownloadModal.vue'
import { downloadAttachment, downloadMsgFiles } from '@/api/notifiedEmail'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('IncidentResponder download modals', () => {
  let createElementSpy
  let createObjectURLSpy
  let link

  beforeEach(() => {
    jest.clearAllMocks()
    link = { click: jest.fn(), href: '', download: '' }
    createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    createObjectURLSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock-url')
  })

  afterEach(() => {
    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('DownloadAttachmentModal.handleDownload downloads zip and closes modal', async () => {
    downloadAttachment.mockResolvedValueOnce({ data: new Blob(['zip']) })
    const emit = jest.fn()
    const ctx = {
      id: 'att-1',
      zipPassword: 'infected',
      attachment: { name: 'invoice.pdf' },
      $emit: emit
    }

    DownloadAttachmentModal.methods.handleDownload.call(ctx)
    await flushPromises()

    expect(downloadAttachment).toHaveBeenCalledWith({
      resourceId: 'att-1',
      zipPassword: 'infected'
    })
    expect(link.download).toBe('attachment-invoice.pdf.zip')
    expect(link.click).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('changeDownloadModalStatus', false)
  })

  it('DownloadModal.handleDownload downloads mail zip and closes modal', async () => {
    downloadMsgFiles.mockResolvedValueOnce({ data: new Blob(['zip']) })
    const emit = jest.fn()
    const ctx = {
      id: 'mail-1',
      zipPassword: 'infected',
      $emit: emit
    }

    DownloadModal.methods.handleDownload.call(ctx)
    await flushPromises()

    expect(downloadMsgFiles).toHaveBeenCalledWith({
      resourceId: 'mail-1',
      zipPassword: 'infected'
    })
    expect(link.download).toBe('mail-mail-1.zip')
    expect(link.click).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('changeDownloadModalStatus', false)
  })

  it('does not create link when response data is not Blob', async () => {
    downloadMsgFiles.mockResolvedValueOnce({ data: 'invalid' })
    const emit = jest.fn()
    const ctx = {
      id: 'mail-2',
      zipPassword: 'infected',
      $emit: emit
    }

    DownloadModal.methods.handleDownload.call(ctx)
    await flushPromises()

    expect(link.click).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })
})
