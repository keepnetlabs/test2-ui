jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailSubmittedDetailsMfa: jest.fn()
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

import CampaignManagerReportSubmittedMfaCodeDetailDialog from '@/components/CampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeDetailDialog.vue'
import { searchCampaignJobUserEmailSubmittedDetailsMfa } from '@/api/phishingsimulator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedMfaCodeDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title and subtitle with fallback', () => {
    expect(
      CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getTitle.call({
        item: { submittedCount: 2 }
      })
    ).toBe('Submitted MFA Code 2 Time(s)')
    expect(
      CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getTitle.call({
        item: {}
      })
    ).toBe('Submitted MFA Code 0 Time(s)')
    expect(
      CampaignManagerReportSubmittedMfaCodeDetailDialog.computed.getSubtitle.call({
        item: { firstName: 'X', lastName: 'Y' }
      })
    ).toBe('X Y')
  })

  it('created hook calls callForData', () => {
    const ctx = { callForData: jest.fn() }
    CampaignManagerReportSubmittedMfaCodeDetailDialog.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData sets pagination and table rows', async () => {
    searchCampaignJobUserEmailSubmittedDetailsMfa.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'm1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      item: { resourceId: 'user-mfa' },
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerReportSubmittedMfaCodeDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignJobUserEmailSubmittedDetailsMfa).toHaveBeenCalledWith(
      ctx.axiosPayload,
      'user-mfa'
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'm1' }])
  })

  it('handleClose emits on-close', () => {
    const emit = jest.fn()
    CampaignManagerReportSubmittedMfaCodeDetailDialog.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })
})
