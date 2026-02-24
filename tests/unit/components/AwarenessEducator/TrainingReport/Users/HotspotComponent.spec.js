import { shallowMount } from '@vue/test-utils'
import HotspotComponent from '@/components/AwarenessEducator/TrainingReport/Users/HotspotComponent.vue'

describe('HotspotComponent.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(HotspotComponent, {
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

  it('userHotspots returns empty when answerOptions empty', () => {
    const wrapper = createWrapper({ answerOptions: [] })
    expect(wrapper.vm.userHotspots).toEqual([])
  })

  it('userHotspots returns empty when answerOptions null', () => {
    const wrapper = createWrapper({ answerOptions: null })
    expect(wrapper.vm.userHotspots).toEqual([])
  })

  it('userHotspots filters only user answers', () => {
    const wrapper = createWrapper({
      answerOptions: [
        { isUserAnswer: true, text: 'Area 1' },
        { isUserAnswer: false, text: 'Area 2' },
        { isUserAnswer: true, option: 'Area 3' }
      ]
    })
    expect(wrapper.vm.userHotspots).toEqual(['Area 1', 'Area 3'])
  })

  it('userHotspots returns Hotspot Area when no text/option/answer', () => {
    const wrapper = createWrapper({
      answerOptions: [{ isUserAnswer: true }]
    })
    expect(wrapper.vm.userHotspots).toEqual(['Hotspot Area'])
  })

  it('displays User\'s Answer label', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain("User's Answer:")
  })
})
