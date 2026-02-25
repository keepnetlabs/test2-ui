import CallbackService from '@/api/callback'
import CampaignManagerReportPhishingReporterItemDetailDialog from '@/components/CallbackReport/PhishingReport/CampaignManagerReportPhishingReporterItemDetailDialog.vue'

jest.mock('@/api/callback', () => ({
  getReportedUserDetails: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

describe('CampaignManagerReportPhishingReporterItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed title and subtitle reflect selected item', () => {
    const ctx = { item: { reportedCount: 4, firstName: 'Jane', lastName: 'Doe' } }

    expect(CampaignManagerReportPhishingReporterItemDetailDialog.computed.getTitle.call(ctx)).toBe(
      'Reported the Email 4 Time(s)'
    )
    expect(
      CampaignManagerReportPhishingReporterItemDetailDialog.computed.getSubtitle.call(ctx)
    ).toBe('Jane Doe')
  })

  it('callForData maps API response to table and server props', async () => {
    CallbackService.getReportedUserDetails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ id: 1 }],
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      item: { resourceId: 'row-1' },
      axiosPayload: { orderBy: 'ReportedTime' },
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: []
    }

    await CampaignManagerReportPhishingReporterItemDetailDialog.methods.callForData.call(ctx)

    expect(CallbackService.getReportedUserDetails).toHaveBeenCalledWith('row-1', {
      orderBy: 'ReportedTime'
    })
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.tableData).toEqual([{ id: 1 }])
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }

    CampaignManagerReportPhishingReporterItemDetailDialog.methods.handleClose.call(ctx)

    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
