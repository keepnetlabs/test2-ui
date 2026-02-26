import CampaignManagerReportSubmittedMfaCode from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCode.vue'

describe('CampaignManagerReportSubmittedMfaCode.vue (extra)', () => {
  it('handleOnDetail uses default empty row when argument is omitted', () => {
    const ctx = {
      selectedRow: { old: true },
      toggleShowDetailDialog: jest.fn()
    }

    CampaignManagerReportSubmittedMfaCode.methods.handleOnDetail.call(ctx)

    expect(ctx.selectedRow).toEqual({})
    expect(ctx.toggleShowDetailDialog).toHaveBeenCalledTimes(1)
  })

  it('toggleShowDetailDialog keeps selected row when opening and clears on close', () => {
    const ctx = {
      isShowDetailDialog: false,
      selectedRow: { resourceId: 'r-1' }
    }

    CampaignManagerReportSubmittedMfaCode.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ resourceId: 'r-1' })

    CampaignManagerReportSubmittedMfaCode.methods.toggleShowDetailDialog.call(ctx)
    expect(ctx.isShowDetailDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })
})
