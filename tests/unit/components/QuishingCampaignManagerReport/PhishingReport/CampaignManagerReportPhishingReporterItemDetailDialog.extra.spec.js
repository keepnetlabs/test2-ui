import CampaignManagerReportPhishingReporterItemDetailDialog from '@/components/QuishingCampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReporterItemDetailDialog.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailReportedDetails: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportPhishingReporterItemDetailDialog.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed fallbacks return defaults when item is missing', () => {
    expect(
      CampaignManagerReportPhishingReporterItemDetailDialog.computed.getTitle.call({ item: null })
    ).toBe('Reported the Email 0 Time(s)')
    expect(
      CampaignManagerReportPhishingReporterItemDetailDialog.computed.getSubtitle.call({ item: {} })
    ).toBe(' ')
  })

  it('created hook triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    CampaignManagerReportPhishingReporterItemDetailDialog.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })

  it('callForData supports undefined resourceId when item is missing', async () => {
    QuishingService.searchCampaignJobUserEmailReportedDetails.mockResolvedValueOnce({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { orderBy: 'ReportedTime' },
      item: null,
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerReportPhishingReporterItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailReportedDetails).toHaveBeenCalledWith(
      ctx.axiosPayload,
      undefined
    )
    expect(ctx.tableData).toEqual([])
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })
})
