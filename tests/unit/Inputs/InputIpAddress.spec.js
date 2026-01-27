import { createLocalVue, shallowMount } from '@vue/test-utils'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress.vue'
import Vuetify from 'vuetify'

describe('InputIpAddress.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('has IP validation rules', () => {
    const wrapper = shallowMount(InputIpAddress, {
      localVue,
      vuetify
    })
    const ipRule = wrapper.vm.rules[0]
    expect(ipRule('192.168.1.1')).toBe(true)
    expect(ipRule('invalid-ip')).not.toBe(true)
  })
})
