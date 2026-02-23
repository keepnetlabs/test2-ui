jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailReportedDetails: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'ReportedTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import CampaignManagerReportPhishingReporterItemDetailDialog from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReporterItemDetailDialog.vue'
import { searchCampaignJobUserEmailReportedDetails } from '@/api/phishingsimulator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportPhishingReporterItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title/subtitle using item values', () => {
    expect(
      CampaignManagerReportPhishingReporterItemDetailDialog.computed.getTitle.call({
        item: { reportedCount: 7 }
      })
    ).toBe('Reported the Email 7 Time(s)')
    expect(
      CampaignManagerReportPhishingReporterItemDetailDialog.computed.getSubtitle.call({
        item: { firstName: 'Jane', lastName: 'Doe' }
      })
    ).toBe('Jane Doe')
  })

  it('created hook triggers data fetch', () => {
    const ctx = { callForData: jest.fn() }
    CampaignManagerReportPhishingReporterItemDetailDialog.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData populates table and server-side pagination', async () => {
    searchCampaignJobUserEmailReportedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'r1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      item: { resourceId: 'user-1' },
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerReportPhishingReporterItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignJobUserEmailReportedDetails).toHaveBeenCalledWith(ctx.axiosPayload, 'user-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'r1' }])
  })

  it('handleClose emits on-close', () => {
    const emit = jest.fn()
    CampaignManagerReportPhishingReporterItemDetailDialog.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })
})
