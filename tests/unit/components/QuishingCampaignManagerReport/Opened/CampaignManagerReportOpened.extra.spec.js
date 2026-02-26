import CampaignManagerReportOpened from '@/components/QuishingCampaignManagerReport/Opened/CampaignManagerReportOpened.vue'

describe('CampaignManagerReportOpened.vue (extra)', () => {
  it('handleOnDetail uses default empty object when called without row', () => {
    const ctx = {
      selectedRow: { old: true },
      toggleShowDetailDialog: jest.fn()
    }

    CampaignManagerReportOpened.methods.handleOnDetail.call(ctx)

    expect(ctx.selectedRow).toEqual({})
    expect(ctx.toggleShowDetailDialog).toHaveBeenCalledTimes(1)
  })

  it('toggleShowDetailDialog keeps selected row when opening and clears on close', () => {
    const ctx = {
      isShowDetailDialog: false,
      selectedRow: { resourceId: 'r-1' }
    }

    CampaignManagerReportOpened.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ resourceId: 'r-1' })

    CampaignManagerReportOpened.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })
})
