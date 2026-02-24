import { shallowMount } from '@vue/test-utils'
import NextButton from '@/components/Common/Buttons/NextButton.vue'

describe('NextButton.vue', () => {
  it('renders as Vue component', () => {
    const wrapper = shallowMount(NextButton)
    expect(wrapper.vm).toBeDefined()
  })

  it('has expected component name', () => {
    const wrapper = shallowMount(NextButton)
    expect(wrapper.vm.$options.name).toBe('NextButton')
  })

  it('displays Next label', () => {
    const wrapper = shallowMount(NextButton)
    expect(wrapper.vm.labels.Next).toBeDefined()
    expect(wrapper.text()).toContain(wrapper.vm.labels.Next)
  })
})
