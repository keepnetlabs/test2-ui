jest.mock('@/api/dashboard', () => ({
  getAuditLogs: jest.fn(),
  exportAuditLog: jest.fn()
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ Value: 'x', FieldName: 'logDate', Operator: '>=' }]),
  columnFilterCleared: jest.fn(() => [])
}))

import Audit from '@/views/Audit.vue'
import { getAuditLogs, exportAuditLog } from '@/api/dashboard'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Audit.vue methods', () => {
  const { methods } = Audit

  beforeEach(() => {
    jest.clearAllMocks()
    getAuditLogs.mockResolvedValue({
      data: {
        data: {
          results: [{ id: 1 }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    exportAuditLog.mockResolvedValue({ data: new Uint8Array([99, 115, 118]) })
  })

  it('serverSidePageNumberChanged updates page number and calls getDatatableList', () => {
    const getDatatableList = jest.fn()
    const ctx = {
      bodyData: { pageNumber: 1 },
      getDatatableList
    }

    methods.serverSidePageNumberChanged.call(ctx, 5)

    expect(ctx.bodyData.pageNumber).toBe(5)
    expect(getDatatableList).toHaveBeenCalledTimes(1)
  })

  it('serverSideSizeChanged updates size, resets page and fetches', () => {
    const getDatatableList = jest.fn()
    const resetPageNumber = jest.fn()
    const ctx = {
      bodyData: { pageSize: 10 },
      serverSideProps: { pageSize: 10 },
      getDatatableList,
      resetPageNumber
    }

    methods.serverSideSizeChanged.call(ctx, 50)

    expect(ctx.bodyData.pageSize).toBe(50)
    expect(ctx.serverSideProps.pageSize).toBe(50)
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(getDatatableList).toHaveBeenCalledTimes(1)
  })

  it('resetPageNumber sets both payload and server-side page to 1', () => {
    const ctx = {
      bodyData: { pageNumber: 7 },
      serverSideProps: { pageNumber: 9 }
    }

    methods.resetPageNumber.call(ctx)

    expect(ctx.bodyData.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
  })

  it('handleSearchChange keeps only filterable fields and refreshes data', () => {
    const resetPageNumber = jest.fn()
    const getDatatableList = jest.fn()
    const ctx = {
      tableOptions: {
        columns: [
          { property: 'logDate', filterableType: 'date' },
          { property: 'username', filterableType: 'text' },
          { property: 'description' }
        ]
      },
      bodyData: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber,
      getDatatableList
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'LogDate', Value: '2025-01-01' },
              { FieldName: 'Description', Value: 'x' }
            ]
          }
        ]
      }
    }

    methods.handleSearchChange.call(ctx, searchFilter)

    expect(ctx.bodyData.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'LogDate', Value: '2025-01-01' }
    ])
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(getDatatableList).toHaveBeenCalledTimes(1)
  })

  it('sortChanged maps ascending order and triggers fetch', () => {
    const getDatatableList = jest.fn()
    const ctx = {
      bodyData: { ascending: false, orderBy: 'LogDate' },
      getDatatableList
    }

    methods.sortChanged.call(ctx, { order: 'ascending', prop: 'UserName' })

    expect(ctx.bodyData.ascending).toBe(true)
    expect(ctx.bodyData.orderBy).toBe('UserName')
    expect(getDatatableList).toHaveBeenCalledTimes(1)
  })

  it('getDatatableList updates table and server props and clears loading', async () => {
    const ctx = {
      loading: false,
      bodyData: {},
      tableData: [],
      serverSideProps: {}
    }

    methods.getDatatableList.call(ctx)
    await flushPromises()

    expect(getAuditLogs).toHaveBeenCalledWith(ctx.bodyData)
    expect(ctx.tableData).toEqual([{ id: 1 }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.loading).toBe(false)
  })

  it('columnFilterChanged and columnFilterCleared use helper outputs then fetch', () => {
    const getDatatableList = jest.fn()
    const ctx = {
      bodyData: {
        filter: {
          FilterGroups: [{ FilterItems: [{ Value: '', FieldName: 'logDate', Operator: '>=' }] }]
        }
      },
      getDatatableList
    }

    methods.columnFilterChanged.call(ctx, { field: 'x' })
    expect(columnFilterChanged).toHaveBeenCalled()
    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems).toEqual([
      { Value: 'x', FieldName: 'logDate', Operator: '>=' }
    ])

    methods.columnFilterCleared.call(ctx, 'logDate')
    expect(columnFilterCleared).toHaveBeenCalledWith('logDate', ctx.bodyData)
    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems).toEqual([])
    expect(getDatatableList).toHaveBeenCalledTimes(2)
  })

  it('exportAuditLog maps XLS to Excel and creates download link', async () => {
    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
    const createObjectURLSpy = jest
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue('blob:mock')
    const ctx = {
      bodyData: {
        orderBy: 'LogDate',
        ascending: false,
        filter: { FilterGroups: [{}, {}] }
      }
    }

    methods.exportAuditLog.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 25
    })
    await flushPromises()

    expect(exportAuditLog).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel', pageSize: 25 })
    )
    expect(exportAuditLog).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(link.click).toHaveBeenCalledTimes(2)
    expect(link.download).toBe('Audit Log.csv')

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })
})
