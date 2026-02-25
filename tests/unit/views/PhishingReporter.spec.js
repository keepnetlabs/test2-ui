import PhishingReporter from '@/views/PhishingReporter.vue'

describe('PhishingReporter.vue', () => {
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

  it('getHash updates tab for users/settings hash', () => {
    const ctx = { tab: 'phishing-reporter-users', $route: { hash: '' } }
    expect(PhishingReporter.methods.getHash.call(ctx, '#users')).toBe(true)
    expect(ctx.tab).toBe(0)

    expect(PhishingReporter.methods.getHash.call(ctx, '#settings')).toBe(true)
    expect(ctx.tab).toBe(1)

    expect(PhishingReporter.methods.getHash.call({ tab: 'x', $route: {} })).toBe(false)
  })
})
