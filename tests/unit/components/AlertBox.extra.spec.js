import { shallowMount } from '@vue/test-utils'
import AlertBox from '@/components/AlertBox.vue'

describe('AlertBox.vue (extra coverage)', () => {
  const createWrapper = ({ propsData = {}, slots = {} } = {}) =>
    shallowMount(AlertBox, {
      propsData,
      slots
    })

  it('uses default icon props and default icon values', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.iconColor).toBe('#B6791D')
    expect(wrapper.vm.iconName).toBe('mdi-alert-circle')
    expect(wrapper.vm.iconProps).toEqual({})
  })

  it('forwards iconProps to v-icon attributes', () => {
    const wrapper = createWrapper({
      propsData: {
        iconProps: { size: 18, dense: true },
        text: 'Alert'
      }
    })

    const icon = wrapper.find('v-icon-stub')
    expect(icon.exists()).toBe(true)
    expect(icon.attributes('size')).toBe('18')
    expect(icon.attributes('dense')).toBe('true')
  })

  it('renders default text paragraph when text slot is not provided', () => {
    const wrapper = createWrapper({
      propsData: { text: 'Fallback text' }
    })

    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.text()).toContain('Fallback text')
  })

  it('uses named text slot instead of fallback text', () => {
    const wrapper = createWrapper({
      propsData: { text: 'Fallback text' },
      slots: {
        text: '<span class="custom-text">Slot text</span>'
      }
    })

    expect(wrapper.find('.custom-text').exists()).toBe(true)
    expect(wrapper.text()).toContain('Slot text')
    expect(wrapper.text()).not.toContain('Fallback text')
  })

  it('renders default slot content and hides default internal content when slot is provided', () => {
    const wrapper = createWrapper({
      propsData: { text: 'Fallback text' },
      slots: {
        default: '<div class="outside-content">Outside Content</div>'
      }
    })

    expect(wrapper.find('.outside-content').exists()).toBe(true)
    expect(wrapper.find('.alert-box__default-content').exists()).toBe(false)
  })

  it('hasAction is false for empty slots object', () => {
    const wrapper = createWrapper({
      propsData: {
        slots: {}
      }
    })

    expect(wrapper.vm.hasAction).toBe(false)
    expect(wrapper.find('.alert-box__actions').exists()).toBe(false)
  })

  it('hasAction is true when any additional slot-flag value is truthy', () => {
    const wrapper = createWrapper({
      propsData: {
        slots: { tertiaryAction: true }
      }
    })

    expect(wrapper.vm.hasAction).toBe(true)
    expect(wrapper.find('.alert-box__actions').exists()).toBe(true)
  })

  it('renders both primary and secondary action slots when enabled', () => {
    const wrapper = createWrapper({
      propsData: {
        slots: { primaryAction: true, secondaryAction: true }
      },
      slots: {
        primaryAction: '<button class="primary-btn">Primary</button>',
        secondaryAction: '<button class="secondary-btn">Secondary</button>'
      }
    })

    expect(wrapper.find('.alert-box__actions').exists()).toBe(true)
    expect(wrapper.find('.primary-btn').exists()).toBe(true)
    expect(wrapper.find('.secondary-btn').exists()).toBe(true)
  })
})
