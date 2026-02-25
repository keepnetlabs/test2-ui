import SamlSettings from '@/components/Company Settings/SAML/SamlSettings.vue'
import { searchSamlSettings, exportSamlSettings } from '@/api/samlSettings'
import { downloadExportedFile } from '@/utils/helperFunctions'

jest.mock('@/api/samlSettings', () => ({
  __esModule: true,
  searchSamlSettings: jest.fn(),
  exportSamlSettings: jest.fn()
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  downloadExportedFile: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SamlSettings.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(SamlSettings.name).toBe('SamlSettings')
  })

  it('sortChanged maps statusName to StatusId and calls data fetch', () => {
    const ctx = {
      axiosPayload: { ascending: true, orderBy: '' },
      callForData: jest.fn()
    }
    SamlSettings.methods.sortChanged.call(ctx, { order: 'descending', prop: 'statusName' })
    expect(ctx.axiosPayload.ascending).toBe(false)
    expect(ctx.axiosPayload.orderBy).toBe('StatusId')
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleSearchChange keeps filterable columns and maps status field', () => {
    const ctx = {
      tableOptions: {
        columns: [
          { property: 'name', filterableType: 'text' },
          { property: 'statusName', filterableType: 'select' },
          { property: 'nonFilterableColumn' }
        ]
      },
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    SamlSettings.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'StatusName', Value: 'Active' },
              { FieldName: 'nonFilterableColumn', Value: 'x' }
            ]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'Status', Value: 'Active' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('toggle and edit actions update modal state correctly', () => {
    const ctx = { isEdit: false, selectedRow: { id: 1 }, isEditOrNewModalOpen: false }

    SamlSettings.methods.toggleNewSamlSettingsModalStatus.call(ctx, false)
    expect(ctx.selectedRow).toBeNull()
    expect(ctx.isEditOrNewModalOpen).toBe(true)

    const editCtx = {
      selectedRow: null,
      toggleNewSamlSettingsModalStatus: jest.fn()
    }
    SamlSettings.methods.handleEditAction.call(editCtx, { resourceId: 'r1' })
    expect(editCtx.selectedRow).toEqual({ resourceId: 'r1' })
    expect(editCtx.toggleNewSamlSettingsModalStatus).toHaveBeenCalledWith(true)
  })

  it('callForData maps response into table and pagination props', async () => {
    searchSamlSettings.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: '1' }],
          totalNumberOfRecords: 12,
          totalNumberOfPages: 3,
          pageNumber: 2
        }
      }
    })
    const ctx = {
      loading: false,
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 },
      tableData: []
    }

    SamlSettings.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchSamlSettings).toHaveBeenCalledWith({})
    expect(ctx.tableData).toEqual([{ resourceId: '1' }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(12)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(3)
    expect(ctx.serverSideProps.pageNumber).toBe(2)
    expect(ctx.loading).toBe(false)
  })

  it('exportSamlSettings maps XLS to Excel and triggers download helper', async () => {
    exportSamlSettings.mockResolvedValue({ data: { file: true } })
    const ctx = {
      axiosPayload: { orderBy: 'name', ascending: true, filter: { FilterGroups: [] } }
    }
    SamlSettings.methods.exportSamlSettings.call(ctx, {
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false,
      exportTypes: ['XLS', 'CSV']
    })
    await flushPromises()

    expect(exportSamlSettings).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(exportSamlSettings).toHaveBeenCalledWith(expect.objectContaining({ exportType: 'CSV' }))
    expect(downloadExportedFile).toHaveBeenCalledTimes(2)
  })
})
