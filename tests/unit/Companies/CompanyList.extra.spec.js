import { shallowMount } from '@vue/test-utils'
import CompanyList from '@/components/Companies/CompanyList.vue'
import { searchCompanies, deleteCompany } from '@/api/company'
import { handleIsSafari, setSafariClusterFix } from '@/utils/functions'

jest.mock('@/api/company', () => ({
  searchCompanies: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          limitExceededCompanyCount: 1,
          results: [{ companyResourceId: 'c-1', companyName: 'Acme' }]
        }
      }
    })
  ),
  getCompanyByID: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  deleteCompany: jest.fn(() => Promise.resolve({ data: { message: 'ok' } })),
  exportCompanies: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
  bulkDeleteCompanies: jest.fn(() => Promise.resolve())
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getMultiple: jest.fn(() => Promise.resolve([]))
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => []),
  columnFilterCleared: jest.fn(() => [])
}))

jest.mock('@/utils/functions', () => ({
  getDefaultAxiosPayload: jest.fn((props = {}) => ({
    pageNumber: 1,
    pageSize: 10,
    orderBy: 'CreateTime',
    ascending: false,
    filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] },
    ...props
  })),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  cancellableAxiosRequest: jest.fn((fn) => fn),
  createRandomCryptStringNumber: jest.fn(() => 'rnd-company-list'),
  handleIsSafari: jest.fn(() => false),
  setSafariClusterFix: jest.fn(() => 'safari-cell')
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CompanyList.vue (extra)', () => {
  const DatatableStub = {
    name: 'Datatable',
    template: '<div />',
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
  })

  it('created adds safari cell-class handler when safari is detected', async () => {
    handleIsSafari.mockReturnValueOnce(true)
    const wrapper = createWrapper()
    await flushPromises()

    expect(handleIsSafari).toHaveBeenCalled()
    expect(typeof wrapper.vm.bindPropsIsSafari.handleSetCellClass).toBe('function')
    const out = wrapper.vm.bindPropsIsSafari.handleSetCellClass({ row: { companyName: 'Acme' } })
    expect(setSafariClusterFix).toHaveBeenCalledWith(
      { row: { companyName: 'Acme' } },
      'companyName'
    )
    expect(out).toBe('safari-cell')
  })

  it('getTableData enables alertbox when exceeded-limit count exists and filter is not active', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    searchCompanies.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          limitExceededCompanyCount: 3,
          results: [{ companyResourceId: 'c-1', companyName: 'A' }]
        }
      }
    })
    wrapper.vm.isTargetUserCountExceedLimit = false
    wrapper.vm.canRenderAlertbox = false

    wrapper.vm.getTableData()
    await flushPromises()

    expect(wrapper.vm.limitExceededCompanyCount).toBe(3)
    expect(wrapper.vm.isExceedingLimitFilterDisabled).toBe(false)
    expect(wrapper.vm.canRenderAlertbox).toBe(true)
  })

  it('getTableData keeps alertbox hidden when exceeded-limit filter is already active', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    searchCompanies.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          limitExceededCompanyCount: 5,
          results: [{ companyResourceId: 'c-2', companyName: 'B' }]
        }
      }
    })
    wrapper.vm.isTargetUserCountExceedLimit = true
    wrapper.vm.canRenderAlertbox = false

    wrapper.vm.getTableData()
    await flushPromises()

    expect(wrapper.vm.limitExceededCompanyCount).toBe(5)
    expect(wrapper.vm.canRenderAlertbox).toBe(false)
  })

  it('deleteConfirmedItem does not refresh table when api response has no message', async () => {
    deleteCompany.mockResolvedValueOnce({ data: {} })
    const wrapper = createWrapper()
    await flushPromises()
    const unSelectRow = jest.fn()
    const changeServerSideSelectionCount = jest.fn()
    wrapper.vm.$refs.refDataList = { unSelectRow, changeServerSideSelectionCount }
    wrapper.vm.getTableData = jest.fn()
    wrapper.vm.selectedRow = { companyResourceId: 'c-1' }

    wrapper.vm.deleteConfirmedItem()
    await flushPromises()

    expect(deleteCompany).toHaveBeenCalledWith('c-1')
    expect(unSelectRow).toHaveBeenCalled()
    expect(changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
    expect(wrapper.vm.getTableData).not.toHaveBeenCalled()
  })
})
