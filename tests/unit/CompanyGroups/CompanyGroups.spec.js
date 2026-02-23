import { createLocalVue, shallowMount } from '@vue/test-utils'
import CompanyGroupList from '@/components/CompanyGroups/CompanyGroupList'

describe('CompanyGroups.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(CompanyGroupList, {
      localVue,
      stubs: {
        Datatable: true,
        DeleteModal: true,
        CreateItemModal: true
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getCompanyGroupsCreatePermissions': true,
            'permissions/getCompanyGroupsEditPermissions': true,
            'permissions/getCompanyGroupsDeletePermissions': true
          }
        },
        $router: { push: jest.fn() }
      },
      methods: {
        callForData: jest.fn(),
        getTableState: jest.fn(() => null)
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('CompanyGroupList')
  })
})

