import CallbackService from '@/api/callback'
import CampaignManagerReportOpenedTable from '@/components/CallbackReport/Opened/CampaignManagerReportOpenedTable.vue'
import { REPORT_TABS } from '@/components/CallbackReport/Opened/utils'

jest.mock('@/api/callback', () => ({
  getCampaignTabUsers: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  exportCampaignTabUsers: jest.fn(() => Promise.resolve({ data: {} }))
}))

describe('CampaignManagerReportOpenedTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleSelectionChange emits selection count', () => {
    const ctx = { $emit: jest.fn() }

    CampaignManagerReportOpenedTable.methods.handleSelectionChange.call(ctx, 4)

    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 4)
  })

  it('handleOnResend maps single and multiple rows into payload', () => {
    const ctx = {
      axiosPayload: { filter: { Condition: 'AND' } },
      $emit: jest.fn()
    }

    CampaignManagerReportOpenedTable.methods.handleOnResend.call(
      ctx,
      { resourceId: 'single' },
      [],
      false
    )
    CampaignManagerReportOpenedTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      ['x'],
      true
    )

    expect(ctx.$emit).toHaveBeenNthCalledWith(1, 'on-resend', {
      Types: [REPORT_TABS.OPENED],
      items: ['single'],
      excludedItems: [],
      selectAll: false,
      filter: { Condition: 'AND' }
    })
    expect(ctx.$emit).toHaveBeenNthCalledWith(2, 'on-resend', {
      Types: [REPORT_TABS.OPENED],
      items: ['a', 'b'],
      excludedItems: ['x'],
      selectAll: true,
      filter: { Condition: 'AND' }
    })
  })

  it('callForData sets default activityType and maps custom fields', async () => {
    CallbackService.getCampaignTabUsers.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              firstName: 'Jane',
              customFieldValues: [{ name: 'Region', value: 'EU' }]
            }
          ],
          totalNumberOfRecords: 3,
          totalNumberOfPages: 2,
          pageNumber: 1,
          totalSandBoxActivityCount: 9
        }
      }
    })

    const ctx = {
      id: 'cmp-1',
      instanceGroup: 1,
      axiosPayload: { filter: {}, orderBy: 'FirstName', ascending: true },
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: [],
      botActivityCount: 0
    }

    await CampaignManagerReportOpenedTable.methods.callForData.call(ctx)

    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(CallbackService.getCampaignTabUsers).toHaveBeenCalledWith(
      REPORT_TABS.OPENED,
      'cmp-1',
      1,
      expect.objectContaining({ activityType: 0 })
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(3)
    expect(ctx.tableData[0]).toEqual(expect.objectContaining({ Region: 'EU' }))
    expect(ctx.botActivityCount).toBe(9)
  })

  it('exportCampaignManagerReportOpenedTable maps XLS to Excel and triggers download', async () => {
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
      id: 'cmp-9',
      instanceGroup: 4,
      axiosPayload: {
        orderBy: 'FirstName',
        ascending: true,
        filter: { Condition: 'AND' },
        activityType: 2
      }
    }

    CampaignManagerReportOpenedTable.methods.exportCampaignManagerReportOpenedTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 2,
      pageSize: 25,
      reportAllPages: true
    })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(CallbackService.exportCampaignTabUsers).toHaveBeenNthCalledWith(
      1,
      REPORT_TABS.OPENED,
      'cmp-9',
      4,
      expect.objectContaining({ exportType: 'Excel', activityType: 2 })
    )
    expect(CallbackService.exportCampaignTabUsers).toHaveBeenNthCalledWith(
      2,
      REPORT_TABS.OPENED,
      'cmp-9',
      4,
      expect.objectContaining({ exportType: 'CSV', activityType: 2 })
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('handleOnDetail emits detail row', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 'd1' }

    CampaignManagerReportOpenedTable.methods.handleOnDetail.call(ctx, row)

    expect(ctx.$emit).toHaveBeenCalledWith('on-detail', row)
  })
})
