import { shallowMount } from '@vue/test-utils'
import OutlookContent from '@/components/PhishingReporter/DownloadAddIn/OutlookContent.vue'

describe('OutlookContent.vue (extra coverage)', () => {
  const mountComponent = (props = {}) =>
    shallowMount(OutlookContent, {
      propsData: { isLoading: false, ...props },
      stubs: { DownloadAddInListItem: true }
    })

  it('emits download when button clicked', () => {
    const wrapper = mountComponent()
    wrapper.findComponent({ name: 'DownloadAddInListItem' }).vm.$emit('button-click')
    expect(wrapper.emitted('download')).toHaveLength(1)
  })

  it('renders Outlook title', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Outlook')
  })

  it('renders MSI add-in subtitle', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('MSI add-in for Windows Outlook Desktop')
  })

  it('passes isLoading to DownloadAddInListItem', () => {
    const wrapper = mountComponent({ isLoading: true })
    const item = wrapper.findComponent({ name: 'DownloadAddInListItem' })
    expect(item.props('isLoading')).toBe(true)
  })

  it('passes correct button-id to list item', () => {
    const wrapper = mountComponent()
    const item = wrapper.findComponent({ name: 'DownloadAddInListItem' })
    expect(item.props('buttonId')).toBe('btn-download-outlook--phishing-reporter-settings-add-in-modal')
  })
})
