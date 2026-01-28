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

  it('applies correct default props', () => {
    const wrapper = shallowMount(InputIpAddress, {
      localVue,
      vuetify
    })

    expect(wrapper.vm.outlined).toBe(true)
    expect(wrapper.vm.dense).toBe(true)
    expect(wrapper.vm.placeholder).toBe('Enter an IP address')
    expect(wrapper.vm.hint).toBe('*Required')
    expect(wrapper.vm.persistentHint).toBe(true)
    expect(wrapper.vm.autocomplete).toBe('off')
  })

  it('validates edge case IP addresses', () => {
    const wrapper = shallowMount(InputIpAddress, {
      localVue,
      vuetify
    })
    const ipRule = wrapper.vm.rules[0]

    expect(ipRule('0.0.0.0')).toBe(true)
    expect(ipRule('255.255.255.255')).toBe(true)
    expect(ipRule('127.0.0.1')).toBe(true)
    expect(ipRule('192.168.0.1')).toBe(true)
  })

  it('rejects invalid IP formats', () => {
    const wrapper = shallowMount(InputIpAddress, {
      localVue,
      vuetify
    })
    const ipRule = wrapper.vm.rules[0]

    expect(ipRule('256.0.0.1')).not.toBe(true)
    expect(ipRule('abc.def.ghi.jkl')).not.toBe(true)
    expect(ipRule('192.168.1')).not.toBe(true)
    expect(ipRule('192.168.1.1.1')).not.toBe(true)
    expect(ipRule('192.168.1.a')).not.toBe(true)
  })

  it('validates starts with space rule', () => {
    const wrapper = shallowMount(InputIpAddress, {
      localVue,
      vuetify
    })
    const spaceRule = wrapper.vm.rules[1]

    expect(spaceRule('192.168.1.1')).toBe(true)
    expect(spaceRule('')).toBe(true)
    expect(spaceRule(' 192.168.1.1')).not.toBe(true)
    expect(spaceRule('  ')).not.toBe(true)
  })
})
