import EmailThreatSimulatorReports from '@/views/EmailThreatSimulatorReports.vue'

describe('EmailThreatSimulatorReports.vue', () => {
  it('has correct component name and default tab', () => {
    expect(EmailThreatSimulatorReports.name).toBe('EMailThreatSimulatorReports')
    expect(EmailThreatSimulatorReports.data().tab).toBe('summary')
  })

  it('created sets tab to sentAttacks when only sentAttacks permission', () => {
    const ctx = {
      tab: 'summary',
      getEtsQuickScanReportPermissionStat: false,
      getEtsQuickScanReportPermissionSearch: true
    }
    EmailThreatSimulatorReports.created.call(ctx)
    expect(ctx.tab).toBe('sentAttacks')
  })

  it('created keeps summary tab for other permission combinations', () => {
    const summaryCtx = {
      tab: 'summary',
      getEtsQuickScanReportPermissionStat: true,
      getEtsQuickScanReportPermissionSearch: false
    }
    EmailThreatSimulatorReports.created.call(summaryCtx)
    expect(summaryCtx.tab).toBe('summary')

    const noPermissionCtx = {
      tab: 'summary',
      getEtsQuickScanReportPermissionStat: false,
      getEtsQuickScanReportPermissionSearch: false
    }
    EmailThreatSimulatorReports.created.call(noPermissionCtx)
    expect(noPermissionCtx.tab).toBe('summary')
  })

  it('changeTabStatus updates tab', () => {
    const ctx = { tab: 'summary' }
    EmailThreatSimulatorReports.methods.changeTabStatus.call(ctx, 'sentAttacks')
    expect(ctx.tab).toBe('sentAttacks')
  })
})
