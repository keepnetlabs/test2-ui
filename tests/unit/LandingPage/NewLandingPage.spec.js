jest.mock('@/api/landingPage', () => ({
  getLandingPageTemplatePreviewContent: jest.fn()
}))

import { getLandingPageTemplatePreviewContent } from '@/api/landingPage'
import NewLandingPage from '@/components/LandingPage/NewLandingPage.vue'

describe('NewLandingPage.vue', () => {
  const { methods, computed } = NewLandingPage

  it('submit opens phishing link section when subDomain is missing', () => {
    const scrollIntoView = jest.fn()
    const ctx = {
      isSubmitDisabled: false,
      isPhishingLinkOpen: false,
      formValues: {
        phishingLink: {
          subDomain: ''
        }
      },
      $refs: {
        refInputPhishingLinkMini: {
          $el: { scrollIntoView }
        }
      },
      $nextTick: (cb) => cb()
    }

    methods.submit.call(ctx)

    expect(ctx.isSubmitDisabled).toBe(false)
    expect(ctx.isPhishingLinkOpen).toBe(true)
    expect(scrollIntoView).toHaveBeenCalled()
  })

  it('buildLandingPagesPayload switches main language when selected language differs', () => {
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      activeLanguage: 'tr',
      selectedLanguages: [{ value: 'en' }],
      formValues: {
        languageTypeResourceId: 'tr',
        landingPages: [{ name: 'TR', content: 'icerik', order: 1, prompt: '' }]
      },
      languagesPayload: [
        {
          languageTypeResourceId: 'en',
          landingPages: [{ name: 'EN', content: 'content', order: 1, prompt: '' }],
          isTranslated: true
        }
      ]
    }
    const payload = {
      languageTypeResourceId: 'tr',
      landingPages: [{ name: 'old', content: 'old', order: 1, prompt: '' }]
    }

    const result = methods.buildLandingPagesPayload.call(ctx, payload)

    expect(ctx.formValues.languageTypeResourceId).toBe('en')
    expect(payload.languageTypeResourceId).toBe('en')
    expect(result[0].name).toBe('EN')
    expect(result[0].content).toBe('content')
  })

  it('buildLandingPagesPayload adds translated languages and resourceId in edit mode', () => {
    const ctx = {
      isEdit: true,
      isDuplicate: false,
      selectedLanguages: [{ value: 'en' }, { value: 'tr' }],
      formValues: {
        languageTypeResourceId: 'en',
        landingPages: [{ name: 'Main', content: 'main-content', order: 1, prompt: '' }]
      },
      languagesPayload: [
        {
          languageTypeResourceId: 'en',
          landingPages: [{ name: 'Main', content: 'main-content', order: 1, prompt: '' }],
          isTranslated: true
        },
        {
          languageTypeResourceId: 'tr',
          landingPages: [{ name: 'Ana', content: 'tr-content', order: 1, prompt: '' }],
          isTranslated: true,
          resourceId: 'tr-res-1'
        }
      ]
    }
    const payload = {
      languageTypeResourceId: 'en',
      landingPages: [{ name: 'Main', content: 'main-content', order: 1, prompt: '' }]
    }

    const result = methods.buildLandingPagesPayload.call(ctx, payload)

    expect(result[0].languages).toHaveLength(1)
    expect(result[0].languages[0].languageTypeResourceId).toBe('tr')
    expect(result[0].languages[0].resourceId).toBe('tr-res-1')
  })

  it('buildLandingPagesPayload omits translated resourceId for duplicate mode', () => {
    const ctx = {
      isEdit: true,
      isDuplicate: true,
      selectedLanguages: [{ value: 'en' }, { value: 'tr' }],
      formValues: {
        languageTypeResourceId: 'en',
        landingPages: [{ name: 'Main', content: 'main-content', order: 1, prompt: '' }]
      },
      languagesPayload: [
        {
          languageTypeResourceId: 'en',
          landingPages: [{ name: 'Main', content: 'main-content', order: 1, prompt: '' }],
          isTranslated: true
        },
        {
          languageTypeResourceId: 'tr',
          landingPages: [{ name: 'Ana', content: 'tr-content', order: 1, prompt: '' }],
          isTranslated: true,
          resourceId: 'tr-res-1'
        }
      ]
    }
    const payload = {
      languageTypeResourceId: 'en',
      landingPages: [{ name: 'Main', content: 'main-content', order: 1, prompt: '' }]
    }

    const result = methods.buildLandingPagesPayload.call(ctx, payload)

    expect(result[0].languages[0].resourceId).toBeUndefined()
  })

  it('getLanguageObject resolves from languageItems, languageOptions and fallback', () => {
    const fromItemsCtx = {
      languageItems: [{ children: [{ text: 'Turkish', value: 'tr' }] }],
      languageOptions: []
    }
    const fromOptionsCtx = {
      languageItems: [],
      languageOptions: [{ text: 'English', languageTypeName: 'English', value: 'en' }]
    }
    const fromNameCtx = { languageItems: [], languageOptions: [] }

    expect(methods.getLanguageObject.call(fromItemsCtx, 'tr')).toEqual({
      text: 'Turkish',
      value: 'tr'
    })
    expect(methods.getLanguageObject.call(fromOptionsCtx, 'en')).toEqual({
      text: 'English',
      value: 'en'
    })
    expect(methods.getLanguageObject.call(fromNameCtx, 'de', 'German')).toEqual({
      text: 'German',
      value: 'de'
    })
  })

  it('menuNudgeBottom returns expected values for panel combinations', () => {
    expect(
      computed.menuNudgeBottom.call({ isPhishingLinkOpen: true, isAIAllyOpen: true })
    ).toBe(380)
    expect(
      computed.menuNudgeBottom.call({ isPhishingLinkOpen: true, isAIAllyOpen: false })
    ).toBe(220)
    expect(
      computed.menuNudgeBottom.call({ isPhishingLinkOpen: false, isAIAllyOpen: false })
    ).toBe(92)
  })

  it('getDisabledStatuses respects isDefault and isSubmitDisabled', () => {
    expect(
      computed.getDisabledStatuses.call({ isDefault: false, isSubmitDisabled: true })
    ).toEqual({
      nextButton: true,
      submitButton: true
    })
    expect(
      computed.getDisabledStatuses.call({ isDefault: true, isSubmitDisabled: true })
    ).toEqual({
      nextButton: false,
      submitButton: true
    })
  })

  it('computed method and visibility helpers return expected values', () => {
    expect(
      computed.getSelectedMethod.call({
        landingPageData: {
          methodTypes: [
            { value: '1', text: 'Click Only' },
            { value: '2', text: 'Data Submission' }
          ]
        },
        formValues: { methodTypeId: '2' }
      })
    ).toBe('Data Submission')
    expect(
      computed.isDataSubmission.call({
        formValues: { methodTypeId: '2' }
      })
    ).toBe(true)
    expect(
      computed.clickOnlyMethodText.call({
        landingPageData: {
          methodTypes: [{ value: '1', text: 'Click Only' }]
        }
      })
    ).toBe('Click Only')
    expect(
      computed.showMakeAvailableFor.call({
        $store: { state: { auth: { userRoleName: 'User' } } }
      })
    ).toBe(true)
  })

  it('isRenderMakeAvailableFor follows disabled flag, role and selected item', () => {
    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: true,
        $store: { state: { auth: { userRoleName: 'User' } } },
        selectedItem: null
      })
    ).toBe(false)
    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: false,
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } },
        selectedItem: null
      })
    ).toBe(false)
    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: false,
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } },
        selectedItem: { id: 1 }
      })
    ).toBe(true)
  })

  it('created sets methodType based on selectedMethodText and triggers helper calls', () => {
    const ctx = {
      isDuplicate: false,
      isEdit: false,
      selectedMethodText: 'Click Only',
      landingPageData: { methodTypes: [{ value: '1' }, { value: '2' }] },
      formValues: {},
      footerButtonsIds: {},
      callForMergedTags: jest.fn(),
      callForLanguages: jest.fn(),
      callForGetCurrentLandingPage: jest.fn(),
      callForGetCurrentLandingPageForEdit: jest.fn()
    }

    NewLandingPage.created.call(ctx)

    expect(ctx.formValues.methodTypeId).toBe('1')
    expect(ctx.formValues.difficultyTypeId).toBe('1')
    expect(ctx.callForMergedTags).toHaveBeenCalledTimes(1)
    expect(ctx.callForLanguages).toHaveBeenCalledTimes(1)
  })

  it('getTitle returns expected modal title variants', () => {
    expect(
      computed.getTitle.call({
        isEditingSystemTemplate: true,
        isEdit: false,
        isDuplicate: false
      })
    ).toBe('Duplicate Landing Page Template')
    expect(
      computed.getTitle.call({
        isEditingSystemTemplate: false,
        isEdit: false,
        isDuplicate: false
      })
    ).toBe('New Landing Page Template')
    expect(
      computed.getTitle.call({
        isEditingSystemTemplate: false,
        isEdit: true,
        isDuplicate: true
      })
    ).toBe('Duplicate Landing Page Template')
    expect(
      computed.getTitle.call({
        isEditingSystemTemplate: false,
        isEdit: true,
        isDuplicate: false
      })
    ).toBe('Edit Landing Page Template')
  })

  it('translatedLanguageResourceIds and getSelectedLanguagePayload work with fallback', () => {
    expect(
      computed.translatedLanguageResourceIds.call({
        languagesPayload: [
          { languageTypeResourceId: 'en', isTranslated: true },
          { languageTypeResourceId: 'tr', isTranslated: false }
        ]
      })
    ).toEqual(['en'])

    expect(
      computed.getSelectedLanguagePayload.call({
        languagesPayload: [{ languageTypeResourceId: 'tr', landingPages: [{ name: 'TR' }] }],
        activeLanguage: 'tr',
        formValues: { landingPages: [{ name: 'Main' }] }
      })
    ).toEqual({ languageTypeResourceId: 'tr', landingPages: [{ name: 'TR' }] })

    expect(
      computed.getSelectedLanguagePayload.call({
        languagesPayload: [],
        activeLanguage: 'en',
        formValues: { landingPages: [{ name: 'Main' }] }
      })
    ).toEqual({ landingPages: [{ name: 'Main' }] })
  })

  it('showLocalizationSuccessMessage dispatches singular success message', () => {
    const dispatch = jest.fn()
    const ctx = {
      isDefault: false,
      $store: { dispatch }
    }

    methods.showLocalizationSuccessMessage.call(ctx, [
      { success: true, error: null, languageResourceId: 'tr', targetLanguage: 'Turkish' }
    ])

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      message: 'The Turkish language was successfully localized.',
      color: 'success'
    })
  })

  it('showLocalizationSuccessMessage dispatches plural success message for multiple languages', () => {
    const dispatch = jest.fn()
    const ctx = {
      isDefault: false,
      $store: { dispatch }
    }

    methods.showLocalizationSuccessMessage.call(ctx, [
      { success: true, languageResourceId: 'tr', targetLanguage: 'Turkish' },
      { success: true, languageResourceId: 'en', targetLanguage: 'English' },
      { success: true, languageResourceId: 'tr', targetLanguage: 'Turkish' }
    ])

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      message: '2 languages were successfully localized.',
      color: 'success'
    })
  })

  it('showLocalizationSuccessMessage does not dispatch when isDefault is true', () => {
    const dispatch = jest.fn()
    const ctx = {
      isDefault: true,
      $store: { dispatch }
    }

    methods.showLocalizationSuccessMessage.call(ctx, [
      { success: true, languageResourceId: 'tr', targetLanguage: 'Turkish' }
    ])

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('resetGenerateWithAIDisabled resets flags and template generation states', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const timeoutId = setTimeout(() => {}, 1)
    const internalTimeoutId = setTimeout(() => {}, 1)
    const refs = [{ isEmailGenerating: true }, { isEmailGenerating: true }]
    const ctx = {
      isGenerateWithAi: true,
      isGenerateWithAIDisabled: true,
      isSubmitDisabled: true,
      isDefault: true,
      timeoutId: internalTimeoutId,
      $refs: {
        refEmailTemplate: refs
      }
    }

    methods.resetGenerateWithAIDisabled.call(ctx, timeoutId)

    expect(ctx.isGenerateWithAi).toBe(false)
    expect(ctx.isGenerateWithAIDisabled).toBe(false)
    expect(ctx.isSubmitDisabled).toBe(false)
    expect(ctx.isDefault).toBe(false)
    expect(ctx.timeoutId).toBe(null)
    expect(refs.every((item) => item.isEmailGenerating === false)).toBe(true)
    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })

  it('getAndUpdateFirstIndexForPageText updates first page name and returns new page index', () => {
    const ctx = {
      formValues: {
        landingPages: [{ name: 'Page 2' }]
      }
    }

    const result = methods.getAndUpdateFirstIndexForPageText.call(ctx)

    expect(result).toBe(2)
    expect(ctx.formValues.landingPages[0].name).toBe('landing-page')
  })

  it('getNewIndexForPageText returns incremented index from edited pages', () => {
    const ctx = {
      editedLandingPages: [{ name: 'landing-page' }, { name: 'Page 3' }],
      formValues: {
        landingPages: [{ name: 'Page 2' }]
      }
    }

    const result = methods.getNewIndexForPageText.call(ctx)

    expect(result).toBe(4)
  })

  it('handleDeleteLandingPage removes page and reorders both main and language pages', () => {
    jest.useFakeTimers()
    const ctx = {
      formValues: {
        landingPages: [
          { name: 'landing-page', order: 1 },
          { name: 'Page 2', order: 2 }
        ]
      },
      languagesPayload: [
        {
          languageTypeResourceId: 'tr',
          landingPages: [
            { name: 'landing-page', order: 1 },
            { name: 'Page 2', order: 2 }
          ]
        }
      ],
      isPageAddMenuOpen: [true, true],
      tab: 'page2'
    }

    methods.handleDeleteLandingPage.call(ctx, 1)
    jest.runAllTimers()

    expect(ctx.formValues.landingPages).toHaveLength(1)
    expect(ctx.formValues.landingPages[0]).toEqual({ name: 'landing-page', order: 1 })
    expect(ctx.languagesPayload[0].landingPages).toHaveLength(1)
    expect(ctx.languagesPayload[0].landingPages[0]).toEqual({ name: 'landing-page', order: 1 })
    expect(ctx.tab).toBe('page1')
    expect(ctx.isPageAddMenuOpen[1]).toBe(false)
    jest.useRealTimers()
  })

  it('handleClickOnlyPageAdded closes modal and adds preview page for create flow', async () => {
    getLandingPageTemplatePreviewContent.mockResolvedValueOnce({
      data: {
        data: {
          landingPages: [{ content: '<div>click-only-template</div>' }]
        }
      }
    })

    const ctx = {
      isSelectClickOnlyPageOpen: true,
      isEdit: false,
      formValues: {
        landingPages: [{ name: 'landing-page', order: 1, prompt: '', content: 'existing' }]
      },
      languagesPayload: [
        {
          languageTypeResourceId: 'en',
          landingPages: [{ name: 'landing-page', order: 1, prompt: '', content: 'existing' }]
        }
      ],
      tab: 'page1',
      getAndUpdateFirstIndexForPageText: jest.fn(() => 2),
      getNewIndexForPageText: jest.fn(() => 9)
    }

    await methods.handleClickOnlyPageAdded.call(ctx, 'resource-1')

    expect(getLandingPageTemplatePreviewContent).toHaveBeenCalledWith('resource-1')
    expect(ctx.isSelectClickOnlyPageOpen).toBe(false)
    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.formValues.landingPages[1]).toEqual({
      name: 'Page 2',
      order: 2,
      prompt: '',
      content: '<div>click-only-template</div>'
    })
    expect(ctx.languagesPayload[0].landingPages).toHaveLength(2)
    expect(ctx.languagesPayload[0].landingPages[1]).toEqual({
      name: 'Page 2',
      order: 2,
      prompt: '',
      content: '<div>click-only-template</div>'
    })
    expect(ctx.tab).toBe('page2')
    expect(ctx.getAndUpdateFirstIndexForPageText).toHaveBeenCalled()
    expect(ctx.getNewIndexForPageText).not.toHaveBeenCalled()
  })

  it('handleClickOnlyPageAdded uses edit page index helper in edit flow', async () => {
    getLandingPageTemplatePreviewContent.mockResolvedValueOnce({
      data: {
        data: {
          landingPages: [{ content: '<div>edit-template</div>' }]
        }
      }
    })

    const ctx = {
      isSelectClickOnlyPageOpen: true,
      isEdit: true,
      formValues: {
        landingPages: [{ name: 'landing-page', order: 1, prompt: '', content: 'existing' }]
      },
      languagesPayload: [],
      tab: 'page1',
      getAndUpdateFirstIndexForPageText: jest.fn(() => 2),
      getNewIndexForPageText: jest.fn(() => 5)
    }

    await methods.handleClickOnlyPageAdded.call(ctx, 'resource-2')

    expect(ctx.formValues.landingPages[1].name).toBe('Page 5')
    expect(ctx.getNewIndexForPageText).toHaveBeenCalled()
    expect(ctx.getAndUpdateFirstIndexForPageText).not.toHaveBeenCalled()
  })
})
