import SmishingSettings from '@/views/SmishingSettings.vue'

describe('SmishingSettings.vue', () => {
  it('created switches default tab by permissions', () => {
    const dnsCtx = {
      tab: 'Domains',
      getSmishingDomainSearchPermissions: false,
      getSmishingDnsSearchPermissions: true,
      getSmishingExcludedIpGetPermissions: false
    }
    SmishingSettings.created.call(dnsCtx)
    expect(dnsCtx.tab).toBe('DNSServices')

    const excludeCtx = {
      tab: 'Domains',
      getSmishingDomainSearchPermissions: false,
      getSmishingDnsSearchPermissions: false,
      getSmishingExcludedIpGetPermissions: true
    }
    SmishingSettings.created.call(excludeCtx)
    expect(excludeCtx.tab).toBe('ExcludeIpAddress')
  })

  it('beforeRouteLeave blocks for open domain/dns modals and handles exclude-ip dirty state', () => {
    const next = jest.fn()

    const domainCtx = {
      $refs: { refDomains: { modalStatus: true, checkIfCanCloseDomainModal: jest.fn() } }
    }
    SmishingSettings.beforeRouteLeave.call(domainCtx, {}, {}, next)
    expect(domainCtx.$refs.refDomains.checkIfCanCloseDomainModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const dnsCtx = {
      $refs: { refDnsServiceList: { modalStatus: true, checkIfCanCloseDnsServiceModal: jest.fn() } }
    }
    SmishingSettings.beforeRouteLeave.call(dnsCtx, {}, {}, next)
    expect(dnsCtx.$refs.refDnsServiceList.checkIfCanCloseDnsServiceModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const excludeCtx = {
      $refs: { refExcludeIPAddress: { isInitialDataAndModelEqual: false } },
      $store: { dispatch }
    }
    SmishingSettings.beforeRouteLeave.call(excludeCtx, {}, {}, next)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(next).toHaveBeenCalledWith(false)
    expect(next).toHaveBeenCalledWith(true)
  })

  it('beforeRouteLeave allows navigation when no blocking condition exists', () => {
    const next = jest.fn()
    const ctx = { $refs: {} }

    SmishingSettings.beforeRouteLeave.call(ctx, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('changeTabStatus keeps ExcludeIpAddress tab when data is dirty and opens leaving dialog', () => {
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      tab: 'ExcludeIpAddress',
      $refs: {
        refExcludeIPAddress: { isInitialDataAndModelEqual: false },
        refTabs: { value: 'ExcludeIpAddress', currentName: 'ExcludeIpAddress' }
      },
      $store: { dispatch }
    }

    SmishingSettings.methods.changeTabStatus.call(ctx, 'Domains')

    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(ctx.tab).toBe('Domains')
  })

  it('changeTabStatus directly switches tab when no guard is needed', () => {
    const ctx = {
      tab: 'Domains',
      $refs: {
        refExcludeIPAddress: { isInitialDataAndModelEqual: true },
        refTabs: { value: 'Domains', currentName: 'Domains' }
      },
      $store: { dispatch: jest.fn() }
    }

    SmishingSettings.methods.changeTabStatus.call(ctx, 'DNSServices')
    expect(ctx.tab).toBe('DNSServices')
  })
})
