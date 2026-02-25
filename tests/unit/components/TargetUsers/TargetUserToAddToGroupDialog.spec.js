jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  )
}))

import TargetUserToAddToGroupDialog from '@/components/TargetUsers/TargetUserToAddToGroupDialog.vue'

describe('TargetUserToAddToGroupDialog.vue', () => {
  it('handleClose emits onClose', () => {
    const ctx = { $emit: jest.fn() }
    TargetUserToAddToGroupDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('onClose')
  })

  it('handleConfirm emits onConfirm', () => {
    const ctx = { $emit: jest.fn() }
    TargetUserToAddToGroupDialog.methods.handleConfirm.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('onConfirm')
  })

  it('handleSelection updates selectedRows', () => {
    const ctx = { selectedRows: [] }
    const selection = [{ resourceId: 'g1' }]
    TargetUserToAddToGroupDialog.methods.handleSelection.call(ctx, selection)
    expect(ctx.selectedRows).toEqual(selection)
  })

  it('data returns tableOptions with iEmpty message', () => {
    const data = TargetUserToAddToGroupDialog.data()
    expect(data.tableOptions.iEmpty.message).toBe('No user groups found.')
  })
})
