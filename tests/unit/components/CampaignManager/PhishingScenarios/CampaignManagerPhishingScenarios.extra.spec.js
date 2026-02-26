import CampaignManagerPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenarios.vue'

describe('CampaignManagerPhishingScenarios.vue (extra)', () => {
  it('getContainerStyle returns empty object when distribution is not manually', () => {
    const ctx = {
      isValid: false,
      scenarioDistribution: 2
    }
    const result = CampaignManagerPhishingScenarios.computed.getContainerStyle.call(ctx)
    expect(result).toEqual({})
  })

  it('transformLandingPages maps main and secondary languages with page templates', () => {
    const ctx = {
      languages: [
        { value: 'en', text: 'English' },
        { value: 'tr', text: 'Turkish' }
      ]
    }
    const landingPages = [
      {
        name: 'Page 1',
        order: 1,
        prompt: 'Prompt',
        content: '<p>EN</p>',
        languageTypeResourceId: 'en',
        languageTypeName: 'English',
        languages: [
          {
            content: '<p>TR</p>',
            languageTypeResourceId: 'tr',
            languageTypeName: 'Turkish'
          }
        ]
      }
    ]

    const result = CampaignManagerPhishingScenarios.methods.transformLandingPages.call(
      ctx,
      landingPages,
      'en',
      'English'
    )

    expect(result.templates).toHaveLength(1)
    expect(result.templates[0].languages).toEqual({
      en: '<p>EN</p>',
      tr: '<p>TR</p>'
    })
    expect(result.languages).toEqual(
      expect.arrayContaining([
        { value: 'en', text: 'English' },
        { value: 'tr', text: 'Turkish' }
      ])
    )
  })

  it('applyLandingPageTemplatePayload updates templates and keeps current language when available', () => {
    const ctx = {
      languages: [{ value: 'en', text: 'English' }],
      landingPageLanguagePreview: 'en',
      landingPageTemplates: [],
      selectedLandingPageLanguages: [],
      transformLandingPages: CampaignManagerPhishingScenarios.methods.transformLandingPages
    }
    const payload = {
      languageTypeResourceId: 'en',
      languageTypeName: 'English',
      landingPages: [
        {
          name: 'LP',
          content: '<p>EN</p>',
          languageTypeResourceId: 'en',
          languageTypeName: 'English',
          languages: []
        }
      ]
    }

    CampaignManagerPhishingScenarios.methods.applyLandingPageTemplatePayload.call(ctx, payload)

    expect(ctx.landingPageTemplates).toHaveLength(1)
    expect(ctx.selectedLandingPageLanguages).toEqual([{ value: 'en', text: 'English' }])
    expect(ctx.landingPageLanguagePreview).toBe('en')
  })

  it('getLandingPageContent returns language-specific then fallback content branches', () => {
    const ctx = { landingPageLanguagePreview: 'tr' }
    const templateWithLanguages = {
      content: '<p>EN default</p>',
      languages: { tr: '<p>TR</p>', en: '<p>EN</p>' }
    }
    const templateWithOnlyContent = { content: '<p>Only main</p>' }
    const templateWithUnknownLanguage = { languages: { en: '<p>EN</p>' } }

    const localized = CampaignManagerPhishingScenarios.methods.getLandingPageContent.call(
      ctx,
      templateWithLanguages
    )
    const contentFallback = CampaignManagerPhishingScenarios.methods.getLandingPageContent.call(
      ctx,
      templateWithOnlyContent
    )
    const firstLangFallback = CampaignManagerPhishingScenarios.methods.getLandingPageContent.call(
      ctx,
      templateWithUnknownLanguage
    )
    const emptyFallback = CampaignManagerPhishingScenarios.methods.getLandingPageContent.call(
      ctx,
      null
    )

    expect(localized).toBe('<p>TR</p>')
    expect(contentFallback).toBe('<p>Only main</p>')
    expect(firstLangFallback).toBe('<p>EN</p>')
    expect(emptyFallback).toBe('')
  })

  it('handleLandingPageLanguageChange updates only for truthy values', () => {
    const ctx = { landingPageLanguagePreview: 'en' }
    CampaignManagerPhishingScenarios.methods.handleLandingPageLanguageChange.call(ctx, '')
    expect(ctx.landingPageLanguagePreview).toBe('en')

    CampaignManagerPhishingScenarios.methods.handleLandingPageLanguageChange.call(ctx, 'tr')
    expect(ctx.landingPageLanguagePreview).toBe('tr')
  })

  it('handleEmailTemplatePreviewLanguageChange returns early when template not found', () => {
    const setMock = jest.fn()
    const ctx = {
      phishingEmailTemplates: [{ languageTypeResourceId: 'en', template: '<p>EN</p>' }],
      emailTemplateParams: { template: '<p>OLD</p>' },
      emailTemplate: '<p>OLD</p>',
      languagePreview: 'en',
      $set: setMock
    }

    CampaignManagerPhishingScenarios.methods.handleEmailTemplatePreviewLanguageChange.call(ctx, 'tr')

    expect(setMock).not.toHaveBeenCalled()
    expect(ctx.emailTemplate).toBe('<p>OLD</p>')
    expect(ctx.languagePreview).toBe('en')
  })
})
