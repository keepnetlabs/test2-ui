import WhiteLabelingDomainDialog from '@/components/Company Settings/WhiteLabelingDomainDialog.vue'

describe('WhiteLabelingDomainDialog.vue', () => {
  it('has correct component name', () => {
    expect(WhiteLabelingDomainDialog.name).toBe('WhiteLabelingDomainDialog')
  })

  it('handleCloseDialog emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    WhiteLabelingDomainDialog.methods.handleCloseDialog.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('handleConfirm emits on-confirm', () => {
    const ctx = { $emit: jest.fn() }
    WhiteLabelingDomainDialog.methods.handleConfirm.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-confirm')
  })
})
