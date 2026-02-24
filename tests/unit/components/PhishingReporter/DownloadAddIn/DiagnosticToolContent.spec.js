import { shallowMount } from '@vue/test-utils'
import DiagnosticToolContent from '@/components/PhishingReporter/DownloadAddIn/DiagnosticToolContent.vue'

describe('DiagnosticToolContent.vue', () => {
  const mountComponent = (props = {}) =>
    shallowMount(DiagnosticToolContent, {
      propsData: { isLoading: false, ...props },
      stubs: { DownloadAddInListItem: true }
    })

  it('renders with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('DownloadAddInDiagnosticToolContent')
  })

  it('renders Diagnostic Tool section', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Diagnostic Tool')
    expect(wrapper.text()).toContain('Only for Outlook Desktop (Windows OS only)')
  })

  it('passes isLoading to DownloadAddInListItem', () => {
    const wrapper = mountComponent({ isLoading: true })
    const item = wrapper.findComponent({ name: 'DownloadAddInListItem' })
    expect(item.props('isLoading')).toBe(true)
  })

  it('emits download on button-click from list item', () => {
    const wrapper = mountComponent()
    wrapper.findComponent({ name: 'DownloadAddInListItem' }).vm.$emit('button-click')
    expect(wrapper.emitted('download')).toBeTruthy()
  })
})
