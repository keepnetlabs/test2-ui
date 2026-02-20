import { shallowMount } from '@vue/test-utils'
import Settings from '@/views/Settings.vue'

describe('Settings.vue', () => {
  const mountComponent = (permissionGetters = {}) =>
    shallowMount(Settings, {
      mocks: {
        $store: {
          getters: {
            'permissions/getDomainSearchPermissions': true,
            'permissions/getDnsSearchPermissions': true,
            'permissions/getExcludedIpAddressGetPermissions': true,
            ...permissionGetters
          },
          dispatch: jest.fn()
        }
      },
      stubs: {
        KContainer: true,
        DnsServiceList: true,
        DomainsList: true,
        ExcludeIPAddress: true,
        'el-tabs': true,
        'el-tab-pane': true
      }
    })

  it('renders and keeps default tab as Domains when all permissions are enabled', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.$options.name).toBe('Settings')
    expect(wrapper.vm.tab).toBe('Domains')
    wrapper.destroy()
  })

  it('created hook switches default tab to DNSServices when domains are not permitted', () => {
    const ctx = {
      tab: 'Domains',
      getDomainSearchPermissions: false,
      getDnsSearchPermissions: true,
      getExcludedIpAddressGetPermissions: true
    }

    Settings.created.call(ctx)
    expect(ctx.tab).toBe('DNSServices')
  })

  it('created hook switches default tab to ExcludeIpAddress when only excluded-ip is permitted', () => {
    const ctx = {
      tab: 'Domains',
      getDomainSearchPermissions: false,
      getDnsSearchPermissions: false,
      getExcludedIpAddressGetPermissions: true
    }

    Settings.created.call(ctx)
    expect(ctx.tab).toBe('ExcludeIpAddress')
  })

  it('created hook keeps Domains as default when domain permission is enabled', () => {
    const ctx = {
      tab: 'Domains',
      getDomainSearchPermissions: true,
      getDnsSearchPermissions: false,
      getExcludedIpAddressGetPermissions: false
    }

    Settings.created.call(ctx)
    expect(ctx.tab).toBe('Domains')
  })

  it('beforeRouteLeave blocks navigation and asks domain modal to close', () => {
    const next = jest.fn()
    const checkIfCanCloseDomainModal = jest.fn()
    const ctx = {
      $refs: {
        refDomains: {
          modalStatus: true,
          checkIfCanCloseDomainModal
        }
      }
    }

    Settings.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(checkIfCanCloseDomainModal).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave blocks navigation and asks dns modal to close', () => {
    const next = jest.fn()
    const checkIfCanCloseDnsServiceModal = jest.fn()
    const ctx = {
      $refs: {
        refDomains: { modalStatus: false },
        refDnsServiceList: {
          modalStatus: true,
          checkIfCanCloseDnsServiceModal
        }
      }
    }

    Settings.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(checkIfCanCloseDnsServiceModal).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave opens leaving dialog for unsaved excluded-ip changes', () => {
    const next = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      $store: { dispatch },
      $refs: {
        refDomains: { modalStatus: false },
        refDnsServiceList: { modalStatus: false },
        refExcludeIPAddress: {
          isInitialDataAndModelEqual: false
        }
      }
    }

    Settings.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(next).toHaveBeenCalledWith(false)
    expect(next).toHaveBeenCalledWith(true)
  })

  it('beforeRouteLeave allows navigation when there is no blocking state', () => {
    const next = jest.fn()
    const ctx = {
      $refs: {
        refDomains: { modalStatus: false },
        refDnsServiceList: { modalStatus: false },
        refExcludeIPAddress: {
          isInitialDataAndModelEqual: true
        }
      }
    }

    Settings.beforeRouteLeave.call(ctx, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('beforeRouteLeave allows navigation when exclude-ip ref is missing', () => {
    const next = jest.fn()
    const ctx = {
      $refs: {
        refDomains: { modalStatus: false },
        refDnsServiceList: { modalStatus: false }
      }
    }

    Settings.beforeRouteLeave.call(ctx, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('changeTabStatus prevents tab change when excluded-ip has unsaved changes', () => {
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      tab: 'ExcludeIpAddress',
      $store: { dispatch },
      $refs: {
        refExcludeIPAddress: { isInitialDataAndModelEqual: false },
        refTabs: { value: 'Domains', currentName: 'Domains' }
      }
    }

    Settings.methods.changeTabStatus.call(ctx, 'Domains')

    expect(ctx.$refs.refTabs.value).toBe('ExcludeIpAddress')
    expect(ctx.$refs.refTabs.currentName).toBe('ExcludeIpAddress')
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(ctx.tab).toBe('Domains')
  })

  it('changeTabStatus updates current tab directly when no unsaved changes exist', () => {
    const ctx = {
      tab: 'Domains',
      $store: { dispatch: jest.fn() },
      $refs: {
        refExcludeIPAddress: { isInitialDataAndModelEqual: true },
        refTabs: { value: 'Domains', currentName: 'Domains' }
      }
    }

    Settings.methods.changeTabStatus.call(ctx, 'DNSServices')
    expect(ctx.tab).toBe('DNSServices')
  })

  it('changeTabStatus updates tab directly when leaving exclude-ip with clean state', () => {
    const dispatch = jest.fn()
    const ctx = {
      tab: 'ExcludeIpAddress',
      $store: { dispatch },
      $refs: {
        refExcludeIPAddress: { isInitialDataAndModelEqual: true },
        refTabs: { value: 'ExcludeIpAddress', currentName: 'ExcludeIpAddress' }
      }
    }

    Settings.methods.changeTabStatus.call(ctx, 'Domains')

    expect(ctx.tab).toBe('Domains')
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('changeTabStatus keeps current tab when switching to same ExcludeIpAddress tab', () => {
    const dispatch = jest.fn()
    const ctx = {
      tab: 'ExcludeIpAddress',
      $store: { dispatch },
      $refs: {
        refExcludeIPAddress: { isInitialDataAndModelEqual: false },
        refTabs: { value: 'ExcludeIpAddress', currentName: 'ExcludeIpAddress' }
      }
    }

    Settings.methods.changeTabStatus.call(ctx, 'ExcludeIpAddress')

    expect(ctx.tab).toBe('ExcludeIpAddress')
    expect(dispatch).not.toHaveBeenCalled()
  })
})
