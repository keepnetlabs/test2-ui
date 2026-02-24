import { shallowMount } from '@vue/test-utils'
import LikertComponent from '@/components/AwarenessEducator/TrainingReport/Users/LikertComponent.vue'

describe('LikertComponent.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(LikertComponent, {
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

  it('userResponses returns empty when answerOptions empty', () => {
    const wrapper = createWrapper({ answerOptions: [] })
    expect(wrapper.vm.userResponses).toEqual([])
  })

  it('userResponses returns empty when answerOptions null', () => {
    const wrapper = createWrapper({ answerOptions: null })
    expect(wrapper.vm.userResponses).toEqual([])
  })

  it('userResponses returns empty when no user answer', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: false, option: '0_Strongly_Disagree' }]
    })
    expect(wrapper.vm.userResponses).toEqual([])
  })

  it('userResponses parses option format and extracts labels', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, option: '0_Strongly_Disagree, 1_Agree' }]
    })
    expect(wrapper.vm.userResponses).toEqual(['Strongly Disagree', 'Agree'])
  })

  it('userResponses handles single part format', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, option: 'single' }]
    })
    expect(wrapper.vm.userResponses).toEqual(['single'])
  })

  it('shows No likert responses found when userResponses empty', () => {
    const wrapper = createWrapper({ answerOptions: [] })
    expect(wrapper.text()).toContain('No likert responses found')
  })
})
