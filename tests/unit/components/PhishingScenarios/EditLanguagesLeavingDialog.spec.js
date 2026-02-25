import EditLanguagesLeavingDialog from '@/components/PhishingScenarios/EditLanguagesLeavingDialog.vue'

describe('EditLanguagesLeavingDialog.vue', () => {
  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    EditLanguagesLeavingDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('handleDiscard emits on-discard with beforeSaveLanguage', () => {
    const ctx = { $emit: jest.fn(), beforeSaveLanguage: 'en' }
    EditLanguagesLeavingDialog.methods.handleDiscard.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-discard', 'en')
  })

  it('handleConfirm emits on-confirm with beforeSaveLanguage', () => {
    const ctx = { $emit: jest.fn(), beforeSaveLanguage: 'tr' }
    EditLanguagesLeavingDialog.methods.handleConfirm.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-confirm', 'tr')
  })

  it('data returns content', () => {
    const data = EditLanguagesLeavingDialog.data()
    expect(data.content).toContain('unsaved changes')
  })
})
