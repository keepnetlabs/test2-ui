import CampaignManagerReportPhishingReportTable from '@/components/QuishingCampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReportTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserPhishingReport: jest.fn(),
    exportCampaignJobUserPhishingReport: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customP', label: 'Custom P' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportPhishingReportTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportPhishingReportTable.name).toBe(
      'CampaignManagerReportPhishingReportTable'
    )
  })

  it('selection/detail/resend handlers emit expected payloads', () => {
    const ctx = { axiosPayload: { filter: {} }, $emit: jest.fn() }
    CampaignManagerReportPhishingReportTable.methods.handleSelectionChange.call(ctx, 7)
    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 7)

    CampaignManagerReportPhishingReportTable.methods.handleOnDetail.call(ctx, { resourceId: 'u1' })
    expect(ctx.$emit).toHaveBeenCalledWith('on-detail', { resourceId: 'u1' })

    CampaignManagerReportPhishingReportTable.methods.handleOnResend.call(ctx, { resourceId: 'u2' })
    expect(ctx.$emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ Types: [6], items: ['u2'] })
    )
  })

  it('callForData maps response rows and custom fields', async () => {
    QuishingService.searchCampaignJobUserPhishingReport.mockResolvedValue({
      data: {
        data: {
          results: [{ customFieldValues: [{ name: 'Team', value: 'Blue' }] }],
          totalNumberOfRecords: 4,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: {},
      id: 'c1',
      instanceGroup: 'ig1',
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: []
    }
    CampaignManagerReportPhishingReportTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(4)
    expect(ctx.tableData[0].Team).toBe('Blue')
  })

  it('customFields watcher inserts generated columns', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'firstName' }, { property: 'department' }] }
    }
    CampaignManagerReportPhishingReportTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])
    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns[2]).toEqual({ property: 'customP', label: 'Custom P' })
  })

  it('export maps XLS to Excel and triggers download links', async () => {
    QuishingService.exportCampaignJobUserPhishingReport.mockResolvedValue({ data: {} })
    const click = jest.fn()
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:phishing')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({ click })
    const ctx = {
      id: 'c1',
      instanceGroup: 'ig1',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
    }

    CampaignManagerReportPhishingReportTable.methods.exportCampaignManagerReportOpenedTable.call(
      ctx,
      { pageNumber: 1, pageSize: 10, reportAllPages: false, exportTypes: ['XLS', 'CSV'] }
    )
    await flushPromises()

    expect(QuishingService.exportCampaignJobUserPhishingReport).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'c1',
      'ig1'
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
