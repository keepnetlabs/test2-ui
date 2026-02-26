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

  it('userResponses returns empty when user answer exists but option is missing', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true }]
    })
    expect(wrapper.vm.userResponses).toEqual([])
  })

  it('userResponses uses first matching user answer option', () => {
    const wrapper = createWrapper({
      answerOptions: [
        { isUserAnswer: true, option: '0_First_Answer' },
        { isUserAnswer: true, option: '0_Second_Answer' }
      ]
    })
    expect(wrapper.vm.userResponses).toEqual(['First Answer'])
  })

  it('shows No likert responses found when userResponses empty', () => {
    const wrapper = createWrapper({ answerOptions: [] })
    expect(wrapper.text()).toContain('No likert responses found')
  })

  it('userResponses converts multi-underscore labels into spaced text', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, option: '0_Strongly_Agree_With_Statement' }]
    })
    expect(wrapper.vm.userResponses).toEqual(['Strongly Agree With Statement'])
  })

  it('userResponses returns empty when option is empty string', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, option: '' }]
    })
    expect(wrapper.vm.userResponses).toEqual([])
  })

  it('renders numbered response items when userResponses exists', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, option: '0_Strongly_Disagree, 1_Agree, 2_Neutral' }]
    })

    const items = wrapper.findAll('.likert-item')
    expect(items.length).toBe(3)
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('Strongly Disagree')
    expect(wrapper.text()).toContain('Agree')
    expect(wrapper.text()).toContain('Neutral')
  })

  it('userResponses keeps comma-without-space payload as a single response item', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, option: '0_Strongly_Disagree,1_Agree' }]
    })

    expect(wrapper.vm.userResponses).toEqual(['Strongly Disagree,1 Agree'])
  })

  it('showCorrectAnswers prop has true default', () => {
    expect(LikertComponent.props.showCorrectAnswers.default).toBe(true)
  })

  it('userResponses throws when option is non-string truthy value', () => {
    expect(() =>
      LikertComponent.computed.userResponses.call({
        answerOptions: [{ isUserAnswer: true, option: 123 }]
      })
    ).toThrow()
  })
})
