import CallbackService from '@/api/callback'
import CampaignManagerReportNoResponseTable from '@/components/CallbackReport/NoResponse/CampaignManagerReportNoResponseTable.vue'
import { REPORT_TABS } from '@/components/CallbackReport/Opened/utils'

jest.mock('@/api/callback', () => ({
  getCampaignTabUsers: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  exportCampaignTabUsers: jest.fn(() => Promise.resolve({ data: {} }))
}))

describe('CampaignManagerReportNoResponseTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleSelectionChange emits selected count', () => {
    const ctx = { $emit: jest.fn() }

    CampaignManagerReportNoResponseTable.methods.handleSelectionChange.call(ctx, 3)

    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 3)
  })

  it('handleOnResend builds payload for table selection', () => {
    const ctx = {
      axiosPayload: { filter: { Condition: 'AND' } },
      $emit: jest.fn()
    }

    CampaignManagerReportNoResponseTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u1' }],
      ['u9'],
      true
    )

    expect(ctx.$emit).toHaveBeenCalledWith('on-resend', {
      Types: [REPORT_TABS.NO_RESPONSE],
      items: ['u1'],
      excludedItems: ['u9'],
      selectAll: true,
      filter: { Condition: 'AND' }
    })
  })

  it('callForData maps response and custom fields', async () => {
    CallbackService.getCampaignTabUsers.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              firstName: 'John',
              customFieldValues: [{ name: 'Office', value: 'Istanbul' }]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      id: 'cmp-1',
      instanceGroup: 2,
      axiosPayload: { orderBy: 'FirstName' },
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: []
    }

    await CampaignManagerReportNoResponseTable.methods.callForData.call(ctx)

    expect(CallbackService.getCampaignTabUsers).toHaveBeenCalledWith(
      REPORT_TABS.NO_RESPONSE,
      'cmp-1',
      2,
      { orderBy: 'FirstName' }
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0]).toEqual(expect.objectContaining({ Office: 'Istanbul' }))
  })

  it('exportCampaignManagerReportNoResponseTable maps XLS to Excel', async () => {
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { click }
      return originalCreateElement(tagName)
    })

    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:test')

    const ctx = {
      id: 'cmp-1',
      instanceGroup: 3,
      axiosPayload: {
        orderBy: 'FirstName',
        ascending: true,
        filter: { Condition: 'AND' }
      }
    }

    CampaignManagerReportNoResponseTable.methods.exportCampaignManagerReportNoResponseTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 50,
      reportAllPages: true
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(CallbackService.exportCampaignTabUsers).toHaveBeenNthCalledWith(
      1,
      REPORT_TABS.NO_RESPONSE,
      'cmp-1',
      3,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(CallbackService.exportCampaignTabUsers).toHaveBeenNthCalledWith(
      2,
      REPORT_TABS.NO_RESPONSE,
      'cmp-1',
      3,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(click).toHaveBeenCalledTimes(2)
  })
})
