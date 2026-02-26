import CampaignManagerPhishingScenariosPreviewDialog from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosPreviewDialog.vue'

describe('CampaignManagerPhishingScenariosPreviewDialog.vue (extra)', () => {
  it('getTitle supports individual-printout and empty fallbacks', () => {
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getTitle.call({
        tab: 'individual-printout',
        emailTemplateParams: { name: 'Printout Template' },
        landingPageParams: { name: 'Landing Name' }
      })
    ).toBe('Printout Template')

    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getTitle.call({
        tab: 'email',
        emailTemplateParams: {},
        landingPageParams: {}
      })
    ).toBe('')
  })

  it('getTemplatePreviewContent returns email content for email/individual-printout tabs', () => {
    const emailCtx = {
      tab: 'email',
      emailTemplate: '<p>Email HTML</p>',
      getCurrentLandingPageTemplate: '<p>LP</p>'
    }
    const printoutCtx = {
      tab: 'individual-printout',
      emailTemplate: '<p>Printout HTML</p>',
      getCurrentLandingPageTemplate: '<p>LP</p>'
    }

    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getTemplatePreviewContent.call(emailCtx)
    ).toBe('<p>Email HTML</p>')
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getTemplatePreviewContent.call(
        printoutCtx
      )
    ).toBe('<p>Printout HTML</p>')
  })

  it('getTemplatePreviewContent returns current landing-page content in landing-page tab', () => {
    const ctx = {
      tab: 'landing-page',
      emailTemplate: '<p>Email HTML</p>',
      getCurrentLandingPageTemplate: '<p>Landing HTML</p>'
    }
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getTemplatePreviewContent.call(ctx)
    ).toBe('<p>Landing HTML</p>')
  })

  it('getCurrentLandingPageTemplate handles single/empty templates and invalid selected tab', () => {
    const singleCtx = {
      selectedLandingPageTab: '10',
      landingPageTemplates: [{ content: 'Single' }]
    }
    const emptyCtx = {
      selectedLandingPageTab: '1',
      landingPageTemplates: []
    }
    const invalidIndexCtx = {
      selectedLandingPageTab: 'abc',
      landingPageTemplates: [{ content: 'A' }, { content: 'B' }]
    }

    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getCurrentLandingPageTemplate.call(
        singleCtx
      )
    ).toBe('Single')
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getCurrentLandingPageTemplate.call(
        emptyCtx
      )
    ).toBe('')
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getCurrentLandingPageTemplate.call(
        invalidIndexCtx
      )
    ).toBe('')
  })

  it('isRedFlaggedTemplate returns false for non-string content', () => {
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.isRedFlaggedTemplate.call({
        getTemplatePreviewContent: { html: '<div data-redflag="1"></div>' }
      })
    ).toBe(false)
  })
})
