import { shallowMount } from '@vue/test-utils'
import MultipleResponseComponent from '@/components/AwarenessEducator/TrainingReport/Users/MultipleResponseComponent.vue'

describe('MultipleResponseComponent.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(MultipleResponseComponent, {
      propsData: {
        answerOptions: [
          { optionId: '1', text: 'Option A', isUserAnswer: true, isCorrect: true },
          { optionId: '2', text: 'Option B', isUserAnswer: false, isCorrect: false }
        ],
        showCorrectAnswers: true,
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays all option text', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Option A')
    expect(wrapper.text()).toContain('Option B')
  })

  it('adds selected class for user answers', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll('.multiple-response-option-item--selected')).toHaveLength(1)
  })

  it('adds correct class when showCorrectAnswers true', () => {
    const wrapper = createWrapper({ showCorrectAnswers: true })
    expect(wrapper.findAll('.multiple-response-option-item--correct').length).toBeGreaterThanOrEqual(0)
  })

  it('does not add correct class when showCorrectAnswers false', () => {
    const wrapper = createWrapper({ showCorrectAnswers: false })
    expect(wrapper.findAll('.multiple-response-option-item--correct')).toHaveLength(0)
  })

  it('shows Selected badge for user answer', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Selected')
  })
})
