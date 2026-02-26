import CampaignManagerReportNoResponse from '@/components/QuishingCampaignManagerReport/NoResponse/CampaignManagerReportNoResponse.vue'

describe('CampaignManagerReportNoResponse.vue (extra)', () => {
  it('data initializes resend count to zero', () => {
    const data = CampaignManagerReportNoResponse.data.call({})
    expect(data.resendItemCount).toBe(0)
  })

  it('handleOnResend replaces payload on repeated calls', () => {
    const ctx = {
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }

    CampaignManagerReportNoResponse.methods.handleOnResend.call(ctx, { items: ['u1'] })
    CampaignManagerReportNoResponse.methods.handleOnResend.call(ctx, { items: ['u2'] })

    expect(ctx.resendPayload).toEqual({ items: ['u2'] })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalledTimes(2)
  })
})
