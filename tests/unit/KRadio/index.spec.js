import { createLocalVue, shallowMount } from '@vue/test-utils'
import KRadio from '@/components/KRadio.vue'
import Vuetify from 'vuetify'

describe('KRadio.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // Mock v-radio stub
  const VRadioStub = {
    template: '<div class="v-radio-stub" @click="$emit(\'click\', $event)"></div>',
    props: ['value']
  }

  const mountComponent = (propsData = {}) => {
    return shallowMount(KRadio, {
      localVue,
      vuetify,
      propsData: {
        value: 'option1',
        ...propsData
      },
      stubs: {
        VRadio: VRadioStub
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.v-radio-stub').exists()).toBe(true)
  })

  it('emits input event on handleInput', () => {
    const wrapper = mountComponent()

    wrapper.vm.handleInput('newValue')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0]).toEqual(['newValue'])
  })

  it('handles multiple value changes', () => {
    const wrapper = mountComponent({ value: 'option1' })
    expect(wrapper.vm.$props.value).toBe('option1')

    wrapper.vm.handleInput('option2')
    expect(wrapper.emitted('input')[0]).toEqual(['option2'])

    wrapper.vm.handleInput('option3')
    expect(wrapper.emitted('input')[1]).toEqual(['option3'])
  })

  it('renders v-radio component', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.v-radio-stub').exists()).toBe(true)
  })

  it('passes value prop to v-radio', () => {
    const testValue = 'test-option'
    const wrapper = mountComponent({ value: testValue })
    expect(wrapper.vm.$props.value).toBe(testValue)
  })

  it('handles different value types', () => {
    const wrapper = mountComponent({ value: 123 })
    wrapper.vm.handleInput(456)
    expect(wrapper.emitted('input')[0]).toEqual([456])

    const wrapper2 = mountComponent({ value: true })
    wrapper2.vm.handleInput(false)
    expect(wrapper2.emitted('input')[0]).toEqual([false])
  })
})
