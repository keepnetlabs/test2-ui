import LDAPScheduledSyncs from '@/components/Company Settings/LDAP/LDAPScheduledSyncs.vue'

describe('LDAPScheduledSyncs.vue', () => {
  it('has correct component name', () => {
    expect(LDAPScheduledSyncs.name).toBe('LDAPScheduledSyncs')
  })

  it('toggleImportLDAPModal toggles modal and sets selected row', () => {
    const row = { resourceId: 'r1' }
    const ctx = { selectedRow: {}, isShowImportLDAPModal: false }
    LDAPScheduledSyncs.methods.toggleImportLDAPModal.call(ctx, row)
    expect(ctx.selectedRow).toBe(row)
    expect(ctx.isShowImportLDAPModal).toBe(true)
  })

  it('toggleDeleteDialog toggles delete dialog and sets selected row', () => {
    const row = { resourceId: 'r2' }
    const ctx = { selectedRow: {}, isShowDeleteDialog: false }
    LDAPScheduledSyncs.methods.toggleDeleteDialog.call(ctx, row)
    expect(ctx.selectedRow).toBe(row)
    expect(ctx.isShowDeleteDialog).toBe(true)
  })

  it('handleUpdateTable refreshes table and closes dialog', () => {
    const selectedRow = { resourceId: 'r3' }
    const ctx = {
      selectedRow,
      $refs: { refTable: { unSelectRow: jest.fn(), callForData: jest.fn() } },
      toggleDeleteDialog: jest.fn()
    }
    LDAPScheduledSyncs.methods.handleUpdateTable.call(ctx)
    expect(ctx.$refs.refTable.unSelectRow).toHaveBeenCalledWith(selectedRow)
    expect(ctx.$refs.refTable.callForData).toHaveBeenCalled()
    expect(ctx.toggleDeleteDialog).toHaveBeenCalledWith({})
  })

  it('callForUpdatedData closes modal and refreshes table', () => {
    const ctx = {
      $refs: { refTable: { callForData: jest.fn() } },
      toggleImportLDAPModal: jest.fn()
    }
    LDAPScheduledSyncs.methods.callForUpdatedData.call(ctx)
    expect(ctx.toggleImportLDAPModal).toHaveBeenCalledWith({})
    expect(ctx.$refs.refTable.callForData).toHaveBeenCalled()
  })
})
