import labels from '@/model/constants/labels'
import CampaignManagerReportSummaryCards from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummaryCards.vue'

describe('CampaignManagerReportSummaryCards.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportSummaryCards.name).toBe('CampaignManagerReportSummaryCards')
  })

  it('campaign-type boolean computeds evaluate combinations correctly', () => {
    expect(
      CampaignManagerReportSummaryCards.computed.isCampaignHasAllTypes.call({
        multipleType: [true, true, true, true]
      })
    ).toBe(true)
    expect(
      CampaignManagerReportSummaryCards.computed.isCampaignClickOnly.call({
        multipleType: [true, false, false, false],
        method: 0
      })
    ).toBe(true)
    expect(
      CampaignManagerReportSummaryCards.computed.isCampaignClickOnly.call({
        multipleType: [],
        method: 1
      })
    ).toBe(true)
  })

  it('data getters return mapped item objects with safe fallbacks', () => {
    const ctx = {
      items: {
        noResponse: { userCount: 1 },
        openedEmail: { userCount: 2 },
        clickedEmail: { userCount: 3 },
        submittedEmail: { userCount: 4 },
        phishingReporter: { userCount: 5 },
        mfa: { userCount: 6 }
      }
    }
    expect(CampaignManagerReportSummaryCards.computed.getNoResponseData.call(ctx)).toEqual({
      userCount: 1
    })
    expect(CampaignManagerReportSummaryCards.computed.getOpenedData.call(ctx)).toEqual({
      userCount: 2
    })
    expect(CampaignManagerReportSummaryCards.computed.getClickedData.call(ctx)).toEqual({
      userCount: 3
    })
    expect(CampaignManagerReportSummaryCards.computed.getMfaData.call(ctx)).toEqual({
      userCount: 6
    })
  })

  it('label/prop computeds switch by campaign flags', () => {
    const allTypesCtx = {
      isCampaignHasAllTypes: true,
      isCampaignMfaClickOnlyAndDataSubmission: false,
      isCampaignHasClickOnlyAndDataSubmissionAndAttachment: false,
      isCampaignAttachmentAndMfaClickOnly: false,
      isCampaignAttachmentAndMfaDataSubmission: false,
      isCampaignDataSubmissionAndMfa: false,
      getClickedData: { userCount: 7 },
      getMfaData: { userCount: 6 },
      clickedLinkIcon: 'clicked'
    }
    expect(CampaignManagerReportSummaryCards.computed.getFirstCardTitle.call(allTypesCtx)).toBe(
      labels.ScannedQRLink
    )
    expect(CampaignManagerReportSummaryCards.computed.getFirstCardProps.call(allTypesCtx)).toEqual(
      { userCount: 7 }
    )
    expect(CampaignManagerReportSummaryCards.computed.getSecondCardProps.call(allTypesCtx)).toEqual(
      { userCount: 6 }
    )
  })
})
