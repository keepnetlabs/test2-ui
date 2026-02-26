import TrainingLibrarySendTrainingUsersByCampaign from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingUsersByCampaign.vue'

describe('TrainingLibrarySendTrainingUsersByCampaign.vue', () => {
  it('languageItems maps helper languages into select items', () => {
    const items = TrainingLibrarySendTrainingUsersByCampaign.computed.languageItems.call({
      languages: [{ name: 'English', code: 'en' }, { name: 'Turkish', code: 'tr' }]
    })
    expect(items).toEqual([
      { text: 'English', value: 'en' },
      { text: 'Turkish', value: 'tr' }
    ])
  })

  it('getTableEmptyTextMessage returns no-result text when filter active', () => {
    const text = TrainingLibrarySendTrainingUsersByCampaign.computed.getTableEmptyTextMessage.call({
      isFilterOrSearchActive: true
    })
    expect(text.toLowerCase()).toContain('no results')
  })

  it('languageItems returns empty array when languages is missing', () => {
    const items = TrainingLibrarySendTrainingUsersByCampaign.computed.languageItems.call({})
    expect(items).toEqual([])
  })

  it('getTableEmptyTextMessage returns default campaign text when no filter/search', () => {
    const text = TrainingLibrarySendTrainingUsersByCampaign.computed.getTableEmptyTextMessage.call({
      isFilterOrSearchActive: false
    })
    expect(text.toLowerCase()).toContain('you do not have any campaigns yet')
  })

  it('getTableEmptySubMessage switches text based on filter activity', () => {
    const active = TrainingLibrarySendTrainingUsersByCampaign.computed.getTableEmptySubMessage.call({
      isFilterOrSearchActive: true
    })
    const passive = TrainingLibrarySendTrainingUsersByCampaign.computed.getTableEmptySubMessage.call({
      isFilterOrSearchActive: false
    })

    expect(active.toLowerCase()).toContain('try adjusting')
    expect(passive.toLowerCase()).toContain('phishing simulator')
  })

  it('getStyle returns centered empty-state style only when there are no items', () => {
    const emptyStyle = TrainingLibrarySendTrainingUsersByCampaign.computed.getStyle.call({
      getItems: []
    })
    const filledStyle = TrainingLibrarySendTrainingUsersByCampaign.computed.getStyle.call({
      getItems: [{ resourceId: '1' }]
    })

    expect(emptyStyle.maxHeight).toBe('360px')
    expect(emptyStyle.display).toBe('flex')
    expect(filledStyle).toEqual({})
  })

  it('landing page helper computeds map values correctly', () => {
    const singleTemplate = TrainingLibrarySendTrainingUsersByCampaign.computed.getSingleTemplateDetails.call({
      landingPageTemplates: [{ content: '<html>page</html>' }]
    })
    const emptyTemplate = TrainingLibrarySendTrainingUsersByCampaign.computed.getSingleTemplateDetails.call({
      landingPageTemplates: []
    })
    const tabsVisible = TrainingLibrarySendTrainingUsersByCampaign.computed.isLandingPageTabsVisible.call({
      landingPageTemplates: [{}, {}]
    })
    const tabsHidden = TrainingLibrarySendTrainingUsersByCampaign.computed.isLandingPageTabsVisible.call({
      landingPageTemplates: [{}]
    })
    const filterActive = TrainingLibrarySendTrainingUsersByCampaign.computed.isFilterOrSearchActive.call({
      search: '',
      language: 'en',
      scenarioType: ''
    })
    const filterPassive = TrainingLibrarySendTrainingUsersByCampaign.computed.isFilterOrSearchActive.call({
      search: '',
      language: '',
      scenarioType: ''
    })
    const items = TrainingLibrarySendTrainingUsersByCampaign.computed.getItems.call({
      campaignItems: [{ resourceId: 'x' }]
    })

    expect(singleTemplate).toBe('<html>page</html>')
    expect(emptyTemplate).toBe('')
    expect(tabsVisible).toBe(true)
    expect(tabsHidden).toBe(false)
    expect(filterActive).toBe('en')
    expect(filterPassive).toBe('')
    expect(items).toEqual([{ resourceId: 'x' }])
  })

  it('getTargetGroupErrorMessage returns expected static message', () => {
    const text =
      TrainingLibrarySendTrainingUsersByCampaign.computed.getTargetGroupErrorMessage.call({})
    expect(text).toBe('At least one target user must be selected')
  })

  it('setActiveScenario maps attachment and landing page details', () => {
    const ctx = {
      isAttachmentBasedScenario: false,
      emailTemplate: null,
      emailTemplateParams: null,
      landingPageTemplates: null,
      landingPageParams: null
    }

    TrainingLibrarySendTrainingUsersByCampaign.methods.setActiveScenario.call(ctx, {
      methodTypeId: 3,
      emailTemplate: {
        template: '<html/>',
        name: 'Mail',
        fromName: 'Sender',
        fromAddress: 'sender@test.com',
        subject: 'Sub',
        phishingFileName: 'file.pdf'
      },
      landingPageTemplate: {
        name: 'LP',
        description: 'desc',
        urlTemplate: 'https://example.com',
        landingPages: [{ content: 'A' }]
      }
    })

    expect(ctx.isAttachmentBasedScenario).toBe(true)
    expect(ctx.emailTemplate).toBe('<html/>')
    expect(ctx.emailTemplateParams.attachment).toEqual({ name: 'file.pdf' })
    expect(ctx.landingPageTemplates).toEqual([{ content: 'A' }])
    expect(ctx.landingPageParams.urlTemplate).toBe('https://example.com')
  })

  it('setActiveScenario uses defaults when fields are missing', () => {
    const ctx = {
      isAttachmentBasedScenario: true,
      emailTemplate: 'old',
      emailTemplateParams: { old: true },
      landingPageTemplates: [{}],
      landingPageParams: { old: true }
    }

    TrainingLibrarySendTrainingUsersByCampaign.methods.setActiveScenario.call(ctx, {})

    expect(ctx.isAttachmentBasedScenario).toBe(false)
    expect(ctx.emailTemplate).toBe('')
    expect(ctx.emailTemplateParams).toEqual({
      name: '',
      fromName: '',
      fromAddress: '',
      subject: '',
      attachment: null
    })
    expect(ctx.landingPageTemplates).toEqual([])
    expect(ctx.landingPageParams).toEqual({
      name: '',
      description: '',
      urlTemplate: ''
    })
  })

  it('callForScenarioDetail selects scenario by tab index', () => {
    const setActiveScenario = jest.fn()
    const selected = { name: 'Scenario-2' }
    const ctx = {
      setActiveScenario,
      phishingScenarios: [{ name: 'Scenario-1' }, selected]
    }

    TrainingLibrarySendTrainingUsersByCampaign.methods.callForScenarioDetail.call(ctx, { index: 1 })
    expect(setActiveScenario).toHaveBeenCalledWith(selected)
  })

  it('handleTabChange with non-campaign label only resets selected landing page tab', () => {
    const ctx = {
      selectedLandingPageTab: '3',
      isCampaignLoading: false
    }

    TrainingLibrarySendTrainingUsersByCampaign.methods.handleTabChange.call(ctx, {
      label: 'Email'
    })
    expect(ctx.selectedLandingPageTab).toBe('1')
    expect(ctx.isCampaignLoading).toBe(false)
  })

  it('handleScroll increases page size and triggers debounced data call near bottom', () => {
    const callForData = jest.fn()
    const debounce = jest.fn((cb) => cb())
    const ctx = {
      axiosPayload: { pageSize: 10 },
      debounce,
      callForData
    }

    TrainingLibrarySendTrainingUsersByCampaign.methods.handleScroll.call(ctx, {
      target: {
        scrollTop: 90,
        scrollHeight: 200,
        offsetHeight: 110
      }
    })

    expect(ctx.axiosPayload.pageSize).toBe(20)
    expect(debounce).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('handleScroll does not change page size when not near bottom', () => {
    const callForData = jest.fn()
    const debounce = jest.fn((cb) => cb())
    const ctx = {
      axiosPayload: { pageSize: 10 },
      debounce,
      callForData
    }

    TrainingLibrarySendTrainingUsersByCampaign.methods.handleScroll.call(ctx, {
      target: {
        scrollTop: 10,
        scrollHeight: 300,
        offsetHeight: 100
      }
    })

    expect(ctx.axiosPayload.pageSize).toBe(10)
    expect(debounce).not.toHaveBeenCalled()
    expect(callForData).not.toHaveBeenCalled()
  })
})
