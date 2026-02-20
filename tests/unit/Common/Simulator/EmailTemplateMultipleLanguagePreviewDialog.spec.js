jest.mock('@/api/phishingsimulator', () => ({
  getEmailTemplatePreviewContent: jest.fn(),
  checkRedFlags: jest.fn()
}))

import EmailTemplateMultipleLanguagePreviewDialog from '@/components/Common/Simulator/EmailTemplates/EmailTemplateMultipleLanguagePreviewDialog.vue'
import labels from '@/model/constants/labels'
import { checkRedFlags } from '@/api/phishingsimulator'

describe('EmailTemplateMultipleLanguagePreviewDialog.vue', () => {
  it('computes drawer class, red flags text and title', () => {
    expect(
      EmailTemplateMultipleLanguagePreviewDialog.computed.getNavigationDrawerClass.call({
        isNested: false
      })
    ).toEqual({
      'k-navigation-drawer k-navigation-drawer--email-template-preview': true,
      'nested-drawer': false
    })

    expect(
      EmailTemplateMultipleLanguagePreviewDialog.computed.redFlagsText.call({
        isShowRedFlags: false
      })
    ).toBe('Show Red Flags')
    expect(
      EmailTemplateMultipleLanguagePreviewDialog.computed.redFlagsText.call({
        isShowRedFlags: true
      })
    ).toBe('Hide Red Flags')

    expect(
      EmailTemplateMultipleLanguagePreviewDialog.computed.getTitle.call({
        isIndividualPrintoutTemplate: false,
        title: 'Email Template Preview'
      })
    ).toBe('Email Template Preview')
    expect(
      EmailTemplateMultipleLanguagePreviewDialog.computed.getTitle.call({
        isIndividualPrintoutTemplate: true,
        title: 'x'
      })
    ).toBe(labels.IndividualPrintoutTemplatePreview)
  })

  it('computes language labels and selected language payload', () => {
    expect(
      EmailTemplateMultipleLanguagePreviewDialog.computed.templateLanguageLabel.call({
        selectedLanguages: [{ value: 'en' }]
      })
    ).toBe('Template Language (1)')
    expect(
      EmailTemplateMultipleLanguagePreviewDialog.computed.templateLanguageLabel.call({
        selectedLanguages: [{ value: 'en' }, { value: 'tr' }]
      })
    ).toBe('Template Languages (2)')

    const payload = EmailTemplateMultipleLanguagePreviewDialog.computed.getSelectedLanguagePayload.call(
      {
        activeLanguage: 'tr',
        templates: [
          { languageTypeResourceId: 'en', template: 'EN' },
          { languageTypeResourceId: 'tr', template: 'TR' }
        ]
      }
    )
    expect(payload).toEqual({ languageTypeResourceId: 'tr', template: 'TR' })
  })

  it('handles overlay click and close by calling closeDrawer', () => {
    const closeDrawer = jest.fn()
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn()
    }
    const ctx = { closeDrawer }

    EmailTemplateMultipleLanguagePreviewDialog.methods.handleOverlayClick.call(ctx, event)
    expect(event.stopPropagation).toHaveBeenCalled()
    expect(event.preventDefault).toHaveBeenCalled()
    expect(closeDrawer).toHaveBeenCalledTimes(1)

    EmailTemplateMultipleLanguagePreviewDialog.methods.handleClose.call(ctx)
    expect(closeDrawer).toHaveBeenCalledTimes(2)
  })

  it('handleEdit emits event and disables html overflow control', () => {
    const emit = jest.fn()
    const ctx = {
      isHtmlOverflowControlManuallyDisabled: false,
      selectedRow: { resourceId: 'et-1' },
      $emit: emit
    }

    EmailTemplateMultipleLanguagePreviewDialog.methods.handleEdit.call(ctx)
    expect(ctx.isHtmlOverflowControlManuallyDisabled).toBe(true)
    expect(emit).toHaveBeenCalledWith('on-edit', { resourceId: 'et-1' })
  })

  it('handleLanguageChange stores current flags and switches template/language', () => {
    const updateTemplateWithFlaggedStyles = jest.fn()
    const ctx = {
      activeLanguage: 'en',
      isShowRedFlags: true,
      redFlags: { subject: { isRedFlagged: true } },
      templateHTML: '<p>EN</p>',
      emailTemplateParams: {
        fromName: 'A',
        fromAddress: 'a@test.com',
        subject: 'Subj',
        template: '<p>EN</p>',
        attachment: { name: 'a.pdf' }
      },
      activeFileName: 'a.pdf',
      lastRedFlags: {},
      templates: [
        { languageTypeResourceId: 'en', template: '<p>EN</p>' },
        { languageTypeResourceId: 'tr', template: '<p>TR</p>', fromName: 'B' }
      ],
      updateTemplateWithFlaggedStyles,
      isFlaggedStylesEnabled: false
    }

    EmailTemplateMultipleLanguagePreviewDialog.methods.handleLanguageChange.call(ctx, 'tr')

    expect(ctx.lastRedFlags.en).toBeTruthy()
    expect(ctx.activeLanguage).toBe('tr')
    expect(ctx.templateHTML).toBe('<p>TR</p>')
    expect(ctx.isShowRedFlags).toBe(false)
    expect(ctx.isFlaggedStylesEnabled).toBe(false)
    expect(updateTemplateWithFlaggedStyles).not.toHaveBeenCalled()
  })

  it('compareRedFlags returns true when nothing changed and object when changed', () => {
    const baseCtx = {
      lastRedFlags: {
        en: {
          templates: ['<p>Hello</p>'],
          textfieldValues: {
            fromName: 'A',
            fromAddress: 'a@test.com',
            subject: 'Hi',
            attachmentFileName: 'x.pdf'
          }
        }
      },
      activeLanguage: 'en',
      emailTemplateParams: {
        fromName: 'A',
        fromAddress: 'a@test.com',
        subject: 'Hi',
        template: '<p>Hello</p>'
      },
      templateHTML: '<p>Hello</p>',
      activeFileName: 'x.pdf'
    }

    expect(EmailTemplateMultipleLanguagePreviewDialog.methods.compareRedFlags.call(baseCtx)).toBe(true)

    const changedCtx = {
      ...baseCtx,
      emailTemplateParams: {
        ...baseCtx.emailTemplateParams,
        subject: 'Changed'
      }
    }
    expect(EmailTemplateMultipleLanguagePreviewDialog.methods.compareRedFlags.call(changedCtx)).toEqual(
      expect.objectContaining({ subject: 'Changed' })
    )
  })

  it('validates payload and html template detection helpers', () => {
    const methods = EmailTemplateMultipleLanguagePreviewDialog.methods

    expect(methods._isValidLanguagePayload.call({}, { template: '<p>x</p>' })).toBeTruthy()
    expect(methods._isValidLanguagePayload.call({}, { template: '   ' })).toBeFalsy()
    expect(methods._isValidLanguagePayload.call({}, null)).toBeFalsy()

    expect(methods._isFullHtmlTemplate.call({}, '<html><body>x</body></html>')).toBe(true)
    expect(methods._isFullHtmlTemplate.call({}, '<div>x</div>')).toBe(false)
    expect(methods._hasHeadTag.call({}, '<html><head></head><body>x</body></html>')).toBe(true)
    expect(methods._hasHeadTag.call({}, '<html><body>x</body></html>')).toBe(false)
  })

  it('checkRedFlagsWithRetry retries and resolves after transient failures', async () => {
    checkRedFlags
      .mockRejectedValueOnce(new Error('temporary-1'))
      .mockRejectedValueOnce(new Error('temporary-2'))
      .mockResolvedValueOnce({ data: { ok: true } })

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn()
      return 1
    })

    const result = await EmailTemplateMultipleLanguagePreviewDialog.methods.checkRedFlagsWithRetry.call(
      EmailTemplateMultipleLanguagePreviewDialog.methods,
      { template: '<p>x</p>' },
      5,
      1,
      1
    )

    expect(result).toEqual({ data: { ok: true } })
    expect(checkRedFlags).toHaveBeenCalledTimes(3)
    setTimeoutSpy.mockRestore()
  })

  it('adds and removes flagged styles from template html', () => {
    const methods = EmailTemplateMultipleLanguagePreviewDialog.methods
    const ctx = {
      _isFullHtmlTemplate: methods._isFullHtmlTemplate,
      _injectCssIntoHead: methods._injectCssIntoHead,
      _prependCssToBodyContent: methods._prependCssToBodyContent,
      _injectScriptIntoBody: methods._injectScriptIntoBody,
      _getPreventClickScript: methods._getPreventClickScript,
      _hasHeadTag: methods._hasHeadTag,
      _escapeRegExp: methods._escapeRegExp
    }

    const original = '<html><body><a href="#">x</a></body></html>'
    const withFlags = methods._addFlaggedStylesToTemplate.call(ctx, original)
    const removed = methods._removeFlaggedStylesFromTemplate.call(ctx, withFlags)

    expect(withFlags).toContain('<script>')
    expect(withFlags).not.toBe(original)
    expect(removed).toContain('<html')
    expect(removed).not.toContain('<script>')
  })

  it('updateTemplateWithFlaggedStyles applies add/remove logic by toggle', () => {
    const methods = EmailTemplateMultipleLanguagePreviewDialog.methods
    const ctx = {
      templateHTML: '<html><body><p>A</p></body></html>',
      isFlaggedStylesEnabled: true,
      activeLanguage: 'en',
      lastRedFlags: {
        en: { templates: [] }
      },
      _addFlaggedStylesToTemplate: methods._addFlaggedStylesToTemplate,
      _removeFlaggedStylesFromTemplate: methods._removeFlaggedStylesFromTemplate,
      _isFullHtmlTemplate: methods._isFullHtmlTemplate,
      _injectCssIntoHead: methods._injectCssIntoHead,
      _prependCssToBodyContent: methods._prependCssToBodyContent,
      _injectScriptIntoBody: methods._injectScriptIntoBody,
      _getPreventClickScript: methods._getPreventClickScript,
      _hasHeadTag: methods._hasHeadTag,
      _escapeRegExp: methods._escapeRegExp
    }

    methods.updateTemplateWithFlaggedStyles.call(ctx)
    expect(ctx.templateHTML).toContain('<script>')

    ctx.isFlaggedStylesEnabled = false
    methods.updateTemplateWithFlaggedStyles.call(ctx)
    expect(ctx.templateHTML).not.toContain('<script>')
    expect(ctx.lastRedFlags.en.templates.length).toBeGreaterThan(0)
  })
})
