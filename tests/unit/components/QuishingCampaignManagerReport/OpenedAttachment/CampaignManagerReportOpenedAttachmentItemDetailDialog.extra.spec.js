import CampaignManagerReportOpenedAttachmentItemDetailDialog from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentItemDetailDialog.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserAttachmentOpenedDetails: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedAttachmentItemDetailDialog.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed fallbacks return default values for missing item', () => {
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.computed.getTitle.call({ item: null })
    ).toBe('Opened Attachment 0 Time(s)')
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.computed.getSubtitle.call({ item: {} })
    ).toBe(' ')
  })

  it('created hook triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    CampaignManagerReportOpenedAttachmentItemDetailDialog.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })

  it('callForData supports undefined resourceId when item is missing', async () => {
    QuishingService.searchCampaignJobUserAttachmentOpenedDetails.mockResolvedValueOnce({
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
      axiosPayload: { orderBy: 'OpenedTime' },
      item: null,
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(QuishingService.searchCampaignJobUserAttachmentOpenedDetails).toHaveBeenCalledWith(
      ctx.axiosPayload,
      undefined
    )
    expect(ctx.tableData).toEqual([])
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })
})
