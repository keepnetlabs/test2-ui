import CampaignManagerReportOpened from '@/components/CallbackReport/Opened/CampaignManagerReportOpened.vue'

describe('CampaignManagerReportOpened.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportOpened.name).toBe('CallbackReportOpened')
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const ctx = { resendItemCount: 0 }

    CampaignManagerReportOpened.methods.handleSelectionChange.call(ctx, 7)

    expect(ctx.resendItemCount).toBe(7)
  })

  it('handleOnDetail stores row and toggles dialog', () => {
    const row = { resourceId: 'r1' }
    const ctx = {
      selectedRow: null,
      toggleShowDetailDialog: jest.fn()
    }

    CampaignManagerReportOpened.methods.handleOnDetail.call(ctx, row)

    expect(ctx.selectedRow).toEqual(row)
    expect(ctx.toggleShowDetailDialog).toHaveBeenCalled()
  })

  it('toggleShowDetailDialog clears selected row only on close', () => {
    const openingCtx = { isShowDetailDialog: false, selectedRow: { resourceId: 'a' } }
    CampaignManagerReportOpened.methods.toggleShowDetailDialog.call(openingCtx)
    expect(openingCtx.isShowDetailDialog).toBe(true)
    expect(openingCtx.selectedRow).toEqual({ resourceId: 'a' })

    const closingCtx = { isShowDetailDialog: true, selectedRow: { resourceId: 'a' } }
    CampaignManagerReportOpened.methods.toggleShowDetailDialog.call(closingCtx)
    expect(closingCtx.isShowDetailDialog).toBe(false)
    expect(closingCtx.selectedRow).toBeNull()
  })
})
