jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  isDifferent: jest.fn(() => true),
  scrollToComponent: jest.fn()
}))

jest.mock('@/api/smishing', () => ({
  getLandingPageTemplate: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  createLandingPageTemplate: jest.fn(() => Promise.resolve()),
  updateLandingPageTemplate: jest.fn(() => Promise.resolve()),
  searchLandingPageTemplates: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  getSmishingLandingPageMergeTags: jest.fn(() =>
    Promise.resolve({ data: { data: { mergeTags: ['FirstName', 'Email'] } } })
  )
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() => Promise.resolve([]))
}))

import NewLandingPage from '@/components/SmishingLandingPages/NewLandingPage.vue'
import { isDifferent, scrollToComponent } from '@/utils/functions'
import SmishingService from '@/api/smishing'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

describe('SmishingLandingPages NewLandingPage.vue (extra branches)', () => {
  const { methods, computed } = NewLandingPage

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('changeNewEmailTemplateModalStatus opens leaving dialog when changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      formValues: { name: 'new' },
      initialFormValues: { name: 'old' },
      $emit: emit,
      $store: { dispatch }
    }

    methods.changeNewEmailTemplateModalStatus.call(ctx)

    expect(isDifferent).toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false)
  })

  it('changeNewEmailTemplateModalStatus closes directly when form is unchanged', () => {
    isDifferent.mockReturnValueOnce(false)
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      formValues: { name: 'same' },
      initialFormValues: { name: 'same' },
      $emit: emit,
      $store: { dispatch }
    }

    methods.changeNewEmailTemplateModalStatus.call(ctx)

    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('nextStep scrolls to validation error when form is invalid', () => {
    const ctx = {
      step: 1,
      availableForRequests: [],
      $refs: {
        refFormStep1: {
          validate: jest.fn(() => false),
          $el: {
            querySelector: jest.fn(() => '#error')
          }
        }
      }
    }

    methods.nextStep.call(ctx)

    expect(ctx.step).toBe(1)
    expect(scrollToComponent).toHaveBeenCalledWith('#error')
  })

  it('nextStep does not advance when make-available-for validation fails', () => {
    const validateAvailableFor = jest.fn()
    const ctx = {
      step: 1,
      availableForRequests: [],
      $refs: {
        refMakeAvailableFor: {
          validateAvailableFor,
          isAvailableForValid: false
        },
        refFormStep1: {
          validate: jest.fn(() => true),
          $el: { querySelector: jest.fn(() => '#error-af') }
        }
      }
    }

    methods.nextStep.call(ctx)

    expect(validateAvailableFor).toHaveBeenCalledWith([])
    expect(ctx.step).toBe(1)
    expect(scrollToComponent).toHaveBeenCalledWith('#error-af')
  })

  it('nextStep advances when form and available-for validations pass', () => {
    const ctx = {
      step: 1,
      availableForRequests: [{ id: 1 }],
      $refs: {
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true
        },
        refFormStep1: {
          validate: jest.fn(() => true),
          $el: { querySelector: jest.fn() }
        }
      }
    }

    methods.nextStep.call(ctx)
    expect(ctx.step).toBe(2)
  })

  it('nextStep advances when form is valid and make-available-for ref is missing', () => {
    const ctx = {
      step: 1,
      availableForRequests: [],
      $refs: {
        refFormStep1: {
          validate: jest.fn(() => true),
          $el: { querySelector: jest.fn() }
        }
      }
    }

    methods.nextStep.call(ctx)
    expect(ctx.step).toBe(2)
  })

  it('submit uses create API when not edit mode', async () => {
    const emit = jest.fn()
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: 'id-1',
      isSubmitDisabled: false,
      availableForRequests: [{ id: 1 }],
      formValues: {
        name: 'x',
        phishingLink: { subDomain: 'a' }
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

    expect(SmishingService.createLandingPageTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ availableForRequests: ['mapped'] })
    )
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit uses update API when edit mode and not duplicate', async () => {
    const emit = jest.fn()
    const ctx = {
      isEdit: true,
      isDuplicate: false,
      emailTemplateId: 'id-2',
      isSubmitDisabled: false,
      availableForRequests: [],
      formValues: {
        name: 'x',
        phishingLink: { subDomain: 'a' }
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

    expect(SmishingService.updateLandingPageTemplate).toHaveBeenCalledWith(
      'id-2',
      expect.any(Object)
    )
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit throws when available-for ref is missing in valid form flow', () => {
    const emit = jest.fn()
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      isSubmitDisabled: false,
      availableForRequests: [],
      formValues: {
        name: 'x',
        phishingLink: { subDomain: 'a' }
      },
      $refs: {
        refEmailTemplateContent: { validate: jest.fn(() => true) },
        refFormStep1: {
          $el: { querySelector: jest.fn() }
        }
      },
      $emit: emit
    }

    expect(() => methods.submit.call(ctx)).toThrow()
    expect(SmishingService.createLandingPageTemplate).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  it('submit resets disable flag on invalid form and scrolls error', () => {
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      isSubmitDisabled: false,
      availableForRequests: [],
      formValues: { phishingLink: {} },
      $refs: {
        refEmailTemplateContent: { validate: jest.fn(() => false) },
        refFormStep1: {
          $el: { querySelector: jest.fn(() => '#err') }
        },
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true
        }
      }
    }

    methods.submit.call(ctx)

    expect(scrollToComponent).toHaveBeenCalledWith('#err')
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit does not call APIs when make-available-for validation fails', () => {
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      isSubmitDisabled: false,
      availableForRequests: [],
      formValues: { phishingLink: {}, name: 'x' },
      $refs: {
        refEmailTemplateContent: { validate: jest.fn(() => true) },
        refFormStep1: {
          $el: { querySelector: jest.fn(() => '#err-af') }
        },
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: false,
          getAvailableForValues: jest.fn(() => [])
        }
      }
    }

    methods.submit.call(ctx)

    expect(SmishingService.createLandingPageTemplate).not.toHaveBeenCalled()
    expect(SmishingService.updateLandingPageTemplate).not.toHaveBeenCalled()
    expect(scrollToComponent).toHaveBeenCalledWith('#err-af')
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('clickOnlyMethodText returns resolved method text when methodTypeId is 1', () => {
    const result = computed.clickOnlyMethodText.call({
      formValues: { methodTypeId: '1' },
      landingPageData: {
        methodTypes: [
          { value: '1', text: 'Click-Only' },
          { value: '2', text: 'Data Submission' }
        ]
      }
    })

    expect(result).toBe('Click-Only')
  })

  it('clickOnlyMethodText falls back to default when method type list misses value 1', () => {
    const result = computed.clickOnlyMethodText.call({
      formValues: { methodTypeId: '1' },
      landingPageData: { methodTypes: [{ value: '2', text: 'Data Submission' }] }
    })

    expect(result).toBe('Click Only')
  })

  it('clickOnlyMethodText falls back to default when landingPageData is missing', () => {
    const result = computed.clickOnlyMethodText.call({
      formValues: { methodTypeId: '1' },
      landingPageData: null
    })

    expect(result).toBe('Click Only')
  })

  it('clickOnlyMethodText returns empty string when methodTypeId is not 1', () => {
    const result = computed.clickOnlyMethodText.call({
      formValues: { methodTypeId: '2' },
      landingPageData: { methodTypes: [{ value: '1', text: 'Click-Only' }] }
    })

    expect(result).toBe('')
  })

  it('handleClickOnlyPageAdded uses indexed content first and falls back to first page', async () => {
    SmishingService.getLandingPageTemplate.mockResolvedValueOnce({
      data: {
        data: {
          landingPages: [{ content: 'first-content' }, { content: 'second-content' }]
        }
      }
    })
    const ctx = {
      isSelectClickOnlyPageOpen: true,
      formValues: { landingPages: [{ name: 'Page 1', content: '' }] },
      tab: 'page1'
    }
    await methods.handleClickOnlyPageAdded.call(ctx, 'template-1', 1)

    expect(ctx.isSelectClickOnlyPageOpen).toBe(false)
    expect(ctx.formValues.landingPages[1].content).toBe('second-content')
    expect(ctx.tab).toBe('page2')

    SmishingService.getLandingPageTemplate.mockResolvedValueOnce({
      data: {
        data: {
          landingPages: [{ content: 'fallback-first' }]
        }
      }
    })
    const fallbackCtx = {
      isSelectClickOnlyPageOpen: true,
      formValues: { landingPages: [{ name: 'Page 1', content: '' }] },
      tab: 'page1'
    }
    await methods.handleClickOnlyPageAdded.call(fallbackCtx, 'template-2', 99)

    expect(fallbackCtx.formValues.landingPages[1].content).toBe('fallback-first')
    expect(fallbackCtx.tab).toBe('page2')
  })

  it('handleClickOnlyPageAdded falls back to empty content when template has no landing pages', async () => {
    SmishingService.getLandingPageTemplate.mockResolvedValueOnce({
      data: {
        data: {
          landingPages: []
        }
      }
    })
    const ctx = {
      isSelectClickOnlyPageOpen: true,
      formValues: { landingPages: [{ name: 'Page 1', content: '' }] },
      tab: 'page1'
    }

    await methods.handleClickOnlyPageAdded.call(ctx, 'template-empty', 0)

    expect(ctx.formValues.landingPages[1].content).toBe('')
    expect(ctx.tab).toBe('page2')
  })

  it('handleDeleteLandingPage keeps current tab when deleted index is not 0 or 1', () => {
    const ctx = {
      formValues: {
        landingPages: [{ name: 'Page 1' }, { name: 'Page 2' }, { name: 'Page 3' }]
      },
      tab: 'page3'
    }

    methods.handleDeleteLandingPage.call(ctx, 2)

    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.tab).toBe('page3')
  })

  it('handleDeleteLandingPage resets tab to page1 when deleted index is 0 or 1', () => {
    const indexZeroCtx = {
      formValues: {
        landingPages: [{ name: 'Page 1' }, { name: 'Page 2' }, { name: 'Page 3' }]
      },
      tab: 'page3'
    }
    methods.handleDeleteLandingPage.call(indexZeroCtx, 0)
    expect(indexZeroCtx.tab).toBe('page1')

    const indexOneCtx = {
      formValues: {
        landingPages: [{ name: 'Page 1' }, { name: 'Page 2' }, { name: 'Page 3' }]
      },
      tab: 'page3'
    }
    methods.handleDeleteLandingPage.call(indexOneCtx, 1)
    expect(indexOneCtx.tab).toBe('page1')
  })

  it('handleAddBlankPage sets tab to page1 when first page is added', () => {
    const ctx = {
      emailTemplateLogo: 'https://cdn/logo.png',
      formValues: { landingPages: [] },
      tab: ''
    }

    methods.handleAddBlankPage.call(ctx)

    expect(ctx.formValues.landingPages).toHaveLength(1)
    expect(ctx.tab).toBe('page1')
  })

  it('handleUploadHTML delegates click to html file input ref', () => {
    const click = jest.fn()
    const ctx = {
      $refs: { refHtmlFile: { click } }
    }

    methods.handleUploadHTML.call(ctx)
    expect(click).toHaveBeenCalled()
  })

  it('handleAddBlankPage sets tab to page2 when second page is added', () => {
    const ctx = {
      emailTemplateLogo: 'https://cdn/logo.png',
      formValues: { landingPages: [{ name: 'Page 1', content: '', order: 1 }] },
      tab: 'page1'
    }

    methods.handleAddBlankPage.call(ctx)

    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.tab).toBe('page2')
  })

  it('callForLanguages maps lookup response and falls back to empty list', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', name: 'English', resourceId: 'lang-en' }
    ])
    const ctx = { languageOptions: [] }
    methods.callForLanguages.call(ctx)
    await Promise.resolve()

    expect(ctx.languageOptions).toEqual([
      { text: 'English', languageTypeName: 'English', value: 'lang-en' }
    ])

    LookupLocalStorage.getSingle.mockResolvedValueOnce(null)
    const fallbackCtx = { languageOptions: [{ text: 'old' }] }
    methods.callForLanguages.call(fallbackCtx)
    await Promise.resolve()

    expect(fallbackCtx.languageOptions).toEqual([])
  })

  it('setActiveBlockManagerComponents builds mapped object and supports empty default', () => {
    const ctx = {
      activeBlockManagerComponents: {},
      getTagsComponent: jest.fn((item) => `mapped-${item}`)
    }

    methods.setActiveBlockManagerComponents.call(ctx, ['FirstName', 'Email'])
    expect(ctx.activeBlockManagerComponents).toEqual({
      FirstName: 'mapped-FirstName',
      Email: 'mapped-Email'
    })

    methods.setActiveBlockManagerComponents.call(ctx)
    expect(ctx.activeBlockManagerComponents).toEqual({})
  })

  it('validateAvailableFor emits false for empty and true for non-empty values', () => {
    const emit = jest.fn()
    const ctx = {
      isAvailableForValidated: false,
      isAvailableForValid: false,
      $emit: emit
    }

    methods.validateAvailableFor.call(ctx, [])
    expect(ctx.isAvailableForValidated).toBe(true)
    expect(ctx.isAvailableForValid).toBe(false)
    expect(emit).toHaveBeenCalledWith('validation', false)

    methods.validateAvailableFor.call(ctx, [{ id: 1 }])
    expect(ctx.isAvailableForValid).toBe(true)
    expect(emit).toHaveBeenCalledWith('validation', true)
  })

  it('backStep decreases current step by one', () => {
    const ctx = { step: 2 }
    methods.backStep.call(ctx)
    expect(ctx.step).toBe(1)
  })

  it('created initializes defaults for non-edit non-duplicate flow', () => {
    const callForMergedTags = jest.fn()
    const callForLanguages = jest.fn()
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      landingPageData: {
        methodTypes: [{ value: '2', text: 'Data Submission' }]
      },
      getCurrentCompany: { preferredLanguageTypeResourceId: 'lang-pref' },
      footerButtonsIds: {},
      callForMergedTags,
      callForLanguages,
      formValues: {
        methodTypeId: null,
        difficultyTypeId: null,
        languageTypeResourceId: '862249c19aad',
        landingPages: [{ name: 'landing-page', content: '', order: 1 }]
      },
      initialFormValues: {}
    }

    NewLandingPage.created.call(ctx)

    expect(ctx.formValues.methodTypeId).toBe('2')
    expect(ctx.formValues.difficultyTypeId).toBe('1')
    expect(ctx.formValues.languageTypeResourceId).toBe('lang-pref')
    expect(callForMergedTags).toHaveBeenCalled()
    expect(callForLanguages).toHaveBeenCalled()
    expect(ctx.initialFormValues.methodTypeId).toBe('2')
    expect(ctx.initialFormValues.difficultyTypeId).toBe('1')
    expect(ctx.initialFormValues.languageTypeResourceId).toBe('862249c19aad')
    expect(ctx.initialFormValues).not.toBe(ctx.formValues)
  })

  it('created sets duplicate footer ids and skips preferred language override', () => {
    const callForMergedTags = jest.fn()
    const callForLanguages = jest.fn()
    const ctx = {
      isEdit: false,
      isDuplicate: true,
      landingPageData: {
        methodTypes: [{ value: '1', text: 'Click-Only' }]
      },
      getCurrentCompany: { preferredLanguageTypeResourceId: 'lang-pref' },
      footerButtonsIds: {},
      callForMergedTags,
      callForLanguages,
      formValues: {
        methodTypeId: null,
        difficultyTypeId: null,
        languageTypeResourceId: '862249c19aad',
        landingPages: [{ name: 'landing-page', content: '', order: 1 }]
      },
      initialFormValues: {}
    }

    NewLandingPage.created.call(ctx)

    expect(ctx.footerButtonsIds).toEqual({
      cancelButton: 'btn-duplicate-cancel--landing-page-templates-modal',
      backButton: 'btn-duplicate-back--landing-page-templates-modal',
      nextButton: 'btn-duplicate-next--landing-page-templates-modal',
      saveButton: 'btn-duplicate-save--landing-page-templates-modal'
    })
    expect(ctx.formValues.methodTypeId).toBe('1')
    expect(ctx.formValues.languageTypeResourceId).toBe('862249c19aad')
    expect(callForMergedTags).toHaveBeenCalled()
    expect(callForLanguages).toHaveBeenCalled()
  })

  it('created falls back to empty methodTypeId when no method types exist', () => {
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      landingPageData: {
        methodTypes: []
      },
      getCurrentCompany: null,
      footerButtonsIds: {},
      callForMergedTags: jest.fn(),
      callForLanguages: jest.fn(),
      formValues: {
        methodTypeId: null,
        difficultyTypeId: null,
        languageTypeResourceId: 'seed-lang',
        landingPages: [{ name: 'landing-page', content: '', order: 1 }]
      },
      initialFormValues: {}
    }

    NewLandingPage.created.call(ctx)

    expect(ctx.formValues.methodTypeId).toBe('')
    expect(ctx.formValues.languageTypeResourceId).toBe('862249c19aad')
  })

  it('created edit flow normalizes ids to strings and derives captcha disable from domain record', async () => {
    SmishingService.getLandingPageTemplate.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Landing A',
          methodTypeId: 2,
          difficultyTypeId: 3,
          subDomain: 'secure',
          urlSchemaTypeId: 10,
          pathTypeId: 20,
          extensionTypeId: 30,
          parameterTypeId: 40,
          domainRecordId: 50,
          landingPages: [{ name: 'Page 1', order: 1, content: '<p>x</p>' }],
          availableForList: []
        }
      }
    })
    const checkSchemaTypes = jest.fn()
    const ctx = {
      isEdit: true,
      isDuplicate: false,
      emailTemplateId: 'tmpl-1',
      landingPageData: {
        methodTypes: [{ value: '1' }],
        domainRecords: [{ value: '50', extraDatas: [{}, { value: false }] }]
      },
      getCurrentCompany: null,
      footerButtonsIds: {},
      callForMergedTags: jest.fn(),
      callForLanguages: jest.fn(),
      formValues: {
        methodTypeId: null,
        difficultyTypeId: null,
        languageTypeResourceId: 'seed',
        landingPages: [{ name: 'landing-page', content: '', order: 1 }]
      },
      initialFormValues: {},
      availableForRequests: [],
      isInvisibleCaptchaDisabled: false,
      $set: (obj, key, value) => {
        obj[key] = value
      },
      $refs: { refInputPhishingLink: { checkSchemaTypes } }
    }

    NewLandingPage.created.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.formValues.methodTypeId).toBe('2')
    expect(ctx.formValues.difficultyTypeId).toBe('3')
    expect(ctx.formValues.phishingLink.domainRecordId).toBe('50')
    expect(checkSchemaTypes).toHaveBeenCalledWith('50', true)
    expect(ctx.isInvisibleCaptchaDisabled).toBe(true)
    expect(Array.isArray(ctx.availableForRequests)).toBe(true)
  })

  it('created edit+duplicate flow appends copy suffix and keeps captcha enabled when domain not found', async () => {
    SmishingService.getLandingPageTemplate.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Landing B',
          methodTypeId: 1,
          difficultyTypeId: 1,
          subDomain: 'safe',
          urlSchemaTypeId: 1,
          pathTypeId: 2,
          extensionTypeId: 3,
          parameterTypeId: 4,
          domainRecordId: 999,
          landingPages: [{ name: 'Page 1', order: 1, content: '<p>b</p>' }],
          availableForList: []
        }
      }
    })
    const ctx = {
      isEdit: true,
      isDuplicate: true,
      emailTemplateId: 'tmpl-2',
      landingPageData: {
        methodTypes: [{ value: '1' }],
        domainRecords: [{ value: '50', extraDatas: [{}, { value: true }] }]
      },
      getCurrentCompany: null,
      footerButtonsIds: {},
      callForMergedTags: jest.fn(),
      callForLanguages: jest.fn(),
      formValues: {
        methodTypeId: null,
        difficultyTypeId: null,
        languageTypeResourceId: 'seed',
        landingPages: [{ name: 'landing-page', content: '', order: 1 }]
      },
      initialFormValues: {},
      availableForRequests: [],
      isInvisibleCaptchaDisabled: true,
      $set: (obj, key, value) => {
        obj[key] = value
      },
      $refs: {}
    }

    NewLandingPage.created.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.formValues.name).toBe('Landing B - Copy')
    expect(ctx.isInvisibleCaptchaDisabled).toBe(false)
    expect(ctx.footerButtonsIds.saveButton).toBe('btn-duplicate-save--landing-page-templates-modal')
  })

  it('callForMergedTags stores merge tags and delegates activation mapping', async () => {
    const setActiveBlockManagerComponents = jest.fn()
    const ctx = {
      blockManagerComponents: {},
      setActiveBlockManagerComponents
    }

    methods.callForMergedTags.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.blockManagerComponents).toEqual(['FirstName', 'Email'])
    expect(setActiveBlockManagerComponents).toHaveBeenCalledWith(['FirstName', 'Email'])
  })

  it('data smishingApiFuncs.list rewrites method filter on cloned payload', async () => {
    const data = NewLandingPage.data.call({})
    const payload = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'methodTypeId', Operator: 'Equal', Value: '1' }]
          }
        ]
      }
    }

    await data.smishingApiFuncs.list(payload)

    expect(SmishingService.searchLandingPageTemplates).toHaveBeenCalledWith({
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'method', Operator: 'Include', Value: '1' }]
          }
        ]
      }
    })
    expect(payload.filter.FilterGroups[0].FilterItems[0]).toEqual({
      FieldName: 'methodTypeId',
      Operator: 'Equal',
      Value: '1'
    })
  })

  it('data smishingApiFuncs.list keeps payload shape when method filter item is missing', async () => {
    const data = NewLandingPage.data.call({})
    const payload = {
      filter: {
        FilterGroups: [{ FilterItems: [] }]
      }
    }

    await data.smishingApiFuncs.list(payload)

    expect(SmishingService.searchLandingPageTemplates).toHaveBeenCalledWith({
      filter: {
        FilterGroups: [{ FilterItems: [] }]
      }
    })
  })

  it('computed URL/path option getters return arrays or empty fallback', () => {
    const fallbackCtx = { landingPageData: null }
    expect(computed.getUrlSchemaTypes.call(fallbackCtx)).toEqual([])
    expect(computed.getDomainRecordTypes.call(fallbackCtx)).toEqual([])
    expect(computed.getExtensionTypes.call(fallbackCtx)).toEqual([])
    expect(computed.getParameterTypes.call(fallbackCtx)).toEqual([])
    expect(computed.getPathTypes.call(fallbackCtx)).toEqual([])

    const dataCtx = {
      landingPageData: {
        urlSchemaTypes: [{ value: 'http' }],
        domainRecords: [{ value: 'd1' }],
        extensionTypes: [{ value: 'e1' }],
        parameterTypes: [{ value: 'p1' }],
        pathTypes: [{ value: 'path1' }]
      }
    }
    expect(computed.getUrlSchemaTypes.call(dataCtx)).toEqual([{ value: 'http' }])
    expect(computed.getDomainRecordTypes.call(dataCtx)).toEqual([{ value: 'd1' }])
    expect(computed.getExtensionTypes.call(dataCtx)).toEqual([{ value: 'e1' }])
    expect(computed.getParameterTypes.call(dataCtx)).toEqual([{ value: 'p1' }])
    expect(computed.getPathTypes.call(dataCtx)).toEqual([{ value: 'path1' }])
  })

  it('getTitle returns new/edit/duplicate title variants', () => {
    expect(computed.getTitle.call({ isEdit: false, isDuplicate: false })).toBe(
      'New Landing Page Template'
    )
    expect(computed.getTitle.call({ isEdit: true, isDuplicate: false })).toBe(
      'Edit Landing Page Template'
    )
    expect(computed.getTitle.call({ isEdit: true, isDuplicate: true })).toBe(
      'Duplicate Landing Page Template'
    )
  })

  it('showMakeAvailableFor is false only for CompanyAdmin', () => {
    expect(
      computed.showMakeAvailableFor.call({
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } }
      })
    ).toBe(false)

    expect(
      computed.showMakeAvailableFor.call({
        $store: { state: { auth: { userRoleName: 'SuperAdmin' } } }
      })
    ).toBe(true)
  })

  it('isRenderMakeAvailableFor returns false when edit items are disabled', () => {
    const result = computed.isRenderMakeAvailableFor.call({
      editItemsDisabled: true,
      selectedItem: { id: 1 },
      $store: { state: { auth: { userRoleName: 'SuperAdmin' } } }
    })

    expect(result).toBe(false)
  })

  it('isRenderMakeAvailableFor depends on selectedItem for CompanyAdmin and true otherwise', () => {
    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: false,
        selectedItem: null,
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } }
      })
    ).toBe(false)

    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: false,
        selectedItem: { id: 42 },
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } }
      })
    ).toBe(true)

    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: false,
        selectedItem: null,
        $store: { state: { auth: { userRoleName: 'SystemAdmin' } } }
      })
    ).toBe(true)
  })

  it('handleHTMLUploadChange appends second page and switches tab on valid HTML file', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'Page 1', order: 1, content: '<p>first</p>' }] },
      tab: 'page1'
    }
    const OriginalFileReader = global.FileReader
    global.FileReader = class {
      readAsText() {
        this.onload({ target: { result: '<html>uploaded</html>' } })
      }
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'text/html', size: 1024 }] }
    })

    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.formValues.landingPages[1]).toEqual({
      name: 'Page 2',
      order: 2,
      content: '<html>uploaded</html>'
    })
    expect(ctx.tab).toBe('page2')
    expect(dispatch).not.toHaveBeenCalled()

    global.FileReader = OriginalFileReader
  })

  it('handleHTMLUploadChange dispatches error snackbar when uploaded html content is empty', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'Page 1', order: 1, content: '<p>first</p>' }] },
      tab: 'page1'
    }
    const OriginalFileReader = global.FileReader
    global.FileReader = class {
      readAsText() {
        this.onload.call({ $store: ctx.$store }, { target: { result: '' } })
      }
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'text/html', size: 1024 }] }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Empty file' })
    )
    expect(ctx.formValues.landingPages).toHaveLength(1)
    expect(ctx.tab).toBe('page1')

    global.FileReader = OriginalFileReader
  })

  it('handleHTMLUploadChange dispatches invalid type snackbar and exits early', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'Page 1', order: 1, content: '<p>first</p>' }] },
      tab: 'page1'
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'application/json', size: 1024 }] }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Invalid file type' })
    )
    expect(ctx.formValues.landingPages).toHaveLength(1)
    expect(ctx.tab).toBe('page1')
  })

  it('handleHTMLUploadChange dispatches max file size snackbar and exits early', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'Page 1', order: 1, content: '<p>first</p>' }] },
      tab: 'page1'
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'text/html', size: 5242881 }] }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'File size should be less than 5MB' })
    )
    expect(ctx.formValues.landingPages).toHaveLength(1)
    expect(ctx.tab).toBe('page1')
  })

  it('handleHTMLUploadChange prioritizes invalid type check before file size check', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'Page 1', order: 1, content: '<p>first</p>' }] },
      tab: 'page1'
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'application/octet-stream', size: 9999999 }] }
    })

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Invalid file type' })
    )
    expect(dispatch).not.toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'File size should be less than 5MB' })
    )
    expect(ctx.formValues.landingPages).toHaveLength(1)
  })

  it('handleHTMLUploadChange accepts file size exactly 5MB', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'Page 1', order: 1, content: '<p>first</p>' }] },
      tab: 'page1'
    }
    const OriginalFileReader = global.FileReader
    global.FileReader = class {
      readAsText() {
        this.onload({ target: { result: '<html>limit-ok</html>' } })
      }
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'text/html', size: 5242880 }] }
    })

    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.formValues.landingPages[1].content).toBe('<html>limit-ok</html>')
    expect(ctx.tab).toBe('page2')
    expect(dispatch).not.toHaveBeenCalled()

    global.FileReader = OriginalFileReader
  })
})
