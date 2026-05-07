import { shallowMount } from '@vue/test-utils'
import AddCompaniesToCompanyGroup from '@/components/CompanyGroups/AddCompaniesToCompanyGroup.vue'

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

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

/**
 * @/utils/helperFunctions mock'lanmaz: prod'daki gibi gerçek mixin + searchFilterNormalize.
 * (AddCompaniesToCompanyGroup.spec.js kısmi mock kullanmaya devam eder.)
 */
describe('AddCompaniesToCompanyGroup search payload (integration)', () => {
  const createWrapper = () =>
    shallowMount(AddCompaniesToCompanyGroup, {
      propsData: {
        status: true,
        selectedGroup: { resourceId: 'g-1', name: 'Group 1' }
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
  })

  it('handleSearchChange maps TotalDuration to DurationMinutes on real axiosPayload', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.callForData = jest.fn()

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'TotalDuration', Operator: 'Contains', Value: '12' },
              { FieldName: 'CompanyName', Operator: 'Contains', Value: 'ac' }
            ]
          }
        ],
        SearchInputTextValue: 'ac'
      }
    })

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '12' },
      { FieldName: 'CompanyName', Operator: 'Contains', Value: 'ac' }
    ])
    expect(wrapper.vm.axiosPayload.filter.SearchInputTextValue).toBe('ac')
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })
})
