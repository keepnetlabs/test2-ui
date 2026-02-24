import { shallowMount } from '@vue/test-utils'
import DownloadAddInListItem from '@/components/PhishingReporter/DownloadAddInListItem.vue'

describe('DownloadAddInListItem.vue (extra coverage)', () => {
  const mountComponent = (props = {}) =>
    shallowMount(DownloadAddInListItem, {
      propsData: props,
      stubs: { 'v-btn': true, 'v-icon': true }
    })

  it('emits button-click when handleClickButton called', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleClickButton()
    expect(wrapper.emitted('button-click')).toHaveLength(1)
  })

  it('applies hide-border class when hideBorder is true', () => {
    const wrapper = mountComponent({ hideBorder: true })
    expect(wrapper.classes()).toContain('download-add-in__list-item--hide-border')
  })

  it('shows Optional span when isOptional is true', () => {
    const wrapper = mountComponent({ title: 'Test', isOptional: true })
    expect(wrapper.text()).toContain('Optional')
  })

  it('uses custom buttonId prop', () => {
    const wrapper = mountComponent({ buttonId: 'custom-btn-id' })
    expect(wrapper.vm.buttonId).toBe('custom-btn-id')
  })

  it('getButtonStyle includes disabled styles when isButtonDisabled', () => {
    const wrapper = mountComponent({ isButtonDisabled: true })
    const style = wrapper.vm.getButtonStyle
    expect(style.opacity).toBe(0.5)
    expect(style.pointerEvents).toBe('none')
  })

  it('getButtonStyle has base styles', () => {
    const wrapper = mountComponent()
    const style = wrapper.vm.getButtonStyle
    expect(style.textTransform).toBe('capitalize')
  })
})
