import { shallowMount } from '@vue/test-utils'
import GoogleWorkspaceContent from '@/components/PhishingReporter/DownloadAddIn/GoogleWorkspaceContent.vue'

describe('GoogleWorkspaceContent.vue', () => {
  const mountComponent = (props = {}) =>
    shallowMount(GoogleWorkspaceContent, {
      propsData: { isLoading: false, ...props },
      stubs: { DownloadAddInListItem: true }
    })

  it('renders with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('DownloadAddInGoogleWorkspaceContent')
  })

  it('renders Google Workspace section', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Google Workspace')
    expect(wrapper.text()).toContain('JSON add-in for web-based Google Workspace emails')
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
