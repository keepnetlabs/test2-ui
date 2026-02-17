import { shallowMount } from '@vue/test-utils'
import AddCompaniesToCompanyGroup from '@/components/CompanyGroups/AddCompaniesToCompanyGroup.vue'
import { addCompanyToCompanyGroup, searchCompanies } from '@/api/company'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

jest.mock('@/api/company', () => ({
  addCompanyToCompanyGroup: jest.fn(() => Promise.resolve()),
  searchCompanies: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ companyResourceId: 'c-1', companyName: 'Acme' }],
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
    getMultiple: jest.fn(() =>
      Promise.resolve([
        { genericCodeTypeId: 2, name: 'Industry A', resourceId: 'i-1' },
        { genericCodeTypeId: 3, name: 'License A', resourceId: 'l-1' }
      ])
    )
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ FieldName: 'companyName', Operator: 'Contains', Value: 'acme' }]),
  columnFilterCleared: jest.fn(() => [])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AddCompaniesToCompanyGroup.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AddCompaniesToCompanyGroup, {
      propsData: {
        status: true,
        selectedGroup: { resourceId: 'g-1', name: 'Group 1' },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        DataTable: true,
        AppDialogFooter: true
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getCompaniesCreatePermissions': true,
            'permissions/getCompaniesEditPermissions': true,
            'permissions/getCompanyGroupsSearchPermissions': true,
            'permissions/getCompaniesSearchPermissions': true,
            'permissions/getCompaniesDeletePermissions': true
          }
        },
        $router: { go: jest.fn() }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('AddCompaniesToCompanyGroup')
  })

  it('computes title from selectedGroup name', () => {
    const wrapper = createWrapper({ selectedGroup: { resourceId: 'g-2', name: 'Blue Team' } })
    expect(wrapper.vm.getTitle).toBe('Add companies to Blue Team')
  })

  it('loads lookup and table data on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(LookupLocalStorage.getMultiple).toHaveBeenCalledWith([2, 3])
    expect(searchCompanies).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toEqual([{ companyResourceId: 'c-1', companyName: 'Acme' }])
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(1)
  })

  it('sets empty table data when searchCompanies fails', async () => {
    searchCompanies.mockRejectedValueOnce(new Error('network'))
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('handleSelectionChange updates selectedArray', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleSelectionChange([{ companyResourceId: 'c-9' }])
    expect(wrapper.vm.selectedArray).toEqual([{ companyResourceId: 'c-9' }])
  })

  it('confirm calls api with selected company ids and emits close-overlay-with-update', async () => {
    const wrapper = createWrapper({ selectedGroup: { resourceId: 'g-1', name: 'Group 1' } })
    wrapper.vm.selectedArray = [{ companyResourceId: 'c-1' }, { companyResourceId: 'c-2' }]

    wrapper.vm.confirm()
    await flushPromises()

    expect(addCompanyToCompanyGroup).toHaveBeenCalledWith('g-1', {
      companyResourceIdArray: ['c-1', 'c-2']
    })
    expect(wrapper.emitted('close-overlay-with-update')).toBeTruthy()
    expect(wrapper.vm.saveDisable).toBe(false)
  })

  it('closeOverlay emits close-overlay', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeOverlay()
    expect(wrapper.emitted('close-overlay')).toEqual([[]])
  })

  it('mixin server side handlers mutate payload and trigger callForData', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.serverSidePageNumberChanged(3)
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(3)

    wrapper.vm.serverSideSizeChanged(15)
    expect(wrapper.vm.axiosPayload.pageSize).toBe(15)
    expect(wrapper.vm.serverSideProps.pageSize).toBe(15)
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(1)

    wrapper.vm.sortChanged({ order: 'ascending', prop: 'companyName' })
    expect(wrapper.vm.axiosPayload.ascending).toBe(true)
    expect(wrapper.vm.axiosPayload.orderBy).toBe('companyName')
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('mixin search and filter handlers update payload and callForData', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'name', Operator: 'Contains', Value: 'ac' }] }],
        SearchInputTextValue: 'ac'
      }
    })
    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'name', Operator: 'Contains', Value: 'ac' }
    ])
    expect(wrapper.vm.axiosPayload.filter.SearchInputTextValue).toBe('ac')

    wrapper.vm.columnFilterChanged({ fieldName: 'companyName' })
    expect(columnFilterChanged).toHaveBeenCalled()
    expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toHaveLength(1)

    wrapper.vm.columnFilterCleared('companyName')
    expect(columnFilterCleared).toHaveBeenCalled()
    expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
  })

  it('handleSwitchCompany stores values and reloads route', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleSwitchCompany({ companyResourceId: 'c-55', companyName: 'Switch Inc' })

    expect(wrapper.vm.$router.go).toHaveBeenCalledWith(0)
    expect(localStorage.getItem('companyId')).toBe('c-55')
    expect(localStorage.getItem('selectedCompanyName')).toBe('Switch Inc')
  })
})
