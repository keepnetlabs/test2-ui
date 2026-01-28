import { createLocalVue, shallowMount } from '@vue/test-utils'
import InputLastName from '@/components/Common/Inputs/InputLastName.vue'
import Vuetify from 'vuetify'

describe('InputLastName.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('has correct default props', () => {
    const wrapper = shallowMount(InputLastName, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.placeholder).toBe('Enter last name')
  })

  it('has validation rules', () => {
    const wrapper = shallowMount(InputLastName, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.rules.length).toBeGreaterThan(0)
    expect(wrapper.vm.rules[0]('')).not.toBe(true)
  })

  it('has correct styling props', () => {
    const wrapper = shallowMount(InputLastName, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.outlined).toBe(true)
    expect(wrapper.vm.dense).toBe(true)
  })

  it('displays required hint', () => {
    const wrapper = shallowMount(InputLastName, {
      localVue,
      vuetify
    })
    expect(wrapper.vm.hint).toBe('*Required')
  })

  it('validates non-empty last names', () => {
    const wrapper = shallowMount(InputLastName, {
      localVue,
      vuetify
    })
    const testRule = wrapper.vm.rules[0]

    expect(testRule('Smith')).toBe(true)
    expect(testRule('O\'Brien')).toBe(true)
    expect(testRule('Garcia-Lopez')).toBe(true)
  })

  it('rejects empty last names', () => {
    const wrapper = shallowMount(InputLastName, {
      localVue,
      vuetify
    })
    const testRule = wrapper.vm.rules[0]

    expect(testRule('')).not.toBe(true)
    expect(testRule(null)).not.toBe(true)
    expect(testRule(undefined)).not.toBe(true)
  })
})
