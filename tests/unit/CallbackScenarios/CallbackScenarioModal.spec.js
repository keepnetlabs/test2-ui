import CallbackScenarioModal from '@/components/CallbackScenarios/CallbackScenarioModal.vue'
import CallbackService from '@/api/callback'
import { getEmailTemplatePreviewContent } from '@/api/phishingsimulator'
import { isDifferent } from '@/utils/functions'

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
})
