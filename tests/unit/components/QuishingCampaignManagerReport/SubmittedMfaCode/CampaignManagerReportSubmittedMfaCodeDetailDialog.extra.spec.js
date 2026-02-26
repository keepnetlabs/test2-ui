import CampaignManagerReportSubmittedMfaCodeDetailDialog from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeDetailDialog.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmittedDetailsMfa: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedMfaCodeDetailDialog.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed fallbacks return default title/subtitle when item is missing', () => {
    expect(
      CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getTitle.call({ item: null })
    ).toBe('Submitted MFA Code 0 Time(s)')
    expect(
      CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getSubtitle.call({ item: {} })
    ).toBe(' ')
  })

  it('created hook triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    CampaignManagerReportSubmittedMfaCodeDetailDialog.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })

  it('callForData sends undefined resourceId when item does not exist and finalizes loading', async () => {
    QuishingService.searchCampaignJobUserEmailSubmittedDetailsMfa.mockResolvedValueOnce({
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

    CampaignManagerReportSubmittedMfaCodeDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.setLoading).toHaveBeenNthCalledWith(1, true)
    expect(QuishingService.searchCampaignJobUserEmailSubmittedDetailsMfa).toHaveBeenCalledWith(
      ctx.axiosPayload,
      undefined
    )
    expect(ctx.tableData).toEqual([])
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })
})
