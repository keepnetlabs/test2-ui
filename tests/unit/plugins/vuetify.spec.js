import vuetify from '@/plugins/vuetify'

describe('plugins/vuetify', () => {
  it('uses mdiSvg icon font', () => {
    expect(['mdi', 'mdiSvg']).toContain(vuetify.framework.icons.iconfont)
  })

  it('registers expected custom icons', () => {
    const iconValues = vuetify.framework.icons.values
    expect(iconValues['custom-resend']).toBeDefined()
    expect(iconValues['white-resend']).toBeDefined()
    expect(iconValues['custom-details']).toBeDefined()
    expect(iconValues['pdf-file']).toBeDefined()
    expect(iconValues['microsoft-teams-resend']).toBeDefined()
  })
})
