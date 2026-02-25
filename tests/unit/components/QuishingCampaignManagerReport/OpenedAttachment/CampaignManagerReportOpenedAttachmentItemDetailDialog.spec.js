import CampaignManagerReportOpenedAttachmentItemDetailDialog from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentItemDetailDialog.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserAttachmentOpenedDetails: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedAttachmentItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('component name and computed header values are correct', () => {
    expect(CampaignManagerReportOpenedAttachmentItemDetailDialog.name).toBe(
      'CampaignManagerReportOpenedItemDetailDialog'
    )
    const ctx = { item: { attachmentOpenedCount: 2, firstName: 'A', lastName: 'B' } }
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.computed.getTitle.call(ctx)
    ).toContain('2 Time(s)')
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.computed.getSubtitle.call(ctx)
    ).toBe('A B')
  })

  it('callForData maps response into table and server-side props', async () => {
    QuishingService.searchCampaignJobUserAttachmentOpenedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ id: 1 }],
          totalNumberOfRecords: 5,
          totalNumberOfPages: 2,
          pageNumber: 1
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
    CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(5)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.tableData).toEqual([{ id: 1 }])
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
