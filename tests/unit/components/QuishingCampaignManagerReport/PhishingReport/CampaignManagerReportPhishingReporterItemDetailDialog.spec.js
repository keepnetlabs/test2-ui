import CampaignManagerReportPhishingReporterItemDetailDialog from '@/components/QuishingCampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReporterItemDetailDialog.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailReportedDetails: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportPhishingReporterItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('component name and computed title/subtitle are correct', () => {
    expect(CampaignManagerReportPhishingReporterItemDetailDialog.name).toBe(
      'CampaignManagerReportPhishingReporterItemDetailDialog'
    )
    const ctx = { item: { reportedCount: 3, firstName: 'Jane', lastName: 'Doe' } }
    expect(
      CampaignManagerReportPhishingReporterItemDetailDialog.computed.getTitle.call(ctx)
    ).toContain('3 Time(s)')
    expect(
      CampaignManagerReportPhishingReporterItemDetailDialog.computed.getSubtitle.call(ctx)
    ).toBe('Jane Doe')
  })

  it('callForData maps response into table and pagination fields', async () => {
    QuishingService.searchCampaignJobUserEmailReportedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ id: 1 }],
          totalNumberOfRecords: 11,
          totalNumberOfPages: 3,
          pageNumber: 2
        }
      }
    })
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: {},
      item: { resourceId: 'u1' },
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: []
    }
    CampaignManagerReportPhishingReporterItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(11)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(3)
    expect(ctx.serverSideProps.pageNumber).toBe(2)
    expect(ctx.tableData).toEqual([{ id: 1 }])
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    CampaignManagerReportPhishingReporterItemDetailDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
