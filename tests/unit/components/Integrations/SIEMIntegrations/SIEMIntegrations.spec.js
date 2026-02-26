import SIEMIntegrations from '@/components/Integrations/SIEMIntegrations/SIEMIntegrations.vue'

describe('SIEMIntegrations.vue', () => {
  const { methods } = SIEMIntegrations

  it('callForData forwards to table ref', () => {
    const callForData = jest.fn()
    methods.callForData.call({ $refs: { refTable: { callForData } } })
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('toggleShowAddOrEditModal toggles status and sets selected row', () => {
    const ctx = { isShowAddOrEditModal: false, selectedRow: null }

    methods.toggleShowAddOrEditModal.call(ctx, { resourceId: '1' })
    expect(ctx.selectedRow).toEqual({ resourceId: '1' })
    expect(ctx.isShowAddOrEditModal).toBe(true)

    methods.toggleShowAddOrEditModal.call(ctx)
    expect(ctx.selectedRow).toBeNull()
    expect(ctx.isShowAddOrEditModal).toBe(false)
  })

  it('toggleShowDeleteDialog clears selectedRow only when closing', () => {
    const ctx = { isShowDeleteDialog: false, selectedRow: { resourceId: '1' } }

    methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ resourceId: '1' })

    methods.toggleShowDeleteDialog.call(ctx)
    expect(ctx.isShowDeleteDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('handleDeleteTableRowClick sets row and opens delete dialog', () => {
    const toggleShowDeleteDialog = jest.fn()
    const ctx = { selectedRow: null, toggleShowDeleteDialog }

    methods.handleDeleteTableRowClick.call(ctx, { resourceId: '2' })

    expect(ctx.selectedRow).toEqual({ resourceId: '2' })
    expect(toggleShowDeleteDialog).toHaveBeenCalledTimes(1)
  })

  it('handleSubmit closes modal and refreshes table', () => {
    const toggleShowAddOrEditModal = jest.fn()
    const callForData = jest.fn()

    methods.handleSubmit.call({ toggleShowAddOrEditModal, callForData })

    expect(toggleShowAddOrEditModal).toHaveBeenCalledTimes(1)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleDeleteItem unselects row, closes dialog and refreshes', () => {
    const unSelectRow = jest.fn()
    const toggleShowDeleteDialog = jest.fn()
    const callForData = jest.fn()
    const row = { resourceId: '3' }

    methods.handleDeleteItem.call(
      {
        $refs: { refTable: { $refs: { refTable: { unSelectRow } } } },
        toggleShowDeleteDialog,
        callForData
      },
      row
    )

    expect(unSelectRow).toHaveBeenCalledWith(row)
    expect(toggleShowDeleteDialog).toHaveBeenCalledTimes(1)
    expect(callForData).toHaveBeenCalledTimes(1)
  })
})
