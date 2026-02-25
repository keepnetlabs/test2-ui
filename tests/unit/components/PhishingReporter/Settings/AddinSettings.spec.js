import AddinSettings from '@/components/PhishingReporter/Settings/AddinSettings.vue'

describe('AddinSettings.vue', () => {
  it('has expected component name', () => {
    expect(AddinSettings.name).toBe('AddinSettings')
  })

  it('computed language option filters work as expected', () => {
    const baseCtx = {
      languageOptions: [
        { text: 'English (United Kingdom)', name: 'en-GB', value: 1 },
        { text: 'French', name: 'fr-FR', value: 2 },
        { text: 'German', name: 'de-DE', value: 3 }
      ],
      formValues: {
        dialogBoxSettings: [{ languageName: 'English (United Kingdom)' }]
      }
    }
    const options = AddinSettings.computed.getLanguageOptions.call(baseCtx)
    expect(options).toEqual([
      { text: 'French', name: 'fr-FR', value: 2 },
      { text: 'German', name: 'de-DE', value: 3 }
    ])

    const filtered = AddinSettings.computed.getLanguageFilterOptions.call({
      ...baseCtx,
      languageFilter: 'fr',
      getLanguageOptions: options
    })
    expect(filtered).toEqual([{ text: 'French', name: 'fr-FR', value: 2 }])
  })

  it('defaultLanguage watcher marks only selected language as default', () => {
    const ctx = {
      formValues: {
        dialogBoxSettings: [
          { languageName: 'English (United Kingdom)', isDefault: false },
          { languageName: 'French', isDefault: true }
        ]
      }
    }

    AddinSettings.watch.defaultLanguage.call(ctx, 'English (United Kingdom)')
    expect(ctx.formValues.dialogBoxSettings[0].isDefault).toBe(true)
    expect(ctx.formValues.dialogBoxSettings[1].isDefault).toBe(false)
  })

  it('delete language confirm handles no-op and successful deletion branches', () => {
    const ctx = {
      selectedLanguageToDelete: '',
      isLanguageDeletionDialogVisible: true,
      defaultLanguage: 'English (United Kingdom)',
      tab: 'French',
      formValues: {
        dialogBoxSettings: [
          { languageName: 'English (United Kingdom)' },
          { languageName: 'French' }
        ]
      }
    }
    AddinSettings.methods.handleDeleteSelectedLanguageConfirm.call(ctx)
    expect(ctx.formValues.dialogBoxSettings).toHaveLength(2)

    ctx.selectedLanguageToDelete = 'French'
    AddinSettings.methods.handleDeleteSelectedLanguageConfirm.call(ctx)
    expect(ctx.formValues.dialogBoxSettings).toHaveLength(1)
    expect(ctx.tab).toBe('English (United Kingdom)')
    expect(ctx.isLanguageDeletionDialogVisible).toBe(false)
  })

  it('getRequiredValue and getTextAreaRules depend on field content', () => {
    const ctx = {
      formValues: { message: 'hello', empty: '' },
      validations: { required: jest.fn(), maxLength: jest.fn() },
      labels: { Required: 'Required', getMaxLengthMessage: jest.fn(() => 'max') }
    }

    expect(AddinSettings.methods.getRequiredValue.call(ctx, 'message')).toBe(true)
    expect(AddinSettings.methods.getRequiredValue.call(ctx, 'empty')).toBe(false)

    const rulesWithValue = AddinSettings.methods.getTextAreaRules.call(ctx, 'message')
    const rulesWithoutValue = AddinSettings.methods.getTextAreaRules.call(ctx, 'empty')
    expect(rulesWithValue).toHaveLength(2)
    expect(rulesWithoutValue).toHaveLength(0)
  })

  it('onFileChanged and getImagePreview cover both branches', () => {
    const ctx = { formValues: { file: 'x' } }
    AddinSettings.methods.onFileChanged.call(ctx, [])
    expect(ctx.formValues.file).toBe('')

    const blob = new Blob(['x'], { type: 'image/png' })
    AddinSettings.methods.onFileChanged.call(ctx, blob)
    expect(ctx.formValues.file).toBe(blob)

    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:img')
    const preview = AddinSettings.methods.getImagePreview.call(ctx)
    expect(preview).toBe('blob:img')
    globalThis.URL.createObjectURL = () => {
      throw new Error('not supported')
    }
    expect(AddinSettings.methods.getImagePreview.call(ctx)).toBe('')
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })

  it('tab and dialog helper methods update state', () => {
    const ctx = {
      isAddNewLanguageMenuVisible: false,
      selectedLanguageToDelete: '',
      isLanguageDeletionDialogVisible: false,
      selectedVersionRow: null,
      reporterVersionModalStatus: false
    }

    AddinSettings.methods.handleAddNewLanguageMenuClick.call(ctx)
    expect(ctx.isAddNewLanguageMenuVisible).toBe(true)

    AddinSettings.methods.handleDeleteSelectedLanguage.call(ctx, 'French')
    expect(ctx.selectedLanguageToDelete).toBe('French')
    expect(ctx.isLanguageDeletionDialogVisible).toBe(true)

    AddinSettings.methods.handleCloseLanguageDeletionDialog.call(ctx)
    expect(ctx.selectedLanguageToDelete).toBe('')
    expect(ctx.isLanguageDeletionDialogVisible).toBe(false)

    AddinSettings.methods.handleHistoryRow.call(ctx, { version: '1.0.0' })
    expect(ctx.selectedVersionRow).toEqual({ version: '1.0.0' })
    expect(ctx.reporterVersionModalStatus).toBe(true)

    expect(AddinSettings.methods.handleTabChange.call(ctx, 'English (United Kingdom)')).toBe(true)
    expect(AddinSettings.methods.handleTabChange.call(ctx, 'addNewLangauge')).toBe(false)
  })
})
