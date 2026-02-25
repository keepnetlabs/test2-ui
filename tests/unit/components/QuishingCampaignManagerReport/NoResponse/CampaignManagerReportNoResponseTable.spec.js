import CampaignManagerReportNoResponseTable from '@/components/QuishingCampaignManagerReport/NoResponse/CampaignManagerReportNoResponseTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserNoResponse: jest.fn(),
    exportCampaignJobUserNoResponse: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customA', label: 'Custom A' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportNoResponseTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportNoResponseTable.name).toBe('CampaignManagerReportNoResponseTable')
  })

  it('selection and resend handlers emit expected payloads', () => {
    const ctx = { axiosPayload: { filter: { FilterGroups: [] } }, $emit: jest.fn() }
    CampaignManagerReportNoResponseTable.methods.handleSelectionChange.call(ctx, 4)
    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 4)

    CampaignManagerReportNoResponseTable.methods.handleOnResend.call(ctx, { resourceId: 'r1' })
    expect(ctx.$emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ Types: [4], items: ['r1'], selectAll: false })
    )
  })

  it('callForData maps response and custom fields into table rows', async () => {
    QuishingService.searchCampaignJobUserNoResponse.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'u1', customFieldValues: [{ name: 'Team', value: 'Blue' }] }],
          totalNumberOfRecords: 6,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: {},
      id: 'camp-1',
      instanceGroup: 'ig-1',
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: []
    }
    CampaignManagerReportNoResponseTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(6)
    expect(ctx.tableData[0].Team).toBe('Blue')
  })

  it('customFields watcher inserts generated columns after department', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'firstName' }, { property: 'department' }] }
    }
    CampaignManagerReportNoResponseTable.watch.customFields.handler.call(ctx, [{ name: 'Custom A' }])
    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns[2]).toEqual({ property: 'customA', label: 'Custom A' })
  })

  it('export maps XLS to Excel and triggers browser download links', async () => {
    QuishingService.exportCampaignJobUserNoResponse.mockResolvedValue({ data: {} })
    const click = jest.fn()
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:no-response')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({ click })
    const ctx = {
      id: 'camp-1',
      instanceGroup: 'ig-1',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
    }

    CampaignManagerReportNoResponseTable.methods.exportCampaignManagerReportNoResponseTable.call(
      ctx,
      { pageNumber: 1, pageSize: 10, reportAllPages: false, exportTypes: ['XLS', 'CSV'] }
    )
    await flushPromises()

    expect(QuishingService.exportCampaignJobUserNoResponse).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'camp-1',
      'ig-1'
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
