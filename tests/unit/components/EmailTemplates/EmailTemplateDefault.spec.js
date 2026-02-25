import EmailTemplateDefault from '@/components/EmailTemplates/EmailTemplateDefault.vue'

describe('EmailTemplateDefault.vue', () => {
  it('has correct component name', () => {
    expect(EmailTemplateDefault.name).toBe('EmailTemplateDefault')
  })

  it('defines emailTemplateLogo prop as String', () => {
    expect(EmailTemplateDefault.props.emailTemplateLogo).toBeDefined()
    expect(EmailTemplateDefault.props.emailTemplateLogo.type).toBe(String)
  })
})
