import CampaignManagerReportOpenedTable from '@/components/QuishingCampaignManagerReport/Opened/CampaignManagerReportOpenedTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailOpened: jest.fn(),
    exportCampaignJobUserEmailOpened: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customO', label: 'Custom O' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportOpenedTable.name).toBe('CampaignManagerReportOpenedTable')
  })

  it('selection/detail/resend handlers emit expected payloads', () => {
    const ctx = { axiosPayload: { filter: {} }, $emit: jest.fn() }
    CampaignManagerReportOpenedTable.methods.handleSelectionChange.call(ctx, 2)
    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 2)

    CampaignManagerReportOpenedTable.methods.handleOnDetail.call(ctx, { resourceId: 'u1' })
    expect(ctx.$emit).toHaveBeenCalledWith('on-detail', { resourceId: 'u1' })

    CampaignManagerReportOpenedTable.methods.handleOnResend.call(ctx, { resourceId: 'u2' })
    expect(ctx.$emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ Types: [1], items: ['u2'], selectAll: false })
    )
  })

  it('callForData maps rows and botActivityCount', async () => {
    QuishingService.searchCampaignJobUserEmailOpened.mockResolvedValue({
      data: {
        data: {
          results: [{ customFieldValues: [{ name: 'Region', value: 'EU' }] }],
          totalNumberOfRecords: 7,
          totalNumberOfPages: 2,
          pageNumber: 1,
          totalSandBoxActivityCount: 4
        }
      }
    })
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: {},
      id: 'c1',
      instanceGroup: 'ig1',
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      botActivityCount: 0
    }

    CampaignManagerReportOpenedTable.methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(7)
    expect(ctx.tableData[0].Region).toBe('EU')
    expect(ctx.botActivityCount).toBe(4)
  })

  it('customFields and isShowSandbox watchers update columns and emit sync', () => {
    const customCtx = {
      tableOptions: { columns: [{ property: 'firstName' }, { property: 'department' }] }
    }
    CampaignManagerReportOpenedTable.watch.customFields.handler.call(customCtx, [{ name: 'x' }])
    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(customCtx.tableOptions.columns[2]).toEqual({ property: 'customO', label: 'Custom O' })

    const sandboxCtx = { $emit: jest.fn() }
    CampaignManagerReportOpenedTable.watch.isShowSandbox.call(sandboxCtx, true)
    expect(sandboxCtx.$emit).toHaveBeenCalledWith('update:is-show-sandbox-from-parent', true)
  })

  it('export maps XLS to Excel and triggers browser download', async () => {
    QuishingService.exportCampaignJobUserEmailOpened.mockResolvedValue({ data: {} })
    const click = jest.fn()
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:opened')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({ click })
    const ctx = {
      id: 'c1',
      instanceGroup: 'ig1',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {}, activityType: 0 }
    }

    CampaignManagerReportOpenedTable.methods.exportCampaignManagerReportOpenedTable.call(ctx, {
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false,
      exportTypes: ['XLS', 'CSV']
    })
    await flushPromises()

    expect(QuishingService.exportCampaignJobUserEmailOpened).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'c1',
      'ig1'
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
