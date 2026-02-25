jest.mock('@/utils/validations', () => ({
  __esModule: true,
  url: jest.fn((value) => value.startsWith('http'))
}))

import CallbackTemplatePreviewStep from '@/components/CallbackScenarios/CallbackTemplatePreviewStep.vue'

describe('CallbackTemplatePreviewStep.vue', () => {
  it('has correct component name', () => {
    expect(CallbackTemplatePreviewStep.name).toBe('CallbackTemplatePreviewStep')
  })

  it('getBeautifiedStepType returns expected labels by inputType', () => {
    expect(CallbackTemplatePreviewStep.computed.getBeautifiedStepType.call({ step: {} })).toBe(
      'Text to Speech'
    )
    expect(
      CallbackTemplatePreviewStep.computed.getBeautifiedStepType.call({
        step: { inputType: 'FileUpload' }
      })
    ).toBe('Upload Audio')
    expect(
      CallbackTemplatePreviewStep.computed.getBeautifiedStepType.call({
        step: { inputType: 'Pause' }
      })
    ).toBe('Pause')
  })

  it('getStepTitle uses index and beautified step type', () => {
    const ctx = { index: 1, getBeautifiedStepType: 'Upload Audio' }
    expect(CallbackTemplatePreviewStep.computed.getStepTitle.call(ctx)).toBe('Step 2 - Upload Audio')
  })

  it('hasTags and required-digit helpers work as expected', () => {
    const requiredCtx = { step: { inputDigit: 3, isVishingStep: false } }
    expect(CallbackTemplatePreviewStep.computed.hasRequiredDigitCount.call(requiredCtx)).toBe(true)
    expect(CallbackTemplatePreviewStep.computed.hasTags.call({ ...requiredCtx, hasRequiredDigitCount: true })).toBe(true)
    expect(
      CallbackTemplatePreviewStep.computed.getRequiredDigitCountTagText.call({
        ...requiredCtx,
        hasRequiredDigitCount: true
      })
    ).toBe('Required 3 digits input')
  })

  it('getFileName returns parsed name for valid urls and original value for invalid url', () => {
    const ctx = { step: { inputUrl: 'https://cdn.test/audio/file.mp3' } }
    expect(CallbackTemplatePreviewStep.methods.getFileName.call(ctx, ctx.step.inputUrl)).toBe('file.mp3')
    expect(CallbackTemplatePreviewStep.methods.getFileName.call(ctx, 'invalid-url')).toBe('invalid-url')
  })

  it('handleAudioPlay and handleAudioPause emit events', () => {
    const $emit = jest.fn()
    CallbackTemplatePreviewStep.methods.handleAudioPlay.call({ $emit })
    CallbackTemplatePreviewStep.methods.handleAudioPause.call({ $emit })
    expect($emit).toHaveBeenCalledWith('play')
    expect($emit).toHaveBeenCalledWith('pause')
  })
})
