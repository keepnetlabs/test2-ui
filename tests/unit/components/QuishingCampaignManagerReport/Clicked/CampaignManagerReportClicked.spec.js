import CampaignManagerReportClicked from '@/components/QuishingCampaignManagerReport/Clicked/CampaignManagerReportClicked.vue'

describe('CampaignManagerReportClicked.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportClicked.name).toBe('CampaignManagerReportClicked')
  })

  it('selection and resend handlers update local payload state', () => {
    const ctx = {
      resendItemCount: 0,
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }
    CampaignManagerReportClicked.methods.handleSelectionChange.call(ctx, 6)
    expect(ctx.resendItemCount).toBe(6)

    const payload = { items: ['a'] }
    CampaignManagerReportClicked.methods.handleOnResend.call(ctx, payload)
    expect(ctx.resendPayload).toEqual(payload)
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('detail dialog handlers set and clear selected row', () => {
    const ctx = {
      selectedRow: { resourceId: 'x' },
      isShowDetailDialog: false,
      toggleShowDetailDialog: CampaignManagerReportClicked.methods.toggleShowDetailDialog
    }

    CampaignManagerReportClicked.methods.handleOnDetail.call(ctx, { resourceId: 'r1' })
    expect(ctx.selectedRow).toEqual({ resourceId: 'r1' })
    expect(ctx.isShowDetailDialog).toBe(true)

    CampaignManagerReportClicked.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)

    CampaignManagerReportClicked.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(true)
  })
})
