import { shallowMount } from '@vue/test-utils'
import AlertBox from '@/components/AlertBox.vue'

describe('AlertBox.vue', () => {
  const mountComponent = (propsData = {}, slots = {}) =>
    shallowMount(AlertBox, {
      propsData,
      slots,
      stubs: {
        VIcon: true
      }
    })

  it('renders with default icon props', () => {
    const wrapper = mountComponent({ text: 'Warning message' })
    expect(wrapper.vm.iconColor).toBe('#B6791D')
    expect(wrapper.vm.iconName).toBe('mdi-alert-circle')
    expect(wrapper.text()).toContain('Warning message')
  })

  it('hasAction is false when no action slots are enabled', () => {
    const wrapper = mountComponent({
      slots: { primaryAction: false, secondaryAction: false }
    })
    expect(wrapper.vm.hasAction).toBe(false)
    expect(wrapper.find('.alert-box__actions').exists()).toBe(false)
  })

  it('hasAction is true when any action slot is enabled', () => {
    const wrapper = mountComponent(
      {
        slots: { primaryAction: true, secondaryAction: false }
      },
      {
        primaryAction: '<button id="primary-btn">Primary</button>'
      }
    )
    expect(wrapper.vm.hasAction).toBe(true)
    expect(wrapper.find('.alert-box__actions').exists()).toBe(true)
  })

  it('renders custom text slot content', () => {
    const wrapper = mountComponent(
      { text: 'Fallback text' },
      { text: '<span id="custom-text">Custom text</span>' }
    )
    expect(wrapper.find('#custom-text').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom text')
  })
})
