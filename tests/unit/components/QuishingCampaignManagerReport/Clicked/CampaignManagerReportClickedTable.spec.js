import CampaignManagerReportClickedTable from '@/components/QuishingCampaignManagerReport/Clicked/CampaignManagerReportClickedTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailClicked: jest.fn(),
    exportCampaignJobUserEmailClicked: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customX', label: 'Custom X' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportClickedTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportClickedTable.name).toBe('CampaignManagerReportClickedTable')
  })

  it('selection emits count and detail emits row', () => {
    const ctx = { $emit: jest.fn() }
    CampaignManagerReportClickedTable.methods.handleSelectionChange.call(ctx, 5)
    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 5)

    CampaignManagerReportClickedTable.methods.handleOnDetail.call(ctx, { resourceId: 'u1' })
    expect(ctx.$emit).toHaveBeenCalledWith('on-detail', { resourceId: 'u1' })
  })

  it('handleOnResend creates payload for single row and selected-all flows', () => {
    const ctx = { axiosPayload: { filter: { FilterGroups: [] } }, $emit: jest.fn() }
    CampaignManagerReportClickedTable.methods.handleOnResend.call(ctx, { resourceId: 'r1' })
    expect(ctx.$emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['r1'], selectAll: false })
    )

    CampaignManagerReportClickedTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'r2' }],
      ['excluded'],
      true
    )
    expect(ctx.$emit).toHaveBeenLastCalledWith(
      'on-resend',
      expect.objectContaining({ items: ['r2'], excludedItems: ['excluded'], selectAll: true })
    )
  })

  it('callForData maps response rows and bot activity count', async () => {
    QuishingService.searchCampaignJobUserEmailClicked.mockResolvedValue({
      data: {
        data: {
          results: [
            { resourceId: 'u1', customFieldValues: [{ name: 'Region', value: 'EU' }] },
            { resourceId: 'u2', customFieldValues: [] }
          ],
          totalNumberOfRecords: 9,
          totalNumberOfPages: 1,
          pageNumber: 1,
          totalSandBoxActivityCount: 3
        }
      }
    })
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { filter: {} },
      id: 'camp1',
      instanceGroup: 'ig1',
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      botActivityCount: 0
    }

    CampaignManagerReportClickedTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(9)
    expect(ctx.tableData[0].Region).toBe('EU')
    expect(ctx.botActivityCount).toBe(3)
  })

  it('watchers update columns and sync sandbox state with parent', () => {
    const customWatchCtx = {
      tableOptions: { columns: [{ property: 'firstName' }, { property: 'department' }] }
    }
    CampaignManagerReportClickedTable.watch.customFields.handler.call(customWatchCtx, [
      { name: 'Custom X' }
    ])
    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(customWatchCtx.tableOptions.columns[2]).toEqual({ property: 'customX', label: 'Custom X' })

    const sandboxCtx = { $emit: jest.fn() }
    CampaignManagerReportClickedTable.watch.isShowSandbox.call(sandboxCtx, true)
    expect(sandboxCtx.$emit).toHaveBeenCalledWith('update:is-show-sandbox-from-parent', true)
  })

  it('export maps XLS to Excel and triggers browser download', async () => {
    QuishingService.exportCampaignJobUserEmailClicked.mockResolvedValue({ data: {} })
    const click = jest.fn()
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:clicked')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click
    })
    const ctx = {
      id: 'camp1',
      instanceGroup: 'ig1',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {}, activityType: 0 }
    }

    CampaignManagerReportClickedTable.methods.exportCampaignManagerReportClickedTable.call(ctx, {
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false,
      exportTypes: ['XLS', 'CSV']
    })
    await flushPromises()

    expect(QuishingService.exportCampaignJobUserEmailClicked).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'camp1',
      'ig1'
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
