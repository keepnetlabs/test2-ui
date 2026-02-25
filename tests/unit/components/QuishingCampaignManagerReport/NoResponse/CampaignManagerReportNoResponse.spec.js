import CampaignManagerReportNoResponse from '@/components/QuishingCampaignManagerReport/NoResponse/CampaignManagerReportNoResponse.vue'

describe('CampaignManagerReportNoResponse.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportNoResponse.name).toBe('CampaignManagerReportNoResponse')
  })

  it('selection and resend handlers update local state', () => {
    const ctx = {
      resendItemCount: 0,
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }

    CampaignManagerReportNoResponse.methods.handleSelectionChange.call(ctx, 3)
    expect(ctx.resendItemCount).toBe(3)

    CampaignManagerReportNoResponse.methods.handleOnResend.call(ctx, { items: ['u1'] })
    expect(ctx.resendPayload).toEqual({ items: ['u1'] })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })
})
