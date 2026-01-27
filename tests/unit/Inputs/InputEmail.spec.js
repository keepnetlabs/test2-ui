import { createLocalVue, shallowMount } from '@vue/test-utils'
import InputEmail from '@/components/Common/Inputs/InputEmail.vue'
import Vuetify from 'vuetify'

describe('InputEmail.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('adds required and minlength rules if required is true (default)', () => {
    const wrapper = shallowMount(InputEmail, {
      localVue,
      vuetify
    })
    // COMMON_CONSTANTS.DEFAULT_EMAIL_RULES starts with some rules
    // created() adds 2 more rules
    expect(wrapper.vm.rules.length).toBeGreaterThan(2)
    // Check if one of them is required rule
    const hasRequired = wrapper.vm.rules.some(r => r('') !== true)
    expect(hasRequired).toBe(true)
  })

  it('does not add required rules if required is false', () => {
    const wrapper = shallowMount(InputEmail, {
      localVue,
      vuetify,
      propsData: {
        required: false
      }
    })
    // It should not have the required rule we added in created()
    // and hint should be null
    expect(wrapper.vm.hint).toBeNull()
    expect(wrapper.vm.persistentHint).toBe(false)
  })
})
