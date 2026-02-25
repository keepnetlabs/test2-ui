import CampaignManagerPrintoutReportSummaryCards from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerPrintoutReportSummaryCards.vue'

describe('CampaignManagerPrintoutReportSummaryCards.vue', () => {
  it('getNoResponseData returns items.noResponse', () => {
    const ctx = { items: { noResponse: { count: 5 } } }
    expect(CampaignManagerPrintoutReportSummaryCards.computed.getNoResponseData.call(ctx)).toEqual({
      count: 5
    })
  })

  it('getOpenedData returns items.openedEmail', () => {
    const ctx = { items: { openedEmail: { count: 3 } } }
    expect(CampaignManagerPrintoutReportSummaryCards.computed.getOpenedData.call(ctx)).toEqual({
      count: 3
    })
  })

  it('getThirdCardLabel returns SubmittedData when isCampaignDataSubmission', () => {
    const labels = { SubmittedData: 'Submitted Data', SubmittedMFACode: 'MFA' }
    const ctx = {
      isCampaignDataSubmission: true,
      isCampaignClickOnlyAndMfa: false,
      labels
    }
    expect(CampaignManagerPrintoutReportSummaryCards.computed.getThirdCardLabel.call(ctx)).toBe(
      'Submitted Data'
    )
  })

  it('isCampaignClickOnly returns true when method is 1', () => {
    const ctx = { multipleType: [], method: 1 }
    expect(CampaignManagerPrintoutReportSummaryCards.computed.isCampaignClickOnly.call(ctx)).toBe(
      true
    )
  })
})
