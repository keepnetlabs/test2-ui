import { shallowMount } from '@vue/test-utils'
import DropdownComponent from '@/components/AwarenessEducator/TrainingReport/Users/DropdownComponent.vue'

describe('DropdownComponent.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DropdownComponent, {
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

  it('getUserSelection returns fallback when answerOptions empty', () => {
    const wrapper = createWrapper({ answerOptions: [] })
    expect(wrapper.vm.getUserSelection).toBe('No selection made')
  })

  it('getUserSelection returns fallback when answerOptions null', () => {
    const wrapper = createWrapper({ answerOptions: null })
    expect(wrapper.vm.getUserSelection).toBe('No selection made')
  })

  it('getUserSelection returns text from user answer', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, text: 'Selected option' }]
    })
    expect(wrapper.vm.getUserSelection).toBe('Selected option')
  })

  it('getUserSelection returns option when text missing', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true, option: 'Option text' }]
    })
    expect(wrapper.vm.getUserSelection).toBe('Option text')
  })

  it('getUserSelection returns fallback when no user answer', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: false, text: 'Other' }]
    })
    expect(wrapper.vm.getUserSelection).toBe('No selection made')
  })

  it('displays User\'s Answer label', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain("User's Answer:")
  })
})
