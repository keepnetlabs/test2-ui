import EmailThreatSimulatorReports from '@/views/EmailThreatSimulatorReports.vue'

describe('EmailThreatSimulatorReports.vue', () => {
  it('created sets tab to sentAttacks when only sentAttacks permission', () => {
    const ctx = {
      tab: 'summary',
      getEtsQuickScanReportPermissionStat: false,
      getEtsQuickScanReportPermissionSearch: true
    }
    EmailThreatSimulatorReports.created.call(ctx)
    expect(ctx.tab).toBe('sentAttacks')
  })

  it('changeTabStatus updates tab', () => {
    const ctx = { tab: 'summary' }
    EmailThreatSimulatorReports.methods.changeTabStatus.call(ctx, 'sentAttacks')
    expect(ctx.tab).toBe('sentAttacks')
  })
})
