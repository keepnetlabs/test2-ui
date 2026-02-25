import IndividualPrintOutTemplateDefault from '@/components/EmailTemplates/IndividualPrintOutTemplateDefault.vue'

describe('IndividualPrintOutTemplateDefault.vue', () => {
  it('has correct component name', () => {
    expect(IndividualPrintOutTemplateDefault.name).toBe('IndividualPrintOutTemplateDefault')
  })

  it('defines emailTemplateLogo prop as String', () => {
    expect(IndividualPrintOutTemplateDefault.props.emailTemplateLogo).toBeDefined()
    expect(IndividualPrintOutTemplateDefault.props.emailTemplateLogo.type).toBe(String)
  })
})
