import { shallowMount } from '@vue/test-utils'
import KShadowFrame from '@/components/KShadowFrame.vue'

describe('KShadowFrame.vue', () => {
  it('renders html content inside shadow frame', () => {
    const wrapper = shallowMount(KShadowFrame, {
      propsData: {
        content: '<span id="inside-content">Hello Frame</span>'
      }
    })

    expect(wrapper.find('.k-shadow-frame').exists()).toBe(true)
    expect(wrapper.find('#inside-content').exists()).toBe(true)
    expect(wrapper.find('#inside-content').text()).toBe('Hello Frame')
  })
})
