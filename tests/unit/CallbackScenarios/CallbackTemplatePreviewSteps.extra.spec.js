jest.mock('@/api/callback', () => ({
  getVoiceUrl: jest.fn().mockResolvedValue({ data: { data: 'https://audio.url' } })
}))

import { shallowMount } from '@vue/test-utils'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps.vue'

describe('CallbackTemplatePreviewSteps.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('getSelectedStepObject returns null when no template', () => {
      expect(
        CallbackTemplatePreviewSteps.computed.getSelectedStepObject.call({
          template: null,
          selectedStep: 'Call Greeting'
        })
      ).toBeNull()
    })

    it('getSelectedStepObject returns callGreeting for Call Greeting', () => {
      const template = { callGreeting: { inputType: 'TextToSpeech' } }
      expect(
        CallbackTemplatePreviewSteps.computed.getSelectedStepObject.call({
          template,
          selectedStep: 'Call Greeting'
        })
      ).toEqual({ inputType: 'TextToSpeech' })
    })

    it('getSelectedStepObject returns invalidDialingNotice for Invalid', () => {
      const template = { invalidDialingNotice: { inputType: 'FileUpload' } }
      expect(
        CallbackTemplatePreviewSteps.computed.getSelectedStepObject.call({
          template,
          selectedStep: 'Invalid Dialing Notice'
        })
      ).toEqual({ inputType: 'FileUpload' })
    })

    it('getSelectedStepObject returns step for Step - N', () => {
      const template = { steps: [{ a: 1 }, { b: 2 }] }
      expect(
        CallbackTemplatePreviewSteps.computed.getSelectedStepObject.call({
          template,
          selectedStep: 'Step - 1'
        })
      ).toEqual({ b: 2 })
    })

    it('getSelectedStepCategory returns correct category', () => {
      const getter = CallbackTemplatePreviewSteps.computed.getSelectedStepCategory
      expect(getter.call({ selectedStep: 'Step - 0' })).toBe('Step')
      expect(getter.call({ selectedStep: 'Invalid Dialing Notice' })).toBe('Invalid Dialing Notice')
      expect(getter.call({ selectedStep: 'Call Greeting' })).toBe('Call Greeting')
    })

    it('getStepName returns formatted name for Step category', () => {
      const wrapper = shallowMount(CallbackTemplatePreviewSteps, {
        propsData: {
          template: { callGreeting: {}, invalidDialingNotice: {}, steps: [] }
        }
      })
      expect(wrapper.vm.getStepName({ inputType: 'TextToSpeech' }, 'Step', 1)).toBe(
        'Step 1 - Text to Speech'
      )
    })

    it('getStepName returns formatted name for other category', () => {
      const wrapper = shallowMount(CallbackTemplatePreviewSteps, {
        propsData: {
          template: { callGreeting: {}, invalidDialingNotice: {}, steps: [] }
        }
      })
      expect(wrapper.vm.getStepName({ inputType: 'FileUpload' }, 'Call Greeting')).toBe(
        'Call Greeting - Upload Audio'
      )
    })

    it('getInputTypeName returns fallback for unknown type', () => {
      const ctx = {
        inputTypeItems: [
          { value: 'TextToSpeech', text: 'Text to Speech' },
          { value: 'FileUpload', text: 'Upload Audio' },
          { value: 'Pause', text: 'Pause' }
        ]
      }
      expect(
        CallbackTemplatePreviewSteps.methods.getInputTypeName.call(ctx, 'Unknown')
      ).toBe('Text to Speech')
    })

    it('handleSelectStep sets selectedStep for Step category', () => {
      const ctx = { selectedStep: '' }
      CallbackTemplatePreviewSteps.methods.handleSelectStep.call(ctx, 'Step', 2)
      expect(ctx.selectedStep).toBe('Step - 2')
    })

    it('handleSelectStep sets selectedStep for other category', () => {
      const ctx = { selectedStep: '' }
      CallbackTemplatePreviewSteps.methods.handleSelectStep.call(ctx, 'Call Greeting')
      expect(ctx.selectedStep).toBe('Call Greeting')
    })
  })

  describe('hasAudioFile', () => {
    it('returns true when steps have FileUpload', () => {
      const ctx = {
        template: { steps: [{ inputType: 'FileUpload' }] }
      }
      expect(CallbackTemplatePreviewSteps.computed.hasAudioFile.call(ctx)).toBe(true)
    })
  })
})
