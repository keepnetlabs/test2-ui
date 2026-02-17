import { shallowMount } from '@vue/test-utils'
import KRadio from '@/components/KRadio.vue'

describe('KRadio.vue', () => {
  it('has expected component name and value prop', () => {
    const wrapper = shallowMount(KRadio, {
      propsData: { value: 'x' },
      stubs: { VRadio: true }
    })

    expect(wrapper.vm.$options.name).toBe('KRadio')
    expect(wrapper.props('value')).toBe('x')
  })

  it('emits input event from handleInput', () => {
    const wrapper = shallowMount(KRadio, {
      propsData: { value: 'x' },
      stubs: { VRadio: true }
    })

    wrapper.vm.handleInput('new-value')
    expect(wrapper.emitted('input')).toEqual([['new-value']])
  })
})
