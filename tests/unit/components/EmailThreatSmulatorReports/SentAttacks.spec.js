jest.mock('@/api/emailThreatSimlator', () => ({
  __esModule: true,
  getQuickScanReportList: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ quickScanItemResourceId: 'q1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportQuickScanReportList: jest.fn(() => Promise.resolve({ data: 'mock-file' })),
  getLookupNameList: jest.fn(() =>
    Promise.resolve({ data: { data: [{ id: 1, name: 'PluginCategory' }] } })
  )
}))

jest.mock('@/api/common', () => ({
  __esModule: true,
  getLookupListByTypeId: jest.fn(() => Promise.resolve({ data: { data: [{ name: 'Malware' }] } }))
}))

import SentAttacks from '@/components/EmailThreatSmulatorReports/SentAttacks.vue'
import { getQuickScanReportList, exportQuickScanReportList } from '@/api/emailThreatSimlator'

describe('SentAttacks.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(SentAttacks.name).toBe('SentAttacks')
  })

  it('setStatusColor returns correct colors by severity ranges', () => {
    expect(SentAttacks.methods.setStatusColor.call({}, 5)).toContain('#0198AC')
    expect(SentAttacks.methods.setStatusColor.call({}, 6)).toContain('#B6791D')
    expect(SentAttacks.methods.setStatusColor.call({}, 8)).toContain('#B83A3A')
    expect(SentAttacks.methods.setStatusColor.call({}, 3)).toContain('#1173C1')
  })

  it('handleSearchChange updates filters and refreshes list', () => {
    const ctx = {
      bodyData: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      getDatatableList: jest.fn()
    }
    SentAttacks.methods.handleSearchChange.call(ctx, {
      filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'hash', Value: 'x' }] }] }
    })
    expect(ctx.bodyData.filter.FilterGroups[1].FilterItems).toHaveLength(1)
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.getDatatableList).toHaveBeenCalled()
  })

  it('getDatatableList fetches and sets table data when permission exists', async () => {
    const ctx = {
      loading: false,
      getEtsQuickScanReportPermissionSearch: true,
      bodyData: { filter: {} },
      qcsResourceId: 'id1',
      serverSideProps: {},
      tableData: [],
      $router: { push: jest.fn() }
    }
    SentAttacks.methods.getDatatableList.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(getQuickScanReportList).toHaveBeenCalledWith(ctx.bodyData, 'id1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ quickScanItemResourceId: 'q1' }])
  })

  it('getDatatableList redirects when no permission', () => {
    const ctx = {
      loading: false,
      getEtsQuickScanReportPermissionSearch: false,
      $router: { push: jest.fn() }
    }
    SentAttacks.methods.getDatatableList.call(ctx)
    expect(ctx.$router.push).toHaveBeenCalledWith('/')
  })

  it('exportTableData creates downloadable file', async () => {
    const link = { click: jest.fn() }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const prevCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url')
    const ctx = {
      qcsResourceId: 'id1',
      bodyData: { filter: {} }
    }
    SentAttacks.methods.exportTableData.call(ctx, {
      exportTypes: ['XLS'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(exportQuickScanReportList).toHaveBeenCalled()
    expect(link.download).toBe('SentAttacks.xlsx')
    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = prevCreateObjectURL
  })
})
