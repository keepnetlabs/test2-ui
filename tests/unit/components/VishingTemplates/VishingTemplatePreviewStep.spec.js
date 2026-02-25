import VishingTemplatePreviewStep from '@/components/VishingTemplates/VishingTemplatePreviewStep.vue'

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
})
