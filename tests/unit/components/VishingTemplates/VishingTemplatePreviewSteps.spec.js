jest.mock('@/api/vishing', () => ({
  playTextToSpeech: jest.fn().mockResolvedValue({ data: { data: 'https://audio.url' } })
}))
jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '12345')
}))

import VishingTemplatePreviewSteps from '@/components/VishingTemplates/VishingTemplatePreviewSteps.vue'

describe('VishingTemplatePreviewSteps.vue', () => {
  const baseTemplate = {
    steps: [
      { inputType: 'TextToSpeech', inputText: 'Hello', isVishingStep: false },
      { inputType: 'FileUpload', inputUrl: 'http://audio.com', isVishingStep: true }
    ],
    invalidDialingNotice: { inputType: 'Pause', duration: 5 },
    callGreeting: { inputType: 'TextToSpeech' }
  }

  it('getInputText returns selected step inputText', () => {
    const ctx = {
      getSelectedStepObject: { inputText: 'Hello world' }
    }
    expect(VishingTemplatePreviewSteps.computed.getInputText.call(ctx)).toBe('Hello world')
  })

  it('getPauseDuration returns duration from selected step', () => {
    const ctx = {
      getSelectedStepObject: { duration: 10 }
    }
    expect(VishingTemplatePreviewSteps.computed.getPauseDuration.call(ctx)).toBe(10)
  })

  it('getInputUrl returns inputUrl from selected step', () => {
    const ctx = {
      getSelectedStepObject: { inputUrl: 'http://file.mp3' }
    }
    expect(VishingTemplatePreviewSteps.computed.getInputUrl.call(ctx)).toBe('http://file.mp3')
  })

  it('hasAudioFile returns true when step has FileUpload', () => {
    const ctx = {
      template: {
        steps: [{ inputType: 'FileUpload' }],
        callGreeting: {},
        invalidDialingNotice: {}
      }
    }
    expect(VishingTemplatePreviewSteps.computed.hasAudioFile.call(ctx)).toBe(true)
  })

  it('hasAudioFile returns false when template has no FileUpload anywhere', () => {
    const ctx = {
      template: {
        steps: [{ inputType: 'TextToSpeech' }],
        callGreeting: { inputType: 'Pause' },
        invalidDialingNotice: { inputType: 'Pause' }
      }
    }
    expect(VishingTemplatePreviewSteps.computed.hasAudioFile.call(ctx)).toBe(false)
  })

  it('getSelectedStepObject returns null when template is missing', () => {
    expect(
      VishingTemplatePreviewSteps.computed.getSelectedStepObject.call({
        template: null,
        selectedStep: 'Step - 0'
      })
    ).toBeNull()
  })

  it('getSelectedStepObject returns callGreeting when selectedStep is Call Greeting', () => {
    const greeting = { inputType: 'TextToSpeech', inputText: 'Welcome' }
    const ctx = {
      template: {
        steps: baseTemplate.steps,
        invalidDialingNotice: baseTemplate.invalidDialingNotice,
        callGreeting: greeting
      },
      selectedStep: 'Call Greeting'
    }
    expect(VishingTemplatePreviewSteps.computed.getSelectedStepObject.call(ctx)).toEqual(greeting)
  })

  it('getSelectedStepCategory returns Call Greeting for call greeting selection', () => {
    expect(
      VishingTemplatePreviewSteps.computed.getSelectedStepCategory.call({
        selectedStep: 'Call Greeting'
      })
    ).toBe('Call Greeting')
  })

  it('getSelectedStepObject returns step by index for Step - N', () => {
    const ctx = {
      template: baseTemplate,
      selectedStep: 'Step - 0'
    }
    const result = VishingTemplatePreviewSteps.computed.getSelectedStepObject.call(ctx)
    expect(result).toEqual(baseTemplate.steps[0])
  })

  it('getSelectedStepObject returns invalidDialingNotice for Invalid', () => {
    const ctx = {
      template: baseTemplate,
      selectedStep: 'Invalid Dialing Notice'
    }
    const result = VishingTemplatePreviewSteps.computed.getSelectedStepObject.call(ctx)
    expect(result).toEqual(baseTemplate.invalidDialingNotice)
  })

  it('getSelectedStepCategory returns Step for Step - N', () => {
    expect(
      VishingTemplatePreviewSteps.computed.getSelectedStepCategory.call({
        selectedStep: 'Step - 0'
      })
    ).toBe('Step')
  })

  it('getSelectedStepCategory returns Invalid Dialing Notice', () => {
    expect(
      VishingTemplatePreviewSteps.computed.getSelectedStepCategory.call({
        selectedStep: 'Invalid Dialing Notice'
      })
    ).toBe('Invalid Dialing Notice')
  })

  it('getInputTypeName returns text for inputType', () => {
    expect(
      VishingTemplatePreviewSteps.methods.getInputTypeName.call(
        { inputTypeItems: [{ value: 'TextToSpeech', text: 'Text to Speech' }] },
        'TextToSpeech'
      )
    ).toBe('Text to Speech')
  })

  it('getInputTypeName falls back to default label when type is unknown', () => {
    expect(
      VishingTemplatePreviewSteps.methods.getInputTypeName.call(
        { inputTypeItems: [{ value: 'TextToSpeech', text: 'Text to Speech' }] },
        'UnknownInput'
      )
    ).toBe('Text to Speech')
  })

  it('isSelectedStepVishingStep returns true when getSelectedStepObject is a vishing step', () => {
    expect(
      VishingTemplatePreviewSteps.computed.isSelectedStepVishingStep.call({
        getSelectedStepObject: { isVishingStep: true }
      })
    ).toBe(true)
  })

  it('isSelectedStepVishingStep returns false when step is not vishing or object missing', () => {
    expect(
      VishingTemplatePreviewSteps.computed.isSelectedStepVishingStep.call({
        getSelectedStepObject: { isVishingStep: false }
      })
    ).toBe(false)
    expect(
      VishingTemplatePreviewSteps.computed.isSelectedStepVishingStep.call({
        getSelectedStepObject: {}
      })
    ).toBe(false)
    expect(
      VishingTemplatePreviewSteps.computed.isSelectedStepVishingStep.call({
        getSelectedStepObject: null
      })
    ).toBe(false)
  })

  it('getStepName returns formatted step name for Step category', () => {
    const ctx = {
      inputTypeItems: [{ value: 'TextToSpeech', text: 'Text to Speech' }],
      getInputTypeName: VishingTemplatePreviewSteps.methods.getInputTypeName
    }
    const step = { inputType: 'TextToSpeech' }
    expect(
      VishingTemplatePreviewSteps.methods.getStepName.call(ctx, step, 'Step', 1)
    ).toBe('Step 1 - Text to Speech')
  })

  it('handleSelectStep sets selectedStep for Step category', () => {
    const ctx = { selectedStep: '' }
    VishingTemplatePreviewSteps.methods.handleSelectStep.call(ctx, 'Step', 2)
    expect(ctx.selectedStep).toBe('Step - 2')
  })

  it('handleSelectStep sets selectedStep for other category', () => {
    const ctx = { selectedStep: '' }
    VishingTemplatePreviewSteps.methods.handleSelectStep.call(ctx, 'Invalid Dialing Notice')
    expect(ctx.selectedStep).toBe('Invalid Dialing Notice')
  })
})
