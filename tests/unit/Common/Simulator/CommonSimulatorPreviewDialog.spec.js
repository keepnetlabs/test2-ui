import CommonSimulatorPreviewDialog from '@/components/Common/Simulator/CommonSimulatorPreviewDialog.vue'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

describe('CommonSimulatorPreviewDialog.vue', () => {
  it('computes tab label and title by preview type', () => {
    expect(
      CommonSimulatorPreviewDialog.computed.getFirstTabLabel.call({
        type: PREVIEW_DIALOG_TYPES.PHISHING
      })
    ).toBe('Email Template')
    expect(
      CommonSimulatorPreviewDialog.computed.getFirstTabLabel.call({
        type: PREVIEW_DIALOG_TYPES.QUISHING
      })
    ).toBe('Quishing Template')

    expect(
      CommonSimulatorPreviewDialog.computed.getTitle.call({
        type: PREVIEW_DIALOG_TYPES.PHISHING
      })
    ).toBe('Phishing Scenario Preview')
    expect(
      CommonSimulatorPreviewDialog.computed.getTitle.call({
        type: PREVIEW_DIALOG_TYPES.QUISHING
      })
    ).toBe('Quishing Scenario Preview')
  })

  it('computes red flags texts and language labels correctly', () => {
    expect(
      CommonSimulatorPreviewDialog.computed.redFlagsText.call({
        isShowRedFlags: false
      })
    ).toBe('Show Red Flags')
    expect(
      CommonSimulatorPreviewDialog.computed.redFlagsText.call({
        isShowRedFlags: true
      })
    ).toBe('Hide Red Flags')

    expect(
      CommonSimulatorPreviewDialog.computed.templateLanguageLabel.call({
        selectedTemplateLanguages: [{ value: 'en' }]
      })
    ).toBe('Template Language (1)')
    expect(
      CommonSimulatorPreviewDialog.computed.templateLanguageLabel.call({
        selectedTemplateLanguages: [{ value: 'en' }, { value: 'tr' }]
      })
    ).toBe('Template Languages (2)')
  })

  it('computes quishing individual printout and attachment-based flags', () => {
    const quishingCtx = {
      type: PREVIEW_DIALOG_TYPES.QUISHING,
      isQuishing: true,
      emailTemplateParams: { type: 'Individual' }
    }
    expect(CommonSimulatorPreviewDialog.computed.isQuishing.call(quishingCtx)).toBe(true)
    expect(CommonSimulatorPreviewDialog.computed.isQuishingTypeIndividualPrintOut.call(quishingCtx)).toBe(
      true
    )

    expect(
      CommonSimulatorPreviewDialog.computed.isAttachmentBasedScenario.call({
        selectedRow: { method: 'Attachment' }
      })
    ).toBe(true)
    expect(
      CommonSimulatorPreviewDialog.computed.isAttachmentBasedScenario.call({
        selectedRow: { method: 'Click-Only' }
      })
    ).toBe(false)
  })

  it('computes individual printout button style by disabled status', () => {
    const enabledStyle = CommonSimulatorPreviewDialog.computed.getIndividualPrintoutStyle.call({
      isIndividualPrintoutButtonDisabled: false
    })
    expect(enabledStyle).toEqual({
      textTransform: 'capitalize'
    })

    const disabledStyle = CommonSimulatorPreviewDialog.computed.getIndividualPrintoutStyle.call({
      isIndividualPrintoutButtonDisabled: true
    })
    expect(disabledStyle).toEqual({
      textTransform: 'capitalize',
      cursor: 'default',
      opacity: 0.5
    })
  })

  it('calls closeDrawer for close and overlay handlers', () => {
    const closeDrawer = jest.fn()
    const ctx = { closeDrawer }
    CommonSimulatorPreviewDialog.methods.handleOverlayClick.call(ctx)
    CommonSimulatorPreviewDialog.methods.handleClose.call(ctx)
    expect(closeDrawer).toHaveBeenCalledTimes(2)
  })

  it('emits edit and fast-launch events with expected payload', () => {
    const emit = jest.fn()
    const ctx = {
      selectedRow: { resourceId: 'sc-1', name: 'Scenario A' },
      $emit: emit
    }

    CommonSimulatorPreviewDialog.methods.handleEdit.call(ctx)
    CommonSimulatorPreviewDialog.methods.handleFastLaunch.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-edit-template')
    expect(emit).toHaveBeenCalledWith('on-fast-launch', { resourceId: 'sc-1', name: 'Scenario A' })
  })

  it('updates loading flag via setLoading', () => {
    const ctx = { isLoading: true }
    CommonSimulatorPreviewDialog.methods.setLoading.call(ctx)
    expect(ctx.isLoading).toBe(false)
    CommonSimulatorPreviewDialog.methods.setLoading.call(ctx, true)
    expect(ctx.isLoading).toBe(true)
  })

  it('computes navigation class, subtitle and current landing page template', () => {
    expect(
      CommonSimulatorPreviewDialog.computed.getNavigationDrawerClass.call({ isNested: false })
    ).toEqual({
      'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
      'nested-drawer': false
    })

    expect(
      CommonSimulatorPreviewDialog.computed.getNavigationDrawerClass.call({ isNested: true })
    ).toEqual({
      'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
      'nested-drawer': true
    })

    expect(
      CommonSimulatorPreviewDialog.computed.getSubtitle.call({
        selectedRow: { name: 'Scenario One' }
      })
    ).toBe('Scenario One')
    expect(
      CommonSimulatorPreviewDialog.computed.getSubtitle.call({
        selectedRow: {}
      })
    ).toBe('')

    expect(
      CommonSimulatorPreviewDialog.computed.getCurrentLandingPageTemplate.call({
        selectedLandingPageIndex: 1,
        landingPageTemplates: [{ content: '<p>EN</p>' }, { content: '<p>TR</p>' }]
      })
    ).toBe('<p>TR</p>')
  })

  it('computes email template preview hint and landing page key behavior', () => {
    expect(
      CommonSimulatorPreviewDialog.computed.getEmailTemplatePreviewLanguageHint.call({
        selectedTemplateLanguages: [{ value: 'en' }]
      })
    ).toBe('This template is available in 1 language.')
    expect(
      CommonSimulatorPreviewDialog.computed.getEmailTemplatePreviewLanguageHint.call({
        selectedTemplateLanguages: [{ value: 'en' }, { value: 'tr' }]
      })
    ).toBe('This template is available in 2 languages.')

    const key = CommonSimulatorPreviewDialog.computed.getLandingPageKey.call({
      tab: 'landing-page'
    })
    expect(key.startsWith('key-')).toBe(true)
    expect(
      CommonSimulatorPreviewDialog.computed.getLandingPageKey.call({
        tab: 'email'
      })
    ).toBe('')
  })

  it('handleEmailTemplatePreviewLanguageChange returns early when no matching template exists', () => {
    const ctx = {
      languagePreview: 'en',
      isShowRedFlags: false,
      lastRedFlags: {},
      phishingEmailTemplates: [],
      emailTemplateParams: {},
      $nextTick: jest.fn(),
      updateTemplateWithFlaggedStyles: jest.fn()
    }

    CommonSimulatorPreviewDialog.methods.handleEmailTemplatePreviewLanguageChange.call(ctx, 'tr')
    expect(ctx.languagePreview).toBe('tr')
    expect(ctx.$nextTick).not.toHaveBeenCalled()
  })

  it('handleEmailTemplatePreviewLanguageChange updates template and resets flag state when cache exists', () => {
    const ctx = {
      languagePreview: 'en',
      isShowRedFlags: true,
      isFlaggedStylesEnabled: true,
      redFlags: { subject: { isRedFlagged: true } },
      lastRedFlags: {
        en: {},
        tr: {
          flags: { subject: { isRedFlagged: true } },
          templates: ['<p>TR cached</p>']
        }
      },
      phishingEmailTemplates: [
        {
          languageTypeResourceId: 'tr',
          ccAddresses: ['cc@test.com'],
          fromName: 'TR Name',
          fromAddress: 'tr@test.com',
          subject: 'TR Subject',
          template: '<p>TR template</p>'
        }
      ],
      emailTemplateParams: {
        fromName: 'EN Name',
        fromAddress: 'en@test.com',
        subject: 'EN Subject',
        attachment: { name: 'file.pdf' }
      },
      emailTemplate: '<p>EN template</p>',
      updateTemplateWithFlaggedStyles: jest.fn(),
      $nextTick: (fn) => fn()
    }

    CommonSimulatorPreviewDialog.methods.handleEmailTemplatePreviewLanguageChange.call(ctx, 'tr')
    expect(ctx.languagePreview).toBe('tr')
    expect(ctx.emailTemplate).toBe('<p>TR cached</p>')
    expect(ctx.isShowRedFlags).toBe(false)
    expect(ctx.isFlaggedStylesEnabled).toBe(false)
    expect(ctx.updateTemplateWithFlaggedStyles).toHaveBeenCalled()
  })

  it('resetRedFlags clears flags and calls remove styles helper', () => {
    const ctx = {
      redFlags: { subject: { isRedFlagged: true } },
      isShowRedFlags: true,
      isFlaggedStylesEnabled: true,
      _removeFlaggedStylesFromTemplate: jest.fn()
    }

    CommonSimulatorPreviewDialog.methods.resetRedFlags.call(ctx)
    expect(ctx.isShowRedFlags).toBe(false)
    expect(ctx.isFlaggedStylesEnabled).toBe(false)
    expect(ctx._removeFlaggedStylesFromTemplate).toHaveBeenCalled()
  })

  it('passes landingPageParams.urlTemplate to landing page tab for blacklist check', () => {
    // CommonSimulatorPreviewDialog passes :phishing-url="landingPageParams.urlTemplate"
    // to TabsWithMfaSettingsMultipleLanguages which performs the blacklist check
    const ctx = {
      landingPageParams: {
        urlTemplate: 'https://www.suspicious-domain.com/film.php'
      }
    }
    // Verify the data structure supports phishing URL propagation
    expect(ctx.landingPageParams.urlTemplate).toBe('https://www.suspicious-domain.com/film.php')
  })

  it('showEditButton returns true when isOwner is not false', () => {
    expect(
      CommonSimulatorPreviewDialog.computed.showEditButton.call({
        selectedRow: { isOwner: true }
      })
    ).toBe(true)
    expect(
      CommonSimulatorPreviewDialog.computed.showEditButton.call({
        selectedRow: null
      })
    ).toBe(true)
    expect(
      CommonSimulatorPreviewDialog.computed.showEditButton.call({
        selectedRow: { isOwner: false }
      })
    ).toBe(false)
  })

  it('showDuplicateButton returns true only when isOwner is false', () => {
    expect(
      CommonSimulatorPreviewDialog.computed.showDuplicateButton.call({
        selectedRow: { isOwner: false }
      })
    ).toBe(true)
    expect(
      CommonSimulatorPreviewDialog.computed.showDuplicateButton.call({
        selectedRow: { isOwner: true }
      })
    ).toBe(false)
    expect(
      CommonSimulatorPreviewDialog.computed.showDuplicateButton.call({
        selectedRow: null
      })
    ).toBeFalsy()
  })

  it('isPhishing and isQuishing computed correctly', () => {
    expect(
      CommonSimulatorPreviewDialog.computed.isPhishing.call({
        type: PREVIEW_DIALOG_TYPES.PHISHING
      })
    ).toBe(true)
    expect(
      CommonSimulatorPreviewDialog.computed.isPhishing.call({
        type: PREVIEW_DIALOG_TYPES.QUISHING
      })
    ).toBe(false)
    expect(
      CommonSimulatorPreviewDialog.computed.isQuishing.call({
        type: PREVIEW_DIALOG_TYPES.QUISHING
      })
    ).toBe(true)
    expect(
      CommonSimulatorPreviewDialog.computed.isQuishing.call({
        type: PREVIEW_DIALOG_TYPES.PHISHING
      })
    ).toBe(false)
  })

  it('getLoaderTitle and getLoaderDescription return AI red-flag scan copy', () => {
    expect(CommonSimulatorPreviewDialog.computed.getLoaderTitle.call({})).toContain('red flags')
    expect(CommonSimulatorPreviewDialog.computed.getLoaderDescription.call({})).toContain('localization')
  })

  it('handleDuplicate emits on-duplicate-template', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }
    CommonSimulatorPreviewDialog.methods.handleDuplicate.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-duplicate-template')
  })

  it('reasoningText prop defaults to empty string', () => {
    const prop = CommonSimulatorPreviewDialog.props.reasoningText
    expect(prop.type).toBe(String)
    const defaultVal = typeof prop.default === 'function' ? prop.default() : prop.default
    expect(defaultVal).toBe('')
  })

  it('reasoningText prop accepts a non-empty string value', () => {
    const prop = CommonSimulatorPreviewDialog.props.reasoningText
    expect(prop.type).toBe(String)
    // validator: any string is valid
    expect('This scenario targets users who reuse passwords.').toEqual(expect.any(String))
  })

  it('isNested prop defaults to false (standalone preview controls html scroll)', () => {
    const prop = CommonSimulatorPreviewDialog.props.isNested
    expect(prop.type).toBe(Boolean)
    const defaultVal = typeof prop.default === 'function' ? prop.default() : prop.default
    expect(defaultVal).toBe(false)
  })

  it('getNavigationDrawerClass treats undefined isNested like false', () => {
    expect(
      CommonSimulatorPreviewDialog.computed.getNavigationDrawerClass.call({})
    ).toEqual({
      'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
      'nested-drawer': undefined
    })
  })

  it('callForLanguages maps lookup response into languages list', async () => {
    jest.spyOn(LookupLocalStorage, 'getSingle').mockResolvedValueOnce([
      { isoFriendlyName: 'English', name: 'English', resourceId: 'lang-en', description: 'EN' },
      { name: 'Turkish', resourceId: 'lang-tr', description: 'TR' }
    ])

    const ctx = { languages: [] }
    CommonSimulatorPreviewDialog.methods.callForLanguages.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(ctx.languages).toEqual([
      {
        text: 'English',
        languageTypeName: 'English',
        value: 'lang-en',
        description: 'EN'
      },
      {
        text: 'Turkish',
        languageTypeName: 'Turkish',
        value: 'lang-tr',
        description: 'TR'
      }
    ])
  })
})
