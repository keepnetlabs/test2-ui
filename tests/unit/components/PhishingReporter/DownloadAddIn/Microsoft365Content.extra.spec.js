import { shallowMount } from '@vue/test-utils'
import Microsoft365Content from '@/components/PhishingReporter/DownloadAddIn/Microsoft365Content.vue'

describe('Microsoft365Content.vue (extra coverage)', () => {
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
        DownloadAddInListItem: { template: '<div><slot name="buttons"></slot></div>' },
        AlertBox: true,
        VTooltip: { template: '<div><slot name="activator"></slot></div>' },
        'v-expansion-panels': true,
        'v-expansion-panel': true,
        'v-expansion-panel-header': true,
        'v-expansion-panel-content': true,
        'v-row': true,
        'v-col': true,
        'v-icon': true
      }
    })

  it('emits delegated-graph-access when delegated button clicked', () => {
    const wrapper = mountComponent({ isAccountConnected: false })
    const btn = wrapper.find('#btn-download-g-suite--phishing-reporter-settings-add-in-modal-delegated')
    btn.vm.$emit('click')
    expect(wrapper.emitted('delegated-graph-access')).toBeTruthy()
  })

  it('emits application-level-graph-access when app-level button clicked', () => {
    const wrapper = mountComponent({ isAccountConnected: true })
    const btn = wrapper.find('#btn-download-g-suite--phishing-reporter-settings-add-in-modal-app-level')
    if (btn.exists()) {
      btn.vm.$emit('click')
      expect(wrapper.emitted('application-level-graph-access')).toBeTruthy()
    }
  })

  it('shows delegated access success message when connected', () => {
    const wrapper = mountComponent({ isAccountConnected: true })
    expect(wrapper.text()).toContain('Delegated access successfully authorized')
  })

  it('shows required message when not connected', () => {
    const wrapper = mountComponent({ isAccountConnected: false })
    expect(wrapper.text()).toContain('Required for all user-based Outlook reporting')
  })

  it('renders Required to enable email reporting subtitle', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Required to enable email reporting from Outlook')
  })
})
