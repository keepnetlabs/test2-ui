import Certificates from '@/views/Certificates.vue'

describe('Certificates.vue', () => {
  it('toggleShowNewCertificateModal toggles state and resets selectedRow on close', () => {
    const ctx = {
      isShowNewCertificateModal: true,
      selectedRow: { id: 1 },
      isDuplicate: true
    }
    Certificates.methods.toggleShowNewCertificateModal.call(ctx)
    expect(ctx.isShowNewCertificateModal).toBe(false)
    expect(ctx.selectedRow).toBeNull()
    expect(ctx.isDuplicate).toBe(false)
  })

  it('toggleShowPreviewModal toggles and resets selectedRow', () => {
    const ctx = {
      isShowPreviewCertificateDialog: true,
      selectedRow: { id: 1 }
    }
    Certificates.methods.toggleShowPreviewModal.call(ctx)
    expect(ctx.isShowPreviewCertificateDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('handleEditRowClick sets selectedRow, isEdit and calls toggleShowNewCertificateModal', () => {
    const toggleShowNewCertificateModal = jest.fn()
    const ctx = {
      selectedRow: null,
      isEdit: false,
      isShowNewCertificateModal: false,
      toggleShowNewCertificateModal
    }
    const row = { id: 1 }
    Certificates.methods.handleEditRowClick.call(ctx, row)
    expect(ctx.selectedRow).toEqual(row)
    expect(ctx.isEdit).toBe(true)
    expect(toggleShowNewCertificateModal).toHaveBeenCalled()
  })

  it('handleDeleteRowClick sets selectedRow and calls toggleShowDeleteCertificatesDialog', () => {
    const toggleShowDeleteCertificatesDialog = jest.fn()
    const ctx = {
      selectedRow: null,
      isShowDeleteCertificateDialog: false,
      toggleShowDeleteCertificatesDialog
    }
    const row = { id: 1 }
    Certificates.methods.handleDeleteRowClick.call(ctx, row)
    expect(ctx.selectedRow).toEqual(row)
    expect(toggleShowDeleteCertificatesDialog).toHaveBeenCalled()
  })

  it('handleDuplicateRowClick sets selectedRow, isDuplicate and calls toggleShowNewCertificateModal', () => {
    const toggleShowNewCertificateModal = jest.fn()
    const ctx = {
      selectedRow: null,
      isDuplicate: false,
      isShowNewCertificateModal: false,
      toggleShowNewCertificateModal
    }
    const row = { id: 1 }
    Certificates.methods.handleDuplicateRowClick.call(ctx, row)
    expect(ctx.selectedRow).toEqual(row)
    expect(ctx.isDuplicate).toBe(true)
    expect(toggleShowNewCertificateModal).toHaveBeenCalled()
  })
})
