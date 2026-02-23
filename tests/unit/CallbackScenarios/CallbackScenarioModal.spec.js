import CallbackScenarioModal from '@/components/CallbackScenarios/CallbackScenarioModal.vue'
import CallbackService from '@/api/callback'
import { getEmailTemplatePreviewContent } from '@/api/phishingsimulator'
import { isDifferent } from '@/utils/functions'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCallbackScenario: jest.fn(),
    createCallbackScenario: jest.fn(),
    updateCallbackScenario: jest.fn(),
    searchEmailTemplates: jest.fn(),
    getEmailTemplate: jest.fn()
  }
}))

jest.mock('@/api/phishingsimulator', () => ({
  getEmailTemplatePreviewContent: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn(() => Promise.resolve([]))
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    isDifferent: jest.fn(() => false),
    scrollToComponent: jest.fn()
  }
})

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackScenarioModal.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getModalTitle returns correct variants', () => {
    expect(CallbackScenarioModal.computed.getModalTitle.call({ isEdit: false, isDuplicate: false })).toBe(
      'New Callback Scenario'
    )
    expect(CallbackScenarioModal.computed.getModalTitle.call({ isEdit: true, isDuplicate: true })).toBe(
      'Duplicate Callback Scenario'
    )
    expect(CallbackScenarioModal.computed.getModalTitle.call({ isEdit: true, isDuplicate: false })).toBe(
      'Edit Callback Scenario'
    )
  })

  it('setFooterDuplicateIds updates footer ids for duplicate flow', () => {
    const ctx = { footerButtonsIds: {} }
    CallbackScenarioModal.methods.setFooterDuplicateIds.call(ctx)
    expect(ctx.footerButtonsIds).toEqual({
      cancelButton: 'btn-cancel--duplicate-scenario-modal',
      backButton: 'btn-back--duplicate-scenario-modal',
      nextButton: 'btn-next--duplicate-scenario-modal',
      saveButton: 'btn-save--duplicate-scenario-modal'
    })
  })

  it('computed helpers return expected values', () => {
    const apiFuncs = CallbackScenarioModal.computed.getEmailTemplateApiFuncs.call({})
    expect(apiFuncs.list).toBe(CallbackService.searchEmailTemplates)
    expect(apiFuncs.content).toBe(CallbackService.getEmailTemplate)

    expect(CallbackScenarioModal.computed.getMethodTypes.call({ scenarioDetailsLookup: {} })).toEqual(
      []
    )
    expect(
      CallbackScenarioModal.computed.getMethodTypes.call({
        scenarioDetailsLookup: { methodTypes: [{ id: 1 }] }
      })
    ).toEqual([{ id: 1 }])
  })

  it('getMethodTypeDescription handles all known methods and fallback', () => {
    expect(CallbackScenarioModal.methods.getMethodTypeDescription.call({}, 'Click-Only')).toBe(
      'See who fails for phishing links'
    )
    expect(
      CallbackScenarioModal.methods.getMethodTypeDescription.call({}, 'Data Submission')
    ).toBe(
      'Gather information from users'
    )
    expect(CallbackScenarioModal.methods.getMethodTypeDescription.call({}, 'Attachment')).toBe(
      'Send a trackable file'
    )
    expect(CallbackScenarioModal.methods.getMethodTypeDescription.call({}, 'MFA')).toBe(
      'Send a phishing MFA'
    )
    expect(CallbackScenarioModal.methods.getMethodTypeDescription.call({}, 'X')).toBe('')
  })

  it('methodType watcher resets selected email ids when user changes method', () => {
    const ctx = {
      isInitial: false,
      formValues: { emailTemplateId: 't1' },
      emailTemplateResourceId: 't1'
    }

    CallbackScenarioModal.watch['formValues.methodTypeId'].call(ctx, '2', '1')
    expect(ctx.formValues.emailTemplateId).toBe(null)
    expect(ctx.emailTemplateResourceId).toBe(null)
  })

  it('methodType watcher does not reset when initial or value unchanged', () => {
    const ctx = {
      isInitial: true,
      formValues: { emailTemplateId: 't1' },
      emailTemplateResourceId: 't1'
    }
    CallbackScenarioModal.watch['formValues.methodTypeId'].call(ctx, '2', '1')
    expect(ctx.formValues.emailTemplateId).toBe('t1')
    expect(ctx.emailTemplateResourceId).toBe('t1')
  })

  it('created flow handles duplicate and non-edit defaults', async () => {
    const duplicateCtx = {
      isDuplicate: true,
      isEdit: false,
      setFooterDuplicateIds: jest.fn(),
      callForLanguages: jest.fn(),
      callForScenario: jest.fn(),
      formValues: { languageTypeResourceId: 'x' },
      initialFormValues: {},
      isInitial: true,
      getCurrentCompany: {}
    }
    CallbackScenarioModal.created.call(duplicateCtx)
    expect(duplicateCtx.setFooterDuplicateIds).toHaveBeenCalled()
    expect(duplicateCtx.callForLanguages).toHaveBeenCalled()
    expect(duplicateCtx.callForScenario).not.toHaveBeenCalled()
    expect(duplicateCtx.formValues.languageTypeResourceId).toBe('x')
    expect(duplicateCtx.isInitial).toBe(false)

    const editCtx = {
      isDuplicate: false,
      isEdit: true,
      setFooterDuplicateIds: jest.fn(),
      callForLanguages: jest.fn(),
      callForScenario: jest.fn(),
      formValues: { languageTypeResourceId: 'x' },
      initialFormValues: {},
      isInitial: true,
      getCurrentCompany: { preferredLanguageTypeResourceId: 'lang-pref' }
    }
    CallbackScenarioModal.created.call(editCtx)
    expect(editCtx.callForScenario).toHaveBeenCalled()
    expect(editCtx.formValues.languageTypeResourceId).toBe('x')
  })

  it('changeNewScenarioModalStatus emits close directly when form is unchanged', () => {
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      formValues: { name: 'n' },
      initialFormValues: { name: 'n' },
      $emit: emit,
      $store: { dispatch }
    }

    isDifferent.mockReturnValueOnce(false)
    CallbackScenarioModal.methods.changeNewScenarioModalStatus.call(ctx)
    expect(emit).toHaveBeenCalledWith('changeNewScenarioModalStatus', false)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('changeNewScenarioModalStatus opens leaving dialog when form is changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      formValues: { name: 'new' },
      initialFormValues: { name: 'old' },
      $emit: emit,
      $store: { dispatch }
    }

    isDifferent.mockReturnValueOnce(true)
    CallbackScenarioModal.methods.changeNewScenarioModalStatus.call(ctx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(emit).toHaveBeenCalledWith('changeNewScenarioModalStatus', false)
  })

  it('nextStep step 2 fetches email template preview and updates summary', async () => {
    getEmailTemplatePreviewContent.mockResolvedValueOnce({
      data: { data: { languageTypeResourceId: 'lang-1', template: '<html />' } }
    })
    const ctx = {
      step: 2,
      formValues: { emailTemplateId: 'et-1' },
      emailTemplateResourceId: 'et-1',
      isSubmitDisabled: false,
      languageOptions: [{ value: 'lang-1', text: 'EN' }],
      summaryData: {},
      selectedEmailTemplate: { difficultyName: 'Easy' },
      scenarioDetailsLookup: { difficultyTypes: [{ text: 'Easy', value: 1 }] },
      generalDifficultyTypeId: '',
      emailDifficultyChipColor: '',
      getDifficultyColor: jest.fn(() => '#217124'),
      $refs: {}
    }

    CallbackScenarioModal.methods.nextStep.call(ctx)
    await flushPromises()

    expect(getEmailTemplatePreviewContent).toHaveBeenCalledWith('et-1')
    expect(ctx.summaryData.emailTemplate).toEqual(
      expect.objectContaining({ languageShortCode: 'EN' })
    )
    expect(ctx.generalDifficultyTypeId).toBe('1')
    expect(ctx.emailDifficultyChipColor).toBe('#217124')
    expect(ctx.step).toBe(3)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('nextStep step 1 advances only when form and availableFor are valid', () => {
    const validCtx = {
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
    CallbackScenarioModal.methods.nextStep.call(validCtx)
    expect(validCtx.step).toBe(2)

    const invalidCtx = {
      step: 1,
      availableForRequests: [],
      $refs: {
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: false
        },
        refFormStep1: {
          validate: jest.fn(() => false),
          $el: { querySelector: jest.fn(() => ({})) }
        }
      }
    }
    CallbackScenarioModal.methods.nextStep.call(invalidCtx)
    expect(invalidCtx.step).toBe(1)
  })

  it('nextStep step 3 does not advance without callback template id', () => {
    const ctx = {
      step: 3,
      formValues: { callbackTemplateResourceId: null },
      summaryData: {},
      $refs: {}
    }
    CallbackScenarioModal.methods.nextStep.call(ctx)
    expect(ctx.step).toBe(3)
  })

  it('nextStep step 3 advances and stores callback template summary', () => {
    const ctx = {
      step: 3,
      formValues: { callbackTemplateResourceId: 'cb-1' },
      selectedCallbackTemplate: { id: 'cb-1', name: 'Template' },
      summaryData: {},
      $refs: {}
    }
    CallbackScenarioModal.methods.nextStep.call(ctx)
    expect(ctx.step).toBe(4)
    expect(ctx.summaryData.callbackTemplate).toEqual({
      template: { id: 'cb-1', name: 'Template' }
    })
  })

  it('submit creates scenario in create flow', async () => {
    CallbackService.createCallbackScenario.mockResolvedValueOnce({})
    const emit = jest.fn()
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      isSubmitDisabled: false,
      scenarioId: 'sc-1',
      formValues: {
        name: 'Scenario',
        description: 'Desc',
        languageTypeResourceId: 'lang-1',
        tags: ['a'],
        emailTemplateId: 'et-1'
      },
      selectedCallbackTemplate: { id: 'cb-1' },
      availableForRequests: [],
      $refs: {},
      $emit: emit
    }

    CallbackScenarioModal.methods.submit.call(ctx)
    await flushPromises()

    expect(CallbackService.createCallbackScenario).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Scenario',
        emailTemplateId: 'et-1',
        callbackTemplateId: 'cb-1'
      })
    )
    expect(emit).toHaveBeenCalledWith('changeNewScenarioModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit updates scenario in edit flow and validates availableFor ref', async () => {
    CallbackService.updateCallbackScenario.mockResolvedValueOnce({})
    const emit = jest.fn()
    const validateAvailableFor = jest.fn()
    const ctx = {
      isEdit: true,
      isDuplicate: false,
      isSubmitDisabled: false,
      scenarioId: 'sc-2',
      formValues: {
        name: 'Scenario 2',
        description: '',
        languageTypeResourceId: 'lang-1',
        tags: [],
        emailTemplateId: 'et-2'
      },
      selectedCallbackTemplate: { id: 'cb-2' },
      availableForRequests: [{ id: 'MyCompanyOnly' }],
      $refs: { refMakeAvailableFor: { validateAvailableFor } },
      $emit: emit
    }

    CallbackScenarioModal.methods.submit.call(ctx)
    await flushPromises()

    expect(validateAvailableFor).toHaveBeenCalledWith([{ id: 'MyCompanyOnly' }])
    expect(CallbackService.updateCallbackScenario).toHaveBeenCalledWith(
      'sc-2',
      expect.objectContaining({
        name: 'Scenario 2',
        callbackTemplateId: 'cb-2'
      })
    )
    expect(emit).toHaveBeenCalledWith('changeNewScenarioModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('callForScenario maps backend response and duplicate copy naming', async () => {
    CallbackService.getCallbackScenario.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Base Scenario',
          description: 'Desc',
          difficultyTypeId: 2,
          methodTypeId: 1,
          emailTemplateResourceId: 'et-1',
          callbackTemplateResourceId: 'cb-1',
          tags: null,
          availableForList: [{ type: 'MyCompanyOnly', resourceId: null }]
        }
      }
    })
    const ctx = {
      isSubmitDisabled: false,
      scenarioId: 'scenario-1',
      formValues: {},
      isDuplicate: true,
      availableForRequests: [],
      initialFormValues: {},
      isFetched: false,
      isInitial: true
    }

    CallbackScenarioModal.methods.callForScenario.call(ctx)
    await flushPromises()

    expect(CallbackService.getCallbackScenario).toHaveBeenCalledWith('scenario-1')
    expect(ctx.formValues.name).toBe('Base Scenario - Copy')
    expect(ctx.formValues.difficultyTypeId).toBe('2')
    expect(ctx.formValues.methodTypeId).toBe('1')
    expect(ctx.formValues.tags).toEqual([])
    expect(ctx.formValues.emailTemplateId).toBe('et-1')
    expect(ctx.formValues.callbackTemplateResourceId).toBe('cb-1')
    expect(ctx.isFetched).toBe(true)
    expect(ctx.isSubmitDisabled).toBe(false)
    expect(ctx.isInitial).toBe(false)
  })

  it('callForLanguages maps language options from lookup', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      {
        isoFriendlyName: 'EN',
        name: 'English',
        resourceId: 'lang-en',
        description: 'English'
      }
    ])
    const ctx = { languageOptions: [] }
    CallbackScenarioModal.methods.callForLanguages.call(ctx)
    await flushPromises()
    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(ctx.languageOptions).toEqual([
      {
        text: 'EN',
        languageTypeName: 'English',
        value: 'lang-en',
        description: 'English'
      }
    ])
  })
})
