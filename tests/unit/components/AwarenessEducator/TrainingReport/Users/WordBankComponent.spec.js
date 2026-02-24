import { shallowMount } from '@vue/test-utils'
import WordBankComponent from '@/components/AwarenessEducator/TrainingReport/Users/WordBankComponent.vue'

describe('WordBankComponent.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(WordBankComponent, {
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

  it('userWords returns empty when answerOptions empty', () => {
    const wrapper = createWrapper({ answerOptions: [] })
    expect(wrapper.vm.userWords).toEqual([])
  })

  it('userWords returns empty when answerOptions null', () => {
    const wrapper = createWrapper({ answerOptions: null })
    expect(wrapper.vm.userWords).toEqual([])
  })

  it('userWords filters user answers and maps text', () => {
    const wrapper = createWrapper({
      answerOptions: [
        { isUserAnswer: true, text: 'Word1' },
        { isUserAnswer: false, text: 'Word2' },
        { isUserAnswer: true, option: 'Word3' }
      ]
    })
    expect(wrapper.vm.userWords).toEqual(['Word1', 'Word3'])
  })

  it('getOrdinalNumber returns 1st, 2nd, 3rd', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getOrdinalNumber(1)).toBe('1st')
    expect(wrapper.vm.getOrdinalNumber(2)).toBe('2nd')
    expect(wrapper.vm.getOrdinalNumber(3)).toBe('3rd')
  })

  it('getOrdinalNumber returns Nth for others', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getOrdinalNumber(4)).toBe('4th')
    expect(wrapper.vm.getOrdinalNumber(11)).toBe('11th')
  })

  it('displays User\'s Answer label', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain("User's Answer:")
  })
})
