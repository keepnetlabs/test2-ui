import PhishingReporter from '@/views/PhishingReporter.vue'
import { getPhishingReporter, getPhishingReportSummary } from '@/api/phishingReporter'

jest.mock('@/api/phishingReporter', () => ({
  getPhishingReporter: jest.fn(),
  getPhishingReportSummary: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('PhishingReporter.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(PhishingReporter.name).toBe('PhishingReporter')
  })

  it('getAddOnStatus returns totalUsersCount fallback', () => {
    expect(PhishingReporter.computed.getAddOnStatus.call({ phishingReportSummary: null })).toBe(0)
    expect(
      PhishingReporter.computed.getAddOnStatus.call({
        phishingReportSummary: { totalUsersCount: 42 }
      })
    ).toBe(42)
  })

  it('handleTabClick calls correct action by label', () => {
    const ctx = {
      getPhishingReport: jest.fn(),
      getPhishingReportSummary: jest.fn()
    }
    PhishingReporter.methods.handleTabClick.call(ctx, { label: 'Settings' })
    expect(ctx.getPhishingReport).toHaveBeenCalled()
    expect(ctx.getPhishingReportSummary).not.toHaveBeenCalled()

    PhishingReporter.methods.handleTabClick.call(ctx, { label: 'Users' })
    expect(ctx.getPhishingReportSummary).toHaveBeenCalled()
  })

  it('changeTabStatus updates active tab', () => {
    const ctx = { tab: 'phishing-reporter-users' }

    PhishingReporter.methods.changeTabStatus.call(ctx, 'phishing-reporter-settings')

    expect(ctx.tab).toBe('phishing-reporter-settings')
  })

  it('handleListItemClick updates selected date and refreshes summary', () => {
    const ctx = {
      selectedDate: 'Last 4 minutes',
      getPhishingReportSummary: jest.fn()
    }

    PhishingReporter.methods.handleListItemClick.call(ctx, 'Last 24h')

    expect(ctx.selectedDate).toBe('Last 24h')
    expect(ctx.getPhishingReportSummary).toHaveBeenCalled()
  })

  it('mounted reads route hash', () => {
    const ctx = {
      getHash: jest.fn()
    }

    PhishingReporter.mounted.call(ctx)

    expect(ctx.getHash).toHaveBeenCalled()
  })

  it('getHash updates tab for users/settings hash', () => {
    const ctx = { tab: 'phishing-reporter-users', $route: { hash: '' } }
    expect(PhishingReporter.methods.getHash.call(ctx, '#users')).toBe(true)
    expect(ctx.tab).toBe(0)

    expect(PhishingReporter.methods.getHash.call(ctx, '#settings')).toBe(true)
    expect(ctx.tab).toBe(1)

    expect(PhishingReporter.methods.getHash.call({ tab: 'x', $route: {} })).toBe(false)
  })

  it('getHash uses route hash fallback and returns true for unknown hash without tab change', () => {
    const ctx = { tab: 'phishing-reporter-users', $route: { hash: '#unknown' } }

    expect(PhishingReporter.methods.getHash.call(ctx)).toBe(true)
    expect(ctx.tab).toBe('phishing-reporter-users')
  })

  it('created prioritizes tenant/error query and keeps settings tab', () => {
    const ctx = {
      tab: 'phishing-reporter-users',
      getPhishingReporterSearchPermissions: true,
      getPhishingReporterGetPermissions: true,
      getPhishingReportSummary: jest.fn(),
      getPhishingReport: jest.fn(),
      $route: {
        query: { tenant: 'abc', tab: 'phishing-reporter-users' },
        params: { tab: 'phishing-reporter-users' }
      },
      $nextTick: (cb) => cb()
    }

    PhishingReporter.created.call(ctx)

    expect(ctx.tab).toBe('phishing-reporter-settings')
  })

  it('created defaults to settings tab when search permission is missing but settings permission exists', () => {
    const ctx = {
      tab: 'phishing-reporter-users',
      getPhishingReporterSearchPermissions: false,
      getPhishingReporterGetPermissions: true,
      getPhishingReportSummary: jest.fn(),
      getPhishingReport: jest.fn(),
      $route: {
        query: {},
        params: {}
      },
      $nextTick: (cb) => cb()
    }

    PhishingReporter.created.call(ctx)

    expect(ctx.tab).toBe('phishing-reporter-settings')
    expect(ctx.getPhishingReportSummary).toHaveBeenCalled()
    expect(ctx.getPhishingReport).toHaveBeenCalled()
  })

  it('created prioritizes route error query when authorization returns an error', () => {
    const ctx = {
      tab: 'phishing-reporter-users',
      getPhishingReporterSearchPermissions: true,
      getPhishingReporterGetPermissions: true,
      getPhishingReportSummary: jest.fn(),
      getPhishingReport: jest.fn(),
      $route: {
        query: {
          error: 'access_denied',
          error_description: 'Authorization failed'
        },
        params: { tab: 'phishing-reporter-users' }
      },
      $nextTick: (cb) => cb()
    }

    PhishingReporter.created.call(ctx)

    expect(ctx.tab).toBe('phishing-reporter-settings')
  })

  it('created applies params tab and then query.tab in nextTick', () => {
    const ctx = {
      tab: 'phishing-reporter-users',
      getPhishingReporterSearchPermissions: true,
      getPhishingReporterGetPermissions: true,
      getPhishingReportSummary: jest.fn(),
      getPhishingReport: jest.fn(),
      $route: {
        query: { tab: 'phishing-reporter-settings' },
        params: { tab: 'phishing-reporter-users' }
      },
      $nextTick: (cb) => cb()
    }

    PhishingReporter.created.call(ctx)

    expect(ctx.tab).toBe('phishing-reporter-settings')
    expect(ctx.getPhishingReportSummary).toHaveBeenCalled()
    expect(ctx.getPhishingReport).toHaveBeenCalled()
  })

  it('beforeRouteLeave blocks first-time/settings guards and allows clean route', () => {
    const next = jest.fn()
    const firstCtx = {
      $refs: { refFirstTime: { showAddInConfiguration: true, checkIfCanCloseOverlay: jest.fn() } }
    }
    PhishingReporter.beforeRouteLeave.call(firstCtx, {}, {}, next)
    expect(firstCtx.$refs.refFirstTime.checkIfCanCloseOverlay).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const usersCtx = {
      $refs: { refUsers: { isWantToDelete: true } }
    }
    PhishingReporter.beforeRouteLeave.call(usersCtx, {}, {}, next)
    expect(usersCtx.$refs.refUsers.isWantToDelete).toBe(false)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    PhishingReporter.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('beforeRouteUpdate handles same/different hash transitions and non-hash routes', () => {
    const next = jest.fn()
    const ctx = {
      getHash: jest.fn(() => true)
    }
    PhishingReporter.beforeRouteUpdate.call(ctx, { hash: '#users' }, { hash: '#settings' }, next)
    expect(next).toHaveBeenCalledWith()

    next.mockClear()
    PhishingReporter.beforeRouteUpdate.call(ctx, { hash: '#users' }, { hash: '#users' }, next)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    ctx.getHash.mockReturnValueOnce(false)
    PhishingReporter.beforeRouteUpdate.call(ctx, { hash: '' }, { hash: '' }, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('getDateValue pads one-digit values and keeps two-digit values', () => {
    expect(PhishingReporter.methods.getDateValue.call({}, 3)).toBe('03')
    expect(PhishingReporter.methods.getDateValue.call({}, '11')).toBe('11')
  })

  it('getDates covers all configured date options', () => {
    const listItems = [
      'Last 4 minutes',
      'Last 24h',
      'Last 7 days',
      'Last 30 days',
      'This month',
      'Previous month'
    ]
    const ctx = {
      listItems,
      selectedDate: '',
      getDateValue: PhishingReporter.methods.getDateValue
    }

    listItems.forEach((label) => {
      ctx.selectedDate = label
      const range = PhishingReporter.methods.getDates.call(ctx)
      expect(range).toEqual(
        expect.objectContaining({
          startDate: expect.any(String),
          endDate: expect.any(String)
        })
      )
    })

    ctx.selectedDate = 'Unknown'
    expect(PhishingReporter.methods.getDates.call(ctx)).toBeUndefined()
  })

  it('getPhishingReportSummary sets summary on success and empty object on failure', async () => {
    getPhishingReportSummary.mockResolvedValueOnce({ data: { data: { totalUsersCount: 2 } } })
    const ctx = {
      loading: false,
      isHeaderLoading: false,
      phishingReportSummary: null,
      getDates: jest.fn(() => ({ startDate: 'a', endDate: 'b' }))
    }

    PhishingReporter.methods.getPhishingReportSummary.call(ctx)
    await flushPromises()
    await flushPromises()
    expect(ctx.phishingReportSummary).toEqual({ totalUsersCount: 2 })
    expect(ctx.loading).toBe(false)
    expect(ctx.isHeaderLoading).toBe(false)

    getPhishingReportSummary.mockRejectedValueOnce(new Error('x'))
    PhishingReporter.methods.getPhishingReportSummary.call(ctx)
    await flushPromises()
    await flushPromises()
    expect(ctx.phishingReportSummary).toEqual({})
  })

  it('getPhishingReport handles not-found and success response branches', async () => {
    const ctx = {
      isLoading: false,
      initialFormData: {},
      tab: 'phishing-reporter-users',
      tabComponent: {}
    }

    getPhishingReporter.mockResolvedValueOnce({
      status: 200,
      data: { status: 'SUCCESS', message: 'Phishing reporter not found' }
    })
    PhishingReporter.methods.getPhishingReport.call(ctx)
    await flushPromises()
    await flushPromises()
    expect(ctx.tab).toBe('phishing-reporter-settings')
    expect(ctx.tabComponent.ref).toBe('refFirstTime')

    getPhishingReporter.mockResolvedValueOnce({
      status: 200,
      data: { status: 'SUCCESS', data: { enabled: true } }
    })
    PhishingReporter.methods.getPhishingReport.call(ctx)
    await flushPromises()
    await flushPromises()
    expect(ctx.initialFormData).toEqual({ enabled: true })
    expect(ctx.tabComponent.ref).toBe('refSettings')
    expect(ctx.isLoading).toBe(false)
  })
})
