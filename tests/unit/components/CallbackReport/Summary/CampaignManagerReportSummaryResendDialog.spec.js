import CallbackReportSummaryResendDialog from '@/components/CallbackReport/Summary/CampaignManagerReportSummaryResendDialog.vue'

describe('CallbackReportSummaryResendDialog.vue', () => {
  it('getActionButtonDisabled handles empty and non-empty type selections', () => {
    expect(
      CallbackReportSummaryResendDialog.computed.getActionButtonDisabled.call({
        isActionButtonDisabled: false,
        types: []
      })
    ).toBe(true)

    expect(
      CallbackReportSummaryResendDialog.computed.getActionButtonDisabled.call({
        isActionButtonDisabled: false,
        types: ['Opened']
      })
    ).toBe(false)

    expect(
      CallbackReportSummaryResendDialog.computed.getActionButtonDisabled.call({
        isActionButtonDisabled: true,
        types: ['Opened']
      })
    ).toBe(true)
  })

  it('closeModal and handleConfirm emit expected events', () => {
    const ctx = { $emit: jest.fn(), types: ['A', 'B'] }

    CallbackReportSummaryResendDialog.methods.closeModal.call(ctx)
    CallbackReportSummaryResendDialog.methods.handleConfirm.call(ctx)

    expect(ctx.$emit).toHaveBeenNthCalledWith(1, 'on-close')
    expect(ctx.$emit).toHaveBeenNthCalledWith(2, 'on-confirm', ['A', 'B'])
  })
})
