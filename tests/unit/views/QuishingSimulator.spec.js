import QuishingSimulator from '@/views/QuishingSimulator.vue'

describe('QuishingSimulator.vue', () => {
  it('has correct component name', () => {
    expect(QuishingSimulator.name).toBe('QuishingSimulator')
  })

  it('created sets tab to email-templates when only email templates permission', () => {
    const ctx = {
      tab: 'scenarios',
      getPhishingScenariosSearchPermissions: false,
      getEmailTemplatesSearchPermissions: true
    }
    QuishingSimulator.created.call(ctx)
    expect(ctx.tab).toBe('emailTemplates')
  })

  it('default tab is scenarios', () => {
    const data = QuishingSimulator.data()
    expect(data.tab).toBe('scenarios')
  })
})
