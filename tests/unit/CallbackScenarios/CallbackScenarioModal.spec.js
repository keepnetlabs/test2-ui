import CallbackScenarioModal from '@/components/CallbackScenarios/CallbackScenarioModal.vue'
import CallbackService from '@/api/callback'
import { getEmailTemplatePreviewContent } from '@/api/phishingsimulator'
import { isDifferent } from '@/utils/functions'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCallbackScenario: jest.fn(),
    getCallbackTemplate: jest.fn(),
    getCallbackTemplatePreview: jest.fn(),
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

    expect(
      CallbackScenarioModal.computed.isFooterActionDisabled.call({
        isSubmitDisabled: false,
        step: 2,
        isFetchingSelectedCallbackTemplate: false
      })
    ).toBe(false)
    expect(
      CallbackScenarioModal.computed.isFooterActionDisabled.call({
        isSubmitDisabled: false,
        step: 3,
        isFetchingSelectedCallbackTemplate: true
      })
    ).toBe(true)
    expect(
      CallbackScenarioModal.computed.hasPhishingFile.call({
        summaryData: { emailTemplate: { phishingFileName: 'file.pdf' } }
      })
    ).toBe(true)
    expect(CallbackScenarioModal.computed.getPhishingFile.call({ summaryData: { emailTemplate: {} } })).toBeNull()
    expect(
      CallbackScenarioModal.computed.getDifficultyType.call({
        scenarioDetailsLookup: { difficultyTypes: [{ value: 2, text: 'Medium' }] },
        generalDifficultyTypeId: '2'
      })
    ).toBe('Medium')
    expect(
      CallbackScenarioModal.computed.getSelectedMethod.call({
        formValues: { methodTypeId: '4' },
        methods: [{ text: 'Click-Only' }, { text: 'Data Submission' }, { text: 'Attachment' }, { text: 'MFA' }],
        selectedEmailTemplate: { categoryName: 'Click Only' }
      })
    ).toBe('Click-Only')
    expect(
      CallbackScenarioModal.computed.getSelectedMethod.call({
        formValues: { methodTypeId: '2' },
        methods: [{ text: 'Click-Only' }, { text: 'Data Submission' }, { text: 'Attachment' }, { text: 'MFA' }]
      })
    ).toBe('Data Submission')
    expect(
      CallbackScenarioModal.computed.getSelectedMethod.call({
        formValues: {},
        methods: []
      })
    ).toBe('')
    expect(
      CallbackScenarioModal.computed.getScenarioInfoItems.call({
        formValues: { name: 'Scenario Name' },
        getDifficultyType: 'Hard'
      })
    ).toEqual({
      Name: 'Scenario Name',
      Difficulty: 'Hard'
    })
    expect(
      CallbackScenarioModal.computed.getMfaSettingsItems.call({
        mfaData: {
          mfaCallerPhoneNumber: '+1 555 000',
          mfaTextTemplate: 'Code'
        }
      })
    ).toEqual({
      'Sender Phone Number': '+1 555 000',
      'Verification Message': 'Code'
    })
    expect(
      CallbackScenarioModal.computed.getPhishingFile.call({
        summaryData: { emailTemplate: { phishingFileName: 'invoice.pdf' } }
      })
    ).toEqual({ name: 'invoice.pdf' })
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

    const createCtx = {
      isDuplicate: false,
      isEdit: false,
      setFooterDuplicateIds: jest.fn(),
      callForLanguages: jest.fn(),
      callForScenario: jest.fn(),
      formValues: { languageTypeResourceId: 'x' },
      initialFormValues: {},
      isInitial: true,
      getCurrentCompany: { preferredLanguageTypeResourceId: 'lang-pref' }
    }
    CallbackScenarioModal.created.call(createCtx)
    expect(createCtx.callForScenario).not.toHaveBeenCalled()
    expect(createCtx.formValues.languageTypeResourceId).toBe('lang-pref')
  })

  it('handleSelectedTemplateResourceIdChange clears selected template only when id changes', () => {
    const changedCtx = {
      formValues: { callbackTemplateResourceId: 'old-id' },
      selectedCallbackTemplate: { id: 'old-id' },
      summaryData: { callbackTemplate: { template: { id: 'old-id' } } }
    }
    CallbackScenarioModal.methods.handleSelectedTemplateResourceIdChange.call(changedCtx, 'new-id')
    expect(changedCtx.selectedCallbackTemplate).toBeNull()
    expect(changedCtx.summaryData.callbackTemplate).toBeNull()
    expect(changedCtx.formValues.callbackTemplateResourceId).toBe('new-id')

    const sameCtx = {
      formValues: { callbackTemplateResourceId: 'same-id' },
      selectedCallbackTemplate: { id: 'same-id' },
      summaryData: { callbackTemplate: { template: { id: 'same-id' } } }
    }
    CallbackScenarioModal.methods.handleSelectedTemplateResourceIdChange.call(sameCtx, 'same-id')
    expect(sameCtx.selectedCallbackTemplate).toEqual({ id: 'same-id' })
    expect(sameCtx.summaryData.callbackTemplate).toEqual({ template: { id: 'same-id' } })
  })

  it('small setter methods update local state correctly', () => {
    const ctx = {
      initialFormValues: {},
      selectedCallbackTemplate: null,
      emailTemplateResourceId: null,
      formValues: { emailTemplateId: null, attachmentFiles: null },
      selectedEmailTemplate: null,
      step: 3,
      isSubmitDisabled: true,
      isAvailableForValidated: false,
      isAvailableForValid: false,
      $emit: jest.fn()
    }

    CallbackScenarioModal.methods.handleInitialTemplate.call(ctx, 'cb-1')
    CallbackScenarioModal.methods.handleSelectedTemplateChange.call(ctx, { id: 'cb-2' })
    CallbackScenarioModal.methods.getInitialEmailTemplateId.call(ctx, 'et-1')
    CallbackScenarioModal.methods.selectedEmailTemplateResourceId.call(ctx, 'et-resource-1')
    CallbackScenarioModal.methods.selectedEmailTemplateChange.call(ctx, 'et-2', { id: 'et-2' })
    CallbackScenarioModal.methods.setAttachmentFile.call(ctx, [{ name: 'file.wav' }])
    CallbackScenarioModal.methods.validateAvailableFor.call(ctx, [{ id: 'MyCompanyOnly' }])
    CallbackScenarioModal.methods.backStep.call(ctx)

    expect(ctx.initialFormValues.callbackTemplateResourceId).toBe('cb-1')
    expect(ctx.selectedCallbackTemplate).toEqual({ id: 'cb-2' })
    expect(ctx.initialFormValues.emailTemplateId).toBe('et-1')
    expect(ctx.emailTemplateResourceId).toBe('et-resource-1')
    expect(ctx.formValues.emailTemplateId).toBe('et-2')
    expect(ctx.selectedEmailTemplate).toEqual({ id: 'et-2' })
    expect(ctx.formValues.attachmentFiles).toEqual([{ name: 'file.wav' }])
    expect(ctx.isAvailableForValidated).toBe(true)
    expect(ctx.isAvailableForValid).toBe(true)
    expect(ctx.$emit).toHaveBeenCalledWith('validation', true)
    expect(ctx.step).toBe(2)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('validateAvailableFor emits invalid state for empty values', () => {
    const ctx = {
      isAvailableForValidated: false,
      isAvailableForValid: true,
      $emit: jest.fn()
    }

    CallbackScenarioModal.methods.validateAvailableFor.call(ctx, [])

    expect(ctx.isAvailableForValidated).toBe(true)
    expect(ctx.isAvailableForValid).toBe(false)
    expect(ctx.$emit).toHaveBeenCalledWith('validation', false)
  })

  it('getSelectedCallbackTemplateLanguageAndVoice prefers preview values and falls back safely', () => {
    expect(
      CallbackScenarioModal.methods.getSelectedCallbackTemplateLanguageAndVoice.call(
        {
          languages: [{ resourceId: 'voice-1', language: 'English', name: 'Amy' }]
        },
        { vishingLanguageResourceId: 'voice-1' },
        { language: 'German', voice: 'Hans' }
      )
    ).toEqual({ language: 'German', voice: 'Hans' })

    expect(
      CallbackScenarioModal.methods.getSelectedCallbackTemplateLanguageAndVoice.call(
        {
          languages: [{ resourceId: 'voice-1', language: 'English', name: 'Amy' }]
        },
        { vishingLanguageResourceId: 'voice-1' },
        {}
      )
    ).toEqual({ language: 'English', voice: 'Amy' })

    expect(
      CallbackScenarioModal.methods.getSelectedCallbackTemplateLanguageAndVoice.call(
        { languages: [] },
        { vishingLanguageResourceId: 'missing' },
        {}
      )
    ).toEqual({ language: '', voice: '' })
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

    await CallbackScenarioModal.methods.nextStep.call(ctx)

    expect(getEmailTemplatePreviewContent).toHaveBeenCalledWith('et-1')
    expect(ctx.summaryData.emailTemplate).toEqual(
      expect.objectContaining({ languageShortCode: 'EN' })
    )
    expect(ctx.generalDifficultyTypeId).toBe('1')
    expect(ctx.emailDifficultyChipColor).toBe('#217124')
    expect(ctx.step).toBe(3)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('nextStep step 2 stays put when no email template is selected', async () => {
    const ctx = {
      step: 2,
      formValues: { emailTemplateId: null },
      emailTemplateResourceId: null,
      isSubmitDisabled: false,
      summaryData: {},
      $refs: {}
    }

    await CallbackScenarioModal.methods.nextStep.call(ctx)

    expect(getEmailTemplatePreviewContent).not.toHaveBeenCalled()
    expect(ctx.step).toBe(2)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('nextStep step 1 advances only when form and availableFor are valid', async () => {
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
    await CallbackScenarioModal.methods.nextStep.call(validCtx)
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
    await CallbackScenarioModal.methods.nextStep.call(invalidCtx)
    expect(invalidCtx.step).toBe(1)
  })

  it('nextStep step 3 does not advance without callback template id', async () => {
    const ctx = {
      step: 3,
      formValues: { callbackTemplateResourceId: null },
      summaryData: {},
      $refs: {}
    }
    await CallbackScenarioModal.methods.nextStep.call(ctx)
    expect(ctx.step).toBe(3)
  })

  it('nextStep step 3 does not advance when callback template cannot be hydrated', async () => {
    const ctx = {
      step: 3,
      formValues: { callbackTemplateResourceId: 'cb-1' },
      summaryData: {},
      ensureSelectedCallbackTemplate: jest.fn(() => Promise.resolve(null)),
      $refs: {}
    }

    await CallbackScenarioModal.methods.nextStep.call(ctx)

    expect(ctx.ensureSelectedCallbackTemplate).toHaveBeenCalled()
    expect(ctx.step).toBe(3)
    expect(ctx.summaryData.callbackTemplate).toBeUndefined()
  })

  it('nextStep step 3 advances and stores callback template summary', async () => {
    const ctx = {
      step: 3,
      formValues: { callbackTemplateResourceId: 'cb-1' },
      summaryData: {},
      ensureSelectedCallbackTemplate: jest.fn(() =>
        Promise.resolve({ id: 'cb-1', name: 'Template' })
      ),
      $refs: {}
    }

    await CallbackScenarioModal.methods.nextStep.call(ctx)

    expect(ctx.step).toBe(4)
    expect(ctx.summaryData.callbackTemplate).toEqual({
      template: { id: 'cb-1', name: 'Template' }
    })
  })

  it('hydrateSelectedCallbackTemplate combines template detail and preview data', async () => {
    CallbackService.getCallbackTemplate.mockResolvedValueOnce({
      data: {
        data: {
          id: 'cb-1',
          vishingLanguageResourceId: 'voice-1',
          difficulty: 'Easy'
        }
      }
    })
    CallbackService.getCallbackTemplatePreview.mockResolvedValueOnce({
      data: {
        data: {
          steps: [{ inputType: 'TextToSpeech' }, { inputType: 'TextToSpeech' }, { id: 'step-1' }]
        }
      }
    })
    const ctx = {
      formValues: { callbackTemplateResourceId: 'cb-1' },
      languages: [{ resourceId: 'voice-1', language: 'English', name: 'Amy' }],
      selectedCallbackTemplate: null,
      isFetchingSelectedCallbackTemplate: false,
      getSelectedCallbackTemplateLanguageAndVoice:
        CallbackScenarioModal.methods.getSelectedCallbackTemplateLanguageAndVoice
    }

    const template = await CallbackScenarioModal.methods.hydrateSelectedCallbackTemplate.call(
      ctx,
      'cb-1'
    )

    expect(CallbackService.getCallbackTemplate).toHaveBeenCalledWith('cb-1')
    expect(CallbackService.getCallbackTemplatePreview).toHaveBeenCalledWith('cb-1')
    expect(template).toEqual(
      expect.objectContaining({
        id: 'cb-1',
        language: 'English',
        voice: 'Amy',
        invalidDialingNotice: { inputType: 'TextToSpeech' },
        callGreeting: { inputType: 'TextToSpeech' },
        steps: [{ id: 'step-1' }]
      })
    )
    expect(ctx.selectedCallbackTemplate).toEqual(template)
    expect(ctx.isFetchingSelectedCallbackTemplate).toBe(false)
  })

  it('hydrateSelectedCallbackTemplate returns null immediately when resource id is missing', async () => {
    const ctx = {
      formValues: { callbackTemplateResourceId: null },
      selectedCallbackTemplate: { id: 'old' }
    }

    const result = await CallbackScenarioModal.methods.hydrateSelectedCallbackTemplate.call(ctx, null)

    expect(result).toBeNull()
    expect(ctx.selectedCallbackTemplate).toBeNull()
    expect(CallbackService.getCallbackTemplate).not.toHaveBeenCalled()
    expect(CallbackService.getCallbackTemplatePreview).not.toHaveBeenCalled()
  })

  it('hydrateSelectedCallbackTemplate ignores stale responses after selection changes', async () => {
    CallbackService.getCallbackTemplate.mockResolvedValueOnce({
      data: { data: { id: 'cb-1', vishingLanguageResourceId: 'voice-1' } }
    })
    CallbackService.getCallbackTemplatePreview.mockResolvedValueOnce({
      data: { data: { steps: [] } }
    })
    const ctx = {
      formValues: { callbackTemplateResourceId: 'cb-2' },
      languages: [],
      selectedCallbackTemplate: { id: 'existing' },
      isFetchingSelectedCallbackTemplate: false,
      getSelectedCallbackTemplateLanguageAndVoice:
        CallbackScenarioModal.methods.getSelectedCallbackTemplateLanguageAndVoice
    }

    const result = await CallbackScenarioModal.methods.hydrateSelectedCallbackTemplate.call(ctx, 'cb-1')

    expect(result).toBeNull()
    expect(ctx.selectedCallbackTemplate).toEqual({ id: 'existing' })
    expect(ctx.isFetchingSelectedCallbackTemplate).toBe(false)
  })

  it('hydrateSelectedCallbackTemplate resets selection when api request fails', async () => {
    CallbackService.getCallbackTemplate.mockRejectedValueOnce(new Error('network'))
    CallbackService.getCallbackTemplatePreview.mockResolvedValueOnce({
      data: { data: { steps: [] } }
    })
    const ctx = {
      formValues: { callbackTemplateResourceId: 'cb-1' },
      languages: [],
      selectedCallbackTemplate: { id: 'existing' },
      isFetchingSelectedCallbackTemplate: false,
      getSelectedCallbackTemplateLanguageAndVoice:
        CallbackScenarioModal.methods.getSelectedCallbackTemplateLanguageAndVoice
    }

    const result = await CallbackScenarioModal.methods.hydrateSelectedCallbackTemplate.call(ctx, 'cb-1')

    expect(result).toBeNull()
    expect(ctx.selectedCallbackTemplate).toBeNull()
    expect(ctx.isFetchingSelectedCallbackTemplate).toBe(false)
  })

  it('ensureSelectedCallbackTemplate reuses current template and hydrates only when missing', async () => {
    const existingCtx = {
      selectedCallbackTemplate: { id: 'cb-1' },
      hydrateSelectedCallbackTemplate: jest.fn()
    }

    const existing = await CallbackScenarioModal.methods.ensureSelectedCallbackTemplate.call(existingCtx)

    expect(existing).toEqual({ id: 'cb-1' })
    expect(existingCtx.hydrateSelectedCallbackTemplate).not.toHaveBeenCalled()

    const missingCtx = {
      selectedCallbackTemplate: null,
      hydrateSelectedCallbackTemplate: jest.fn(() => Promise.resolve({ id: 'cb-2' }))
    }

    const hydrated = await CallbackScenarioModal.methods.ensureSelectedCallbackTemplate.call(missingCtx)

    expect(hydrated).toEqual({ id: 'cb-2' })
    expect(missingCtx.hydrateSelectedCallbackTemplate).toHaveBeenCalled()
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
      ensureSelectedCallbackTemplate: jest.fn(() => Promise.resolve({ id: 'cb-1' })),
      availableForRequests: [],
      $refs: {},
      $emit: emit
    }

    await CallbackScenarioModal.methods.submit.call(ctx)

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

  it('submit stops early when callback template is unavailable', async () => {
    const ctx = {
      isEdit: true,
      isDuplicate: false,
      isSubmitDisabled: false,
      formValues: {
        name: 'Scenario 2',
        description: '',
        languageTypeResourceId: 'lang-1',
        tags: [],
        emailTemplateId: 'et-2'
      },
      ensureSelectedCallbackTemplate: jest.fn(() => Promise.resolve(null)),
      availableForRequests: [],
      $refs: {},
      $emit: jest.fn()
    }

    await CallbackScenarioModal.methods.submit.call(ctx)

    expect(CallbackService.createCallbackScenario).not.toHaveBeenCalled()
    expect(CallbackService.updateCallbackScenario).not.toHaveBeenCalled()
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
      ensureSelectedCallbackTemplate: jest.fn(() => Promise.resolve({ id: 'cb-2' })),
      availableForRequests: [{ id: 'MyCompanyOnly' }],
      $refs: { refMakeAvailableFor: { validateAvailableFor } },
      $emit: emit
    }

    await CallbackScenarioModal.methods.submit.call(ctx)

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
      isInitial: true,
      hydrateSelectedCallbackTemplate: jest.fn()
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
    expect(ctx.hydrateSelectedCallbackTemplate).toHaveBeenCalledWith('cb-1')
    expect(ctx.isFetched).toBe(true)
    expect(ctx.isSubmitDisabled).toBe(false)
    expect(ctx.isInitial).toBe(false)
  })

  it('callForScenario skips callback template hydration when resource id is missing', async () => {
    CallbackService.getCallbackScenario.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Base Scenario',
          description: 'Desc',
          difficultyTypeId: 1,
          methodTypeId: 2,
          emailTemplateResourceId: 'et-1',
          callbackTemplateResourceId: null,
          tags: ['tag-1'],
          availableForList: []
        }
      }
    })
    const ctx = {
      isSubmitDisabled: false,
      scenarioId: 'scenario-2',
      formValues: {},
      isDuplicate: false,
      availableForRequests: [],
      initialFormValues: {},
      isFetched: false,
      isInitial: true,
      hydrateSelectedCallbackTemplate: jest.fn()
    }

    CallbackScenarioModal.methods.callForScenario.call(ctx)
    await flushPromises()

    expect(ctx.formValues.name).toBe('Base Scenario')
    expect(ctx.formValues.callbackTemplateResourceId).toBeNull()
    expect(ctx.formValues.tags).toEqual(['tag-1'])
    expect(ctx.hydrateSelectedCallbackTemplate).not.toHaveBeenCalled()
    expect(ctx.isFetched).toBe(true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('callForLanguages falls back to empty array when lookup payload is missing', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce(undefined)
    const ctx = { languageOptions: [{ value: 'old' }] }

    CallbackScenarioModal.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(ctx.languageOptions).toEqual([])
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
