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
})
