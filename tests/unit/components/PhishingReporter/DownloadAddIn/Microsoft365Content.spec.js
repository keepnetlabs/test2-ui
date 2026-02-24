import { shallowMount } from '@vue/test-utils'
import Microsoft365Content from '@/components/PhishingReporter/DownloadAddIn/Microsoft365Content.vue'

describe('Microsoft365Content.vue', () => {
  const mountComponent = (props = {}) =>
    shallowMount(Microsoft365Content, {
      propsData: {
        isAccountConnected: false,
        isApplicationLevelAuthorized: false,
        o365SpinnerStatus: false,
        pageViewSpinnerStatus: false,
        ...props
      },
      stubs: {
        DownloadAddInListItem: {
          template: '<div><slot name="buttons"></slot></div>'
        },
        AlertBox: true,
        VTooltip: {
          template: '<div><slot name="activator" v-bind="{}"></slot><slot></slot></div>'
        },
        'v-expansion-panels': true,
        'v-expansion-panel': true,
        'v-expansion-panel-header': true,
        'v-expansion-panel-content': true,
        'v-row': true,
        'v-col': true,
        'v-icon': true
      }
    })

  it('renders with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('DownloadAddInMicrosoft365Content')
  })

  it('shows Authorize when isAccountConnected is false', () => {
    const wrapper = mountComponent({ isAccountConnected: false })
    expect(wrapper.text()).toContain('Authorize')
  })

  it('shows Revoke Authorization when isAccountConnected is true', () => {
    const wrapper = mountComponent({ isAccountConnected: true })
    expect(wrapper.text()).toContain('Revoke Authorization')
  })

  it('has delegated button with correct id', () => {
    const wrapper = mountComponent({ isAccountConnected: false })
    const btn = wrapper.find('#btn-download-g-suite--phishing-reporter-settings-add-in-modal-delegated')
    expect(btn.exists()).toBe(true)
  })

  it('has application-level button with correct id', () => {
    const wrapper = mountComponent({ isAccountConnected: true })
    const btn = wrapper.find('#btn-download-g-suite--phishing-reporter-settings-add-in-modal-app-level')
    expect(btn.exists()).toBe(true)
  })

  it('has ribbon view download button when connected', () => {
    const wrapper = mountComponent({ isAccountConnected: true })
    const btn = wrapper.find('#btn-download-ribbon-view--phishing-reporter-settings-add-in-modal')
    expect(btn.exists()).toBe(true)
  })

  it('has page view download button', () => {
    const wrapper = mountComponent()
    const btn = wrapper.find('#btn-download-page-view--phishing-reporter-settings-add-in-modal')
    expect(btn.exists()).toBe(true)
  })

  it('renders Microsoft Graph Permissions section', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Microsoft Graph Permissions')
  })

  it('renders Available Reporting Add-ins section', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Available Reporting Add-ins')
  })

  it('renders Check Platform Compatibility section', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Check Platform Compatibility')
  })
})
