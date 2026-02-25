import LandingPageTemplateDefault from '@/components/EmailTemplates/LandingPageTemplateDefault.vue'

describe('LandingPageTemplateDefault.vue', () => {
  it('has correct component name', () => {
    expect(LandingPageTemplateDefault.name).toBe('LandingPageTemplateDefault')
  })

  it('defines emailTemplateLogo prop as String', () => {
    expect(LandingPageTemplateDefault.props.emailTemplateLogo).toBeDefined()
    expect(LandingPageTemplateDefault.props.emailTemplateLogo.type).toBe(String)
  })
})
