import CampaignManagerReportSubmittedMfaCodeTable from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCodeTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmittedMfa: jest.fn(),
    exportCampaignJobUserEmailSubmittedMfa: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customM', label: 'Custom M' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedMfaCodeTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportSubmittedMfaCodeTable.name).toBe('CampaignManagerReportSubmittedTable')
  })

  it('selection/detail/resend handlers emit expected payloads', () => {
    const ctx = { axiosPayload: { filter: {} }, $emit: jest.fn() }
    CampaignManagerReportSubmittedMfaCodeTable.methods.handleSelectionChange.call(ctx, 4)
    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 4)

    CampaignManagerReportSubmittedMfaCodeTable.methods.handleOnDetail.call(ctx, { resourceId: 'u1' })
    expect(ctx.$emit).toHaveBeenCalledWith('on-detail', { resourceId: 'u1' })

    CampaignManagerReportSubmittedMfaCodeTable.methods.handleOnResend.call(ctx, { resourceId: 'u2' })
    expect(ctx.$emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ Types: [8], items: ['u2'] })
    )
  })

  it('callForData maps response rows and custom fields', async () => {
    QuishingService.searchCampaignJobUserEmailSubmittedMfa.mockResolvedValue({
      data: {
        data: {
          results: [{ customFieldValues: [{ name: 'Tier', value: 'Gold' }] }],
          totalNumberOfRecords: 6,
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
    CampaignManagerReportSubmittedMfaCodeTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(6)
    expect(ctx.tableData[0].Tier).toBe('Gold')
  })

  it('customFields watcher inserts generated columns', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'firstName' }, { property: 'department' }] }
    }
    CampaignManagerReportSubmittedMfaCodeTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])
    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns[2]).toEqual({ property: 'customM', label: 'Custom M' })
  })

  it('export maps XLS to Excel and triggers download links', async () => {
    QuishingService.exportCampaignJobUserEmailSubmittedMfa.mockResolvedValue({ data: {} })
    const click = jest.fn()
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:mfa')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({ click })
    const ctx = {
      id: 'c1',
      instanceGroup: 'ig1',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
    }

    CampaignManagerReportSubmittedMfaCodeTable.methods.exportCampaignManagerReportSubmittedTable.call(
      ctx,
      { pageNumber: 1, pageSize: 10, reportAllPages: false, exportTypes: ['XLS', 'CSV'] }
    )
    await flushPromises()

    expect(QuishingService.exportCampaignJobUserEmailSubmittedMfa).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'c1',
      'ig1'
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
