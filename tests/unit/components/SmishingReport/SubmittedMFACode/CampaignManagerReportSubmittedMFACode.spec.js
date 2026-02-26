import CampaignManagerReportSubmittedMFACode from '@/components/SmishingReport/SubmittedMFACode/CampaignManagerReportSubmittedMFACode.vue'

describe('CampaignManagerReportSubmittedMFACode.vue', () => {
  it('getPasswordComplexities returns array from formDetails or empty', () => {
    const withData = { formDetails: { passwordComplexityTypes: ['low', 'high'] } }
    const withoutData = { formDetails: null }

    expect(CampaignManagerReportSubmittedMFACode.computed.getPasswordComplexities.call(withData)).toEqual([
      'low',
      'high'
    ])
    expect(
      CampaignManagerReportSubmittedMFACode.computed.getPasswordComplexities.call(withoutData)
    ).toEqual([])
  })

  it('handleOnResend updates payload and toggles resend dialog', () => {
    const ctx = { resendPayload: null, toggleIsShowResendDialog: jest.fn() }
    const payload = { selectedItems: ['u1'] }
    CampaignManagerReportSubmittedMFACode.methods.handleOnResend.call(ctx, payload)
    expect(ctx.resendPayload).toEqual(payload)
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('handleOnDetail sets selected row and opens detail dialog', () => {
    const ctx = { selectedRow: {}, toggleShowDetailDialog: jest.fn() }
    const row = { id: '1' }
    CampaignManagerReportSubmittedMFACode.methods.handleOnDetail.call(ctx, row)
    expect(ctx.selectedRow).toBe(row)
    expect(ctx.toggleShowDetailDialog).toHaveBeenCalled()
  })

  it('toggleShowDetailDialog clears selected row when closing', () => {
    const ctx = { isShowDetailDialog: true, selectedRow: { id: '1' } }
    CampaignManagerReportSubmittedMFACode.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)
    expect(ctx.selectedRow).toBe(null)
  })
})
