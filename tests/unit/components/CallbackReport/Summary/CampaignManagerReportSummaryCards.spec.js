import CampaignManagerReportSummaryCards from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryCards.vue'

describe('CampaignManagerReportSummaryCards.vue', () => {
  it('computed card data maps from items object', () => {
    const ctx = {
      items: {
        noResponse: { value: 1 },
        openedEmail: { value: 2 },
        calledBack: { value: 3 },
        enteredDigits: { value: 4 }
      }
    }

    expect(CampaignManagerReportSummaryCards.computed.getNoResponseData.call(ctx)).toEqual({ value: 1 })
    expect(CampaignManagerReportSummaryCards.computed.getOpenedData.call(ctx)).toEqual({ value: 2 })
    expect(CampaignManagerReportSummaryCards.computed.getCalledBackData.call(ctx)).toEqual({ value: 3 })
    expect(CampaignManagerReportSummaryCards.computed.getEnteredDigitsData.call(ctx)).toEqual({ value: 4 })
  })

  it('label/color/class computed values are stable', () => {
    expect(CampaignManagerReportSummaryCards.computed.getFirstCardTitle()).toBe('No Response')
    expect(CampaignManagerReportSummaryCards.computed.getSecondCardColor()).toBe('#B6791D')
    expect(CampaignManagerReportSummaryCards.computed.getThirdCardClass()).toContain('submitted-data')
    expect(CampaignManagerReportSummaryCards.computed.getFourthCardClass()).toContain('submitted-mfa-data')
  })
})
