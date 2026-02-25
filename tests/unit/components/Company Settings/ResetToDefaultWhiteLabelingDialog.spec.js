import ResetToDefaultWhiteLabelingDialog from '@/components/Company Settings/ResetToDefaultWhiteLabelingDialog.vue'

describe('ResetToDefaultWhiteLabelingDialog.vue', () => {
  it('has correct component name', () => {
    expect(ResetToDefaultWhiteLabelingDialog.name).toBe('ResetToDefaultWhiteLabelingDialog')
  })

  it('handleCloseDialog emits handleCloseDialog', () => {
    const ctx = { $emit: jest.fn() }
    ResetToDefaultWhiteLabelingDialog.methods.handleCloseDialog.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('handleCloseDialog')
  })

  it('handleConfirm emits handleConfirm', () => {
    const ctx = { $emit: jest.fn() }
    ResetToDefaultWhiteLabelingDialog.methods.handleConfirm.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('handleConfirm')
  })
})
