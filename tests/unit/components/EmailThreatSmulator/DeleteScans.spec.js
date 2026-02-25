jest.mock('@/api/emailThreatSimlator', () => ({
  __esModule: true,
  deleteQuickScanItem: jest.fn(() => Promise.resolve())
}))

import DeleteScans from '@/components/EmailThreatSmulator/DeleteScans.vue'
import { deleteQuickScanItem } from '@/api/emailThreatSimlator'

describe('DeleteScans.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(DeleteScans.name).toBe('DeleteScans')
  })

  it('closeModal emits handleCloseModal', () => {
    const ctx = { $emit: jest.fn() }
    DeleteScans.methods.closeModal.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('handleCloseModal')
  })

  it('handleDelete calls api and emits success then closes', async () => {
    const ctx = {
      selectedItem: { quickScanResourceId: 'q1' },
      isActionButtonDisabled: false,
      closeModal: jest.fn(),
      $emit: jest.fn()
    }
    DeleteScans.methods.handleDelete.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(deleteQuickScanItem).toHaveBeenCalledWith('q1')
    expect(ctx.$emit).toHaveBeenCalledWith('handleSuccessDeleteAction')
    expect(ctx.closeModal).toHaveBeenCalled()
    expect(ctx.isActionButtonDisabled).toBe(false)
  })
})
