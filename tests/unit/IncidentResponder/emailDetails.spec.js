import EmailDetails from '@/components/IncidentResponder/emailDetails.vue'

describe('IncidentResponder emailDetails.vue', () => {
  const { methods, computed } = EmailDetails

  it('getKeyValue capitalizes header key', () => {
    expect(methods.getKeyValue({ key: 'subject' })).toBe('Subject')
    expect(methods.getKeyValue({ key: '' })).toBe('')
    expect(methods.getKeyValue({ key: null })).toBe('')
  })

  it('isFileUploaded returns true when no analysis item is uploaded', () => {
    expect(methods.isFileUploaded([{ isSendFile: false }, { isSendFile: false }])).toBe(true)
    expect(methods.isFileUploaded([{ isSendFile: true }, { isSendFile: false }])).toBe(false)
  })

  it('setSecondCollapse removes index and clipboard flags on collapse', () => {
    const ctx = {
      showSecondCollapse: [2],
      isCopiedShaClipboard: [2],
      isCopiedMd5Clipboard: [2]
    }
    const event = { target: { textContent: 'COLLAPSE' } }

    methods.setSecondCollapse.call(ctx, event, 2)

    expect(ctx.showSecondCollapse).toEqual([])
    expect(ctx.isCopiedShaClipboard).toEqual([])
    expect(ctx.isCopiedMd5Clipboard).toEqual([])
  })

  it('setSecondCollapse adds index on details click', () => {
    const ctx = {
      showSecondCollapse: [],
      isCopiedShaClipboard: [],
      isCopiedMd5Clipboard: []
    }
    const event = { target: { textContent: 'DETAILS' } }

    methods.setSecondCollapse.call(ctx, event, 1)

    expect(ctx.showSecondCollapse).toEqual([1])
  })

  it('getMd5Text and getSha512Text return copied text when index exists', () => {
    const ctx = {
      isCopiedMd5Clipboard: [3],
      isCopiedShaClipboard: [4]
    }

    expect(methods.getMd5Text.call(ctx, 3)).toBe('COPIED!')
    expect(methods.getSha512Text.call(ctx, 4)).toBe('COPIED!')
    expect(methods.getMd5Text.call(ctx, 9)).toBe('COPY TO CLIPBOARD')
    expect(methods.getSha512Text.call(ctx, 9)).toBe('COPY TO CLIPBOARD')
  })

  it('handleDownloadAttachment and close handler update state', () => {
    const ctx = {
      selectedAttachment: null,
      downloadAttachmentModalStatus: false
    }
    const attachment = { resourceId: 'att-1' }

    methods.handleDownloadAttachment.call(ctx, attachment)
    expect(ctx.selectedAttachment).toEqual(attachment)
    expect(ctx.downloadAttachmentModalStatus).toBe(true)

    methods.handleCloseDownloadAttachmentModal.call(ctx)
    expect(ctx.selectedAttachment).toBe(null)
    expect(ctx.downloadAttachmentModalStatus).toBe(false)
  })

  it('isMailDetailsHaveAttachments returns attachment count truthiness', () => {
    expect(computed.isMailDetailsHaveAttachments.call({ mailDetails: { attachments: [1, 2] } })).toBe(
      2
    )
    expect(computed.isMailDetailsHaveAttachments.call({ mailDetails: { attachments: [] } })).toBe(
      0
    )
    expect(computed.isMailDetailsHaveAttachments.call({ mailDetails: null })).toBeUndefined()
  })
})
