jest.mock('@/api/restApi', () => ({
  __esModule: true,
  searchRestApi: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ resourceId: 'r1', clientName: 'Client A', statusName: 'Active' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportRestApi: jest.fn(() => Promise.resolve({ data: 'mock-file' })),
  deleteRestApi: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => ({
  __esModule: true,
  getDefaultAxiosPayload: jest.fn(() => ({
    orderBy: 'createTime',
    ascending: false,
    filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
  })),
  createRandomCryptStringNumber: jest.fn(() => 'abc123'),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  cancellableAxiosRequest: jest.fn((fn) => fn)
}))

import CustomApi from '@/components/Company Settings/RestApi/CustomApi.vue'
import { searchRestApi, deleteRestApi, exportRestApi } from '@/api/restApi'

describe('CustomApi.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CustomApi.name).toBe('CustomApi')
  })

  it('callForData sets table data and server-side totals', async () => {
    const ctx = {
      loading: false,
      axiosPayload: { filter: {} },
      tableData: [],
      serverSideProps: {}
    }
    CustomApi.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(searchRestApi).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'r1', clientName: 'Client A', statusName: 'Active' }])
    expect(ctx.loading).toBe(false)
  })

  it('sortChanged maps statusName to StatusId and refreshes', () => {
    const ctx = {
      axiosPayload: {},
      callForData: jest.fn()
    }
    CustomApi.methods.sortChanged.call(ctx, { order: 'ascending', prop: 'statusName' })
    expect(ctx.axiosPayload.ascending).toBe(true)
    expect(ctx.axiosPayload.orderBy).toBe('StatusId')
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleSearchChange remaps StatusName filter field', () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    CustomApi.methods.handleSearchChange.call(ctx, {
      filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'StatusName', Value: '1' }] }] }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems[0].FieldName).toBe('StatusId')
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleDeleteCustomApi calls api and refreshes after unselect', async () => {
    const ctx = {
      selectedRow: { resourceId: 'r1' },
      saveDisableDelete: false,
      $refs: { refCustomApiList: { unSelectRow: jest.fn() } },
      toggleShowDeleteCustomApi: jest.fn(),
      callForData: jest.fn()
    }
    CustomApi.methods.handleDeleteCustomApi.call(ctx, 'r1')
    await Promise.resolve()
    await Promise.resolve()
    expect(deleteRestApi).toHaveBeenCalledWith('r1')
    expect(ctx.$refs.refCustomApiList.unSelectRow).toHaveBeenCalledWith(ctx.selectedRow)
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.saveDisableDelete).toBe(false)
  })

  it('exportRestApi triggers export call', async () => {
    const createdLink = { click: jest.fn() }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(createdLink)
    const prevCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url')
    const ctx = { axiosPayload: { orderBy: 'x', ascending: true, filter: {} } }
    CustomApi.methods.exportRestApi.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(exportRestApi).toHaveBeenCalled()
    expect(createdLink.download).toBe('Rest Api.csv')
    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = prevCreateObjectURL
  })
})
