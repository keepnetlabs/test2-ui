import SCIMSettings from '@/components/Company Settings/SCIM/SCIMSettings.vue'

describe('SCIMSettings.vue', () => {
  it('has correct component name', () => {
    expect(SCIMSettings.name).toBe('SCIMSettings')
  })

  it('watch route query opens modal and redirects when showModal exists', () => {
    const toggleAddOrEditModal = jest.fn()
    const replace = jest.fn()
    const ctx = {
      toggleAddOrEditModal,
      $router: { replace }
    }

    SCIMSettings.watch['$route.query'].handler.call(ctx, { showModal: true })
    expect(toggleAddOrEditModal).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/company/company-settings')
  })

  it('toggleAddOrEditModal handles open and close branches', () => {
    const ctx = {
      isShowAddOrEditModal: false,
      selectedRow: null,
      isEdit: false,
      setSelectedRowToNull: jest.fn(function () {
        this.selectedRow = null
      })
    }

    SCIMSettings.methods.toggleAddOrEditModal.call(ctx, { resourceId: '1' })
    expect(ctx.isShowAddOrEditModal).toBe(true)
    expect(ctx.selectedRow).toEqual({ resourceId: '1' })
    expect(ctx.isEdit).toBe(true)

    SCIMSettings.methods.toggleAddOrEditModal.call(ctx)
    expect(ctx.isShowAddOrEditModal).toBe(false)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.selectedRow).toBe(null)
  })

  it('toggleDeleteDialog and toggleRevokeDialog reset selected row when closing', () => {
    const ctxDelete = {
      isShowDeleteDialog: false,
      selectedRow: null,
      setSelectedRowToNull: jest.fn(function () {
        this.selectedRow = null
      })
    }

    SCIMSettings.methods.toggleDeleteDialog.call(ctxDelete, { resourceId: 'd1' })
    expect(ctxDelete.isShowDeleteDialog).toBe(true)
    expect(ctxDelete.selectedRow).toEqual({ resourceId: 'd1' })

    SCIMSettings.methods.toggleDeleteDialog.call(ctxDelete)
    expect(ctxDelete.isShowDeleteDialog).toBe(false)
    expect(ctxDelete.selectedRow).toBe(null)

    const ctxRevoke = {
      isShowRevokeDialog: false,
      selectedRow: null,
      setSelectedRowToNull: jest.fn(function () {
        this.selectedRow = null
      })
    }

    SCIMSettings.methods.toggleRevokeDialog.call(ctxRevoke, { resourceId: 'r1' })
    expect(ctxRevoke.isShowRevokeDialog).toBe(true)
    expect(ctxRevoke.selectedRow).toEqual({ resourceId: 'r1' })

    SCIMSettings.methods.toggleRevokeDialog.call(ctxRevoke)
    expect(ctxRevoke.isShowRevokeDialog).toBe(false)
    expect(ctxRevoke.selectedRow).toBe(null)
  })

  it('close/update and success handlers update refs and dialog states', () => {
    const unSelectRow = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      $refs: { refTable: { $refs: { refTable: { unSelectRow } }, callForData } },
      isShowAddOrEditModal: true,
      isShowSuccessDialog: true,
      successApiKey: 'old'
    }

    SCIMSettings.methods.handleCloseWithUpdate.call(ctx, { resourceId: 'x' })
    expect(unSelectRow).toHaveBeenCalledWith({ resourceId: 'x' })
    expect(callForData).toHaveBeenCalledTimes(1)

    ctx.handleCloseWithUpdate = jest.fn()
    SCIMSettings.methods.handleCloseSuccessDialog.call(ctx)
    expect(ctx.successApiKey).toBe('')
    expect(ctx.isShowSuccessDialog).toBe(false)
    expect(ctx.isShowAddOrEditModal).toBe(false)
    expect(ctx.handleCloseWithUpdate).toHaveBeenCalledTimes(1)

    SCIMSettings.methods.handleSuccessCreate.call(ctx, 'k1')
    expect(ctx.successDialogTitle).toBe('Successfully created SCIM Integration')
    expect(ctx.successApiKey).toBe('k1')
    expect(ctx.isShowSuccessDialog).toBe(true)

    SCIMSettings.methods.handleSuccessRevoke.call(ctx, 'k2')
    expect(ctx.successDialogTitle).toBe('Successfully revoked SCIM Integration')
    expect(ctx.successApiKey).toBe('k2')
    expect(ctx.isShowSuccessDialog).toBe(true)
  })

  it('checkIfCanCloseScimAddOrEditModal safely handles both branches', () => {
    const handleClose = jest.fn()
    const withRefCtx = { $refs: { refScimAddOrEditModal: { handleClose } } }
    SCIMSettings.methods.checkIfCanCloseScimAddOrEditModal.call(withRefCtx)
    expect(handleClose).toHaveBeenCalledTimes(1)

    const withoutRefCtx = { $refs: {} }
    expect(() =>
      SCIMSettings.methods.checkIfCanCloseScimAddOrEditModal.call(withoutRefCtx)
    ).not.toThrow()
  })
})
