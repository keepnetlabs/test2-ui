import NewEmailTemplates from '@/components/PhishingScenarios/NewEmailTemplates.vue'

jest.mock('@/utils/functions', () => ({
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  FLAGGED_AREA_CSS: '<style>.flagged-area{outline:1px solid red;}</style>',
  cancellableAxiosRequest: jest.fn((fn) => fn),
  createRandomCryptStringNumber: jest.fn(() => 'rnd'),
  getDefaultAxiosPayload: jest.fn((payload = {}) => ({
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'CreateTime',
    ascending: false,
    filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] },
    ...payload
  }))
}))

describe('NewEmailTemplates.vue methods/computed', () => {
  it('getTitle computed resolves correct mode text', () => {
    expect(
      NewEmailTemplates.computed.getTitle.call({
        isEditingSystemTemplate: true,
        isEdit: false,
        isDuplicate: false
      })
    ).toBe('Duplicate Email Template')

    expect(
      NewEmailTemplates.computed.getTitle.call({
        isEditingSystemTemplate: false,
        isEdit: true,
        isDuplicate: true
      })
    ).toBe('Duplicate Email Template')

    expect(
      NewEmailTemplates.computed.getTitle.call({
        isEditingSystemTemplate: false,
        isEdit: true,
        isDuplicate: false
      })
    ).toBe('Edit Email Template')

    expect(
      NewEmailTemplates.computed.getTitle.call({
        isEditingSystemTemplate: false,
        isEdit: false,
        isDuplicate: false
      })
    ).toBe('New Email Template')
  })

  it('language-related computed values return expected arrays/objects', () => {
    const ctx = {
      languagesPayload: [
        { languageTypeResourceId: 'tr', isTranslated: true },
        { languageTypeResourceId: 'en', isTranslated: false },
        { languageTypeResourceId: 'de', isTranslated: true }
      ],
      activeLanguage: 'de'
    }

    expect(NewEmailTemplates.computed.translatedLanguageResourceIds.call(ctx)).toEqual(['tr', 'de'])
    expect(NewEmailTemplates.computed.getSelectedLanguagePayload.call(ctx)).toEqual({
      languageTypeResourceId: 'de',
      isTranslated: true
    })
  })

  it('activeFileName computed prefers attachmentFiles then imported attachments', () => {
    expect(
      NewEmailTemplates.computed.activeFileName.call({
        formValues: {
          attachmentFiles: [{ fileName: 'first.docx' }],
          importedEmailAttachments: [{ fileName: 'imported.pdf' }]
        }
      })
    ).toBe('first.docx')

    expect(
      NewEmailTemplates.computed.activeFileName.call({
        formValues: {
          attachmentFiles: [],
          importedEmailAttachments: [{ fileName: 'imported.pdf' }]
        }
      })
    ).toBe('imported.pdf')

    expect(
      NewEmailTemplates.computed.activeFileName.call({
        formValues: {
          attachmentFiles: [],
          importedEmailAttachments: []
        }
      })
    ).toBe('')
  })

  it('setFooterButtonIds updates ids only for duplicate flow', () => {
    const duplicateCtx = {
      isDuplicate: true,
      footerButtonsIds: {}
    }
    NewEmailTemplates.methods.setFooterButtonIds.call(duplicateCtx)
    expect(duplicateCtx.footerButtonsIds.saveButton).toBe('btn-duplicate-save--email-templates-modal')

    const normalCtx = {
      isDuplicate: false,
      footerButtonsIds: { saveButton: 'original' }
    }
    NewEmailTemplates.methods.setFooterButtonIds.call(normalCtx)
    expect(normalCtx.footerButtonsIds.saveButton).toBe('original')
  })

  it('getPreferredLanguagePayload and setEmptyLanguagesPayload fill missing fields', () => {
    const ctx = {
      scenarioDetailsLookup: { companyLanguageTypeResourceId: 'tr' },
      languagesPayload: [
        {
          languageTypeResourceId: 'tr',
          fromName: 'Keepnet',
          fromAddress: 'tr@keepnetlabs.com',
          subject: 'Merhaba',
          template: '<p>TR</p>',
          ccAddresses: ['tr-cc@k.com']
        },
        {
          languageTypeResourceId: 'en',
          fromName: '',
          fromAddress: '',
          subject: '',
          template: '',
          ccAddresses: []
        }
      ]
    }
    ctx.getPreferredLanguagePayload = NewEmailTemplates.methods.getPreferredLanguagePayload

    const preferred = NewEmailTemplates.methods.getPreferredLanguagePayload.call(ctx)
    expect(preferred.languageTypeResourceId).toBe('tr')

    const filled = NewEmailTemplates.methods.setEmptyLanguagesPayload.call(ctx)
    expect(filled[1].fromName).toBe('Keepnet')
    expect(filled[1].fromAddress).toBe('tr@keepnetlabs.com')
    expect(filled[1].subject).toBe('Merhaba')
    expect(filled[1].template).toBe('<p>TR</p>')
    expect(filled[1].ccAddresses).toEqual(['tr-cc@k.com'])
  })

  it('validateAvailableFor emits validation state', () => {
    const emit = jest.fn()
    const ctx = {
      isAvailableForValidated: false,
      isAvailableForValid: false,
      $emit: emit
    }

    NewEmailTemplates.methods.validateAvailableFor.call(ctx, [{ id: 1 }])
    expect(ctx.isAvailableForValidated).toBe(true)
    expect(ctx.isAvailableForValid).toBe(true)
    expect(emit).toHaveBeenCalledWith('validation', true)
  })

  it('changeNewEmailTemplateModalStatus closes directly when unchanged', () => {
    const emit = jest.fn()
    const ctx = {
      formValues: { name: 'A' },
      initialFormValues: { name: 'A' },
      showLeavingDialog: true,
      $emit: emit,
      $store: { dispatch: jest.fn() }
    }

    NewEmailTemplates.methods.changeNewEmailTemplateModalStatus.call(ctx)
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false)
    expect(ctx.$store.dispatch).not.toHaveBeenCalled()
  })

  it('handleAttachmentRemove removes matching entries from all attachment arrays', () => {
    const ctx = {
      formValues: {
        attachmentFilesToRemove: '',
        attachmentFiles: [{ fileName: 'a.docx' }, { fileName: 'b.docx' }],
        importedEmailAttachments: [{ fileName: 'a.docx' }],
        attachmentFilesFromApi: [{ fileName: 'a.docx' }, { fileName: 'b.docx' }]
      }
    }

    NewEmailTemplates.methods.handleAttachmentRemove.call(ctx, {
      item: { fileName: 'a.docx' },
      index: 0
    })

    expect(ctx.formValues.attachmentFilesToRemove).toBe('a.docx')
    expect(ctx.formValues.attachmentFiles.map((x) => x.fileName)).toEqual(['b.docx'])
    expect(ctx.formValues.importedEmailAttachments).toEqual([])
    expect(ctx.formValues.attachmentFilesFromApi.map((x) => x.fileName)).toEqual(['a.docx'])
  })

  it('showLocalizationSuccessMessage uses relocalize and single-language messages', () => {
    const dispatch = jest.fn()
    const ctx = {
      isDefault: false,
      isRelocalizeOperation: true,
      relocalizeLanguageName: 'Turkish',
      selectedLanguages: [{ value: 'tr', text: 'Turkish' }],
      languageItems: [],
      getLanguageNameById: NewEmailTemplates.methods.getLanguageNameById,
      $store: { dispatch }
    }

    NewEmailTemplates.methods.showLocalizationSuccessMessage.call(ctx, [
      { languageResourceId: 'tr' }
    ])
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'The Turkish localization has been updated.' })
    )

    dispatch.mockClear()
    ctx.isRelocalizeOperation = false
    NewEmailTemplates.methods.showLocalizationSuccessMessage.call(ctx, [
      { languageResourceId: 'tr' }
    ])
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'The Turkish language was successfully localized.' })
    )
  })

  it('red flag template helpers add and clean css/classes safely', () => {
    const ctx = {
      _isFullHtmlTemplate: NewEmailTemplates.methods._isFullHtmlTemplate,
      _injectCssIntoHead: NewEmailTemplates.methods._injectCssIntoHead,
      _prependCssToBodyContent: NewEmailTemplates.methods._prependCssToBodyContent,
      _getPreventClickScript: NewEmailTemplates.methods._getPreventClickScript,
      _injectScriptIntoBody: NewEmailTemplates.methods._injectScriptIntoBody,
      _hasHeadTag: NewEmailTemplates.methods._hasHeadTag,
      _escapeRegExp: (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const html = '<html><head></head><body><div>Hi</div></body></html>'
    const styled = NewEmailTemplates.methods._addFlaggedStylesToTemplate.call(ctx, html)
    expect(styled).toContain('.flagged-area')

    const dirty =
      '<div class="x flagged-area flagged-area-img" data-flag-tooltip="risky">Body</div>'
    const cleaned = NewEmailTemplates.methods._removeRedFlagClassesAndAttributes.call(ctx, dirty)
    expect(cleaned).not.toContain('flagged-area')
    expect(cleaned).not.toContain('data-flag-tooltip')
  })
})
