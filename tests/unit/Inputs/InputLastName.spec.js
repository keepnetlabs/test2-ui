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
})
