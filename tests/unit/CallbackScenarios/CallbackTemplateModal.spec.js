import CallbackTemplateModal from '@/components/CallbackScenarios/CallbackTemplateModal.vue'
import CallbackService from '@/api/callback'
import { isDifferent, scrollToComponent } from '@/utils/functions'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCallbackTemplate: jest.fn(),
    createCallbackTemplate: jest.fn(() => Promise.resolve()),
    updateCallbackTemplate: jest.fn(() => Promise.resolve())
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

describe('CallbackTemplateModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed getTitle and isAddStepDisabled return expected values', () => {
    expect(CallbackTemplateModal.computed.getTitle.call({ isEdit: false, isDuplicate: false })).toBe(
      'New Callback Template'
    )
    expect(CallbackTemplateModal.computed.getTitle.call({ isEdit: true, isDuplicate: true })).toBe(
      'Duplicate Callback Template'
    )
    expect(CallbackTemplateModal.computed.getTitle.call({ isEdit: true, isDuplicate: false })).toBe(
      'Edit Callback Template'
    )

    expect(CallbackTemplateModal.computed.isAddStepDisabled.call({ formValues: { steps: [1, 2, 3, 4, 5] } })).toBe(
      true
    )
    expect(CallbackTemplateModal.computed.isAddStepDisabled.call({ formValues: { steps: [1, 2, 3, 4] } })).toBe(
      false
    )
  })

  it('computed voice helpers and compatibility work for selected language and voice', () => {
    const ctx = {
      selectedCallbackLanguage: 'English',
      selectedCallbackVoice: 'Amy',
      languageItems: [
        { language: 'English', name: 'Amy', resourceId: 'r-1', voiceProviderTypeId: 2 },
        { language: 'English', name: 'Brian', resourceId: 'r-2', voiceProviderTypeId: 1 },
        { language: 'Turkish', name: 'Cem', resourceId: 'r-3', voiceProviderTypeId: 3 }
      ]
    }

    expect(CallbackTemplateModal.computed.getVoiceResourceId.call(ctx)).toBe('r-1')
    expect(CallbackTemplateModal.computed.isVoiceTextToSpeechCompatible.call(ctx)).toBe(true)
    expect(CallbackTemplateModal.computed.getVoiceItems.call(ctx)).toEqual(['Amy', 'Brian'])

    const emptyCtx = {
      ...ctx,
      selectedCallbackLanguage: '',
      selectedCallbackVoice: 'Unknown'
    }
    expect(CallbackTemplateModal.computed.getVoiceResourceId.call(emptyCtx)).toBe('')
    expect(CallbackTemplateModal.computed.isVoiceTextToSpeechCompatible.call(emptyCtx)).toBe(false)
    expect(CallbackTemplateModal.computed.getVoiceItems.call(emptyCtx)).toEqual([])
  })

  it('computed file preview helpers return content and url variants', () => {
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:preview')

    const file = { name: 'notice.mp3', size: 123 }
    const fileCtx = {
      formValues: { dialingNoticeStepContent: file, dialingNoticeStepInputUrl: null }
    }

    expect(CallbackTemplateModal.computed.getDialingNoticeFileSrc.call(fileCtx)).toBe('blob:preview')
    expect(CallbackTemplateModal.computed.getDialingNoticeFilePreviews.call(fileCtx)).toEqual([
      { name: 'notice.mp3', size: 123 }
    ])

    const urlCtx = {
      formValues: {
        dialingNoticeStepContent: null,
        dialingNoticeStepInputUrl: 'https://cdn.keepnet.com/files/voice.wav'
      }
    }
    expect(CallbackTemplateModal.computed.getDialingNoticeFileSrc.call(urlCtx)).toBe(
      'https://cdn.keepnet.com/files/voice.wav'
    )
    expect(CallbackTemplateModal.computed.getDialingNoticeFilePreviews.call(urlCtx)).toEqual([
      { name: 'voice.wav' }
    ])

    const emptyCtx = {
      formValues: {
        dialingNoticeStepContent: null,
        dialingNoticeStepInputUrl: null
      }
    }
    expect(CallbackTemplateModal.computed.getDialingNoticeFileSrc.call(emptyCtx)).toBeNull()
    expect(CallbackTemplateModal.computed.getDialingNoticeFilePreviews.call(emptyCtx)).toEqual([])

    window.URL.createObjectURL = originalCreateObjectURL
  })

  it('onVishingStepChange marks only selected step as vishing', () => {
    const ctx = {
      formValues: {
        steps: [{ isVishingStep: false }, { isVishingStep: false }, { isVishingStep: true }]
      }
    }

    CallbackTemplateModal.methods.onVishingStepChange.call(ctx, 1)
    expect(ctx.formValues.steps[0].isVishingStep).toBe(false)
    expect(ctx.formValues.steps[1].isVishingStep).toBe(true)
    expect(ctx.formValues.steps[2].isVishingStep).toBe(false)
  })

  it('onAddStep adds requested step and onRemoveStep reorders items', () => {
    const ctx = {
      formValues: {
        steps: [
          { inputType: 'TextToSpeech', order: 1, isExpanded: true },
          { inputType: 'Pause', order: 2, isExpanded: true }
        ]
      }
    }

    CallbackTemplateModal.methods.onAddStep.call(ctx, 'FileUpload')
    expect(ctx.formValues.steps.length).toBe(3)
    expect(ctx.formValues.steps[0].isExpanded).toBe(false)
    expect(ctx.formValues.steps[2]).toEqual(
      expect.objectContaining({ inputType: 'FileUpload', order: 3, isExpanded: true })
    )

    CallbackTemplateModal.methods.onRemoveStep.call(ctx, 1)
    expect(ctx.formValues.steps.length).toBe(2)
    expect(ctx.formValues.steps[0].order).toBe(1)
    expect(ctx.formValues.steps[1].order).toBe(2)
  })

  it('validateSteps expands invalid step and triggers step-2 form validation', async () => {
    const validate = jest.fn()
    const ctx = {
      formValues: {
        steps: [
          { inputType: 'TextToSpeech', inputText: 'hello', inputDigit: 1, isExpanded: false },
          { inputType: 'Pause', duration: 11, isExpanded: false }
        ]
      },
      $set: (obj, index, value) => {
        obj[index] = value
      },
      $nextTick: (cb) => cb(),
      $refs: {
        refFormStep2: { validate }
      }
    }

    const result = CallbackTemplateModal.methods.validateSteps.call(ctx)
    await flushPromises()

    expect(result).toBe(false)
    expect(ctx.formValues.steps[1].isExpanded).toBe(true)
    expect(ctx.formValues.steps[0].isExpanded).toBe(false)
    expect(validate).toHaveBeenCalled()
  })

  it('onFileChanged handles empty file list and valid file case', () => {
    const ctx = {
      isPlayAudioClicked: true,
      fileUploadErrorText: '',
      formValues: {
        dialingNoticeStepContent: null,
        dialingNoticeStepInputUrl: 'https://cdn.keepnet.com/file.wav'
      }
    }

    CallbackTemplateModal.methods.onFileChanged.call(ctx, [])
    expect(ctx.formValues.dialingNoticeStepContent).toBeNull()
    expect(ctx.formValues.dialingNoticeStepInputUrl).toBeNull()
    expect(ctx.fileUploadErrorText).toBe("Audio file can't be empty.")
    expect(ctx.isPlayAudioClicked).toBe(false)

    CallbackTemplateModal.methods.onFileChanged.call(ctx, { name: 'new.wav' })
    expect(ctx.formValues.dialingNoticeStepContent).toEqual({ name: 'new.wav' })
    expect(ctx.fileUploadErrorText).toBe('')
  })

  it('changeCallbackTemplateModalStatus emits directly when unchanged, dispatches when changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())

    const unchangedCtx = {
      formValues: { name: 'A' },
      initialFormValues: { name: 'A' },
      $emit: emit,
      $store: { dispatch }
    }
    isDifferent.mockReturnValueOnce(false)
    CallbackTemplateModal.methods.changeCallbackTemplateModalStatus.call(unchangedCtx)
    expect(emit).toHaveBeenCalledWith('changeCallbackTemplateModalStatus', false)

    const changedCtx = {
      formValues: { name: 'B' },
      initialFormValues: { name: 'A' },
      $emit: emit,
      $store: { dispatch }
    }
    isDifferent.mockReturnValueOnce(true)
    CallbackTemplateModal.methods.changeCallbackTemplateModalStatus.call(changedCtx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
  })

  it('nextStep increments only when form and available-for validation pass', () => {
    const invalidCtx = {
      step: 1,
      formValues: { availableForRequests: [] },
      $refs: {
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: false
        },
        refFormStep1: {
          validate: jest.fn(() => true),
          $el: { querySelector: jest.fn(() => 'message-el') }
        }
      }
    }

    CallbackTemplateModal.methods.nextStep.call(invalidCtx)
    expect(invalidCtx.step).toBe(1)
    expect(scrollToComponent).toHaveBeenCalledWith('message-el')

    const validCtx = {
      step: 1,
      formValues: { availableForRequests: [] },
      $refs: {
        refFormStep1: {
          validate: jest.fn(() => true),
          $el: { querySelector: jest.fn() }
        }
      }
    }
    CallbackTemplateModal.methods.nextStep.call(validCtx)
    expect(validCtx.step).toBe(2)
  })

  it('submit blocks when no digit entering step is selected', async () => {
    const dispatch = jest.fn()
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      isSubmitDisabled: false,
      languageItems: [],
      selectedCallbackLanguage: '',
      selectedCallbackVoice: '',
      formValues: {
        name: 'Template',
        description: '',
        tags: [],
        difficulty: 1,
        availableForRequests: [],
        dialingNoticeStepInputType: 'TextToSpeech',
        dialingNoticeStepInputText: 'notice',
        dialingNoticeStepContent: null,
        dialingNoticeStepInputUrl: null,
        callGreeting: {
          inputType: 'TextToSpeech',
          inputText: 'hello',
          content: null,
          duration: 0,
          isVishingStep: false,
          inputUrl: null
        },
        steps: [{ inputType: 'TextToSpeech', inputText: 'step', inputDigit: 0, duration: 0, isVishingStep: false }]
      },
      getVoiceResourceId: '',
      getInputTypeValue: CallbackTemplateModal.methods.getInputTypeValue,
      validateFailStep: jest.fn(() => false),
      validateSteps: jest.fn(() => true),
      $refs: {
        refFormStep2: {
          validate: jest.fn(() => true),
          $el: { querySelector: jest.fn(() => 'message-el') }
        }
      },
      $store: { dispatch },
      $emit: jest.fn()
    }

    CallbackTemplateModal.methods.submit.call(ctx)
    await flushPromises()

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'One step should be chosen as digit entering step.' })
    )
    expect(CallbackService.createCallbackTemplate).not.toHaveBeenCalled()
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit calls create API on valid create flow', async () => {
    const emit = jest.fn()
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      templateId: 'tpl-1',
      isSubmitDisabled: false,
      languageItems: [{ language: 'English', name: 'Amy', resourceId: 'voice-1' }],
      selectedCallbackLanguage: 'English',
      selectedCallbackVoice: 'Amy',
      formValues: {
        name: 'Template',
        description: 'Desc',
        tags: ['tag-a'],
        difficulty: 2,
        availableForRequests: [{ resourceId: 'c-1', type: 2 }],
        dialingNoticeStepInputType: 'TextToSpeech',
        dialingNoticeStepInputText: 'notice',
        dialingNoticeStepContent: null,
        dialingNoticeStepInputUrl: null,
        callGreeting: {
          inputType: 'TextToSpeech',
          inputText: 'hello',
          content: null,
          duration: 0,
          isVishingStep: false,
          inputUrl: null
        },
        steps: [
          {
            inputType: 'TextToSpeech',
            inputText: 'step',
            inputDigit: 3,
            duration: 0,
            inputUrl: null,
            content: null,
            isVishingStep: true
          }
        ]
      },
      getVoiceResourceId: 'voice-1',
      getInputTypeValue: CallbackTemplateModal.methods.getInputTypeValue,
      validateFailStep: jest.fn(() => true),
      validateSteps: jest.fn(() => true),
      $refs: {
        refFormStep2: {
          validate: jest.fn(() => true),
          $el: { querySelector: jest.fn(() => 'message-el') }
        }
      },
      $store: { dispatch: jest.fn() },
      $emit: emit
    }

    CallbackTemplateModal.methods.submit.call(ctx)
    await flushPromises()

    expect(CallbackService.createCallbackTemplate).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('changeCallbackTemplateModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit calls update API in edit mode', async () => {
    const emit = jest.fn()
    const ctx = {
      isEdit: true,
      isDuplicate: false,
      templateId: 'tpl-9',
      isSubmitDisabled: false,
      languageItems: [],
      selectedCallbackLanguage: '',
      selectedCallbackVoice: '',
      formValues: {
        name: 'Template',
        description: '',
        tags: [],
        difficulty: 1,
        availableForRequests: [],
        dialingNoticeStepInputType: 'TextToSpeech',
        dialingNoticeStepInputText: 'notice',
        dialingNoticeStepContent: null,
        dialingNoticeStepInputUrl: null,
        callGreeting: {
          inputType: 'TextToSpeech',
          inputText: 'hello',
          content: null,
          duration: 0,
          isVishingStep: false,
          inputUrl: null
        },
        steps: [
          {
            inputType: 'TextToSpeech',
            inputText: 'step',
            inputDigit: 1,
            duration: 0,
            inputUrl: null,
            content: null,
            isVishingStep: true
          }
        ]
      },
      getVoiceResourceId: '',
      getInputTypeValue: CallbackTemplateModal.methods.getInputTypeValue,
      validateFailStep: jest.fn(() => true),
      validateSteps: jest.fn(() => true),
      $refs: {
        refFormStep2: {
          validate: jest.fn(() => true),
          $el: { querySelector: jest.fn(() => 'message-el') }
        }
      },
      $store: { dispatch: jest.fn() },
      $emit: emit
    }

    CallbackTemplateModal.methods.submit.call(ctx)
    await flushPromises()

    expect(CallbackService.updateCallbackTemplate).toHaveBeenCalledWith('tpl-9', expect.any(FormData))
    expect(emit).toHaveBeenCalledWith('changeCallbackTemplateModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })
})
