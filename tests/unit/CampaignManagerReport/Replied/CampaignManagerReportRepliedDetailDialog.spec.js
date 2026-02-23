jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserRepliedDetails: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'replySent',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import CampaignManagerReportRepliedDetailDialog from '@/components/CampaignManagerReport/Replied/CampaignManagerReportRepliedDetailDialog.vue'
import { searchCampaignJobUserRepliedDetails } from '@/api/phishingsimulator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportRepliedDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title/subtitle and current template helpers', () => {
    const vm = {
      item: { replyType: 'Manual Reply', firstName: 'Jane', lastName: 'Doe' },
      repliedTemplates: [{ content: '<p>1</p>', subject: 's1' }],
      selectedTemplateIndex: 0
    }
    expect(CampaignManagerReportRepliedDetailDialog.computed.getTitle.call(vm)).toBe(
      'Manual Reply Preview'
    )
    expect(CampaignManagerReportRepliedDetailDialog.computed.getSubtitle.call(vm)).toBe('Jane Doe')
    expect(CampaignManagerReportRepliedDetailDialog.computed.getCurrentTemplate.call(vm)).toEqual(
      expect.objectContaining({ subject: 's1' })
    )
    expect(CampaignManagerReportRepliedDetailDialog.computed.getCurrentReplyTemplate.call(vm)).toBe(
      '<p>1</p>'
    )
    expect(CampaignManagerReportRepliedDetailDialog.computed.hasNextTemplate.call(vm)).toBe(false)
    expect(CampaignManagerReportRepliedDetailDialog.computed.hasPreviousTemplate.call(vm)).toBe(
      false
    )
  })

  it('created hook calls data fetch', () => {
    const ctx = { callForData: jest.fn() }
    CampaignManagerReportRepliedDetailDialog.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData maps response and paging values', async () => {
    searchCampaignJobUserRepliedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ content: '<p>a</p>', subject: 'A' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      item: { resourceId: 'row-1' },
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      repliedTemplates: [],
      setLoading: jest.fn()
    }

    CampaignManagerReportRepliedDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCampaignJobUserRepliedDetails).toHaveBeenCalledWith(ctx.axiosPayload, 'row-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.repliedTemplates).toEqual([{ content: '<p>a</p>', subject: 'A' }])
  })

  it('navigation and close methods update state and emit', () => {
    const emit = jest.fn()
    const ctx = { selectedTemplateIndex: 1, $emit: emit }
    CampaignManagerReportRepliedDetailDialog.methods.handlePreviousTemplate.call(ctx)
    expect(ctx.selectedTemplateIndex).toBe(0)
    CampaignManagerReportRepliedDetailDialog.methods.handleNextTemplate.call(ctx)
    expect(ctx.selectedTemplateIndex).toBe(1)
    CampaignManagerReportRepliedDetailDialog.methods.handleClose.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-close')
  })
})
