jest.mock('@/api/company', () => ({
  searchCompanyGroups: jest.fn(),
  exportCompanyGroup: jest.fn(),
  deleteCompanyGroup: jest.fn(),
  bulkDeleteCompanyGroups: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    createRandomCryptStringNumber: jest.fn(() => '123'),
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'createTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import CompanyGroupList from '@/components/CompanyGroups/CompanyGroupList'
import {
  searchCompanyGroups,
  exportCompanyGroup,
  deleteCompanyGroup,
  bulkDeleteCompanyGroups
} from '@/api/company'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CompanyGroupList.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData maps paging and table rows', async () => {
    searchCompanyGroups.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'g1', name: 'Group1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      loading: false,
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: []
    }
    CompanyGroupList.methods.callForData.call(ctx)
    await flushPromises()

    expect(searchCompanyGroups).toHaveBeenCalledWith({})
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'g1', name: 'Group1' }])
    expect(ctx.loading).toBe(false)
  })

  it('addFiltersToPayload returns early when filter object is empty', () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } }
    }

    CompanyGroupList.methods.addFiltersToPayload.call(ctx, {})

    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
  })

  it('addFiltersToPayload handles between and single operator filters', () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } }
    }
    CompanyGroupList.methods.addFiltersToPayload.call(ctx, {
      createTime: { selectValue: 'between', textValue: ['2026-01-01', '2026-02-01'] },
      name: { selectValue: 'Contains', textValue: 'acme' }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { Value: '2026-01-01', FieldName: 'createTime', Operator: '>=' },
      { Value: '2026-02-01', FieldName: 'createTime', Operator: '<=' },
      { Value: 'acme', FieldName: 'name', Operator: 'Contains' }
    ])
  })

  it('handleSearchChange filters by available column filterableType and refreshes', () => {
    const ctx = {
      tableOptions: {
        columns: [
          { property: 'name', filterableType: 'text' },
          { property: 'unknown', filterableType: null }
        ]
      },
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    CompanyGroupList.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'name', Value: 'abc' },
              { FieldName: 'unknown', Value: 'x' }
            ]
          }
        ]
      }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'name', Value: 'abc' }
    ])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleTableDownload exports files with extension mapping', async () => {
    exportCompanyGroup.mockResolvedValue({ data: Buffer.from('x') })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:cg')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })

    const ctx = {
      axiosPayload: { orderBy: 'createTime', ascending: false, filter: { FilterGroups: [] } }
    }
    CompanyGroupList.methods.handleTableDownload.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCompanyGroup).toHaveBeenCalledTimes(2)
    expect(exportCompanyGroup.mock.calls[0][0]).toEqual(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(links[0].download).toBe('Company Groups.xlsx')
    expect(links[1].download).toBe('Company Groups.csv')

    window.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()
  })

  it('delete handlers and modal toggles update component state', async () => {
    deleteCompanyGroup.mockResolvedValue({ data: { message: 'ok' } })
    bulkDeleteCompanyGroups.mockResolvedValue({})
    const ref = {
      unSelectRow: jest.fn(),
      changeServerSideSelectionCount: jest.fn(),
      resetSelectableParams: jest.fn()
    }
    const ctx = {
      isMultipleDelete: false,
      isDeleting: false,
      isShowDeleteModal: false,
      isShowAddModal: false,
      selectedRow: null,
      multipleDeletePayload: {},
      multipleDeleteGroupCount: 0,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: { totalNumberOfRecords: 7 },
      $refs: { refGroupDataList: ref },
      callForData: jest.fn(),
      changeDeleteModalStatus: CompanyGroupList.methods.changeDeleteModalStatus
    }

    CompanyGroupList.methods.handleTableItemDelete.call(ctx, { resourceId: 'g1' })
    expect(ctx.isMultipleDelete).toBe(false)
    expect(ctx.isShowDeleteModal).toBe(true)

    CompanyGroupList.methods.deleteConfirmedItem.call(ctx, { resourceId: 'g1' })
    await flushPromises()
    expect(ref.unSelectRow).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()

    CompanyGroupList.methods.handleMultipleDeleteOfCompanyGroups.call(
      ctx,
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      ['c'],
      true
    )
    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletePayload.items).toEqual([])
    expect(ctx.multipleDeleteGroupCount).toBe(7)

    CompanyGroupList.methods.deleteMultipleConfirmedItems.call(ctx)
    await flushPromises()
    expect(bulkDeleteCompanyGroups).toHaveBeenCalledWith(ctx.multipleDeletePayload)
    expect(ref.resetSelectableParams).toHaveBeenCalled()
    expect(ctx.isDeleting).toBe(false)
  })

  it('deleteConfirmedItem does not refresh list when response message is missing', async () => {
    deleteCompanyGroup.mockResolvedValueOnce({ data: {} })
    const ctx = {
      $refs: { refGroupDataList: { unSelectRow: jest.fn(), changeServerSideSelectionCount: jest.fn() } },
      callForData: jest.fn()
    }

    CompanyGroupList.methods.deleteConfirmedItem.call(ctx, { resourceId: 'g2' })
    await flushPromises()

    expect(ctx.$refs.refGroupDataList.unSelectRow).toHaveBeenCalledWith({ resourceId: 'g2' })
    expect(ctx.$refs.refGroupDataList.changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
    expect(ctx.callForData).not.toHaveBeenCalled()
  })

  it('handleMultipleDeleteOfCompanyGroups uses selected item ids when selectAll is false', () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      serverSideProps: { totalNumberOfRecords: 99 },
      multipleDeletePayload: {},
      multipleDeleteGroupCount: 0,
      isMultipleDelete: false,
      isShowDeleteModal: false,
      changeDeleteModalStatus: CompanyGroupList.methods.changeDeleteModalStatus
    }

    CompanyGroupList.methods.handleMultipleDeleteOfCompanyGroups.call(
      ctx,
      [{ resourceId: 'a1' }, { resourceId: 'a2' }, { resourceId: 'a3' }],
      [],
      false
    )

    expect(ctx.multipleDeletePayload.items).toEqual(['a1', 'a2', 'a3'])
    expect(ctx.multipleDeleteGroupCount).toBe(3)
    expect(ctx.isShowDeleteModal).toBe(true)
  })

  it('add/edit/create/goToDetails helpers update state and route', () => {
    const push = jest.fn()
    const originalLocalStorage = window.localStorage
    const setItemSpy = jest.fn()
    Object.defineProperty(window, 'localStorage', {
      value: { setItem: setItemSpy },
      configurable: true
    })
    const ctx = {
      isShowAddModal: false,
      editAddModal: false,
      selectedRow: null,
      callForData: jest.fn(),
      $router: { push },
      changeAddModalStatus: CompanyGroupList.methods.changeAddModalStatus
    }
    CompanyGroupList.methods.addButton.call(ctx)
    expect(ctx.isShowAddModal).toBe(true)
    expect(ctx.editAddModal).toBe(false)

    CompanyGroupList.methods.editAction.call(ctx, { resourceId: 'r1' })
    expect(ctx.isShowAddModal).toBe(true)
    expect(ctx.editAddModal).toBe(true)
    expect(ctx.selectedRow).toEqual({ resourceId: 'r1' })

    CompanyGroupList.methods.companyGroupCreated.call(ctx)
    expect(ctx.selectedRow).toBe(null)
    expect(ctx.callForData).toHaveBeenCalled()

    CompanyGroupList.methods.goToDetails.call(ctx, { name: 'Group A', resourceId: 'g-1' })
    expect(setItemSpy).toHaveBeenCalledWith('companyGroupName', 'Group A')
    expect(setItemSpy).toHaveBeenCalledWith('companyGroupResourceId', 'g-1')
    expect(push).toHaveBeenCalledWith({
      name: 'Company Group Details',
      params: { groupId: 'g-1' }
    })
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage, configurable: true })
  })

  it('created branch with persisted table state maps persistent data', async () => {
    searchCompanyGroups.mockResolvedValue({
      data: {
        data: {
          results: [
            { resourceId: 'r1' },
            { resourceId: 'r2' },
            { resourceId: 'r3' }
          ]
        }
      }
    })
    const tableState = {
      rowCount: 2,
      currentPage: 2,
      filterValues: { name: { selectValue: 'Contains', textValue: 'a' } },
      multipleSelection: [{ resourceId: 'r2' }, { resourceId: 'x-missing' }],
      filteredData: [{ resourceId: 'r3' }],
      search: 'abc'
    }
    const ctx = {
      isLoadState: true,
      loading: false,
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      serverSideProps: {},
      tableState: null,
      tableKey: 'k1',
      addFiltersToPayload: CompanyGroupList.methods.addFiltersToPayload,
      getTableState: () => tableState,
      callForData: jest.fn()
    }
    CompanyGroupList.created.call(ctx)
    await flushPromises()

    expect(ctx.tableState).toEqual(
      expect.objectContaining({
        persistentState: expect.objectContaining({
          initialData: expect.any(Array),
          tableData: [{ resourceId: 'r3' }]
        })
      })
    )
    expect(ctx.tableKey).toContain('key-')
    expect(ctx.loading).toBe(false)
    expect(ctx.callForData).not.toHaveBeenCalled()
  })

  it('created falls back to callForData when persisted state is missing', () => {
    const ctx = {
      isLoadState: true,
      getTableState: jest.fn(() => null),
      callForData: jest.fn()
    }

    CompanyGroupList.created.call(ctx)

    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('created immediately calls callForData when load-state mode is disabled', () => {
    const ctx = {
      isLoadState: false,
      callForData: jest.fn()
    }

    CompanyGroupList.created.call(ctx)

    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('getTableState returns tableState from store when it exists', () => {
    const expected = { rowCount: 10 }
    const ctx = {
      $store: {
        state: {
          datatable: {
            tables: {
              CompanyGroups: { tableState: expected }
            }
          }
        }
      }
    }

    expect(CompanyGroupList.methods.getTableState.call(ctx)).toBe(expected)
  })

  it('getTableState returns undefined when state key is missing', () => {
    const ctx = {
      $store: {
        state: {
          datatable: {
            tables: {}
          }
        }
      }
    }

    expect(CompanyGroupList.methods.getTableState.call(ctx)).toBeUndefined()
  })

  it('beforeDestroy persists datatable state into store', () => {
    const dispatch = jest.fn()
    const ctx = {
      $refs: {
        refGroupDataList: {
          getState: jest.fn(() => ({ currentPage: 2 }))
        }
      },
      serverSideProps: { pageNumber: 2 },
      $store: { dispatch }
    }

    CompanyGroupList.beforeDestroy.call(ctx)

    expect(dispatch).toHaveBeenCalledWith('datatable/setTable', {
      key: 'CompanyGroups',
      tableState: {
        currentPage: 2,
        serverSideProps: { pageNumber: 2 }
      }
    })
  })
})
