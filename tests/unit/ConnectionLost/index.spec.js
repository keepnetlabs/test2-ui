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

  it('has correct list item structure and classes', () => {
    const wrapper = mountComponent()
    const listItem = wrapper.find('v-list-item-stub')

    expect(listItem.exists()).toBe(true)
    expect(listItem.classes()).toContain('pl-0')
  })

  it('has icon with correct properties', () => {
    const wrapper = mountComponent()
    const icon = wrapper.find('v-icon-stub')

    expect(icon.exists()).toBe(true)
    expect(icon.attributes('medium')).toBeDefined()
    expect(icon.attributes('left')).toBeDefined()
    expect(icon.attributes('color')).toBe('blue')
  })

  it('applies all required CSS classes', () => {
    const wrapper = mountComponent()

    const cartIcon = wrapper.find('.v-btn.v-cart-icon-wrapper')
    expect(cartIcon.exists()).toBe(true)

    const subtitle = wrapper.find('.connection-lost-title')
    expect(subtitle.exists()).toBe(true)

    const subTitle = wrapper.find('.connection-lost-sub-title')
    expect(subTitle.exists()).toBe(true)
    expect(subTitle.classes()).toContain('mt-3')
  })

  it('displays all text content correctly', () => {
    const wrapper = mountComponent()

    expect(wrapper.text()).toContain('Connection Is Lost')
    expect(wrapper.text()).toContain('Cannot connect to the web')
    expect(wrapper.text()).toContain('You may lose your unsaved progress')
  })
})
