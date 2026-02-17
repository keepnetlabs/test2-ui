import { createLocalVue, shallowMount } from '@vue/test-utils'
import ChoiceQuestionComponent from '@/components/AwarenessEducator/TrainingReport/Users/ChoiceQuestionComponent'

describe('Questionnaire.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(ChoiceQuestionComponent, {
      localVue,
      propsData: {
        answerOptions: [
          { optionId: 1, text: 'A', isUserAnswer: true, isCorrect: false },
          { optionId: 2, text: 'B', isUserAnswer: false, isCorrect: true }
        ],
        ...propsData
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('shows selected and correct badges', () => {
    const wrapper = mountComponent({ showCorrectAnswers: true })
    expect(wrapper.text()).toContain('Selected')
    expect(wrapper.text()).toContain('Correct')
  })

  it('hides correct badge when showCorrectAnswers is false', () => {
    const wrapper = mountComponent({ showCorrectAnswers: false })
    expect(wrapper.text()).toContain('Selected')
    expect(wrapper.text()).not.toContain('Correct')
  })

  it('adds selected and correct css classes according to option state', () => {
    const wrapper = mountComponent({ showCorrectAnswers: true })
    const items = wrapper.findAll('.choice-option-item')
    expect(items.at(0).classes()).toContain('choice-option-item--selected')
    expect(items.at(0).classes()).not.toContain('choice-option-item--correct')
    expect(items.at(1).classes()).toContain('choice-option-item--correct')
  })

  it('renders all option texts', () => {
    const wrapper = mountComponent({
      answerOptions: [
        { optionId: 1, text: 'Option 1', isUserAnswer: false, isCorrect: false },
        { optionId: 2, text: 'Option 2', isUserAnswer: false, isCorrect: true },
        { optionId: 3, text: 'Option 3', isUserAnswer: true, isCorrect: false }
      ]
    })
    expect(wrapper.text()).toContain('Option 1')
    expect(wrapper.text()).toContain('Option 2')
    expect(wrapper.text()).toContain('Option 3')
  })
})
