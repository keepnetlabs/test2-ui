import { createLocalVue, shallowMount } from '@vue/test-utils'
import SmishingSettings from '@/views/SmishingSettings'

describe('SmishingSettings.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (getterOverrides = {}) =>
    shallowMount(SmishingSettings, {
      localVue,
      stubs: {
        KContainer: true,
        DnsServiceList: true,
        DomainsList: true,
        ExcludeIPAddress: true,
        'el-tabs': true,
        'el-tab-pane': true
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getSmishingDomainSearchPermissions': true,
            'permissions/getSmishingDnsSearchPermissions': true,
            'permissions/getSmishingExcludedIpGetPermissions': true,
            ...getterOverrides
          },
          dispatch: jest.fn()
        }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('Settings')
  })

  it('sets default tab to DNSServices when domain permission is missing', () => {
    const wrapper = mountComponent({
      'permissions/getSmishingDomainSearchPermissions': false,
      'permissions/getSmishingDnsSearchPermissions': true
    })
    expect(wrapper.vm.tab).toBe('DNSServices')
  })

  it('sets default tab to ExcludeIpAddress when only excluded-ip permission is available', () => {
    const wrapper = mountComponent({
      'permissions/getSmishingDomainSearchPermissions': false,
      'permissions/getSmishingDnsSearchPermissions': false,
      'permissions/getSmishingExcludedIpGetPermissions': true
    })
    expect(wrapper.vm.tab).toBe('ExcludeIpAddress')
  })

  it('changeTabStatus keeps current tab and opens leaving dialog for dirty exclude-ip form', () => {
    const wrapper = mountComponent()
    wrapper.vm.tab = 'ExcludeIpAddress'
    wrapper.vm.$refs = {
      refExcludeIPAddress: { isInitialDataAndModelEqual: false },
      refTabs: { value: '', currentName: '' }
    }

    wrapper.vm.changeTabStatus('Domains')

    expect(wrapper.vm.tab).toBe('ExcludeIpAddress')
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('beforeRouteLeave blocks navigation when domains modal is open', () => {
    const wrapper = mountComponent()
    const next = jest.fn()
    const checkIfCanCloseDomainModal = jest.fn()
    wrapper.vm.$refs = {
      refDomains: { modalStatus: true, checkIfCanCloseDomainModal }
    }

    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(checkIfCanCloseDomainModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)
  })
})
