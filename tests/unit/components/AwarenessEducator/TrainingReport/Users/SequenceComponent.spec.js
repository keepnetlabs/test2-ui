import { shallowMount } from '@vue/test-utils'
import SequenceComponent from '@/components/AwarenessEducator/TrainingReport/Users/SequenceComponent.vue'

describe('SequenceComponent.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(SequenceComponent, {
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

  it('userSequence returns empty when answerOptions empty', () => {
    const wrapper = createWrapper({ answerOptions: [] })
    expect(wrapper.vm.userSequence).toEqual([])
  })

  it('userSequence returns empty when answerOptions null', () => {
    const wrapper = createWrapper({ answerOptions: null })
    expect(wrapper.vm.userSequence).toEqual([])
  })

  it('userSequence maps options in order', () => {
    const wrapper = createWrapper({
      answerOptions: [
        { text: 'First' },
        { option: 'Second' },
        { answer: 'Third' }
      ]
    })
    expect(wrapper.vm.userSequence).toEqual(['First', 'Second', 'Third'])
  })

  it('displays User\'s Sequence label', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain("User's Sequence:")
  })

  it('renders sequence items with numbers', () => {
    const wrapper = createWrapper({
      answerOptions: [{ text: 'Step A' }, { text: 'Step B' }]
    })
    expect(wrapper.text()).toContain('Step A')
    expect(wrapper.text()).toContain('Step B')
    expect(wrapper.findAll('.sequence-item')).toHaveLength(2)
  })
})
