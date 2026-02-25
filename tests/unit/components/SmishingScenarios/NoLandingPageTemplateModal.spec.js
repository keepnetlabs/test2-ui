import NoLandingPageTemplateModal from '@/components/SmishingScenarios/NoLandingPageTemplateModal.vue'

describe('NoLandingPageTemplateModal.vue', () => {
  it('closeModal emits handleCloseModal', () => {
    const ctx = { $emit: jest.fn() }
    NoLandingPageTemplateModal.methods.closeModal.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('handleCloseModal')
  })

  it('handleConfirm emits handleConfirm', () => {
    const ctx = { $emit: jest.fn() }
    NoLandingPageTemplateModal.methods.handleConfirm.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('handleConfirm')
  })
})
