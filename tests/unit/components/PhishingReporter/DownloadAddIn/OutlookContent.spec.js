import { shallowMount } from '@vue/test-utils'
import OutlookContent from '@/components/PhishingReporter/DownloadAddIn/OutlookContent.vue'

describe('OutlookContent.vue', () => {
  const mountComponent = (props = {}) =>
    shallowMount(OutlookContent, {
      propsData: { isLoading: false, ...props },
      stubs: { DownloadAddInListItem: true }
    })

  it('renders with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('DownloadAddInOutlookContent')
  })

  it('renders Outlook section', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Outlook')
    expect(wrapper.text()).toContain('MSI add-in for Windows Outlook Desktop')
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
