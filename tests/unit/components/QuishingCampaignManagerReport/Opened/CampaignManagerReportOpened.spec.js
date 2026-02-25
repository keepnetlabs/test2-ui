import CampaignManagerReportOpened from '@/components/QuishingCampaignManagerReport/Opened/CampaignManagerReportOpened.vue'

describe('CampaignManagerReportOpened.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportOpened.name).toBe('CampaignManagerReportOpened')
  })

  it('selection and resend handlers update state', () => {
    const ctx = {
      resendItemCount: 0,
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }
    CampaignManagerReportOpened.methods.handleSelectionChange.call(ctx, 8)
    expect(ctx.resendItemCount).toBe(8)

    CampaignManagerReportOpened.methods.handleOnResend.call(ctx, { items: ['u1'] })
    expect(ctx.resendPayload).toEqual({ items: ['u1'] })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('detail handlers open/close and clear selected row when closing', () => {
    const ctx = {
      selectedRow: null,
      isShowDetailDialog: false,
      toggleShowDetailDialog: CampaignManagerReportOpened.methods.toggleShowDetailDialog
    }
    CampaignManagerReportOpened.methods.handleOnDetail.call(ctx, { resourceId: 'r1' })
    expect(ctx.selectedRow).toEqual({ resourceId: 'r1' })
    expect(ctx.isShowDetailDialog).toBe(true)

    CampaignManagerReportOpened.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })
})
