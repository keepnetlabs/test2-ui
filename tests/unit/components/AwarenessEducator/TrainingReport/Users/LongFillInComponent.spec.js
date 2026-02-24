import { shallowMount } from '@vue/test-utils'
import LongFillInComponent from '@/components/AwarenessEducator/TrainingReport/Users/LongFillInComponent.vue'

describe('LongFillInComponent.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(LongFillInComponent, {
      propsData: {
        answerOptions: [],
        showCorrectAnswers: true,
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('getUserResponse returns fallback when answerOptions empty', () => {
    const wrapper = createWrapper({ answerOptions: [] })
    expect(wrapper.vm.getUserResponse).toBe('No response provided')
  })

  it('getUserResponse returns fallback when answerOptions null', () => {
    const wrapper = createWrapper({ answerOptions: null })
    expect(wrapper.vm.getUserResponse).toBe('No response provided')
  })

  it('getUserResponse returns text from user answer', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, text: 'My essay answer' }]
    })
    expect(wrapper.vm.getUserResponse).toBe('My essay answer')
  })

  it('getUserResponse returns option when text missing', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, option: 'Option text' }]
    })
    expect(wrapper.vm.getUserResponse).toBe('Option text')
  })

  it('getUserResponse returns answer when text and option missing', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, answer: 'Answer field' }]
    })
    expect(wrapper.vm.getUserResponse).toBe('Answer field')
  })

  it('getUserResponse returns fallback when no user answer', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: false, text: 'Other' }]
    })
    expect(wrapper.vm.getUserResponse).toBe('No response provided')
  })
})
