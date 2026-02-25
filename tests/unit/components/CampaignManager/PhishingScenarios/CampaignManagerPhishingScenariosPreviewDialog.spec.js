import CampaignManagerPhishingScenariosPreviewDialog from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenariosPreviewDialog.vue'

describe('CampaignManagerPhishingScenariosPreviewDialog.vue', () => {
  it('has correct component name', () => {
    expect(CampaignManagerPhishingScenariosPreviewDialog.name).toBe(
      'CampaignManagerPhishingScenariosPreviewDialog'
    )
  })

  it('getTitle returns email or landing page title based on tab', () => {
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getTitle.call({
        tab: 'email',
        emailTemplateParams: { name: 'Email Name' },
        landingPageParams: { name: 'Landing Name' }
      })
    ).toBe('Email Name')

    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getTitle.call({
        tab: 'landing-page',
        emailTemplateParams: { name: 'Email Name' },
        landingPageParams: { name: 'Landing Name' }
      })
    ).toBe('Landing Name')
  })

  it('getCurrentLandingPageTemplate resolves by selected tab index', () => {
    const ctx = {
      selectedLandingPageTab: '2',
      landingPageTemplates: [{ content: 'A' }, { content: 'B' }]
    }
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.getCurrentLandingPageTemplate.call(ctx)
    ).toBe('B')
  })

  it('isRedFlaggedTemplate detects red-flag attribute', () => {
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.isRedFlaggedTemplate.call({
        getTemplatePreviewContent: '<div data-redflag="1"></div>'
      })
    ).toBe(true)
    expect(
      CampaignManagerPhishingScenariosPreviewDialog.computed.isRedFlaggedTemplate.call({
        getTemplatePreviewContent: '<div></div>'
      })
    ).toBe(false)
  })

  it('handleClose emits on-close false', () => {
    const $emit = jest.fn()
    CampaignManagerPhishingScenariosPreviewDialog.methods.handleClose.call({ $emit })
    expect($emit).toHaveBeenCalledWith('on-close', false)
  })
})
