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
