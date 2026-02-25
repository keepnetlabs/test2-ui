import CampaignManagerReportSubmittedtemDetailDialog from '@/components/QuishingCampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedtemDetailDialog.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmittedDetails: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedtemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('component name and computed title/subtitle are correct', () => {
    expect(CampaignManagerReportSubmittedtemDetailDialog.name).toBe(
      'CampaignManagerReportSubmittedtemDetailDialog'
    )
    const ctx = { item: { submittedCount: 2, firstName: 'Sam', lastName: 'Lee' } }
    expect(CampaignManagerReportSubmittedtemDetailDialog.computed.getTitle.call(ctx)).toContain(
      '2 Time(s)'
    )
    expect(CampaignManagerReportSubmittedtemDetailDialog.computed.getSubtitle.call(ctx)).toBe(
      'Sam Lee'
    )
  })

  it('callForData maps response into table and server-side props', async () => {
    QuishingService.searchCampaignJobUserEmailSubmittedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ id: 5 }],
          totalNumberOfRecords: 12,
          totalNumberOfPages: 4,
          pageNumber: 3
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
    CampaignManagerReportSubmittedtemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(12)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(4)
    expect(ctx.serverSideProps.pageNumber).toBe(3)
    expect(ctx.tableData).toEqual([{ id: 5 }])
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    CampaignManagerReportSubmittedtemDetailDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
