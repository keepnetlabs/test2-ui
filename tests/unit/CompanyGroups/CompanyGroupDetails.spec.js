jest.mock('@/api/company', () => ({
  exportCompanyGroupDetails: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
  getCompanyByID: jest.fn(() => Promise.resolve({ data: { data: { name: 'Acme Inc' } } })),
  removeCompanyToCompanyGroup: jest.fn(() => Promise.resolve({ data: { message: 'ok' } })),
  searchGroupCompanies: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ companyResourceId: 'c1', companyName: 'Acme' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn((code) =>
      Promise.resolve(
        code === 2
          ? [{ name: 'Industry A', resourceId: 'i1' }]
          : [{ name: 'License A', resourceId: 'l1' }]
      )
    )
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'createTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import CompanyGroupDetails from '@/components/CompanyGroups/CompanyGroupDetails.vue'
import {
  exportCompanyGroupDetails,
  getCompanyByID,
  removeCompanyToCompanyGroup,
  searchGroupCompanies
} from '@/api/company'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CompanyGroupDetails.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('created and groupId watcher call callForData', () => {
    const createdCtx = { callForData: jest.fn() }
    CompanyGroupDetails.created.call(createdCtx)
    expect(createdCtx.callForData).toHaveBeenCalled()

    const watchCtx = { callForData: jest.fn() }
    CompanyGroupDetails.watch.groupId.call(watchCtx)
    expect(watchCtx.callForData).toHaveBeenCalled()
  })

  it('isShowCreateOrEditModal watcher toggles overflow class', () => {
    const toggle = jest.fn()
    const oldQuery = document.querySelector
    document.querySelector = jest.fn(() => ({ classList: { toggle } }))
    CompanyGroupDetails.watch.isShowCreateOrEditModal.call({})
    expect(toggle).toHaveBeenCalledWith('overflow-y-hidden')
    document.querySelector = oldQuery
  })

  it('callForData chains lookups and then table data fetch', async () => {
    const ctx = {
      tableOptions: { columns: [{}, {}, {}] },
      $set: jest.fn((obj, key, val) => {
        obj[key] = val
      }),
      $refs: { refDataList: { reRenderFilters: jest.fn() } },
      getTableData: jest.fn(),
      getIndustries: CompanyGroupDetails.methods.getIndustries,
      getLicenceTypes: CompanyGroupDetails.methods.getLicenceTypes
    }
    CompanyGroupDetails.methods.callForData.call(ctx)
    await flushPromises()
    expect(LookupLocalStorage.getSingle).toHaveBeenCalledTimes(2)
    expect(ctx.getTableData).toHaveBeenCalled()
  })

  it('getIndustries and getLicenceTypes map lookup values into filter items', async () => {
    const ctx = {
      tableOptions: { columns: [{}, {}, {}] },
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      })
    }

    await CompanyGroupDetails.methods.getIndustries.call(ctx)
    await CompanyGroupDetails.methods.getLicenceTypes.call(ctx)

    expect(ctx.tableOptions.columns[1].filterableItems).toEqual([{ text: 'Industry A', value: 'i1' }])
    expect(ctx.tableOptions.columns[2].filterableItems).toEqual([{ text: 'License A', value: 'l1' }])
  })

  it('getTableData maps response and handles 403 fallback', async () => {
    const ctx = {
      loading: false,
      groupId: 'g1',
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      $router: { push: jest.fn() }
    }
    CompanyGroupDetails.methods.getTableData.call(ctx)
    await flushPromises()
    expect(searchGroupCompanies).toHaveBeenCalledWith('g1', {})
    expect(ctx.tableData).toEqual([{ companyResourceId: 'c1', companyName: 'Acme' }])

    searchGroupCompanies.mockRejectedValueOnce({ response: { status: 403 } })
    CompanyGroupDetails.methods.getTableData.call(ctx)
    await flushPromises()
    expect(ctx.$router.push).toHaveBeenCalledWith({
      name: 'Companies',
      params: { tab: 'second', force: true }
    })
    expect(ctx.tableData).toEqual([])
  })

  it('getTableData handles non-403 errors and resets table', async () => {
    searchGroupCompanies.mockRejectedValueOnce({ response: { status: 500 } })
    const ctx = {
      loading: false,
      groupId: 'g1',
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [{ companyResourceId: 'old' }],
      $router: { push: jest.fn() }
    }

    CompanyGroupDetails.methods.getTableData.call(ctx)
    await flushPromises()

    expect(ctx.$router.push).not.toHaveBeenCalled()
    expect(ctx.tableData).toEqual([])
    expect(ctx.loading).toBe(false)
  })

  it('download, remove and modal helpers work', async () => {
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:cgd')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })
    const ctx = {
      groupId: 'g1',
      $route: { params: { groupId: 'g1' } },
      axiosPayload: { orderBy: 'createTime', ascending: false, filter: { FilterGroups: [] } }
    }
    CompanyGroupDetails.methods.handleTableDownload.call(ctx, {
      exportTypes: ['XLS', 'PDF'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: true
    })
    await flushPromises()
    expect(exportCompanyGroupDetails).toHaveBeenCalledTimes(2)
    expect(links[0].download).toBe('Company Group Details.xlsx')
    expect(links[1].download).toBe('Company Group Details.pdf')
    globalThis.URL.createObjectURL = originalCreateObjectURL
    createElementSpy.mockRestore()

    const ref = { unSelectRow: jest.fn() }
    const removeCtx = {
      groupId: 'g1',
      removeModalDisable: false,
      $refs: { refDataList: ref },
      getTableData: jest.fn()
    }
    CompanyGroupDetails.methods.removeConfirmedItem.call(removeCtx, { companyResourceId: 'c1' })
    await flushPromises()
    expect(removeCompanyToCompanyGroup).toHaveBeenCalledWith('g1', {
      companyResourceIdArray: ['c1']
    })
    expect(ref.unSelectRow).toHaveBeenCalled()
    expect(removeCtx.getTableData).toHaveBeenCalled()
    expect(removeCtx.removeModalDisable).toBe(false)
  })

  it('handleTableDownload ignores export failures (catch branch)', async () => {
    exportCompanyGroupDetails.mockRejectedValueOnce(new Error('download-failed'))
    const createElementSpy = jest.spyOn(document, 'createElement')
    const ctx = {
      $route: { params: { groupId: 'g1' } },
      axiosPayload: { orderBy: 'createTime', ascending: false, filter: { FilterGroups: [] } }
    }

    CompanyGroupDetails.methods.handleTableDownload.call(ctx, {
      exportTypes: ['PDF'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCompanyGroupDetails).toHaveBeenCalled()
    expect(createElementSpy).not.toHaveBeenCalled()
    createElementSpy.mockRestore()
  })

  it('removeConfirmedItem does not refresh table when response has no message', async () => {
    removeCompanyToCompanyGroup.mockResolvedValueOnce({ data: {} })
    const removeCtx = {
      groupId: 'g1',
      removeModalDisable: false,
      $refs: { refDataList: { unSelectRow: jest.fn() } },
      getTableData: jest.fn()
    }

    CompanyGroupDetails.methods.removeConfirmedItem.call(removeCtx, { companyResourceId: 'c1' })
    await flushPromises()

    expect(removeCtx.$refs.refDataList.unSelectRow).toHaveBeenCalled()
    expect(removeCtx.getTableData).not.toHaveBeenCalled()
    expect(removeCtx.removeModalDisable).toBe(false)
  })

  it('row/dialog state methods update fields and emit expected navigation payloads', async () => {
    const ctx = {
      isShowRemoveModal: false,
      isShowCreateOrEditModal: false,
      selectedRow: {},
      selectedExtend: {},
      isShowExtended: true,
      companyIdArray: [],
      showAddGroupToModal: false,
      showCreateNewGroupWithCompany: false,
      editCreateGroup: true,
      forCompany: false,
      groupId: 'group-1',
      showAddCompanyModal: false,
      $router: { push: jest.fn() },
      getTableData: jest.fn(),
      changeRemoveModalStatus: CompanyGroupDetails.methods.changeRemoveModalStatus,
      changeCreateOrEditModalStatus: CompanyGroupDetails.methods.changeCreateOrEditModalStatus
    }

    CompanyGroupDetails.methods.handleTableItemRemove.call(ctx, { companyResourceId: 'c1' })
    expect(ctx.isShowRemoveModal).toBe(true)

    CompanyGroupDetails.methods.editAction.call(ctx, { companyResourceId: 'c1' })
    await flushPromises()
    expect(getCompanyByID).toHaveBeenCalledWith('c1')
    expect(ctx.isShowCreateOrEditModal).toBe(true)

    CompanyGroupDetails.methods.cancelCreateOrEditForm.call(ctx)
    expect(ctx.isShowCreateOrEditModal).toBe(false)
    expect(ctx.editModal).toBe(false)

    CompanyGroupDetails.methods.closeExtend.call(ctx)
    expect(ctx.isShowExtended).toBe(false)

    CompanyGroupDetails.methods.handleAddGroupToModal.call(ctx, [{ companyResourceId: 'c1' }])
    expect(ctx.companyIdArray).toEqual(['c1'])
    expect(ctx.showAddGroupToModal).toBe(true)

    CompanyGroupDetails.methods.handleStatusAddGroupToModal.call(ctx, false)
    expect(ctx.showAddGroupToModal).toBe(false)
    expect(ctx.getTableData).toHaveBeenCalled()

    CompanyGroupDetails.methods.handleCreateNewGroupWithCompany.call(ctx, {
      companyResourceId: 'c9'
    })
    expect(ctx.forCompany).toBe(true)
    expect(ctx.showCreateNewGroupWithCompany).toBe(true)

    CompanyGroupDetails.methods.handleCreateItemModal.call(ctx, false)
    expect(ctx.showCreateNewGroupWithCompany).toBe(false)

    CompanyGroupDetails.methods.addButton.call(ctx)
    expect(ctx.showAddCompanyModal).toBe(true)

    CompanyGroupDetails.methods.handleSubmit.call(ctx, 'g-new', 'New Group')
    expect(localStorage.getItem('companyGroupResourceId')).toBe('g-new')
    expect(ctx.$router.push).toHaveBeenCalledWith({
      name: 'Company Group Details',
      params: { groupId: 'g-new' }
    })
  })

  it('editAction catch branch keeps modal closed when getCompanyByID fails', async () => {
    getCompanyByID.mockRejectedValueOnce(new Error('failed'))
    const ctx = {
      selectedRow: null,
      editModal: false,
      isShowExtended: true,
      isShowCreateOrEditModal: false,
      changeCreateOrEditModalStatus: CompanyGroupDetails.methods.changeCreateOrEditModalStatus
    }

    CompanyGroupDetails.methods.editAction.call(ctx, { companyResourceId: 'c404' })
    await flushPromises()

    expect(ctx.selectedRow).toEqual({ companyResourceId: 'c404' })
    expect(ctx.isShowExtended).toBe(false)
    expect(ctx.isShowCreateOrEditModal).toBe(false)
  })

  it('toggle/close add-company modal helpers and single add-group flow', () => {
    const ctx = {
      showAddCompanyModal: false,
      showAddGroupToModal: false,
      companyIdArray: [],
      getTableData: jest.fn(),
      toggleShowAddCompanyModal: CompanyGroupDetails.methods.toggleShowAddCompanyModal
    }

    CompanyGroupDetails.methods.toggleShowAddCompanyModal.call(ctx)
    expect(ctx.showAddCompanyModal).toBe(true)
    CompanyGroupDetails.methods.closeAddCompanyModalWithUpdate.call(ctx)
    expect(ctx.getTableData).toHaveBeenCalled()
    expect(ctx.showAddCompanyModal).toBe(false)

    CompanyGroupDetails.methods.handleAddGroupToModal.call(ctx, { companyResourceId: 'single' })
    expect(ctx.companyIdArray).toEqual(['single'])
    expect(ctx.showAddGroupToModal).toBe(true)

    CompanyGroupDetails.methods.handleStatusAddGroupToModal.call(ctx, true)
    expect(ctx.showAddGroupToModal).toBe(true)
  })
})
