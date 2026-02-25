import CampaignManagerReportSubmittedMfaCode from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCode.vue'

describe('CampaignManagerReportSubmittedMfaCode.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportSubmittedMfaCode.name).toBe('CampaignManagerReportSubmittedMfaCode')
  })

  it('selection and resend handlers update state', () => {
    const ctx = {
      resendItemCount: 0,
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }
    CampaignManagerReportSubmittedMfaCode.methods.handleSelectionChange.call(ctx, 3)
    expect(ctx.resendItemCount).toBe(3)

    CampaignManagerReportSubmittedMfaCode.methods.handleOnResend.call(ctx, { items: ['u1'] })
    expect(ctx.resendPayload).toEqual({ items: ['u1'] })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('detail handlers open/close dialog and clear selected row on close', () => {
    const ctx = {
      selectedRow: {},
      isShowDetailDialog: false,
      toggleShowDetailDialog: CampaignManagerReportSubmittedMfaCode.methods.toggleShowDetailDialog
    }
    CampaignManagerReportSubmittedMfaCode.methods.handleOnDetail.call(ctx, { resourceId: 'r1' })
    expect(ctx.selectedRow).toEqual({ resourceId: 'r1' })
    expect(ctx.isShowDetailDialog).toBe(true)

    CampaignManagerReportSubmittedMfaCode.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })
})
