import QuishingNewLandingPageModal from '@/components/QuishingLandingPageTemplates/QuishingNewLandingPageModal.vue'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import QuishingService from '@/api/quishing'

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    scrollToComponent: jest.fn(),
    isDifferent: jest.fn(() => false)
  }
})

jest.mock('@/api/quishing', () => ({
  getLandingPageTemplatePreviewContent: jest.fn(() =>
    Promise.resolve({
      data: { data: { landingPages: [{ content: '<html>preview</html>' }] } }
    })
  )
}))

describe('QuishingNewLandingPageModal.vue', () => {
  const { computed, methods } = QuishingNewLandingPageModal

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed clickOnlyMethodText returns method label only for type 1 (click only)', () => {
    expect(
      computed.clickOnlyMethodText.call({
        formValues: { methodTypeId: '1' },
        landingPageData: { methodTypes: [{ value: '1', text: 'Click Only' }] }
      })
    ).toBe('Click Only')
    expect(
      computed.clickOnlyMethodText.call({
        formValues: { methodTypeId: '2' },
        landingPageData: { methodTypes: [{ value: '2', text: 'Data Submission' }] }
      })
    ).toBe('')
  })

  it('computed schema helpers fallback to empty arrays', () => {
    expect(computed.getUrlSchemaTypes.call({ landingPageData: null })).toEqual([])
    expect(computed.getDomainRecordTypes.call({ landingPageData: null })).toEqual([])
    expect(computed.getExtensionTypes.call({ landingPageData: null })).toEqual([])
    expect(computed.getParameterTypes.call({ landingPageData: null })).toEqual([])
    expect(computed.getPathTypes.call({ landingPageData: null })).toEqual([])
  })

  it('computed getTitle and visibility helpers return expected values', () => {
    expect(computed.getTitle.call({ isEdit: false, isDuplicate: false })).toBe(
      'New Landing Page Template'
    )
    expect(computed.getTitle.call({ isEdit: true, isDuplicate: true })).toBe(
      'Duplicate Landing Page Template'
    )
    expect(computed.getTitle.call({ isEdit: true, isDuplicate: false })).toBe(
      'Edit Landing Page Template'
    )
    expect(
      computed.showMakeAvailableFor.call({
        $store: { state: { auth: { userRoleName: 'User' } } }
      })
    ).toBe(true)
    expect(
      computed.isRenderMakeAvailableFor.call({
        editItemsDisabled: false,
        $store: { state: { auth: { userRoleName: 'CompanyAdmin' } } },
        selectedItem: null
      })
    ).toBe(false)
  })

  it('handleDeleteLandingPage removes page and resets tab', () => {
    const ctx = {
      formValues: {
        landingPages: [{ name: 'Page 1', order: 1 }, { name: 'Page 2', order: 2 }]
      },
      tab: 'page2'
    }

    methods.handleDeleteLandingPage.call(ctx, 1)
    expect(ctx.formValues.landingPages).toEqual([{ name: 'Page 1', order: 1 }])
    expect(ctx.tab).toBe('page1')
  })

  it('setActiveBlockManagerComponents maps tags to component map', () => {
    const ctx = {
      activeBlockManagerComponents: {},
      getTagsComponent: jest.fn((item) => `cmp-${item}`)
    }

    methods.setActiveBlockManagerComponents.call(ctx, ['{USER}', '{LINK}'])

    expect(ctx.activeBlockManagerComponents).toEqual({
      '{USER}': 'cmp-{USER}',
      '{LINK}': 'cmp-{LINK}'
    })
  })

  it('changeNewEmailTemplateModalStatus emits directly when unchanged', () => {
    isDifferent.mockReturnValueOnce(false)
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      formValues: { a: 1 },
      initialFormValues: { a: 1 },
      $emit: emit,
      $store: { dispatch }
    }

    methods.changeNewEmailTemplateModalStatus.call(ctx)
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('changeNewEmailTemplateModalStatus opens leaving dialog when changed', () => {
    isDifferent.mockReturnValueOnce(true)
    const emit = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      formValues: { a: 2 },
      initialFormValues: { a: 1 },
      $emit: emit,
      $store: { dispatch }
    }

    methods.changeNewEmailTemplateModalStatus.call(ctx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false)
  })

  it('nextStep increments on valid form and scrolls on invalid form', () => {
    const validCtx = {
      step: 1,
      availableForRequests: [],
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
    methods.nextStep.call(validCtx)
    expect(validCtx.step).toBe(2)

    const invalidCtx = {
      step: 1,
      availableForRequests: [],
      $refs: {
        refFormStep1: {
          validate: jest.fn(() => false),
          $el: { querySelector: jest.fn(() => '.v-messages__message') }
        }
      }
    }
    methods.nextStep.call(invalidCtx)
    expect(scrollToComponent).toHaveBeenCalledWith('.v-messages__message')
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

    methods.validateAvailableFor.call(ctx, [{ resourceId: 'c-1' }])
    expect(ctx.isAvailableForValid).toBe(true)
    expect(emit).toHaveBeenCalledWith('validation', true)
  })

  it('backStep decrements current step', () => {
    const ctx = { step: 2 }
    methods.backStep.call(ctx)
    expect(ctx.step).toBe(1)
  })

  it('handleUploadHTML triggers hidden file input click', () => {
    const click = jest.fn()
    const ctx = { $refs: { refHtmlFile: { click } } }

    methods.handleUploadHTML.call(ctx)

    expect(click).toHaveBeenCalledTimes(1)
  })

  it('handleHTMLUploadChange dispatches snackbar for invalid file type and oversized file', () => {
    const dispatch = jest.fn()
    const ctx = {
      $store: { dispatch },
      formValues: { landingPages: [{ name: 'Page 1' }] },
      tab: 'page1'
    }

    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'application/pdf', size: 100 }] }
    })
    methods.handleHTMLUploadChange.call(ctx, {
      target: { files: [{ type: 'text/html', size: 5242881 }] }
    })

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      'common/createSnackBar',
      expect.objectContaining({ message: 'Invalid file type' })
    )
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      'common/createSnackBar',
      expect.objectContaining({ message: 'File size should be less than 5MB' })
    )
  })

  it('handleClickOnlyPageAdded appends second page from preview content', async () => {
    const ctx = {
      isSelectClickOnlyPageOpen: true,
      formValues: { landingPages: [{ name: 'Page 1', order: 1, content: '<html>first</html>' }] },
      tab: 'page1'
    }

    await methods.handleClickOnlyPageAdded.call(ctx, 'resource-1')

    expect(QuishingService.getLandingPageTemplatePreviewContent).toHaveBeenCalledWith('resource-1')
    expect(ctx.isSelectClickOnlyPageOpen).toBe(false)
    expect(ctx.formValues.landingPages).toHaveLength(2)
    expect(ctx.formValues.landingPages[1].content).toBe('<html>preview</html>')
    expect(ctx.tab).toBe('page2')
  })
})
