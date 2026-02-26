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
  createCustomFieldColumns: jest.fn(() => [{ property: 'customSubmitted', label: 'Custom Submitted' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSubmittedTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data() printout branch uses printout count column and single details action', () => {
    const data = CampaignManagerReportSubmittedTable.data.call({
      getQuishingTypePrintOut: () => true,
      $store: {
        getters: {
          'permissions/getQuishingCampaignReportsSubmittedDataDetailsPermissions': true
        }
      }
    })

    expect(data.tableOptions.rowActions).toHaveLength(1)
    expect(data.tableOptions.rowActions[0].action).toBe('on-detail')
    expect(data.tableOptions.selectEvent.resend).toBe(false)
    expect(data.tableOptions.columns.some((c) => c.property === 'submittedCount')).toBe(true)
  })

  it('data() non-printout branch enables resend action and respects details permission', () => {
    const data = CampaignManagerReportSubmittedTable.data.call({
      getQuishingTypePrintOut: () => false,
      $store: {
        getters: {
          'permissions/getQuishingCampaignReportsSubmittedDataDetailsPermissions': false
        }
      }
    })

    expect(data.tableOptions.rowActions).toHaveLength(2)
    expect(data.tableOptions.rowActions[0].action).toBe('on-detail')
    expect(data.tableOptions.rowActions[0].disabled).toBe(true)
    expect(data.tableOptions.rowActions[1].action).toBe('on-resend')
    expect(data.tableOptions.selectEvent.resend).toBe(true)
  })

  it('customFields watcher does not insert when department index is 0', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] }
    }

    CampaignManagerReportSubmittedTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('customFields watcher inserts fields when department column is missing (index -1 branch)', () => {
    const ctx = {
      tableOptions: { columns: [{ property: 'email' }, { property: 'firstName' }] }
    }

    CampaignManagerReportSubmittedTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns[0].property).toBe('customSubmitted')
  })

  it('setPasswordComplexityItems works when table ref is missing', () => {
    const complexityCol = { property: 'minPasswordComplexity' }
    const ctx = {
      passwordComplexities: [{ text: 'Low' }],
      tableOptions: { columns: [complexityCol] },
      $set: (obj, key, value) => {
        obj[key] = value
      },
      $refs: {}
    }

    CampaignManagerReportSubmittedTable.methods.setPasswordComplexityItems.call(ctx)
    expect(complexityCol.filterableItems).toEqual([{ text: 'Low', value: 'Low' }])
  })

  it('callForData maps empty customFieldValues and finalizes loading', async () => {
    QuishingService.searchCampaignJobUserEmailSubmitted.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ customFieldValues: [] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { orderBy: 'FirstName', ascending: true, filter: {} },
      id: 'c1',
      instanceGroup: 'ig1',
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerReportSubmittedTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toHaveLength(1)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })

  it('handleOnResend maps array items, excluded list and selectAll flag', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { q: 'abc' } },
      $emit: emit
    }

    CampaignManagerReportSubmittedTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'u1' }, { resourceId: 'u2' }],
      ['u9'],
      true
    )

    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [3],
      items: ['u1', 'u2'],
      excludedItems: ['u9'],
      selectAll: true,
      filter: { q: 'abc' }
    })
  })

  it('handleOnResend maps single item and defaults excluded/selectAll', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { status: 'submitted' } },
      $emit: emit
    }

    CampaignManagerReportSubmittedTable.methods.handleOnResend.call(ctx, { resourceId: 'single-1' })

    expect(emit).toHaveBeenCalledWith('on-resend', {
      Types: [3],
      items: ['single-1'],
      excludedItems: [],
      selectAll: false,
      filter: { status: 'submitted' }
    })
  })

  it('exportCampaignManagerReportSubmittedTable keeps non-XLS exportType and maps filename extension', async () => {
    QuishingService.exportCampaignJobUserEmailSubmitted.mockResolvedValue({ data: { any: true } })

    const click = jest.fn()
    const originalURL = globalThis.URL
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click,
      set href(value) {
        this._href = value
      },
      get href() {
        return this._href
      },
      set download(value) {
        this._download = value
      },
      get download() {
        return this._download
      }
    })
    globalThis.URL = {
      ...originalURL,
      createObjectURL: jest.fn(() => 'blob:test')
    }

    const ctx = {
      id: 'campaign-1',
      instanceGroup: 'ig-1',
      axiosPayload: { orderBy: 'FirstName', ascending: false, filter: { q: 'abc' } }
    }

    CampaignManagerReportSubmittedTable.methods.exportCampaignManagerReportSubmittedTable.call(ctx, {
      pageNumber: 2,
      pageSize: 25,
      reportAllPages: true,
      exportTypes: ['PDF']
    })
    await flushPromises()

    expect(QuishingService.exportCampaignJobUserEmailSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'PDF',
        pageNumber: 2,
        pageSize: 25,
        reportAllPages: true
      }),
      'campaign-1',
      'ig-1'
    )
    expect(click).toHaveBeenCalledTimes(1)

    createElementSpy.mockRestore()
    globalThis.URL = originalURL
  })
})
