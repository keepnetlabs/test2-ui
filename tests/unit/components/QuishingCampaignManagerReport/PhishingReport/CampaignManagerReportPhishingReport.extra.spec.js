import CampaignManagerReportPhishingReport from '@/components/QuishingCampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReport.vue'

describe('CampaignManagerReportPhishingReport.vue (extra)', () => {
  it('handleOnDetail uses default empty object when no row is provided', () => {
    const ctx = {
      selectedRow: { old: true },
      toggleShowDetailDialog: jest.fn()
    }

    CampaignManagerReportPhishingReport.methods.handleOnDetail.call(ctx)

    expect(ctx.selectedRow).toEqual({})
    expect(ctx.toggleShowDetailDialog).toHaveBeenCalledTimes(1)
  })

  it('toggleShowDetailDialog clears selectedRow only while closing', () => {
    const ctx = {
      isShowDetailDialog: false,
      selectedRow: { resourceId: 'r-1' }
    }

    CampaignManagerReportPhishingReport.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ resourceId: 'r-1' })

    CampaignManagerReportPhishingReport.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })
})
