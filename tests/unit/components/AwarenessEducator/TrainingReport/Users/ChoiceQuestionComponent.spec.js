import { shallowMount } from '@vue/test-utils'
import ChoiceQuestionComponent from '@/components/AwarenessEducator/TrainingReport/Users/ChoiceQuestionComponent.vue'

describe('ChoiceQuestionComponent.vue', () => {
  const defaultAnswerOptions = [
    { optionId: '1', text: 'Option A', isUserAnswer: true, isCorrect: true },
    { optionId: '2', text: 'Option B', isUserAnswer: false, isCorrect: false },
    { optionId: '3', text: 'Option C', isUserAnswer: false, isCorrect: true }
  ]

  const createWrapper = (propsData = {}) =>
    shallowMount(ChoiceQuestionComponent, {
      propsData: {
        answerOptions: defaultAnswerOptions,
        showCorrectAnswers: true,
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('renders all answer options', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll('.choice-option-item')).toHaveLength(3)
  })

  it('displays option text', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Option A')
    expect(wrapper.text()).toContain('Option B')
    expect(wrapper.text()).toContain('Option C')
  })

  it('adds choice-option-item--selected class when option is user answer', () => {
    const wrapper = createWrapper()
    const selected = wrapper.findAll('.choice-option-item--selected')
    expect(selected).toHaveLength(1)
  })

  it('adds choice-option-item--correct class when option is correct and showCorrectAnswers true', () => {
    const wrapper = createWrapper({ showCorrectAnswers: true })
    const correct = wrapper.findAll('.choice-option-item--correct')
    expect(correct.length).toBeGreaterThanOrEqual(1)
  })

  it('does not add choice-option-item--correct when showCorrectAnswers false', () => {
    const wrapper = createWrapper({ showCorrectAnswers: false })
    const correct = wrapper.findAll('.choice-option-item--correct')
    expect(correct).toHaveLength(0)
  })

  it('shows Selected badge when option is user answer', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Selected')
  })

  it('shows Correct badge when option is correct and showCorrectAnswers true', () => {
    const wrapper = createWrapper({ showCorrectAnswers: true })
    expect(wrapper.text()).toContain('Correct')
  })

  it('supports optionId or text as key', () => {
    const options = [{ text: 'Fallback key', isUserAnswer: false, isCorrect: false }]
    const wrapper = createWrapper({ answerOptions: options })
    expect(wrapper.text()).toContain('Fallback key')
  })
})
