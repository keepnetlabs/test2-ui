import CampaignManagerReportSummaryCampaignInfo from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryCampaignInfo.vue'

describe('CampaignManagerReportSummaryCampaignInfo.vue', () => {
  it('isTooltip and getTooltipText branches are correct', () => {
    const withTooltip = {
      helperData: {
        sendOnlyActiveUsers: true,
        sendRandomlyUsers: true,
        randomlyUsersCount: 10,
        totalTargetUserCount: 100
      },
      isTooltip: true
    }
    const withoutTooltip = { helperData: { sendOnlyActiveUsers: true, sendRandomlyUsers: false } }

    expect(CampaignManagerReportSummaryCampaignInfo.computed.isTooltip.call(withTooltip)).toBe(true)
    expect(CampaignManagerReportSummaryCampaignInfo.computed.getTooltipText.call(withTooltip)).toContain(
      '10 of 100'
    )
    expect(CampaignManagerReportSummaryCampaignInfo.computed.isTooltip.call(withoutTooltip)).toBe(
      false
    )
  })

  it('getBodyValue includes total target users when tooltip is active', () => {
    const ctx = {
      items: { 'Target Users': 50 },
      helperData: { totalTargetUserCount: 120 },
      isTooltip: true
    }

    expect(CampaignManagerReportSummaryCampaignInfo.computed.getBodyValue.call(ctx)).toBe(
      '50 users of 120'
    )
  })

  it('target groups modal handlers toggle visibility', () => {
    const ctx = { isTargetGroupsModalVisible: false }

    CampaignManagerReportSummaryCampaignInfo.methods.handleViewTargetGroupsClick.call(ctx)
    expect(ctx.isTargetGroupsModalVisible).toBe(true)

    CampaignManagerReportSummaryCampaignInfo.methods.handleCloseTargetGroupsModal.call(ctx)
    expect(ctx.isTargetGroupsModalVisible).toBe(false)
  })
})
