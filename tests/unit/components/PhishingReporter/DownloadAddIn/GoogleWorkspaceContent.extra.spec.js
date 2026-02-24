import { shallowMount } from '@vue/test-utils'
import GoogleWorkspaceContent from '@/components/PhishingReporter/DownloadAddIn/GoogleWorkspaceContent.vue'

describe('GoogleWorkspaceContent.vue (extra coverage)', () => {
  const mountComponent = (props = {}) =>
    shallowMount(GoogleWorkspaceContent, {
      propsData: { isLoading: false, ...props },
      stubs: { DownloadAddInListItem: true }
    })

  it('emits download when button clicked', () => {
    const wrapper = mountComponent()
    wrapper.findComponent({ name: 'DownloadAddInListItem' }).vm.$emit('button-click')
    expect(wrapper.emitted('download')).toHaveLength(1)
  })

  it('renders Google Workspace Add-in title', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Google Workspace')
  })

  it('renders JSON add-in subtitle', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('JSON add-in for web-based Google Workspace emails')
  })

  it('passes isLoading to DownloadAddInListItem', () => {
    const wrapper = mountComponent({ isLoading: true })
    const item = wrapper.findComponent({ name: 'DownloadAddInListItem' })
    expect(item.props('isLoading')).toBe(true)
  })

  it('passes correct button-id to list item', () => {
    const wrapper = mountComponent()
    const item = wrapper.findComponent({ name: 'DownloadAddInListItem' })
    expect(item.props('buttonId')).toBe('btn-download-google-workspace--phishing-reporter-settings-add-in-modal')
  })
})
