import { shallowMount } from '@vue/test-utils'
import DiagnosticToolContent from '@/components/PhishingReporter/DownloadAddIn/DiagnosticToolContent.vue'

describe('DiagnosticToolContent.vue (extra coverage)', () => {
  const createWrapper = (props = {}) =>
    shallowMount(DiagnosticToolContent, {
      propsData: props,
      stubs: { DownloadAddInListItem: true }
    })

  it('emits download when button clicked', () => {
    const wrapper = createWrapper({ isLoading: false })
    wrapper.findComponent({ name: 'DownloadAddInListItem' }).vm.$emit('button-click')
    expect(wrapper.emitted('download')).toHaveLength(1)
  })

  it('renders section title', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Diagnostic Tool')
  })

  it('renders subtitle about Outlook Desktop (Windows OS only)', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Outlook Desktop (Windows OS only)')
  })

  it('passes isLoading true to list item', () => {
    const wrapper = createWrapper({ isLoading: true })
    const item = wrapper.findComponent({ name: 'DownloadAddInListItem' })
    expect(item.props('isLoading')).toBe(true)
  })

  it('passes hide-border to list item', () => {
    const wrapper = createWrapper()
    const item = wrapper.findComponent({ name: 'DownloadAddInListItem' })
    expect(item.props('hideBorder')).toBe(true)
  })
})
