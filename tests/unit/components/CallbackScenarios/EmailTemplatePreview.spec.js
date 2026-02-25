import EmailTemplatePreview from '@/components/CallbackScenarios/EmailTemplatePreview.vue'

describe('EmailTemplatePreview.vue', () => {
  it('has correct component name', () => {
    expect(EmailTemplatePreview.name).toBe('CallbackEmailTemplatePreview')
  })

  it('defines status and isPreviewLoading defaults as false', () => {
    expect(EmailTemplatePreview.props.status.default).toBe(false)
    expect(EmailTemplatePreview.props.isPreviewLoading.default).toBe(false)
  })

  it('registers required child components', () => {
    expect(EmailTemplatePreview.components.AppDialog).toBeDefined()
    expect(EmailTemplatePreview.components.DatatableLoading).toBeDefined()
    expect(EmailTemplatePreview.components.KEmailPreview).toBeDefined()
    expect(EmailTemplatePreview.components.AttachmentsPreview).toBeDefined()
  })
})
