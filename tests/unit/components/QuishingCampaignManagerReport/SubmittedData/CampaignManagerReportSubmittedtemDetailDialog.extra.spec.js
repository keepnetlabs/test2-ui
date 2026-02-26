import CampaignManagerReportSubmittedtemDetailDialog from '@/components/QuishingCampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedtemDetailDialog.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmittedDetails: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedtemDetailDialog.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed fallbacks return default title and empty subtitle when item is missing', () => {
    expect(
      CampaignManagerReportSubmittedtemDetailDialog.computed.getTitle.call({ item: null })
    ).toBe('Submitted Data 0 Time(s)')
    expect(
      CampaignManagerReportSubmittedtemDetailDialog.computed.getSubtitle.call({ item: {} })
    ).toBe(' ')
  })

  it('created hook triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    CampaignManagerReportSubmittedtemDetailDialog.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })

  it('callForData supports undefined resourceId when item is missing', async () => {
    QuishingService.searchCampaignJobUserEmailSubmittedDetails.mockResolvedValueOnce({
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
      axiosPayload: { orderBy: 'SubmittedTime' },
      item: null,
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerReportSubmittedtemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailSubmittedDetails).toHaveBeenCalledWith(
      ctx.axiosPayload,
      undefined
    )
    expect(ctx.tableData).toEqual([])
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })

  it('callForData sends payload/resourceId and toggles loading in correct order', async () => {
    QuishingService.searchCampaignJobUserEmailSubmittedDetails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ id: 'r-1' }, { id: 'r-2' }],
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { orderBy: 'SubmittedTime', pageNumber: 1, pageSize: 10 },
      item: { resourceId: 'user-42' },
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: []
    }

    CampaignManagerReportSubmittedtemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserEmailSubmittedDetails).toHaveBeenCalledWith(
      ctx.axiosPayload,
      'user-42'
    )
    expect(ctx.setLoading).toHaveBeenNthCalledWith(1, true)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
    expect(ctx.serverSideProps).toEqual({
      totalNumberOfRecords: 2,
      totalNumberOfPages: 1,
      pageNumber: 1
    })
    expect(ctx.tableData).toEqual([{ id: 'r-1' }, { id: 'r-2' }])
  })

  it('computed subtitle keeps spacing when only one name side exists (fallback branches)', () => {
    expect(
      CampaignManagerReportSubmittedtemDetailDialog.computed.getSubtitle.call({
        item: { firstName: 'Ada' }
      })
    ).toBe('Ada ')

    expect(
      CampaignManagerReportSubmittedtemDetailDialog.computed.getSubtitle.call({
        item: { lastName: 'Lovelace' }
      })
    ).toBe(' Lovelace')
  })
})
