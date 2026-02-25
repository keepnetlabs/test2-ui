import SendTrainingSelectUsersByCampaign from '@/components/AwarenessEducator/SendTraining/SendTrainingSelectUsersByCampaign.vue'

describe('SendTrainingSelectUsersByCampaign.vue', () => {
  it('getStyle returns centered style when items are empty', () => {
    const style = SendTrainingSelectUsersByCampaign.computed.getStyle.call({
      getItems: []
    })
    expect(style.display).toBe('flex')
    expect(style.justifyContent).toBe('center')
  })

  it('setActiveScenario maps template params', () => {
    const ctx = {}
    SendTrainingSelectUsersByCampaign.methods.setActiveScenario.call(ctx, {
      methodTypeId: 3,
      emailTemplate: { name: 'N', fromName: 'F', fromAddress: 'a@b.com', subject: 'S' },
      landingPageTemplate: { name: 'LP', description: 'D', urlTemplate: 'https://x', landingPages: [] }
    })
    expect(ctx.isAttachmentBasedScenario).toBe(true)
    expect(ctx.emailTemplateParams.name).toBe('N')
    expect(ctx.landingPageParams.name).toBe('LP')
  })
})

