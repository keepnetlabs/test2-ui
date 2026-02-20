import { shallowMount } from '@vue/test-utils'
import InputAIDescription from '@/components/Common/Inputs/InputAIDescription.vue'
import labels from '@/model/constants/labels'

describe('InputAIDescription.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(InputAIDescription, {
      propsData: {
        value: '',
        ...propsData
      }
    })

  it('computes minHeightNumber and textareaStyle from height prop', () => {
    const wrapper = createWrapper({ height: '140px' })
    expect(wrapper.vm.minHeightNumber).toBe('140')
    expect(wrapper.vm.textareaStyle).toEqual({ '--textarea-min-height': '140px' })

    const wrapperWithoutPx = createWrapper({ height: '120' })
    expect(wrapperWithoutPx.vm.minHeightNumber).toBe('120')
    expect(wrapperWithoutPx.vm.textareaStyle).toEqual({ '--textarea-min-height': '120px' })
  })

  it('returns empty style and undefined min height when height is not provided', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.minHeightNumber).toBeUndefined()
    expect(wrapper.vm.textareaStyle).toEqual({})
  })

  it('computes generate button text for generate, improve and regenerate states', async () => {
    const wrapper = createWrapper({ value: '' })
    expect(wrapper.vm.generateButtonText).toBe('Generate')

    await wrapper.setProps({ value: 'this text should be improved' })
    expect(wrapper.vm.generateButtonText).toBe('Improve with AI')

    await wrapper.setProps({ hasGenerated: true })
    expect(wrapper.vm.generateButtonText).toBe('Regenerate')
  })

  it('computes disabled generate button style when disabled or generating', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getGenerateButtonStyle).toEqual({
      textTransform: 'capitalize',
      maxHeight: '28px'
    })

    await wrapper.setProps({ isGenerateDisabled: true })
    expect(wrapper.vm.getGenerateButtonStyle).toEqual({
      opacity: 0.5,
      pointerEvents: 'none',
      textTransform: 'capitalize',
      maxHeight: '28px'
    })
  })

  it('emits generate on click when generation is allowed', () => {
    const wrapper = createWrapper({ isGenerateDisabled: false, isGenerating: false })
    wrapper.vm.handleGenerateClick()

    expect(wrapper.emitted('generate')).toBeTruthy()
    expect(wrapper.emitted('generate').length).toBe(1)
  })

  it('does not emit generate when disabled or already generating', async () => {
    const wrapper = createWrapper({ isGenerateDisabled: true, isGenerating: false })
    wrapper.vm.handleGenerateClick()
    expect(wrapper.emitted('generate')).toBeFalsy()

    await wrapper.setProps({ isGenerateDisabled: false, isGenerating: true })
    wrapper.vm.handleGenerateClick()
    expect(wrapper.emitted('generate')).toBeFalsy()
  })

  it('initializes placeholder and required metadata in created hook', () => {
    const wrapper = createWrapper({ required: true, hint: 'Custom hint' })
    expect(wrapper.vm.placeholder).toBe(labels.EnterDescription)
    expect(wrapper.vm.requiredProps).toEqual({
      hint: 'Custom hint',
      persistentHint: true
    })
    expect(wrapper.vm.rules.length).toBeGreaterThan(0)
  })

  it('uses initialPlaceholder and initialRules when provided', () => {
    const initialRules = [jest.fn(() => true)]
    const wrapper = createWrapper({
      initialPlaceholder: 'Describe with AI',
      initialRules
    })

    expect(wrapper.vm.placeholder).toBe('Describe with AI')
    expect(wrapper.vm.rules).toBe(initialRules)
  })

  it('emits generating-changed immediately and when isGenerating changes', async () => {
    const wrapper = createWrapper({ isGenerating: false })
    expect(wrapper.emitted('generating-changed')[0]).toEqual([false])

    await wrapper.setProps({ isGenerating: true })
    const emissions = wrapper.emitted('generating-changed')
    expect(emissions[1]).toEqual([true])
  })

  it('resets rules when applyRules is false after required watcher runs', async () => {
    const wrapper = createWrapper({ required: false, applyRules: false })
    await wrapper.setProps({ required: true })

    expect(wrapper.vm.rules).toEqual([])
  })

  it('renders skeleton state while isGenerating is true', () => {
    const wrapper = createWrapper({ isGenerating: true })
    expect(wrapper.find('.input-ai-description__skeleton').exists()).toBe(true)
    expect(wrapper.find('.input-ai-description__generating-badge').exists()).toBe(true)
  })

  it('renders append-inner slot when generate button is hidden', () => {
    const wrapper = shallowMount(InputAIDescription, {
      propsData: { showGenerateButton: false },
      slots: {
        'append-inner': '<span class="append-slot-content">slot</span>'
      }
    })

    expect(wrapper.find('.append-slot-content').exists()).toBe(true)
  })

  it('shows generated badge when showGeneratedByAI is true', () => {
    const wrapper = createWrapper({ showGeneratedByAI: true, isGenerating: false })
    expect(wrapper.find('.input-ai-description__generated-badge').exists()).toBe(true)
  })
})
