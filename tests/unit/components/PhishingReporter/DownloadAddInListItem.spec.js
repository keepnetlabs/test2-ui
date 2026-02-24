import { shallowMount } from '@vue/test-utils'
import DownloadAddInListItem from '@/components/PhishingReporter/DownloadAddInListItem.vue'

describe('DownloadAddInListItem.vue', () => {
  const mountComponent = (props = {}) =>
    shallowMount(DownloadAddInListItem, {
      propsData: {
        description: 'Test description',
        ...props
      },
      stubs: { 'v-btn': true, 'v-icon': true }
    })

  it('renders with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('DownloadAddInListItem')
  })

  it('renders title when provided', () => {
    const wrapper = mountComponent({ title: 'Add-in Title' })
    expect(wrapper.text()).toContain('Add-in Title')
  })

  it('renders Optional badge when isOptional is true', () => {
    const wrapper = mountComponent({ title: 'Optional Item', isOptional: true })
    expect(wrapper.text()).toContain('Optional')
  })

  it('renders description', () => {
    const wrapper = mountComponent({ description: 'My description' })
    expect(wrapper.text()).toContain('My description')
  })

  it('emits button-click on button click', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleClickButton()
    expect(wrapper.emitted('button-click')).toBeTruthy()
  })

  it('getButtonStyle adds disabled styles when isButtonDisabled', () => {
    const wrapper = mountComponent({ isButtonDisabled: true })
    const style = wrapper.vm.getButtonStyle
    expect(style.opacity).toBe(0.5)
    expect(style.pointerEvents).toBe('none')
  })

  it('getButtonStyle returns base style when not disabled', () => {
    const wrapper = mountComponent()
    const style = wrapper.vm.getButtonStyle
    expect(style.textTransform).toBe('capitalize')
    expect(style.opacity).toBeUndefined()
    expect(style.pointerEvents).toBeUndefined()
  })

  it('applies hide-border class when hideBorder is true', () => {
    const wrapper = mountComponent({ hideBorder: true })
    expect(wrapper.classes()).toContain('download-add-in__list-item--hide-border')
  })
})
