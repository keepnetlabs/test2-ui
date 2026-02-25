import CampaignManagerReportPhishingReport from '@/components/CallbackReport/PhishingReport/CampaignManagerReportPhishingReport.vue'

describe('CampaignManagerReportPhishingReport.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportPhishingReport.name).toBe('CampaignManagerReportPhishingReport')
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const ctx = { resendItemCount: 0 }

    CampaignManagerReportPhishingReport.methods.handleSelectionChange.call(ctx, 5)

    expect(ctx.resendItemCount).toBe(5)
  })

  it('handleOnDetail sets selected row and toggles detail dialog', () => {
    const ctx = {
      selectedRow: null,
      toggleShowDetailDialog: jest.fn()
    }
    const row = { resourceId: 'u1' }

    CampaignManagerReportPhishingReport.methods.handleOnDetail.call(ctx, row)

    expect(ctx.selectedRow).toEqual(row)
    expect(ctx.toggleShowDetailDialog).toHaveBeenCalled()
  })

  it('toggleShowDetailDialog clears row when closing', () => {
    const openCtx = { isShowDetailDialog: false, selectedRow: { a: 1 } }
    CampaignManagerReportPhishingReport.methods.toggleShowDetailDialog.call(openCtx)
    expect(openCtx.isShowDetailDialog).toBe(true)
    expect(openCtx.selectedRow).toEqual({ a: 1 })

    const closeCtx = { isShowDetailDialog: true, selectedRow: { a: 1 } }
    CampaignManagerReportPhishingReport.methods.toggleShowDetailDialog.call(closeCtx)
    expect(closeCtx.isShowDetailDialog).toBe(false)
    expect(closeCtx.selectedRow).toBeNull()
  })
})
