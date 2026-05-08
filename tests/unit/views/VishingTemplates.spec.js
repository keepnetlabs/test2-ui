import VishingTemplates from '@/views/VishingTemplates.vue'

describe('VishingTemplates.vue', () => {
  it('has correct component name', () => {
    expect(VishingTemplates.name).toBe('VishingTemplates')
  })

  it('onToggleShowPreviewModal toggles isPreviewVisible', () => {
    const ctx = { isPreviewVisible: true }
    VishingTemplates.methods.onToggleShowPreviewModal.call(ctx)
    expect(ctx.isPreviewVisible).toBe(false)
  })

  it('onToggleShowPreviewModal clears selectedTemplate when closing', () => {
    const ctx = {
      isPreviewVisible: true,
      selectedTemplate: { resourceId: 'cleared' }
    }
    VishingTemplates.methods.onToggleShowPreviewModal.call(ctx)
    expect(ctx.isPreviewVisible).toBe(false)
    expect(ctx.selectedTemplate).toBe(null)
  })

  it('onToggleShowPreviewModal does not clear selectedTemplate when opening from closed', () => {
    const row = { resourceId: 'kept' }
    const ctx = {
      isPreviewVisible: false,
      selectedTemplate: row
    }
    VishingTemplates.methods.onToggleShowPreviewModal.call(ctx)
    expect(ctx.isPreviewVisible).toBe(true)
    expect(ctx.selectedTemplate).toEqual(row)
  })

  it('handlePreview when drawer already open clears template and closes', () => {
    const row2 = { resourceId: 'second' }
    const ctx = {
      vishingTemplateId: 'old',
      selectedTemplate: { resourceId: 'first' },
      isPreviewVisible: true,
      onToggleShowPreviewModal: VishingTemplates.methods.onToggleShowPreviewModal
    }

    VishingTemplates.methods.handlePreview.call(ctx, row2)

    expect(ctx.vishingTemplateId).toBe('second')
    expect(ctx.isPreviewVisible).toBe(false)
    expect(ctx.selectedTemplate).toBe(null)
  })

  it('handlePreviewEdit opens edit modal without clearing selected template', () => {
    const selectedTemplate = { resourceId: 'tpl-1' }
    const ctx = {
      selectedTemplate,
      isPreviewVisible: true,
      handleEdit: jest.fn()
    }

    VishingTemplates.methods.handlePreviewEdit.call(ctx)

    expect(ctx.isPreviewVisible).toBe(false)
    expect(ctx.handleEdit).toHaveBeenCalledWith(selectedTemplate, false)
  })

  it('handlePreviewDuplicate opens duplicate modal without clearing selected template', () => {
    const selectedTemplate = { resourceId: 'tpl-1' }
    const ctx = {
      selectedTemplate,
      isPreviewVisible: true,
      handleEdit: jest.fn()
    }

    VishingTemplates.methods.handlePreviewDuplicate.call(ctx)

    expect(ctx.isPreviewVisible).toBe(false)
    expect(ctx.handleEdit).toHaveBeenCalledWith(selectedTemplate, true)
  })
})
