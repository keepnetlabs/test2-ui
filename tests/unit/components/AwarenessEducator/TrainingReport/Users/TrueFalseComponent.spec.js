import { shallowMount } from '@vue/test-utils'
import TrueFalseComponent from '@/components/AwarenessEducator/TrainingReport/Users/TrueFalseComponent.vue'

describe('TrueFalseComponent.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TrueFalseComponent, {
      propsData: {
        answerOptions: [
          { optionId: '1', text: 'True', isUserAnswer: true, isCorrect: true },
          { optionId: '2', text: 'False', isUserAnswer: false, isCorrect: false }
        ],
        showCorrectAnswers: true,
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays option text', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('True')
    expect(wrapper.text()).toContain('False')
  })

  it('isTrueOption returns true for true text', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isTrueOption('True')).toBe(true)
    expect(wrapper.vm.isTrueOption('doğru')).toBe(true)
  })

  it('isTrueOption returns false for false text', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isTrueOption('False')).toBe(false)
  })

  it('isFalseOption returns true for false text', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isFalseOption('False')).toBe(true)
    expect(wrapper.vm.isFalseOption('yanlış')).toBe(true)
  })

  it('isFalseOption returns falsy for empty', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isFalseOption(null)).toBeFalsy()
  })

  it('adds selected class for user answer', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll('.true-false-option-card--selected')).toHaveLength(1)
  })

  it('shows Selected badge', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Selected')
  })
})
