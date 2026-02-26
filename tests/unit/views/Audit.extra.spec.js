jest.mock('@/api/dashboard', () => ({
  exportAuditLog: jest.fn(),
  getAuditLogs: jest.fn()
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(),
  columnFilterCleared: jest.fn()
}))

import Audit from '@/views/Audit.vue'
import { exportAuditLog, getAuditLogs } from '@/api/dashboard'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Audit.vue (extra branches)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created sets date filters and triggers datatable fetch', () => {
    const subtract = jest.fn(() => ({ format: jest.fn(() => '2026-02-01 00:00') }))
    const format = jest.fn(() => '2026-02-15 00:00')
    const moment = jest.fn(() => ({ subtract, format }))
    const ctx = {
      $moment: moment,
      bodyData: {
        filter: {
          FilterGroups: [
            {
              FilterItems: [{ Value: '' }, { Value: '' }]
            }
          ]
        }
      },
      getDatatableList: jest.fn()
    }

    Audit.created.call(ctx)

    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems[0].Value).toBe('2026-02-01 00:00')
    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems[1].Value).toBe('2026-02-15 00:00')
    expect(ctx.getDatatableList).toHaveBeenCalledTimes(1)
  })

  it('serverSidePageNumberChanged updates payload page and fetches data', () => {
    const ctx = {
      bodyData: { pageNumber: 1 },
      getDatatableList: jest.fn()
    }

    Audit.methods.serverSidePageNumberChanged.call(ctx, 4)

    expect(ctx.bodyData.pageNumber).toBe(4)
    expect(ctx.getDatatableList).toHaveBeenCalledTimes(1)
  })

  it('serverSideSizeChanged updates sizes, resets page and fetches', () => {
    const ctx = {
      bodyData: { pageSize: 10, pageNumber: 3 },
      serverSideProps: { pageSize: 10, pageNumber: 3 },
      resetPageNumber: jest.fn(function () {
        this.bodyData.pageNumber = 1
        this.serverSideProps.pageNumber = 1
      }),
      getDatatableList: jest.fn()
    }

    Audit.methods.serverSideSizeChanged.call(ctx, 25)

    expect(ctx.bodyData.pageSize).toBe(25)
    expect(ctx.serverSideProps.pageSize).toBe(25)
    expect(ctx.bodyData.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.getDatatableList).toHaveBeenCalledTimes(1)
  })

  it('resetPageNumber sets both payload and server props to first page', () => {
    const ctx = {
      bodyData: { pageNumber: 7 },
      serverSideProps: { pageNumber: 8 }
    }

    Audit.methods.resetPageNumber.call(ctx)

    expect(ctx.bodyData.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
  })

  it('handleSearchChange keeps only filterable columns and refreshes list', () => {
    const ctx = {
      tableOptions: {
        columns: [
          { property: 'UserName', filterableType: 'text' },
          { property: 'Description' },
          { property: 'IP', filterableType: 'text' }
        ]
      },
      bodyData: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber: jest.fn(),
      getDatatableList: jest.fn()
    }

    Audit.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'username', Value: 'alice' },
              { FieldName: 'description', Value: 'ignored' },
              { FieldName: 'ip', Value: '10.0.0.1' }
            ]
          }
        ]
      }
    })

    expect(ctx.bodyData.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'username', Value: 'alice' },
      { FieldName: 'ip', Value: '10.0.0.1' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalledTimes(1)
    expect(ctx.getDatatableList).toHaveBeenCalledTimes(1)
  })

  it('sortChanged updates ascending/orderBy and fetches', () => {
    const ctx = {
      bodyData: { ascending: true, orderBy: 'LogDate' },
      getDatatableList: jest.fn()
    }

    Audit.methods.sortChanged.call(ctx, { order: 'descending', prop: 'UserName' })
    expect(ctx.bodyData.ascending).toBe(false)
    expect(ctx.bodyData.orderBy).toBe('UserName')

    Audit.methods.sortChanged.call(ctx, { order: 'ascending', prop: 'LogDate' })
    expect(ctx.bodyData.ascending).toBe(true)
    expect(ctx.bodyData.orderBy).toBe('LogDate')
    expect(ctx.getDatatableList).toHaveBeenCalledTimes(2)
  })

  it('columnFilterChanged and columnFilterCleared update filter items and refresh list', () => {
    columnFilterChanged.mockReturnValueOnce([{ FieldName: 'UserName', Value: 'u' }])
    columnFilterCleared.mockReturnValueOnce([{ FieldName: 'IP', Value: 'x' }])

    const ctx = {
      bodyData: {
        filter: { FilterGroups: [{ FilterItems: [] }] }
      },
      getDatatableList: jest.fn()
    }

    Audit.methods.columnFilterChanged.call(ctx, { fieldName: 'UserName' })
    expect(columnFilterChanged).toHaveBeenCalledWith({ fieldName: 'UserName' }, ctx.bodyData)
    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'UserName', Value: 'u' }
    ])

    Audit.methods.columnFilterCleared.call(ctx, 'UserName')
    expect(columnFilterCleared).toHaveBeenCalledWith('UserName', ctx.bodyData)
    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'IP', Value: 'x' }
    ])
    expect(ctx.getDatatableList).toHaveBeenCalledTimes(2)
  })

  it('getDatatableList maps response to table data and pagination, then disables loading', async () => {
    getAuditLogs.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ id: 'a1' }],
          totalNumberOfRecords: 11,
          totalNumberOfPages: 2,
          pageNumber: 2
        }
      }
    })

    const ctx = {
      loading: false,
      bodyData: { pageNumber: 2 },
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      },
      tableData: []
    }

    Audit.methods.getDatatableList.call(ctx)
    await flushPromises()

    expect(ctx.loading).toBe(false)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(11)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.serverSideProps.pageNumber).toBe(2)
    expect(ctx.tableData).toEqual([{ id: 'a1' }])
  })

  it('exportAuditLog maps XLS to Excel and downloads with proper extensions', async () => {
    exportAuditLog.mockResolvedValue({ data: Buffer.from('f') })
    const click = jest.fn()
    const downloads = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { click }
      Object.defineProperty(link, 'download', {
        set: (v) => downloads.push(v)
      })
      return link
    })
    global.URL.createObjectURL = jest.fn(() => 'blob:mock')

    const ctx = {
      bodyData: {
        orderBy: 'LogDate',
        ascending: true,
        filter: { FilterGroups: [] }
      }
    }

    Audit.methods.exportAuditLog.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 20
    })

    await flushPromises()
    await flushPromises()

    expect(exportAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'Excel',
        reportAllPages: true,
        pageNumber: 1,
        pageSize: 20
      })
    )
    expect(exportAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'CSV'
      })
    )
    expect(click).toHaveBeenCalledTimes(2)
    expect(downloads).toEqual(expect.arrayContaining(['Audit Log.xlsx', 'Audit Log.csv']))

    createElementSpy.mockRestore()
  })
})
