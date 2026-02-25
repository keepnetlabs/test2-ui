import QuishingEmailTemplateDefault from '@/components/EmailTemplates/QuishingEmailTemplateDefault.vue'

describe('QuishingEmailTemplateDefault.vue', () => {
  it('has correct component name', () => {
    expect(QuishingEmailTemplateDefault.name).toBe('QuishingEmailTemplateDefault')
  })

  it('defines emailTemplateLogo prop as String', () => {
    expect(QuishingEmailTemplateDefault.props.emailTemplateLogo).toBeDefined()
    expect(QuishingEmailTemplateDefault.props.emailTemplateLogo.type).toBe(String)
  })
})
