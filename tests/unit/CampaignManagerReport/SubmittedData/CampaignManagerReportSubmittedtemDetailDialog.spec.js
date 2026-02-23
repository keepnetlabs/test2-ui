jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailSubmittedDetails: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'SubmittedTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import CampaignManagerReportSubmittedtemDetailDialog from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedtemDetailDialog.vue'
import { searchCampaignJobUserEmailSubmittedDetails } from '@/api/phishingsimulator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedtemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title and subtitle correctly', () => {
    expect(
      CampaignManagerReportSubmittedtemDetailDialog.computed.getTitle.call({
        item: { submittedCount: 3 }
      })
    ).toBe('Submitted Data 3 Time(s)')
    expect(
      CampaignManagerReportSubmittedtemDetailDialog.computed.getSubtitle.call({
        item: { firstName: 'A', lastName: 'B' }
      })
    ).toBe('A B')
  })

  it('created calls callForData', () => {
    const ctx = { callForData: jest.fn() }
    CampaignManagerReportSubmittedtemDetailDialog.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData fetches rows and updates server-side props', async () => {
    searchCampaignJobUserEmailSubmittedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 's1' }],
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

    CampaignManagerReportSubmittedtemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignJobUserEmailSubmittedDetails).toHaveBeenCalledWith(ctx.axiosPayload, 'user-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 's1' }])
  })

  it('handleClose emits on-close', () => {
    const emit = jest.fn()
    CampaignManagerReportSubmittedtemDetailDialog.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })
})
