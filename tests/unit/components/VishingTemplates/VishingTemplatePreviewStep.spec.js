import VishingTemplatePreviewStep from '@/components/VishingTemplates/VishingTemplatePreviewStep.vue'
import * as validations from '@/utils/validations'

describe('VishingTemplatePreviewStep.vue', () => {
  it('getBeautifiedStepType returns step type labels', () => {
    expect(
      VishingTemplatePreviewStep.computed.getBeautifiedStepType.call({
        step: { inputType: 'TextToSpeech' }
      })
    ).toBe('Text to Speech')
    expect(
      VishingTemplatePreviewStep.computed.getBeautifiedStepType.call({
        step: { inputType: 'FileUpload' }
      })
    ).toBe('Upload Audio')
    expect(
      VishingTemplatePreviewStep.computed.getBeautifiedStepType.call({
        step: { inputType: 'Pause' }
      })
    ).toBe('Pause')
    expect(
      VishingTemplatePreviewStep.computed.getBeautifiedStepType.call({
        step: { inputType: 'UnknownKind' }
      })
    ).toBe('')
  })

  it('getBeautifiedStepType defaults to Text to Speech when step or inputType is missing', () => {
    expect(VishingTemplatePreviewStep.computed.getBeautifiedStepType.call({ step: null })).toBe(
      'Text to Speech'
    )
    expect(VishingTemplatePreviewStep.computed.getBeautifiedStepType.call({ step: {} })).toBe(
      'Text to Speech'
    )
  })

  it('isTextToSpeechStep and isFileUploadStep reflect step inputType', () => {
    expect(
      VishingTemplatePreviewStep.computed.isTextToSpeechStep.call({
        step: { inputType: 'FileUpload' }
      })
    ).toBe(false)
    expect(
      VishingTemplatePreviewStep.computed.isFileUploadStep.call({
        step: { inputType: 'TextToSpeech' }
      })
    ).toBe(false)
  })

  it('hasTags is true when only isVishingStep is set', () => {
    expect(
      VishingTemplatePreviewStep.computed.hasTags.call({
        step: { isVishingStep: true },
        hasRequiredDigitCount: false
      })
    ).toBe(true)
  })

  it('getStepTitle formats step title with index', () => {
    const result = VishingTemplatePreviewStep.computed.getStepTitle.call({
      index: 1,
      getBeautifiedStepType: 'Text to Speech'
    })
    expect(result).toBe('Step 2 - Text to Speech')
  })

  it('hasRequiredDigitCount returns true when inputDigit exists', () => {
    expect(
      VishingTemplatePreviewStep.computed.hasRequiredDigitCount.call({
        step: { inputDigit: 4 }
      })
    ).toBe(true)
    expect(
      VishingTemplatePreviewStep.computed.hasRequiredDigitCount.call({ step: {} })
    ).toBeFalsy()
  })

  it('getRequiredDigitCountTagText returns tag text', () => {
    const ctx = { step: { inputDigit: 4 } }
    Object.defineProperty(ctx, 'hasRequiredDigitCount', {
      get: () => !!ctx.step?.inputDigit
    })
    expect(VishingTemplatePreviewStep.computed.getRequiredDigitCountTagText.call(ctx)).toBe(
      'Required 4 digits input'
    )
  })

  it('handleAudioPlay emits play', () => {
    const emit = jest.fn()
    VishingTemplatePreviewStep.methods.handleAudioPlay.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('play')
  })

  it('handleAudioPause emits pause', () => {
    const emit = jest.fn()
    VishingTemplatePreviewStep.methods.handleAudioPause.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('pause')
  })

  it('getFileName extracts trailing segment when url validates', () => {
    const spy = jest.spyOn(validations, 'url').mockReturnValue(true)
    const ctx = { step: { inputUrl: 'https://cdn.example.com/folder/track.mp3' } }
    expect(
      VishingTemplatePreviewStep.methods.getFileName.call(
        ctx,
        'https://cdn.example.com/folder/track.mp3'
      )
    ).toBe('track.mp3')
    spy.mockRestore()
  })

  it('getFileName returns argument when url does not validate', () => {
    const spy = jest.spyOn(validations, 'url').mockReturnValue(false)
    const ctx = { step: { inputUrl: 'ignored' } }
    expect(VishingTemplatePreviewStep.methods.getFileName.call(ctx, 'local.wav')).toBe('local.wav')
    spy.mockRestore()
  })
})
