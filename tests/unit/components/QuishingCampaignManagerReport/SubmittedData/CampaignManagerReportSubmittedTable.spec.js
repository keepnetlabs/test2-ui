import CampaignManagerReportSubmittedTable from '@/components/QuishingCampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailSubmitted: jest.fn(),
    exportCampaignJobUserEmailSubmitted: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customS', label: 'Custom S' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportSubmittedTable.name).toBe('CampaignManagerReportSubmittedTable')
  })

  it('selection/detail/resend handlers emit expected payloads', () => {
    const ctx = { axiosPayload: { filter: {} }, $emit: jest.fn() }
    CampaignManagerReportSubmittedTable.methods.handleSelectionChange.call(ctx, 6)
    expect(ctx.$emit).toHaveBeenCalledWith('on-selection-text-change', 6)

    CampaignManagerReportSubmittedTable.methods.handleOnDetail.call(ctx, { resourceId: 'u1' })
    expect(ctx.$emit).toHaveBeenCalledWith('on-detail', { resourceId: 'u1' })

    CampaignManagerReportSubmittedTable.methods.handleOnResend.call(ctx, { resourceId: 'u2' })
    expect(ctx.$emit).toHaveBeenCalledWith(
      'on-resend',
      expect.objectContaining({ Types: [3], items: ['u2'] })
    )
  })

  it('callForData maps response rows and custom fields', async () => {
    QuishingService.searchCampaignJobUserEmailSubmitted.mockResolvedValue({
      data: {
        data: {
          results: [{ customFieldValues: [{ name: 'DeptCode', value: 'A1' }] }],
          totalNumberOfRecords: 10,
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
    CampaignManagerReportSubmittedTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.tableData[0].DeptCode).toBe('A1')
  })

  it('setPasswordComplexityItems maps filterable items and rerenders filters', () => {
    const complexityCol = { property: 'minPasswordComplexity' }
    const ctx = {
      passwordComplexities: [{ text: 'Weak' }, { text: 'Strong' }],
      tableOptions: { columns: [complexityCol] },
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      }),
      $refs: { refTable: { reRenderFilters: jest.fn() } }
    }
    CampaignManagerReportSubmittedTable.methods.setPasswordComplexityItems.call(ctx)
    expect(ctx.$set).toHaveBeenCalled()
    expect(complexityCol.filterableItems).toEqual([
      { text: 'Weak', value: 'Weak' },
      { text: 'Strong', value: 'Strong' }
    ])
    expect(ctx.$refs.refTable.reRenderFilters).toHaveBeenCalled()
  })

  it('watchers trigger password mapping and custom field insertion', () => {
    const ctx = {
      setPasswordComplexityItems: jest.fn(),
      tableOptions: { columns: [{ property: 'firstName' }, { property: 'department' }] }
    }
    CampaignManagerReportSubmittedTable.watch.passwordComplexities.handler.call(ctx)
    expect(ctx.setPasswordComplexityItems).toHaveBeenCalled()

    CampaignManagerReportSubmittedTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])
    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns[2]).toEqual({ property: 'customS', label: 'Custom S' })
  })

  it('export maps XLS to Excel and triggers download links', async () => {
    QuishingService.exportCampaignJobUserEmailSubmitted.mockResolvedValue({ data: {} })
    const click = jest.fn()
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:submitted')
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({ click })
    const ctx = {
      id: 'c1',
      instanceGroup: 'ig1',
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} }
    }

    CampaignManagerReportSubmittedTable.methods.exportCampaignManagerReportSubmittedTable.call(ctx, {
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false,
      exportTypes: ['XLS', 'CSV']
    })
    await flushPromises()

    expect(QuishingService.exportCampaignJobUserEmailSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'c1',
      'ig1'
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})
