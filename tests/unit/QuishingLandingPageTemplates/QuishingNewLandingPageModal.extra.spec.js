jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  isDifferent: jest.fn(() => true),
  scrollToComponent: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn(() => Promise.resolve([]))
  }
}))

jest.mock('@/api/quishing', () => ({
  createLandingPage: jest.fn(() => Promise.resolve()),
  updateLandingPage: jest.fn(() => Promise.resolve()),
  getMergedTextForQuishing: jest.fn(() =>
    Promise.resolve({
      data: { data: { mergeTags: ['userName'] } }
    })
  ),
  getLandingPageTemplatePreviewContent: jest.fn(() =>
    Promise.resolve({
      data: { data: { landingPages: [{ content: '<html>preview</html>' }] } }
    })
  )
}))

import QuishingNewLandingPageModal from '@/components/QuishingLandingPageTemplates/QuishingNewLandingPageModal.vue'
import QuishingService from '@/api/quishing'
import { scrollToComponent, isDifferent } from '@/utils/functions'

describe('QuishingNewLandingPageModal.vue (extra branches)', () => {
  const { methods, computed, created } = QuishingNewLandingPageModal

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('showMakeAvailableFor returns false for CompanyAdmin', () => {
    expect(
      computed.showMakeAvailableFor.call({
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } }
      })
    ).toBe(false)
  })

  it('showMakeAvailableFor returns true for non-CompanyAdmin', () => {
    expect(
      computed.showMakeAvailableFor.call({
        $store: { state: { auth: { userRoleName: 'SuperAdmin' } } }
      })
    ).toBe(true)
  })

  it('clickOnlyMethodText falls back to default label when type-1 label is missing', () => {
    expect(
      computed.clickOnlyMethodText.call({
        formValues: { methodTypeId: '1' },
        landingPageData: { methodTypes: [{ value: '2', text: 'Data Submission' }] }
      })
    ).toBe('Click Only')
  })

  it('clickOnlyMethodText returns configured method text when type-1 label exists', () => {
    expect(
      computed.clickOnlyMethodText.call({
        formValues: { methodTypeId: '1' },
        landingPageData: { methodTypes: [{ value: '1', text: 'Click Mode' }] }
      })
    ).toBe('Click Mode')
  })

  it('clickOnlyMethodText returns empty when method is not click-only', () => {
    expect(
      computed.clickOnlyMethodText.call({
        formValues: { methodTypeId: '2' },
        landingPageData: { methodTypes: [{ value: '1', text: 'Click Only' }] }
      })
    ).toBe('')
  })

  it('getTitle returns create/duplicate/edit titles by mode', () => {
    expect(computed.getTitle.call({ isEdit: false, isDuplicate: false })).toBe(
      'New Landing Page Template'
    )
    expect(computed.getTitle.call({ isEdit: true, isDuplicate: true })).toBe(
      'Duplicate Landing Page Template'
    )
    expect(computed.getTitle.call({ isEdit: true, isDuplicate: false })).toBe(
      'Edit Landing Page Template'
    )
  })

  it('isRenderMakeAvailableFor returns false when editItemsDisabled is true', () => {
    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: true,
        $store: { state: { auth: { userRoleName: 'SuperAdmin' } } },
        selectedItem: {}
      })
    ).toBe(false)
  })

  it('isRenderMakeAvailableFor returns false for CompanyAdmin without selectedItem', () => {
    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: false,
        selectedItem: null,
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } }
      })
    ).toBe(false)
  })

  it('isRenderMakeAvailableFor returns true for CompanyAdmin with selectedItem', () => {
    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: false,
        selectedItem: { id: 'x' },
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } }
      })
    ).toBe(true)
  })

  it('schema/domain/path/parameter/extension computed fields fallback to empty arrays', () => {
    const ctx = { landingPageData: null }
    expect(computed.getUrlSchemaTypes.call(ctx)).toEqual([])
    expect(computed.getDomainRecordTypes.call(ctx)).toEqual([])
    expect(computed.getExtensionTypes.call(ctx)).toEqual([])
    expect(computed.getParameterTypes.call(ctx)).toEqual([])
    expect(computed.getPathTypes.call(ctx)).toEqual([])
  })

  it('schema/domain/path/parameter/extension computed fields return landingPageData values', () => {
    const ctx = {
      landingPageData: {
        urlSchemaTypes: [{ value: 'https' }],
        domainRecords: [{ value: 'rec' }],
        extensionTypes: [{ value: '.html' }],
        parameterTypes: [{ value: 'utm' }],
        pathTypes: [{ value: '/x' }]
      }
    }
    expect(computed.getUrlSchemaTypes.call(ctx)).toEqual([{ value: 'https' }])
    expect(computed.getDomainRecordTypes.call(ctx)).toEqual([{ value: 'rec' }])
    expect(computed.getExtensionTypes.call(ctx)).toEqual([{ value: '.html' }])
    expect(computed.getParameterTypes.call(ctx)).toEqual([{ value: 'utm' }])
    expect(computed.getPathTypes.call(ctx)).toEqual([{ value: '/x' }])
  })

  it('created sets duplicate footer ids', () => {
    const ctx = {
      isDuplicate: true,
      isEdit: false,
      landingPageData: { methodTypes: [{ value: '1' }] },
      formValues: {},
      footerButtonsIds: {},
      callForMergedTags: jest.fn(),
      callForLanguages: jest.fn(),
      getCurrentCompany: {}
    }

    created.call(ctx)

    expect(ctx.footerButtonsIds).toEqual({
      cancelButton: 'btn-duplicate-cancel--landing-page-templates-modal',
      backButton: 'btn-duplicate-back--landing-page-templates-modal',
      nextButton: 'btn-duplicate-next--landing-page-templates-modal',
      saveButton: 'btn-duplicate-save--landing-page-templates-modal'
    })
  })

  it('created assigns company preferred language in create mode', () => {
    const ctx = {
      isDuplicate: false,
      isEdit: false,
      landingPageData: { methodTypes: [{ value: '1' }] },
      formValues: {},
      footerButtonsIds: {},
      callForMergedTags: jest.fn(),
      callForLanguages: jest.fn(),
      getCurrentCompany: { preferredLanguageTypeResourceId: 'lang-tr' }
    }

    created.call(ctx)

    expect(ctx.formValues.methodTypeId).toBe('1')
    expect(ctx.formValues.difficultyTypeId).toBe('1')
    expect(ctx.formValues.languageTypeResourceId).toBe('lang-tr')
  })

  it('nextStep scrolls when form valid but make-available validation fails', () => {
    const ctx = {
      step: 1,
      availableForRequests: [],
      $refs: {
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: false
        },
        refFormStep1: {
          validate: jest.fn(() => true),
          $el: { querySelector: jest.fn(() => '.msg') }
        }
      }
    }

    methods.nextStep.call(ctx)

    expect(ctx.step).toBe(1)
    expect(scrollToComponent).toHaveBeenCalledWith('.msg')
  })

  it('nextStep increases step when form and make-available are valid', () => {
    const ctx = {
      step: 1,
      availableForRequests: [{ id: 1 }],
      $refs: {
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true
        },
        refFormStep1: {
          validate: jest.fn(() => true)
        }
      }
    }

    methods.nextStep.call(ctx)
    expect(ctx.step).toBe(2)
  })

  it('validateAvailableFor emits validation false for empty value', () => {
    const emit = jest.fn()
    const ctx = {
      isAvailableForValidated: false,
      isAvailableForValid: true,
      $emit: emit
    }

    methods.validateAvailableFor.call(ctx, [])

    expect(ctx.isAvailableForValidated).toBe(true)
    expect(ctx.isAvailableForValid).toBe(false)
    expect(emit).toHaveBeenCalledWith('validation', false)
  })

  it('validateAvailableFor emits validation true for non-empty value', () => {
    const emit = jest.fn()
    const ctx = {
      isAvailableForValidated: false,
      isAvailableForValid: false,
      $emit: emit
    }

    methods.validateAvailableFor.call(ctx, [{ id: 1 }])

    expect(ctx.isAvailableForValid).toBe(true)
    expect(emit).toHaveBeenCalledWith('validation', true)
  })

  it('backStep decreases current step', () => {
    const ctx = { step: 2 }
    methods.backStep.call(ctx)
    expect(ctx.step).toBe(1)
  })

  it('handleDeleteLandingPage keeps tab for non-first/second index', () => {
    const ctx = {
      formValues: {
        landingPages: [
          { name: 'Page 1', order: 1 },
          { name: 'Page 2', order: 2 },
          { name: 'Page 3', order: 3 }
        ]
      },
      tab: 'page3'
    }

    methods.handleDeleteLandingPage.call(ctx, 2)

    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.tab).toBe('page3')
  })

  it('handleDeleteLandingPage resets tab to page1 for first and second index', () => {
    const ctxFirst = {
      formValues: {
        landingPages: [
          { name: 'Page 1', order: 1 },
          { name: 'Page 2', order: 2 }
        ]
      },
      tab: 'page2'
    }
    methods.handleDeleteLandingPage.call(ctxFirst, 0)
    expect(ctxFirst.tab).toBe('page1')

    const ctxSecond = {
      formValues: {
        landingPages: [
          { name: 'Page 1', order: 1 },
          { name: 'Page 2', order: 2 },
          { name: 'Page 3', order: 3 }
        ]
      },
      tab: 'page3'
    }
    methods.handleDeleteLandingPage.call(ctxSecond, 1)
    expect(ctxSecond.tab).toBe('page1')
  })

  it('submit calls createLandingPage when not edit mode', async () => {
    const emit = jest.fn()
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: 'id-1',
      isSubmitDisabled: false,
      availableForRequests: [{ id: 1 }],
      formValues: {
        phishingLink: { subDomain: 'x' },
        name: 'Landing'
      },
      $refs: {
        refEmailTemplateContent: { validate: jest.fn(() => true) },
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true,
          getAvailableForValues: jest.fn(() => ['mapped'])
        }
      },
      $emit: emit
    }

    methods.submit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(QuishingService.createLandingPage).toHaveBeenCalledWith(
      expect.objectContaining({ availableForRequests: ['mapped'] })
    )
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit calls updateLandingPage when edit and not duplicate', async () => {
    const emit = jest.fn()
    const ctx = {
      isEdit: true,
      isDuplicate: false,
      emailTemplateId: 'id-2',
      isSubmitDisabled: false,
      availableForRequests: [],
      formValues: {
        phishingLink: { subDomain: 'x' },
        name: 'Landing'
      },
      $refs: {
        refEmailTemplateContent: { validate: jest.fn(() => true) },
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true,
          getAvailableForValues: jest.fn(() => [])
        }
      },
      $emit: emit
    }

    methods.submit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(QuishingService.updateLandingPage).toHaveBeenCalledWith(expect.any(Object), 'id-2')
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit invalid path scrolls and resets isSubmitDisabled', () => {
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      isSubmitDisabled: false,
      availableForRequests: [],
      formValues: { phishingLink: {} },
      $refs: {
        refEmailTemplateContent: { validate: jest.fn(() => false) },
        refFormStep1: {
          $el: { querySelector: jest.fn(() => '.err') }
        },
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true
        }
      }
    }

    methods.submit.call(ctx)

    expect(scrollToComponent).toHaveBeenCalledWith('.err')
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('changeNewEmailTemplateModalStatus emits close directly when no changes detected', () => {
    isDifferent.mockReturnValueOnce(false)
    const emit = jest.fn()
    const ctx = {
      formValues: { name: 'A' },
      initialFormValues: { name: 'A' },
      $emit: emit,
      $store: { dispatch: jest.fn() }
    }

    methods.changeNewEmailTemplateModalStatus.call(ctx)
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false)
  })

  it('changeNewEmailTemplateModalStatus opens leaving dialog when changes exist', () => {
    isDifferent.mockReturnValueOnce(true)
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      formValues: { name: 'A' },
      initialFormValues: { name: 'B' },
      $emit: emit,
      $store: { dispatch }
    }

    methods.changeNewEmailTemplateModalStatus.call(ctx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('handleUploadHTML forwards click to hidden file input', () => {
    const click = jest.fn()
    methods.handleUploadHTML.call({
      $refs: { refHtmlFile: { click } }
    })
    expect(click).toHaveBeenCalled()
  })

  it('handleClickOnlyPageAdded pushes selected page content and closes selector', async () => {
    QuishingService.getLandingPageTemplatePreviewContent.mockResolvedValueOnce({
      data: {
        data: {
          landingPages: [{ content: '<p>first</p>' }, { content: '<p>second</p>' }]
        }
      }
    })
    const ctx = {
      isSelectClickOnlyPageOpen: true,
      formValues: {
        landingPages: [{ name: 'Page 1', content: '<p>existing</p>', order: 1 }]
      },
      tab: 'page1'
    }

    await methods.handleClickOnlyPageAdded.call(ctx, 'rid-1', 1)

    expect(ctx.isSelectClickOnlyPageOpen).toBe(false)
    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.formValues.landingPages[1].content).toBe('<p>second</p>')
    expect(ctx.tab).toBe('page2')
  })

  it('handleClickOnlyPageAdded falls back to first page content when index is out of range', async () => {
    QuishingService.getLandingPageTemplatePreviewContent.mockResolvedValueOnce({
      data: {
        data: {
          landingPages: [{ content: '<p>first-fallback</p>' }]
        }
      }
    })
    const ctx = {
      isSelectClickOnlyPageOpen: true,
      formValues: {
        landingPages: [{ name: 'Page 1', content: '<p>existing</p>', order: 1 }]
      },
      tab: 'page1'
    }

    await methods.handleClickOnlyPageAdded.call(ctx, 'rid-2', 9)

    expect(ctx.formValues.landingPages[1].content).toBe('<p>first-fallback</p>')
    expect(ctx.tab).toBe('page2')
  })

  it('handleClickOnlyPageAdded uses empty content when landingPages payload is missing', async () => {
    QuishingService.getLandingPageTemplatePreviewContent.mockResolvedValueOnce({
      data: {
        data: {}
      }
    })
    const ctx = {
      isSelectClickOnlyPageOpen: true,
      formValues: {
        landingPages: [{ name: 'Page 1', content: '<p>existing</p>', order: 1 }]
      },
      tab: 'page1'
    }

    await methods.handleClickOnlyPageAdded.call(ctx, 'rid-empty', 0)

    expect(ctx.formValues.landingPages[1]).toEqual(
      expect.objectContaining({
        name: 'Page 2',
        order: 2,
        content: ''
      })
    )
    expect(ctx.tab).toBe('page2')
  })

  it('handleAddBlankPage appends a page and switches tab to page2 when two pages exist', () => {
    const ctx = {
      emailTemplateLogo: 'logo.png',
      formValues: {
        landingPages: [{ name: 'Page 1', order: 1, content: 'x' }]
      },
      tab: 'page1'
    }

    methods.handleAddBlankPage.call(ctx)

    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.formValues.landingPages[1].name).toBe('Page 2')
    expect(ctx.tab).toBe('page2')
  })

  it('handleAddBlankPage sets tab to page1 when list starts empty', () => {
    const ctx = {
      emailTemplateLogo: 'logo.png',
      formValues: {
        landingPages: []
      },
      tab: 'page2'
    }

    methods.handleAddBlankPage.call(ctx)

    expect(ctx.formValues.landingPages).toHaveLength(1)
    expect(ctx.formValues.landingPages[0].name).toBe('Page 1')
    expect(ctx.tab).toBe('page1')
  })

  it('handleHTMLUploadChange dispatches invalid file type error', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch }
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'image/png', size: 10 }] }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Invalid file type' })
    )
  })

  it('handleHTMLUploadChange dispatches size error for files over 5MB', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch }
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'text/html', size: 6 * 1024 * 1024 }] }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'File size should be less than 5MB' })
    )
  })

  it('handleHTMLUploadChange dispatches empty-file error when reader result is empty', () => {
    const dispatch = jest.fn()
    const originalFileReader = global.FileReader
    const mockFileReaderContext = { $store: { dispatch } }
    class MockFileReader {
      readAsText() {
        this.onload.call(mockFileReaderContext, { target: { result: '' } })
      }
    }
    global.FileReader = MockFileReader

    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'Page 1', content: 'x', order: 1 }] },
      tab: 'page1'
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'text/html', size: 100 }] }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Empty file' })
    )

    global.FileReader = originalFileReader
  })

  it('handleHTMLUploadChange appends new page and switches tab for valid html file', () => {
    const dispatch = jest.fn()
    const originalFileReader = global.FileReader
    class MockFileReader {
      readAsText() {
        this.onload({ target: { result: '<html>ok</html>' } })
      }
    }
    global.FileReader = MockFileReader

    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'Page 1', content: 'x', order: 1 }] },
      tab: 'page1'
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'text/html', size: 100 }] }
    })

    expect(dispatch).not.toHaveBeenCalled()
    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.formValues.landingPages[1]).toEqual({
      name: 'Page 2',
      order: 2,
      content: '<html>ok</html>'
    })
    expect(ctx.tab).toBe('page2')

    global.FileReader = originalFileReader
  })

  it('setAttachmentFile assigns attachment into formValues', () => {
    const ctx = { formValues: {} }
    methods.setAttachmentFile.call(ctx, [{ name: 'f1' }])
    expect(ctx.formValues.attachmentFiles).toEqual([{ name: 'f1' }])
  })

  it('getTagsComponent returns undefined for unknown merge tag key', () => {
    expect(methods.getTagsComponent.call({}, 'unknown-tag-key')).toBeUndefined()
  })

  it('setActiveBlockManagerComponents builds object from list', () => {
    const ctx = {
      activeBlockManagerComponents: {},
      getTagsComponent: jest.fn((item) => `cmp-${item}`)
    }

    methods.setActiveBlockManagerComponents.call(ctx, ['userName', 'status'])

    expect(ctx.activeBlockManagerComponents).toEqual({
      userName: 'cmp-userName',
      status: 'cmp-status'
    })
  })

  it('callForLanguages maps language options with iso fallback', async () => {
    const LookupLocalStorage = require('@/helper-classes/lookup-local-storage').default
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: '', name: 'Turkish', resourceId: 'tr' }
    ])
    const ctx = { languageOptions: [] }

    methods.callForLanguages.call(ctx)
    await Promise.resolve()

    expect(ctx.languageOptions).toEqual([
      { text: 'Turkish', languageTypeName: 'Turkish', value: 'tr' }
    ])
  })

  it('callForMergedTags maps merge tags to active block components', async () => {
    const ctx = {
      blockManagerComponents: [],
      activeBlockManagerComponents: {},
      setActiveBlockManagerComponents: jest.fn()
    }

    methods.callForMergedTags.call(ctx)
    await Promise.resolve()

    expect(QuishingService.getMergedTextForQuishing).toHaveBeenCalled()
    expect(ctx.setActiveBlockManagerComponents).toHaveBeenCalledWith(['userName'])
  })
})
