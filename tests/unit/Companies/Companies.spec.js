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

  it('sets company-groups tab on created when company permission is missing', () => {
    const wrapper = mountComponent({
      'permissions/getCompaniesSearchPermissions': false,
      'permissions/getCompanyGroupsSearchPermissions': true
    })

    expect(wrapper.vm.tab).toBe('company-company-groups')
  })

  it('watches tab and resets load state on companies tab', async () => {
    const wrapper = mountComponent()
    await wrapper.setData({ isLoadState: true, tab: 'company-company-groups' })
    await wrapper.setData({ tab: 'company-companies' })

    expect(wrapper.vm.isLoadState).toBe(false)
  })

  it('updates tab from route params in updated hook', () => {
    const wrapper = mountComponent()
    wrapper.vm.$route.params = { tab: 'company-company-groups', force: false }

    wrapper.vm.$options.updated[0].call(wrapper.vm)

    expect(wrapper.vm.tab).toBe('company-company-groups')
  })

  it('forces company-groups tab in updated hook when company permission is missing', () => {
    const wrapper = mountComponent({
      'permissions/getCompaniesSearchPermissions': false,
      'permissions/getCompanyGroupsSearchPermissions': true
    })
    wrapper.vm.tab = 'company-companies'

    wrapper.vm.$options.updated[0].call(wrapper.vm)

    expect(wrapper.vm.tab).toBe('company-company-groups')
  })

  it('changes tab status via method', () => {
    const wrapper = mountComponent()
    wrapper.vm.changeTabStatus('company-company-groups')

    expect(wrapper.vm.tab).toBe('company-company-groups')
  })

  it('handles beforeRouteEnter transitions', () => {
    const next = jest.fn()
    Companies.beforeRouteEnter({ name: 'Companies' }, { name: 'Company Group Details' }, next)
    const vm = { tab: 'company-companies', isLoadState: false }
    next.mock.calls[0][0](vm)

    expect(vm.tab).toBe('company-company-groups')
    expect(vm.isLoadState).toBe(true)

    const next2 = jest.fn()
    Companies.beforeRouteEnter({ name: 'Company Group Details' }, { name: 'Any' }, next2)
    const vm2 = { tab: 'company-company-groups', isLoadState: true }
    next2.mock.calls[0][0](vm2)

    expect(vm2.tab).toBe('company-companies')
  })

  it('beforeRouteLeave blocks navigation and opens leaving dialog when form changed', () => {
    const dispatch = jest.fn()
    const wrapper = mountComponent()
    wrapper.vm.$store.dispatch = dispatch
    const cancelCreateOrEditForm = jest.fn()
    const refCompanyList = {
      isShowCreateOrEditModal: true,
      cancelCreateOrEditForm,
      $refs: {
        refCreateOrEditModal: {
          isFormDataChanged: () => true
        }
      }
    }
    wrapper.vm.$refs = { refCompanyList }
    const next = jest.fn()

    Companies.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(dispatch).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave closes modal when form is unchanged', () => {
    const wrapper = mountComponent()
    const refCompanyList = {
      isShowCreateOrEditModal: true,
      cancelCreateOrEditForm: jest.fn(),
      $refs: {
        refCreateOrEditModal: {
          isFormDataChanged: () => false
        }
      }
    }
    wrapper.vm.$refs = { refCompanyList }
    const next = jest.fn()

    Companies.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(refCompanyList.isShowCreateOrEditModal).toBe(false)
    expect(next).not.toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave calls next when modal is not open', () => {
    const wrapper = mountComponent()
    wrapper.vm.$refs = { refCompanyList: { isShowCreateOrEditModal: false } }
    const next = jest.fn()

    Companies.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(next).toHaveBeenCalled()
  })
})
