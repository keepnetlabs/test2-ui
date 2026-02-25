import CampaignManagerReportSubmittedData from '@/components/QuishingCampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedData.vue'

describe('CampaignManagerReportSubmittedData.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportSubmittedData.name).toBe('CampaignManagerReportSubmittedData')
  })

  it('computed getPasswordComplexities returns safe array', () => {
    expect(
      CampaignManagerReportSubmittedData.computed.getPasswordComplexities.call({ formDetails: null })
    ).toEqual([])
    expect(
      CampaignManagerReportSubmittedData.computed.getPasswordComplexities.call({
        formDetails: { passwordComplexityTypes: [{ text: 'Strong' }] }
      })
    ).toEqual([{ text: 'Strong' }])
  })

  it('selection and resend handlers update state', () => {
    const ctx = {
      resendItemCount: 0,
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }
    CampaignManagerReportSubmittedData.methods.handleSelectionChange.call(ctx, 9)
    expect(ctx.resendItemCount).toBe(9)

    CampaignManagerReportSubmittedData.methods.handleOnResend.call(ctx, { items: ['u1'] })
    expect(ctx.resendPayload).toEqual({ items: ['u1'] })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('detail handlers open/close modal and clear selected row on close', () => {
    const ctx = {
      selectedRow: {},
      isShowDetailDialog: false,
      toggleShowDetailDialog: CampaignManagerReportSubmittedData.methods.toggleShowDetailDialog
    }
    CampaignManagerReportSubmittedData.methods.handleOnDetail.call(ctx, { resourceId: 'r1' })
    expect(ctx.selectedRow).toEqual({ resourceId: 'r1' })
    expect(ctx.isShowDetailDialog).toBe(true)

    CampaignManagerReportSubmittedData.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })
})
