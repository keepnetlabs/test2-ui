import { createLocalVue, shallowMount } from '@vue/test-utils'
import Companies from '@/views/Companies'

describe('Companies.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (getterOverrides = {}) =>
    shallowMount(Companies, {
      localVue,
      stubs: {
        KContainer: true,
        CompanyList: true,
        CompanyGroupList: true,
        CompanyGroupDetails: true,
        'el-tabs': true,
        'el-tab-pane': true
      },
      mocks: {
        $route: { name: 'Companies', params: {} },
        $store: {
          getters: {
            'permissions/getCompaniesSearchPermissions': true,
            'permissions/getCompanyGroupsSearchPermissions': true,
            ...getterOverrides
          },
          dispatch: jest.fn()
        }
      }
    })

  it('renders', () => {
    expect(mountComponent().vm).toBeDefined()
  })

  it('has expected name', () => {
    expect(mountComponent().vm.$options.name).toBe('Companies')
  })
})
