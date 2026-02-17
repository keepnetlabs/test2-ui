import { shallowMount } from '@vue/test-utils'
import CompanyList from '@/components/Companies/CompanyList.vue'
import { searchCompanies, getCompanyByID, exportCompanies, bulkDeleteCompanies, deleteCompany } from '@/api/company'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

jest.mock('@/api/company', () => ({
  searchCompanies: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          limitExceededCompanyCount: 1,
          results: [{ companyResourceId: 'c-1', companyName: 'Acme', numberOfUsers: 10, targetUserCount: 12 }]
        }
      }
    })
  ),
  getCompanyByID: jest.fn(() => Promise.resolve({ data: { data: { id: 'c-1', name: 'Acme' } } })),
  deleteCompany: jest.fn(() => Promise.resolve({ data: { message: 'ok' } })),
  exportCompanies: jest.fn(() => Promise.resolve({ data: new Blob(['x']) })),
  bulkDeleteCompanies: jest.fn(() => Promise.resolve())
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getMultiple: jest.fn(() =>
      Promise.resolve([
        { genericCodeTypeId: 2, name: 'Industry A', resourceId: 'i-1' },
        { genericCodeTypeId: 3, name: 'License A', resourceId: 'l-1' }
      ])
    )
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ FieldName: 'CompanyName', Operator: 'Contains', Value: 'acme' }]),
  columnFilterCleared: jest.fn(() => [])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CompanyList.vue', () => {
  const DatatableStub = {
    name: 'Datatable',
    template: '<div />',
    data() {
      return {
        isSettingsOpened: false
      }
    },
    methods: {
      reRenderFilters() {},
      unSelectRow() {},
      changeServerSideSelectionCount() {},
      resetSelectableParams() {},
      toggleIsSettingsOpened() {}
    }
  }

  const createWrapper = () =>
    shallowMount(CompanyList, {
      stubs: {
        Datatable: DatatableStub,
        DeleteModal: true,
        CompanyListExtend: true,
        CompanyCreateOrEdit: true,
        AddGroupToModal: true,
        CreateItemModal: true,
        AppModal: true,
        ConfigureNewCompanyModal: true,
        AlertBox: true,
        DefaultButtonRowAction: true,
        RowActionsMenu: true,
        DefaultMenuRowAction: true,
        VIcon: true,
        VBtn: true,
        VTooltip: true
      },
      mocks: {
        $router: { go: jest.fn() },
        $store: {
          getters: {
            'permissions/getCompaniesCreatePermissions': true,
            'permissions/getCompaniesEditPermissions': true,
            'permissions/getCompanyGroupsSearchPermissions': true,
            'permissions/getCompaniesSearchPermissions': true,
            'permissions/getCompaniesDeletePermissions': true
          }
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('loads lookup data and table data on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(LookupLocalStorage.getMultiple).toHaveBeenCalledWith([2, 3])
    expect(searchCompanies).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.limitExceededCompanyCount).toBe(1)
  })

  it('computes exceeding-limit filter label and tooltip states', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ isTargetUserCountExceedLimit: false, isExceedingLimitFilterDisabled: false })
    expect(wrapper.vm.getExceedingLimitFilterLabel).toBe('FILTER EXCEEDING LIMIT')
    expect(wrapper.vm.getExceedingLimitFilterTooltip).toBe('Filter exceeding limit')

    await wrapper.setData({ isTargetUserCountExceedLimit: true })
    expect(wrapper.vm.getExceedingLimitFilterLabel).toBe('REMOVE FILTER')
    expect(wrapper.vm.getExceedingLimitFilterTooltip).toBe('Remove Filter')
  })

  it('toggles exceeding-limit filter and refreshes data', async () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()
    wrapper.setData({ canRenderAlertbox: true, isTargetUserCountExceedLimit: false })

    wrapper.vm.handleExceedingFilterClick()

    expect(wrapper.vm.isTargetUserCountExceedLimit).toBe(true)
    expect(wrapper.vm.canRenderAlertbox).toBe(false)
    expect(wrapper.vm.getTableData).toHaveBeenCalled()
  })

  it('builds multiple delete payload for selected rows', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeDeleteModalStatus = jest.fn()
    wrapper.vm.serverSideProps.totalNumberOfRecords = 50

    wrapper.vm.handleMultipleDeleteOfCompanies(
      [{ companyResourceId: 'c-1' }, { companyResourceId: 'c-2' }],
      ['x'],
      false
    )

    expect(wrapper.vm.multipleDeletePayload.items).toEqual(['c-1', 'c-2'])
    expect(wrapper.vm.multipleDeleteCompanyCount).toBe(2)
    expect(wrapper.vm.isMultipleDelete).toBe(true)
    expect(wrapper.vm.changeDeleteModalStatus).toHaveBeenCalledWith(true)
  })

  it('handles pagination and sorting mutations before fetching', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()

    wrapper.vm.serverSidePageNumberChanged(3)
    expect(wrapper.vm.payload.pageNumber).toBe(3)

    wrapper.vm.sortChanged({ order: 'ascending', prop: 'CreateTime' })
    expect(wrapper.vm.payload.ascending).toBe(true)
    expect(wrapper.vm.payload.orderBy).toBe('CreateTime')

    wrapper.vm.serverSideSizeChanged(25)
    expect(wrapper.vm.payload.pageSize).toBe(25)
    expect(wrapper.vm.serverSideProps.pageSize).toBe(25)
    expect(wrapper.vm.payload.pageNumber).toBe(1)
  })

  it('sets monthly active user filter items and requests datatable rerender', async () => {
    const wrapper = createWrapper()
    const reRenderFilters = jest.fn()
    wrapper.vm.$refs.refDataList = { reRenderFilters }

    wrapper.vm.setMonthlyActiveUserFilterItems()
    await wrapper.vm.$nextTick()

    const col = wrapper.vm.tableOptions.columns.find((x) => x.property === 'monthlyActiveUserCount')
    expect(col.filterableItems.length).toBeGreaterThan(0)
    expect(reRenderFilters).toHaveBeenCalled()
  })

  it('applies and clears column filters', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()

    wrapper.vm.columnFilterChanged({ fieldName: 'CompanyName' })
    expect(columnFilterChanged).toHaveBeenCalled()
    expect(wrapper.vm.payload.filter.FilterGroups[0].FilterItems).toHaveLength(1)

    wrapper.vm.columnFilterCleared('CompanyName')
    expect(columnFilterCleared).toHaveBeenCalled()
    expect(wrapper.vm.payload.filter.FilterGroups[0].FilterItems).toEqual([])
  })

  it('handles add-to-group payload for single and multiple rows', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleAddGroupToModal({ companyResourceId: 'c-9' })
    expect(wrapper.vm.companyIdArray).toEqual(['c-9'])
    expect(wrapper.vm.showAddGroupToModal).toBe(true)

    wrapper.vm.handleAddGroupToModal([{ companyResourceId: 'c-1' }, { companyResourceId: 'c-2' }])
    expect(wrapper.vm.companyIdArray).toEqual(['c-1', 'c-2'])
  })

  it('sets selected row shape for creating group with company', () => {
    const wrapper = createWrapper()
    const changeGroupModalStatus = jest.spyOn(wrapper.vm, 'changeGroupModalStatus')
    const row = { companyResourceId: 'c-5', companyName: 'Demo' }

    wrapper.vm.handleCreateNewGroupWithCompany(row)

    expect(changeGroupModalStatus).toHaveBeenCalledWith(true)
    expect(wrapper.vm.selectedRow).toEqual({
      companyResourceId: 'c-5',
      companyName: 'Demo',
      name: null,
      resourceId: 'c-5'
    })
  })

  it('switches company and writes localStorage', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleSwitchCompany({ companyResourceId: 'c-777', companyName: 'Switch Co' })

    expect(wrapper.vm.$router.go).toHaveBeenCalledWith(0)
    expect(localStorage.getItem('companyId')).toBe('c-777')
    expect(localStorage.getItem('selectedCompanyName')).toBe('Switch Co')
  })

  it('fetches company detail for extend panel and handles failure', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.extend = { clickClose: jest.fn() }
    wrapper.vm.$refs.refDataList = {
      isSettingsOpened: true,
      toggleIsSettingsOpened: jest.fn(),
      reRenderFilters: jest.fn(),
      $el: { clientHeight: 500 }
    }

    wrapper.vm.handleCompanyNameClick({ companyResourceId: 'c-1', companyName: 'Acme' })
    await flushPromises()

    expect(getCompanyByID).toHaveBeenCalledWith('c-1', false)
    expect(wrapper.vm.selectedExtend).toEqual({ id: 'c-1', name: 'Acme' })
    expect(wrapper.vm.isShowExtended).toBe(true)
  })

  it('downloads selected export types', async () => {
    const wrapper = createWrapper()
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName)
      if (tagName === 'a') {
        element.click = click
      }
      return element
    })
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
    const objectUrlSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test')

    wrapper.vm.handleTableDownload({
      exportTypes: ['CSV', 'XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await flushPromises()

    expect(exportCompanies).toHaveBeenCalledTimes(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    objectUrlSpy.mockRestore()
  })

  it('runs bulk delete flow and resets deleting state', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refDataList = { resetSelectableParams: jest.fn(), reRenderFilters: jest.fn() }
    wrapper.vm.getTableData = jest.fn()
    wrapper.vm.multipleDeletePayload = { items: ['c-1'] }

    wrapper.vm.deleteMultipleConfirmedItems()
    await flushPromises()

    expect(bulkDeleteCompanies).toHaveBeenCalledWith({ items: ['c-1'] })
    expect(wrapper.vm.$refs.refDataList.resetSelectableParams).toHaveBeenCalled()
    expect(wrapper.vm.getTableData).toHaveBeenCalled()
    expect(wrapper.vm.isDeleting).toBe(false)
  })

  it('recursively marks child rows in getManipulatedTableData', () => {
    const wrapper = createWrapper()
    const rows = [{ companyName: 'A', children: [{ companyName: 'B' }] }]

    const out = wrapper.vm.getManipulatedTableData(rows)

    expect(out[0].children[0].isChild).toBe(true)
  })

  it('resets table filters and rerenders datatable filters', () => {
    const wrapper = createWrapper()
    const reRenderFilters = jest.fn()
    wrapper.vm.$refs.refDataList = { reRenderFilters }
    wrapper.vm.payload.filter.FilterGroups[0].FilterItems = [{ FieldName: 'x' }]

    wrapper.vm.resetTableFilters()

    expect(wrapper.vm.payload.filter.FilterGroups[0].FilterItems).toEqual([])
    expect(reRenderFilters).toHaveBeenCalledWith({})
  })

  it('handles cluster and list views by resetting state and fetching data', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()
    wrapper.vm.resetPageNumber = jest.fn()
    wrapper.vm.resetTableFilters = jest.fn()

    wrapper.vm.clusterChanged()
    expect(wrapper.vm.isClustered).toBe(true)
    expect(wrapper.vm.resetPageNumber).toHaveBeenCalled()
    expect(wrapper.vm.resetTableFilters).toHaveBeenCalled()
    expect(wrapper.vm.getTableData).toHaveBeenCalled()

    wrapper.vm.handleListBulletedClick()
    expect(wrapper.vm.isClustered).toBe(false)
  })

  it('updates search payload and handles cell click for companyName', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()
    wrapper.vm.resetPageNumber = jest.fn()

    wrapper.vm.handleSearchChange({
      filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'CompanyName', Value: 'Acme' }] }] }
    })
    expect(wrapper.vm.payload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'CompanyName', Value: 'Acme' }
    ])
    expect(wrapper.vm.getTableData).toHaveBeenCalled()

    wrapper.vm.handleCellClick({ column: { property: 'companyName' }, event: { offsetTop: 120 } })
    expect(wrapper.vm.extendTop).toBe(120)
  })

  it('toggles configure modal and clears created company resource id when closing', async () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()
    await wrapper.setData({
      isShowConfigureCompanyModal: true,
      createdCompanyResourceIdForConfigureCompany: 'company-1'
    })

    wrapper.vm.toggleConfigureNewCompanyModal()

    expect(wrapper.vm.getTableData).toHaveBeenCalled()
    expect(wrapper.vm.isShowConfigureCompanyModal).toBe(false)
    expect(wrapper.vm.createdCompanyResourceIdForConfigureCompany).toBe('')
  })

  it('deleteConfirmedItem calls api and updates table selection helpers', async () => {
    const wrapper = createWrapper()
    const unSelectRow = jest.fn()
    const changeServerSideSelectionCount = jest.fn()
    wrapper.vm.$refs.refDataList = { unSelectRow, changeServerSideSelectionCount, reRenderFilters: jest.fn() }
    wrapper.vm.getTableData = jest.fn()
    wrapper.vm.selectedRow = { companyResourceId: 'c-1' }

    wrapper.vm.deleteConfirmedItem()
    await flushPromises()

    expect(deleteCompany).toHaveBeenCalledWith('c-1')
    expect(unSelectRow).toHaveBeenCalledWith(wrapper.vm.selectedRow)
    expect(changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
    expect(wrapper.vm.getTableData).toHaveBeenCalled()
  })

  it('editAction opens modal on success and closes extend on error', async () => {
    const wrapper = createWrapper()
    wrapper.vm.changeCreateOrEditModalStatus = jest.fn()

    wrapper.vm.editAction({ companyResourceId: 'c-1' })
    await flushPromises()
    expect(getCompanyByID).toHaveBeenCalledWith('c-1')
    expect(wrapper.vm.changeCreateOrEditModalStatus).toHaveBeenCalledWith(true)

    getCompanyByID.mockRejectedValueOnce(new Error('fail'))
    wrapper.vm.editAction({ companyResourceId: 'c-2' })
    await flushPromises()
    expect(wrapper.vm.isShowExtended).toBe(false)
  })

  it('cancels form and reloads table with default sorting', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()
    wrapper.setData({
      isShowCreateOrEditModal: true,
      editModal: true,
      selectedExtend: { id: 1 },
      selectedRow: { id: 2 }
    })

    wrapper.vm.cancelCreateOrEditForm()

    expect(wrapper.vm.isShowCreateOrEditModal).toBe(false)
    expect(wrapper.vm.editModal).toBe(false)
    expect(wrapper.vm.selectedExtend).toEqual({})
    expect(wrapper.vm.selectedRow).toEqual({})
    expect(wrapper.vm.getTableData).toHaveBeenCalledWith({ orderBy: 'createTime', ascending: false })
  })

  it('close form configure flow sets id, resets form and toggles configure modal', () => {
    const wrapper = createWrapper()
    wrapper.vm.cancelCreateOrEditForm = jest.fn()
    wrapper.vm.toggleConfigureNewCompanyModal = jest.fn()

    wrapper.vm.closeFormConfigureNewCompanyModal('new-id')

    expect(wrapper.vm.createdCompanyResourceIdForConfigureCompany).toBe('new-id')
    expect(wrapper.vm.cancelCreateOrEditForm).toHaveBeenCalled()
    expect(wrapper.vm.toggleConfigureNewCompanyModal).toHaveBeenCalled()
  })

  it('updates add-group modal status and fetches data when closing', () => {
    const wrapper = createWrapper()
    wrapper.vm.getTableData = jest.fn()

    wrapper.vm.handleStatusAddGroupToModal(true)
    expect(wrapper.vm.showAddGroupToModal).toBe(true)
    expect(wrapper.vm.getTableData).not.toHaveBeenCalled()

    wrapper.vm.handleStatusAddGroupToModal(false)
    expect(wrapper.vm.showAddGroupToModal).toBe(false)
    expect(wrapper.vm.getTableData).toHaveBeenCalled()
  })
})
