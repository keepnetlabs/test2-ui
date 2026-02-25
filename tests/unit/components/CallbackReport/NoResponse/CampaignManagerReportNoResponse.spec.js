import CampaignManagerReportNoResponse from '@/components/CallbackReport/NoResponse/CampaignManagerReportNoResponse.vue'

describe('CampaignManagerReportNoResponse.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportNoResponse.name).toBe('CampaignManagerReportNoResponse')
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const ctx = { resendItemCount: 0 }

    CampaignManagerReportNoResponse.methods.handleSelectionChange.call(ctx, 12)

    expect(ctx.resendItemCount).toBe(12)
  })
})
