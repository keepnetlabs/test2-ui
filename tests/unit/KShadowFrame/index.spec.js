import { createLocalVue, shallowMount } from '@vue/test-utils'
import KShadowFrame from '@/components/KShadowFrame.vue'

describe('KShadowFrame.vue', () => {
  const localVue = createLocalVue()

  it('renders content prop as html', () => {
    const content = '<p class="test-content">Hello</p>'
    const wrapper = shallowMount(KShadowFrame, {
      localVue,
      propsData: {
        content
      }
    })
    
    expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello')
  })
})
