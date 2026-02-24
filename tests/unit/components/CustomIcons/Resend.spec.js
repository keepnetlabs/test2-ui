import { shallowMount } from '@vue/test-utils'
import Resend from '@/components/CustomIcons/Resend.vue'

describe('Resend.vue', () => {
  it('renders as Vue component', () => {
    const wrapper = shallowMount(Resend)
    expect(wrapper.vm).toBeDefined()
  })

  it('renders resend icon image', () => {
    const wrapper = shallowMount(Resend)
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('resend-icon')
    expect(img.attributes('src')).toContain('resend.svg')
  })
})
