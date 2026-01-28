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

  it('has persistent hint set to true', () => {
    const wrapper = shallowMount(InputFirstName, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.persistentHint).toBe(true)
  })

  it('displays required hint', () => {
    const wrapper = shallowMount(InputFirstName, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.hint).toBe('*Required')
  })

  it('rejects invalid names', () => {
    const wrapper = shallowMount(InputFirstName, {
      localVue,
      vuetify
    })
    const rules = wrapper.vm.rules
    const testRule = rules[0]

    expect(testRule(null)).not.toBe(true)
    expect(testRule('a')).toBe(true)
  })

  it('accepts valid first names', () => {
    const wrapper = shallowMount(InputFirstName, {
      localVue,
      vuetify
    })
    const rules = wrapper.vm.rules
    const testRule = rules[0]

    expect(testRule('John')).toBe(true)
    expect(testRule('Jean-Pierre')).toBe(true)
    expect(testRule('Maria')).toBe(true)
  })
})
