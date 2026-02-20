jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    isDifferent: jest.fn(() => false),
    handleIsSafari: jest.fn(() => false)
  }
})

import LandingPageTemplateListPreview from '@/components/workshop/LandingPageTemplateListPreview.vue'
import { isDifferent } from '@/utils/functions'

describe('workshop/LandingPageTemplateListPreview.vue', () => {
  const { methods, computed } = LandingPageTemplateListPreview

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('returns expected preview language hint and captcha style', () => {
    expect(computed.landingPagePreviewLanguageHint.call({ selectedTemplateLanguages: [] })).toBe('')
    expect(
      computed.landingPagePreviewLanguageHint.call({ selectedTemplateLanguages: [{ value: 'en' }] })
    ).toBe('This template is available in 1 language.')
    expect(
      computed.landingPagePreviewLanguageHint.call({
        selectedTemplateLanguages: [{ value: 'en' }, { value: 'tr' }]
      })
    ).toBe('This template is available in 2 languages.')

    expect(computed.invisibleCaptchaEnabledStyle.call({ isInvisibleCaptchaDisabled: true })).toEqual({
      opacity: 0.38,
      cursor: 'default !important'
    })
    expect(computed.invisibleCaptchaEnabledStyle.call({ isInvisibleCaptchaDisabled: false })).toEqual(
      {}
    )
  })

  it('getItemDescription returns non-breaking space for invalid values', () => {
    expect(methods.getItemDescription()).toBe('\xa0')
    expect(methods.getItemDescription({ description: 'null' })).toBe('\xa0')
    expect(methods.getItemDescription({ description: 'undefined' })).toBe('\xa0')
    expect(methods.getItemDescription({ description: 'desc' })).toBe('desc')
  })

  it('setItemToFirstIndex moves selected item to first position', () => {
    const ctx = { listData: [{ resourceId: '1' }, { resourceId: '2' }, { resourceId: '3' }] }
    methods.setItemToFirstIndex.call(ctx, '2')
    expect(ctx.listData.map((x) => x.resourceId)).toEqual(['2', '1', '3'])
  })

  it('checkAndAddResourceIdToPayload appends ResourceId filter for initial load', () => {
    const emit = jest.fn()
    const ctx = {
      loadingTemplates: false,
      landingPageTemplateResourceId: 'res-1',
      $emit: emit
    }
    const bodyData = { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } }

    methods.checkAndAddResourceIdToPayload.call(ctx, true, bodyData)

    expect(ctx.loadingTemplates).toBe(true)
    expect(emit).toHaveBeenCalledWith('loading', true)
    expect(bodyData.filter.FilterGroups[1].FilterItems[0]).toEqual({
      FieldName: 'ResourceId',
      Operator: 'Include',
      value: 'res-1'
    })
  })

  it('getDataAfterValidScroll loads next page only when there are more pages and no search', () => {
    const ctx = {
      bodyData: { pageNumber: 1 },
      totalNumberOfPages: 2,
      search: '',
      loadingTemplates: false,
      getTemplates: jest.fn()
    }
    methods.getDataAfterValidScroll.call(ctx)

    expect(ctx.bodyData.pageNumber).toBe(2)
    expect(ctx.loadingTemplates).toBe(true)
    expect(ctx.getTemplates).toHaveBeenCalledTimes(1)

    const blocked = {
      bodyData: { pageNumber: 2 },
      totalNumberOfPages: 2,
      search: 'x',
      loadingTemplates: false,
      getTemplates: jest.fn()
    }
    methods.getDataAfterValidScroll.call(blocked)
    expect(blocked.getTemplates).not.toHaveBeenCalled()
  })

  it('resolves language option by value, languageTypeResourceId and id', () => {
    const ctx = {
      languages: [
        { value: 'en', text: 'English' },
        { languageTypeResourceId: 'tr', text: 'Turkish' },
        { id: 'de', text: 'German' }
      ]
    }

    expect(methods.getLanguageOptionById.call(ctx, 'en').text).toBe('English')
    expect(methods.getLanguageOptionById.call(ctx, 'tr').text).toBe('Turkish')
    expect(methods.getLanguageOptionById.call(ctx, 'de').text).toBe('German')
    expect(methods.getLanguageOptionById.call(ctx, '')).toBeNull()
  })

  it('getLandingPageContent returns language-specific, direct content or first language fallback', () => {
    expect(
      methods.getLandingPageContent.call(
        { languagePreview: 'tr' },
        { languages: { tr: '<p>TR</p>' }, content: '<p>fallback</p>' }
      )
    ).toBe('<p>TR</p>')

    expect(
      methods.getLandingPageContent.call(
        { languagePreview: 'en' },
        { languages: {}, content: '<p>Main</p>' }
      )
    ).toBe('<p>Main</p>')

    expect(
      methods.getLandingPageContent.call(
        { languagePreview: 'xx' },
        { languages: { en: '<p>EN</p>' }, content: '' }
      )
    ).toBe('<p>EN</p>')
  })

  it('transformLandingPages builds page templates with language map', () => {
    const result = methods.transformLandingPages.call(
      {},
      [
        {
          name: 'Page 1',
          order: 1,
          prompt: '',
          content: '<p>Main</p>',
          languageTypeResourceId: 'en',
          languageTypeName: 'English',
          languages: [{ languageTypeResourceId: 'tr', languageTypeName: 'Turkish', content: '<p>TR</p>' }]
        }
      ],
      'en',
      'English'
    )

    expect(result.templates).toHaveLength(1)
    expect(result.templates[0].languages).toEqual({ en: '<p>Main</p>', tr: '<p>TR</p>' })
    expect(result.languages.map((l) => l.value)).toEqual(['en', 'tr'])
  })

  it('applyLandingPageTemplatePayload updates templates and keeps valid language preview', () => {
    const ctx = {
      languagePreview: 'tr',
      landingPageTemplates: [],
      selectedTemplateLanguages: [],
      transformLandingPages: methods.transformLandingPages
    }
    const payload = {
      languageTypeResourceId: 'en',
      landingPages: [{ name: 'Page 1', order: 1, content: '<p>Main</p>', languageTypeResourceId: 'en' }]
    }

    methods.applyLandingPageTemplatePayload.call(ctx, payload)
    expect(ctx.landingPageTemplates).toHaveLength(1)
    expect(ctx.selectedTemplateLanguages[0].value).toBe('en')
    expect(ctx.languagePreview).toBe('en')
  })

  it('handleLandingPagePreviewLanguageChange updates value only when provided', () => {
    const ctx = { languagePreview: 'en' }
    methods.handleLandingPagePreviewLanguageChange.call(ctx, '')
    expect(ctx.languagePreview).toBe('en')
    methods.handleLandingPagePreviewLanguageChange.call(ctx, 'tr')
    expect(ctx.languagePreview).toBe('tr')
  })

  it('checkIsRedFlaggedTemplate and getPreviewLandingHtml handle logo replacements', () => {
    expect(methods.checkIsRedFlaggedTemplate.call({}, '<div data-redflag></div>')).toBe(true)
    expect(methods.checkIsRedFlaggedTemplate.call({}, '<div></div>')).toBe(false)

    localStorage.setItem('isSelectCompany', 'false')
    const ctx = {
      $store: {
        state: {
          dashboard: { selectedCompanyObject: { logoUrl: '' } },
          auth: { logoUrl: 'https://logo.auth/logo.png' },
          whitelabel: { mainLogoUrl: 'https://logo.main/logo.png' }
        }
      }
    }
    expect(methods.getPreviewLandingHtml.call(ctx, '<img src="{COMPANYLOGO}" data-redflag />')).toContain(
      'https://logo.auth/logo.png'
    )
  })

  it('handleExitEditing closes directly when unchanged and dispatches dialog when changed', () => {
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      isEditMode: true,
      editData: { a: 1 },
      initialEditData: { a: 1 },
      $store: { dispatch }
    }

    isDifferent.mockReturnValueOnce(false)
    methods.handleExitEditing.call(ctx)
    expect(ctx.isEditMode).toBe(false)
    expect(dispatch).not.toHaveBeenCalled()

    ctx.isEditMode = true
    isDifferent.mockReturnValueOnce(true)
    methods.handleExitEditing.call(ctx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(ctx.isEditMode).toBe(false)
  })

  it('validateMfaForm handles non-mfa, invalid-form and missing MFA_CODE branches', () => {
    const dispatch = jest.fn()

    expect(methods.validateMfaForm.call({ isMethodMfa: false })).toBe(true)

    const invalidCtx = {
      isMethodMfa: true,
      selectedTab: 'landingPage',
      mfaData: { mfaTextTemplate: '' },
      $refs: { refMfaForm: { validate: jest.fn(() => false) } },
      $store: { dispatch }
    }
    expect(methods.validateMfaForm.call(invalidCtx)).toBe(false)
    expect(invalidCtx.selectedTab).toBe('mfaSettings')

    const missingCodeCtx = {
      isMethodMfa: true,
      selectedTab: 'landingPage',
      mfaData: { mfaTextTemplate: 'Your code is 123456' },
      $refs: { refMfaForm: { validate: jest.fn(() => true) } },
      $store: { dispatch }
    }
    expect(methods.validateMfaForm.call(missingCodeCtx)).toBe(false)
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        color: '#f56c6c'
      })
    )
  })

  it('setSelectedTemplate exits early when saving or when unsaved changes exist', () => {
    const savingCtx = { isSaving: true }
    expect(() => methods.setSelectedTemplate.call(savingCtx, { id: 1 }, 0)).not.toThrow()

    const handleExitEditing = jest.fn()
    const changedCtx = {
      isSaving: false,
      isEditMode: true,
      editData: { a: 2 },
      initialEditData: { a: 1 },
      handleExitEditing,
      listData: [],
      $emit: jest.fn(),
      apiFuncs: { content: jest.fn() }
    }
    isDifferent.mockReturnValueOnce(true)
    methods.setSelectedTemplate.call(changedCtx, { id: 1, resourceId: 'r-1' }, 0)
    expect(handleExitEditing).toHaveBeenCalledTimes(1)
    expect(changedCtx.apiFuncs.content).not.toHaveBeenCalled()
  })
})
