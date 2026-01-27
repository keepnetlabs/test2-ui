import { createLocalVue, shallowMount } from '@vue/test-utils'
import ConnectionLost from '@/components/ConnectionLost.vue'
import Vuetify from 'vuetify'

describe('ConnectionLost.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = () => {
    return shallowMount(ConnectionLost, {
      localVue,
      vuetify
    })
  }

  it('renders correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    
    // Check key elements
    expect(wrapper.text()).toContain('Connection Is Lost')
    expect(wrapper.text()).toContain('Cannot connect to the web')
    expect(wrapper.text()).toContain('You may lose your unsaved progress')
    
    // Check icon
    const icon = wrapper.find('v-icon-stub')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('mdi-wifi-strength-off')
  })
})
