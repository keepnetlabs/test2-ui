import EmailTemplate from '@/components/Company Settings/EmailTemplate.vue'

describe('EmailTemplate.vue', () => {
  it('has expected component name', () => {
    expect(EmailTemplate.name).toBe('EmailTemplate')
  })

  it('computed getSelectedStateName and isUSAStateSelected work correctly', () => {
    const stateCtx = {
      localeOptions: [
        { resourceId: 'us-ca', name: 'California' },
        { resourceId: 'de', name: 'Germany' }
      ],
      localizationResourceId: 'us-ca',
      usaStateResourceIds: ['us-ca', 'us-ny']
    }

    expect(EmailTemplate.computed.getSelectedStateName.call(stateCtx)).toBe('California')
    expect(EmailTemplate.computed.isUSAStateSelected.call(stateCtx)).toBe(true)
  })

  it('handleValueComparator supports direct and USA mapped comparison', () => {
    const ctx = {
      usaResourceId: 'usa-root',
      usaStateResourceIds: ['us-ca', 'us-ny']
    }

    expect(EmailTemplate.methods.handleValueComparator.call(ctx, 'same', 'same')).toBe(true)
    expect(EmailTemplate.methods.handleValueComparator.call(ctx, 'usa-root', 'us-ca')).toBe(true)
    expect(EmailTemplate.methods.handleValueComparator.call(ctx, 'usa-root', 'de')).toBe(false)
  })

  it('handleAiAssistantBadgeClick selects landing and email badge content', () => {
    const landingCtx = {
      templateType: 'landing',
      landingPageBadgeContents: [{ content: 'landing badge' }],
      badgeContents: [{ content: 'email badge' }],
      aiTemplateText: ''
    }
    const emailCtx = {
      templateType: 'email',
      landingPageBadgeContents: [{ content: 'landing badge' }],
      badgeContents: [{ content: 'email badge' }],
      aiTemplateText: ''
    }

    EmailTemplate.methods.handleAiAssistantBadgeClick.call(landingCtx, 0)
    EmailTemplate.methods.handleAiAssistantBadgeClick.call(emailCtx, 0)

    expect(landingCtx.aiTemplateText).toBe('landing badge')
    expect(emailCtx.aiTemplateText).toBe('email badge')
  })

  it('changeGrapesModalStatus toggles modal and emits template-edit', () => {
    const ctx = { showGrapesModal: false, $emit: jest.fn() }

    EmailTemplate.methods.changeGrapesModalStatus.call(ctx)
    expect(ctx.showGrapesModal).toBe(true)
    expect(ctx.$emit).toHaveBeenCalledWith('template-edit', true)

    EmailTemplate.methods.changeGrapesModalStatus.call(ctx)
    expect(ctx.showGrapesModal).toBe(false)
    expect(ctx.$emit).toHaveBeenCalledWith('template-edit', false)
  })
})
