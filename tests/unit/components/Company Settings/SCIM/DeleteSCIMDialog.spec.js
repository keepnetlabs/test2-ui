jest.mock('@/api/scimSettings', () => ({
  __esModule: true,
  deleteSCIMSetting: jest.fn(() => Promise.resolve())
}))

import DeleteSCIMDialog from '@/components/Company Settings/SCIM/DeleteSCIMDialog.vue'
import { deleteSCIMSetting } from '@/api/scimSettings'

describe('DeleteSCIMDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(DeleteSCIMDialog.name).toBe('DeleteSCIMDialog')
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    DeleteSCIMDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('handleDelete deletes selected row and emits update', async () => {
    const selectedRow = { resourceId: 'scim-1', name: 'SCIM A' }
    const ctx = {
      selectedRow,
      isActionButtonDisabled: false,
      handleClose: jest.fn(),
      $emit: jest.fn()
    }

    DeleteSCIMDialog.methods.handleDelete.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(deleteSCIMSetting).toHaveBeenCalledWith('scim-1')
    expect(ctx.handleClose).toHaveBeenCalled()
    expect(ctx.$emit).toHaveBeenCalledWith('on-close-with-update', selectedRow)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
