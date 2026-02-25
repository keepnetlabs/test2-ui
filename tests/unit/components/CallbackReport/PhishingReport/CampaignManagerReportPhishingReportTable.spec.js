import CallbackService from '@/api/callback'
import CampaignManagerReportPhishingReportTable from '@/components/CallbackReport/PhishingReport/CampaignManagerReportPhishingReportTable.vue'
import { REPORT_TABS } from '@/components/CallbackReport/Opened/utils'

jest.mock('@/api/callback', () => ({
  getCampaignTabUsers: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  exportCampaignTabUsers: jest.fn(() => Promise.resolve({ data: {} }))
}))

describe('CampaignManagerReportPhishingReportTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleSelectionChange emits selected count', () => {
    const ctx = { $emit: jest.fn() }

    CampaignManagerReportPhishingReportTable.methods.handleSelectionChange.call(ctx, 2)

    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 2)
  })

  it('handleOnResend maps payload for single and multiple selections', () => {
    const ctx = {
      axiosPayload: { filter: { Condition: 'AND' } },
      $emit: jest.fn()
    }

    CampaignManagerReportPhishingReportTable.methods.handleOnResend.call(ctx, { resourceId: 'u1' })
    CampaignManagerReportPhishingReportTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u2' }, { resourceId: 'u3' }],
      ['u9'],
      true
    )

    expect(ctx.$emit).toHaveBeenNthCalledWith(1, 'on-resend', {
      Types: [REPORT_TABS.REPORTED],
      items: ['u1'],
      excludedItems: [],
      selectAll: false,
      filter: { Condition: 'AND' }
    })
    expect(ctx.$emit).toHaveBeenNthCalledWith(2, 'on-resend', {
      Types: [REPORT_TABS.REPORTED],
      items: ['u2', 'u3'],
      excludedItems: ['u9'],
      selectAll: true,
      filter: { Condition: 'AND' }
    })
  })

  it('callForData maps response and custom fields to table', async () => {
    CallbackService.getCampaignTabUsers.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              firstName: 'Joe',
              customFieldValues: [{ name: 'DeptCode', value: 'D1' }]
            }
          ],
          totalNumberOfRecords: 4,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      id: 'cmp-1',
      instanceGroup: 7,
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} },
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: []
    }

    await CampaignManagerReportPhishingReportTable.methods.callForData.call(ctx)

    expect(CallbackService.getCampaignTabUsers).toHaveBeenCalledWith(
      REPORT_TABS.REPORTED,
      'cmp-1',
      7,
      expect.objectContaining({ orderBy: 'FirstName' })
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(4)
    expect(ctx.tableData[0]).toEqual(expect.objectContaining({ DeptCode: 'D1' }))
  })

  it('exportCampaignManagerReportOpenedTable maps XLS to Excel and triggers links', async () => {
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { click }
      return originalCreateElement(tagName)
    })

    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:test')

    const ctx = {
      id: 'cmp-2',
      instanceGroup: 8,
      axiosPayload: {
        orderBy: 'FirstName',
        ascending: true,
        filter: { Condition: 'AND' }
      }
    }

    CampaignManagerReportPhishingReportTable.methods.exportCampaignManagerReportOpenedTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: false
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(CallbackService.exportCampaignTabUsers).toHaveBeenNthCalledWith(
      1,
      REPORT_TABS.REPORTED,
      'cmp-2',
      8,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(CallbackService.exportCampaignTabUsers).toHaveBeenNthCalledWith(
      2,
      REPORT_TABS.REPORTED,
      'cmp-2',
      8,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('handleOnDetail emits detail row', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 'detail-row' }

    CampaignManagerReportPhishingReportTable.methods.handleOnDetail.call(ctx, row)

    expect(ctx.$emit).toHaveBeenCalledWith('on-detail', row)
  })
})
