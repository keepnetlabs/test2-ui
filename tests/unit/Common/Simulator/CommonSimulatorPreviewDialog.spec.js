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
      CommonSimulatorPreviewDialog.computed.getNavigationDrawerClass.call({})
    ).toEqual({
      'k-navigation-drawer k-navigation-drawer--preview-dialog': true
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
