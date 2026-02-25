import CampaignManagerReportSubmittedMfaCodeDetailDialog from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeDetailDialog.vue'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmittedDetailsMfa: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedMfaCodeDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('component name and computed header values are correct', () => {
    expect(CampaignManagerReportSubmittedMfaCodeDetailDialog.name).toBe(
      'CampaignManagerReportSubmittedMfaDetailDialog'
    )
    const ctx = { item: { mfaSubmittedCount: 2, firstName: 'Ali', lastName: 'Veli' } }
    expect(CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getTitle.call(ctx)).toContain(
      '2 Time(s)'
    )
    expect(CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getSubtitle.call(ctx)).toBe(
      'Ali Veli'
    )
  })

  it('callForData maps response into table and pagination fields', async () => {
    QuishingService.searchCampaignJobUserEmailSubmittedDetailsMfa.mockResolvedValue({
      data: {
        data: {
          results: [{ id: 1 }],
          totalNumberOfRecords: 8,
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
    CampaignManagerReportSubmittedMfaCodeDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(8)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.tableData).toEqual([{ id: 1 }])
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    CampaignManagerReportSubmittedMfaCodeDetailDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
