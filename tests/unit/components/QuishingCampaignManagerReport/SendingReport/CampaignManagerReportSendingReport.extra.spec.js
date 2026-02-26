import CampaignManagerReportSendingReport from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReport.vue'

describe('CampaignManagerReportSendingReport.vue (extra)', () => {
  it('handleOnDetail uses default empty row when called without args', () => {
    const ctx = {
      selectedRow: { old: true },
      toggleShowDetailDialog: jest.fn()
    }

    CampaignManagerReportSendingReport.methods.handleOnDetail.call(ctx)

    expect(ctx.selectedRow).toEqual({})
    expect(ctx.toggleShowDetailDialog).toHaveBeenCalledTimes(1)
  })

  it('isQuishingTypePrintout returns false when response path is missing', () => {
    const result = CampaignManagerReportSendingReport.computed.isQuishingTypePrintout.call({
      apiResponse: null
    })
    expect(result).toBe(false)
  })
})
