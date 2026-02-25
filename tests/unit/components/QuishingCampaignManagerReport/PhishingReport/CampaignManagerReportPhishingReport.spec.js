import CampaignManagerReportPhishingReport from '@/components/QuishingCampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReport.vue'

describe('CampaignManagerReportPhishingReport.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportPhishingReport.name).toBe('CampaignManagerReportPhishingReport')
  })

  it('selection and resend handlers update state', () => {
    const ctx = {
      resendItemCount: 0,
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }
    CampaignManagerReportPhishingReport.methods.handleSelectionChange.call(ctx, 5)
    expect(ctx.resendItemCount).toBe(5)

    CampaignManagerReportPhishingReport.methods.handleOnResend.call(ctx, { items: ['u1'] })
    expect(ctx.resendPayload).toEqual({ items: ['u1'] })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('detail handlers open/close modal and clear selected row on close', () => {
    const ctx = {
      selectedRow: {},
      isShowDetailDialog: false,
      toggleShowDetailDialog: CampaignManagerReportPhishingReport.methods.toggleShowDetailDialog
    }
    CampaignManagerReportPhishingReport.methods.handleOnDetail.call(ctx, { resourceId: 'r1' })
    expect(ctx.selectedRow).toEqual({ resourceId: 'r1' })
    expect(ctx.isShowDetailDialog).toBe(true)

    CampaignManagerReportPhishingReport.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })
})
