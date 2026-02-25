jest.mock('@/api/company', () => ({
  __esModule: true,
  searchCompanyGroups: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ resourceId: 'g1', name: 'Group 1', companyCount: 2 }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  exportCompanyGroup: jest.fn(() => Promise.resolve({ data: 'mock-file' })),
  deleteCompanyGroup: jest.fn(() => Promise.resolve({ data: { message: 'ok' } })),
  bulkDeleteCompanyGroups: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => ({
  __esModule: true,
  createRandomCryptStringNumber: jest.fn(() => 'rnd'),
  getDefaultAxiosPayload: jest.fn(() => ({ orderBy: 'CreateTime', ascending: false, filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } })),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  cancellableAxiosRequest: jest.fn((fn) => fn)
}))

import CompanyGroupList from '@/components/CompanyGroups/CompanyGroupList.vue'
import {
  searchCompanyGroups,
  exportCompanyGroup,
  deleteCompanyGroup,
  bulkDeleteCompanyGroups
} from '@/api/company'

describe('CompanyGroupList.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(CompanyGroupList.name).toBe('CompanyGroupList')
  })

  it('callForData populates table and server side props', async () => {
    const ctx = {
      axiosPayload: { filter: {} },
      loading: false,
      serverSideProps: {},
      tableData: []
    }
    CompanyGroupList.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(searchCompanyGroups).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'g1', name: 'Group 1', companyCount: 2 }])
    expect(ctx.loading).toBe(false)
  })

  it('addFiltersToPayload appends between and normal operators', () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } }
    }
    CompanyGroupList.methods.addFiltersToPayload.call(ctx, {
      createTime: { selectValue: 'between', textValue: ['2026-01-01', '2026-02-01'] },
      name: { selectValue: 'contains', textValue: 'Group' }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { Value: '2026-01-01', FieldName: 'createTime', Operator: '>=' },
      { Value: '2026-02-01', FieldName: 'createTime', Operator: '<=' },
      { Value: 'Group', FieldName: 'name', Operator: 'contains' }
    ])
  })

  it('handleMultipleDeleteOfCompanyGroups sets payload and opens modal', () => {
    const ctx = {
      axiosPayload: { filter: { x: 1 } },
      serverSideProps: { totalNumberOfRecords: 50 },
      changeDeleteModalStatus: jest.fn()
    }
    CompanyGroupList.methods.handleMultipleDeleteOfCompanyGroups.call(
      ctx,
      [{ resourceId: 'g1' }, { resourceId: 'g2' }],
      ['g3'],
      false
    )
    expect(ctx.multipleDeletePayload).toEqual({
      items: ['g1', 'g2'],
      excludedItems: ['g3'],
      selectAll: false,
      filter: { x: 1 }
    })
    expect(ctx.multipleDeleteGroupCount).toBe(2)
    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.changeDeleteModalStatus).toHaveBeenCalledWith(true)
  })

  it('deleteConfirmedItem unselects and refreshes on success', async () => {
    const ctx = {
      $refs: {
        refGroupDataList: {
          unSelectRow: jest.fn(),
          changeServerSideSelectionCount: jest.fn()
        }
      },
      callForData: jest.fn()
    }
    const selectedItem = { resourceId: 'g1' }
    CompanyGroupList.methods.deleteConfirmedItem.call(ctx, selectedItem)
    await Promise.resolve()
    await Promise.resolve()
    expect(deleteCompanyGroup).toHaveBeenCalledWith('g1')
    expect(ctx.$refs.refGroupDataList.unSelectRow).toHaveBeenCalledWith(selectedItem)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('deleteMultipleConfirmedItems resets selection and refreshes', async () => {
    const ctx = {
      isDeleting: false,
      multipleDeletePayload: { items: ['g1'] },
      $refs: { refGroupDataList: { resetSelectableParams: jest.fn() } },
      callForData: jest.fn()
    }
    CompanyGroupList.methods.deleteMultipleConfirmedItems.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(bulkDeleteCompanyGroups).toHaveBeenCalledWith({ items: ['g1'] })
    expect(ctx.$refs.refGroupDataList.resetSelectableParams).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.isDeleting).toBe(false)
  })

  it('goToDetails stores identifiers and routes to details page', () => {
    const push = jest.fn()
    const ctx = { $router: { push } }
    CompanyGroupList.methods.goToDetails.call(ctx, { name: 'Group X', resourceId: 'gx' })
    expect(localStorage.getItem('companyGroupName')).toBe('Group X')
    expect(localStorage.getItem('companyGroupResourceId')).toBe('gx')
    expect(push).toHaveBeenCalledWith({
      name: 'Company Group Details',
      params: { groupId: 'gx' }
    })
  })

  it('handleTableDownload triggers export call', async () => {
    const createdLink = { click: jest.fn() }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(createdLink)
    const prevCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url')
    const ctx = {
      axiosPayload: { orderBy: 'CreateTime', ascending: false, filter: {} }
    }
    CompanyGroupList.methods.handleTableDownload.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(exportCompanyGroup).toHaveBeenCalled()
    expect(createdLink.download).toBe('Company Groups.csv')
    expect(createdLink.click).toHaveBeenCalled()
    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = prevCreateObjectURL
  })
})
