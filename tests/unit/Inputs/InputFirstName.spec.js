import { createLocalVue, shallowMount } from '@vue/test-utils'
import InputFirstName from '@/components/Common/Inputs/InputFirstName.vue'
import Vuetify from 'vuetify'

describe('InputFirstName.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('has correct default props', () => {
    const wrapper = shallowMount(InputFirstName, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.outlined).toBe(true)
    expect(wrapper.vm.dense).toBe(true)
    expect(wrapper.vm.placeholder).toBe('Enter first name')
  })

  it('has validation rules', () => {
    const wrapper = shallowMount(InputFirstName, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    // Testing the first rule (required)
    expect(wrapper.vm.rules[0]('')).not.toBe(true)
    expect(wrapper.vm.rules[0]('John')).toBe(true)
  })
})
