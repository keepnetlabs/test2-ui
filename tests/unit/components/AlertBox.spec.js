import { shallowMount } from '@vue/test-utils'
import AlertBox from '@/components/AlertBox.vue'

describe('AlertBox.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AlertBox, {
      propsData: {
        text: 'Default alert message',
        ...propsData
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays text prop', () => {
    const wrapper = createWrapper({ text: 'Custom alert' })
    expect(wrapper.text()).toContain('Custom alert')
  })

  it('uses default icon name', () => {
    const wrapper = createWrapper()
    const icon = wrapper.find('v-icon-stub')
    expect(icon.exists()).toBe(true)
    expect(icon.attributes('iconname') || wrapper.vm.iconName).toBeTruthy()
  })

  it('uses custom iconColor', () => {
    const wrapper = createWrapper({ iconColor: '#FF0000' })
    expect(wrapper.vm.iconColor).toBe('#FF0000')
  })

  it('uses custom iconName', () => {
    const wrapper = createWrapper({ iconName: 'mdi-information' })
    expect(wrapper.vm.iconName).toBe('mdi-information')
  })

  it('hasAction is false when no slots', () => {
    const wrapper = createWrapper({ slots: { primaryAction: false, secondaryAction: false } })
    expect(wrapper.vm.hasAction).toBe(false)
  })

  it('hasAction is true when primaryAction slot', () => {
    const wrapper = createWrapper({ slots: { primaryAction: true, secondaryAction: false } })
    expect(wrapper.vm.hasAction).toBe(true)
  })

  it('hasAction is true when secondaryAction slot', () => {
    const wrapper = createWrapper({ slots: { primaryAction: false, secondaryAction: true } })
    expect(wrapper.vm.hasAction).toBe(true)
  })

  it('renders actions div when hasAction', () => {
    const wrapper = createWrapper({ slots: { primaryAction: true, secondaryAction: false } })
    expect(wrapper.find('.alert-box__actions').exists()).toBe(true)
  })

  it('does not render actions div when hasAction false', () => {
    const wrapper = createWrapper({ slots: { primaryAction: false, secondaryAction: false } })
    expect(wrapper.find('.alert-box__actions').exists()).toBe(false)
  })
})
