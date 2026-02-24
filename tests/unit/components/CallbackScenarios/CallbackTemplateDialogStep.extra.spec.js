import { shallowMount } from '@vue/test-utils'
import CallbackTemplateDialogStep from '@/components/CallbackScenarios/CallbackTemplateDialogStep.vue'

const baseValue = {
  inputType: 'TextToSpeech',
  isExpanded: true,
  isVishingStep: false,
  inputText: '',
  inputDigit: 0,
  duration: 0
}

describe('CallbackTemplateDialogStep.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CallbackTemplateDialogStep, {
      propsData: {
        value: { ...baseValue },
        index: 0,
        isRemoveDisabled: false,
        isCallGreeting: false,
        dialingNoticeItems: [],
        ...propsData
      },
      stubs: {
        FormGroup: true,
        KButtonCheckbox: true,
        KFileUpload: true,
        KSelect: true,
        InputMergeTag: true,
        CustomError: true,
        AlertBox: true,
        AudioPlayer: true
      }
    })

  it('getTitle returns Text To Speech for inputType TextToSpeech', () => {
    const wrapper = createWrapper({
      value: { ...baseValue, inputType: 'TextToSpeech' },
      index: 1
    })
    expect(wrapper.vm.getTitle).toBe('Step 2 - Text To Speech')
  })

  it('getTitle returns Text To Speech for inputType 1 (numeric)', () => {
    const wrapper = createWrapper({
      value: { ...baseValue, inputType: 1 },
      index: 0
    })
    expect(wrapper.vm.getTitle).toBe('Step 1 - Text To Speech')
  })

  it('getTitle returns Upload Audio for inputType FileUpload', () => {
    const wrapper = createWrapper({
      value: { ...baseValue, inputType: 'FileUpload' }
    })
    expect(wrapper.vm.getTitle).toBe('Step 1 - Upload Audio')
  })

  it('getTitle returns Pause for inputType Pause', () => {
    const wrapper = createWrapper({
      value: { ...baseValue, inputType: 'Pause' }
    })
    expect(wrapper.vm.getTitle).toBe('Step 1 - Pause')
  })

  it('getTextToSpeechSubTitlte returns call greeting text when isCallGreeting', () => {
    const wrapper = createWrapper({ isCallGreeting: true })
    expect(wrapper.vm.getTextToSpeechSubTitlte).toContain('voiced by AI')
    expect(wrapper.vm.getTextToSpeechSubTitlte).not.toContain('merge tags')
  })

  it('getTextToSpeechSubTitlte returns merge tags hint when not call greeting', () => {
    const wrapper = createWrapper({ isCallGreeting: false })
    expect(wrapper.vm.getTextToSpeechSubTitlte).toContain('merge tags')
  })

  it('getFilePreviews returns empty when no content or inputUrl', () => {
    const wrapper = createWrapper({
      value: { ...baseValue, content: null, inputUrl: null }
    })
    expect(wrapper.vm.getFilePreviews).toEqual([])
  })

  it('onVishingStepChange emits input and vishingStepChange when val is true', () => {
    const wrapper = createWrapper()
    wrapper.vm.onVishingStepChange(true)
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('vishingStepChange')).toBeTruthy()
    expect(wrapper.emitted('vishingStepChange')[0][0]).toBe(0)
  })

  it('onRemoveStep emits removeStep', () => {
    const wrapper = createWrapper()
    wrapper.vm.onRemoveStep()
    expect(wrapper.emitted('removeStep')).toBeTruthy()
  })

  it('onToggleExpansion emits input with toggled isExpanded', () => {
    const wrapper = createWrapper({
      value: { ...baseValue, isExpanded: true }
    })
    wrapper.vm.onToggleExpansion()
    expect(wrapper.emitted('input')[0][0].isExpanded).toBe(false)
  })
})
