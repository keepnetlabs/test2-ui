import CampaignManagerReportOpenedAttachment from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachment.vue'

describe('CampaignManagerReportOpenedAttachment.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportOpenedAttachment.name).toBe('CampaignManagerReportOpenedAttachment')
  })

  it('selection and resend handlers update state', () => {
    const ctx = {
      resendItemCount: 0,
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }
    CampaignManagerReportOpenedAttachment.methods.handleSelectionChange.call(ctx, 4)
    expect(ctx.resendItemCount).toBe(4)

    CampaignManagerReportOpenedAttachment.methods.handleOnResend.call(ctx, { items: ['u1'] })
    expect(ctx.resendPayload).toEqual({ items: ['u1'] })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('detail handlers toggle modal and clear selected row on close', () => {
    const ctx = {
      selectedRow: null,
      isShowDetailDialog: false,
      toggleShowDetailDialog: CampaignManagerReportOpenedAttachment.methods.toggleShowDetailDialog
    }
    CampaignManagerReportOpenedAttachment.methods.handleOnDetail.call(ctx, { resourceId: 'r1' })
    expect(ctx.selectedRow).toEqual({ resourceId: 'r1' })
    expect(ctx.isShowDetailDialog).toBe(true)

    CampaignManagerReportOpenedAttachment.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })
})
