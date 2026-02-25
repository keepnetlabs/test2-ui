import CampaignManagerReportOpenedAttachmentTable from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserAttachmentOpened: jest.fn(),
    exportCampaignJobUserAttachmentOpened: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customAt', label: 'Custom AT' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedAttachmentTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportOpenedAttachmentTable.name).toBe(
      'CampaignManagerReportOpenedAttachmentTable'
    )
  })

  it('selection/detail/resend handlers emit payloads', () => {
    const ctx = { axiosPayload: { filter: {} }, $emit: jest.fn() }
    CampaignManagerReportOpenedAttachmentTable.methods.handleSelectionChange.call(ctx, 3)
    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 3)

    CampaignManagerReportOpenedAttachmentTable.methods.handleOnDetail.call(ctx, { resourceId: 'u1' })
    expect(ctx.$emit).toHaveBeenCalledWith('on-detail', { resourceId: 'u1' })

    CampaignManagerReportOpenedAttachmentTable.methods.handleOnResend.call(ctx, { resourceId: 'u2' })
    expect(ctx.$emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ Types: [1], items: ['u2'] })
    )
  })

  it('callForData maps response and custom field values', async () => {
    QuishingService.searchCampaignJobUserAttachmentOpened.mockResolvedValue({
      data: {
        data: {
          results: [{ customFieldValues: [{ name: 'Region', value: 'EMEA' }] }],
          totalNumberOfRecords: 9,
          totalNumberOfPages: 2,
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
    CampaignManagerReportOpenedAttachmentTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(9)
    expect(ctx.tableData[0].Region).toBe('EMEA')
  })

  it('customFields watcher inserts generated columns', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'firstName' }, { property: 'department' }] }
    }
    CampaignManagerReportOpenedAttachmentTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])
    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns[2]).toEqual({ property: 'customAt', label: 'Custom AT' })
  })

  it('export maps XLS to Excel and clicks generated links', async () => {
    QuishingService.exportCampaignJobUserAttachmentOpened.mockResolvedValue({ data: {} })
    const click = jest.fn()
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:att')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({ click })
    const ctx = {
      id: 'c1',
      instanceGroup: 'ig1',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
    }

    CampaignManagerReportOpenedAttachmentTable.methods.exportCampaignManagerReportOpenedTable.call(
      ctx,
      { pageNumber: 1, pageSize: 10, reportAllPages: false, exportTypes: ['XLS', 'CSV'] }
    )
    await flushPromises()

    expect(QuishingService.exportCampaignJobUserAttachmentOpened).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'c1',
      'ig1'
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
