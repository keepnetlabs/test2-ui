import NoTextMessageTemplateModal from '@/components/SmishingScenarios/NoTextMessageTemplateModal.vue'

describe('NoTextMessageTemplateModal.vue', () => {
  it('closeModal emits handleCloseModal', () => {
    const ctx = { $emit: jest.fn() }
    NoTextMessageTemplateModal.methods.closeModal.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('handleCloseModal')
  })

  it('handleConfirm emits handleConfirm', () => {
    const ctx = { $emit: jest.fn() }
    NoTextMessageTemplateModal.methods.handleConfirm.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('handleConfirm')
  })
})
