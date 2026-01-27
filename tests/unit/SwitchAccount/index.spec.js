import { createLocalVue, shallowMount } from '@vue/test-utils'
import SwitchAccount from '@/components/SwitchAccount.vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import { getMyCompanies } from '@/api/company'

jest.mock('@/api/company')
jest.mock('@/components/SwitchAccountTreeView', () => ({
  name: 'SwitchAccountTreeView',
  template: '<div><slot/></div>',
  methods: {
    toggle: jest.fn()
  }
}))
jest.mock('@/components/AlertBox', () => ({
  name: 'AlertBox',
  template: '<div></div>'
}))

// Mock the nested import with spaces
jest.mock('./Company Settings/AccountPrivacy/utils', () => ({
  PRIVACY_DURATIONS: { DENY: 100 }
}), { virtual: true }) 

const localVue = createLocalVue()
localVue.use(Vuex)

describe('SwitchAccount.vue', () => {
  let vuetify
  let store
  let authState
  let dashboardState
  let dashboardActions
  let routerMock

  beforeEach(() => {
    vuetify = new Vuetify()
    
    authState = {
      namespaced: true,
      state: {
        user: { firstName: 'John' },
        companyName: 'Test Company',
        userRoleName: 'Admin',
        logoUrl: 'http://logo.url',
        selectedCompanyName: 'Selected Co'
      }
    }

    dashboardState = {
      namespaced: true,
      state: {
        selectedCompany: { id: 1 },
        selectedCompanyObject: { logoUrl: 'http://company.logo' }
      },
      getters: {
        getCompanyDropdowns: () => [],
        getIsSwitchDialogOpen: () => true
      },
      actions: {
        selectCompany: jest.fn(),
        setSwitchDialog: jest.fn()
      }
    }
    
    dashboardActions = dashboardState.actions

    store = new Vuex.Store({
      modules: {
        auth: authState,
        dashboard: dashboardState,
        common: {
          namespaced: true,
          getters: {
            getIsLoading: () => false
          }
        }
      }
    })

    routerMock = {
      go: jest.fn()
    }
    
    getMyCompanies.mockResolvedValue({
      data: {
        data: [
          { resourceId: '1', name: 'Company A', privacyDurationId: 0, children: [] },
          { resourceId: '2', name: 'Company B', privacyDurationId: 0, children: [] }
        ]
      }
    })
  })

  const mountComponent = () => {
    return shallowMount(SwitchAccount, {
      localVue,
      vuetify,
      store,
      mocks: {
        $router: routerMock
      },
      stubs: {
        'v-switch': {
          template: '<input type="checkbox" @input="$emit(\'input\', $event.target.checked)" />',
          props: ['value']
        },
        'v-text-field': {
          template: '<input @input="$emit(\'input\', $event.target.value)" />',
          methods: {
            focus: jest.fn(),
            blur: jest.fn()
          }
        }
      }
    })
  }

  it('renders correctly and loads companies', async () => {
    const wrapper = mountComponent()
    
    expect(getMyCompanies).toHaveBeenCalled()
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 0))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.orderedAccounts.length).toBe(2)
    expect(wrapper.vm.isCompaniesLoading).toBe(false)
  })

/*
  it('handles company selection', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    
    const account = { resourceId: '3', name: 'Company C', label: 'Company C', privacyDurationId: 0 }
    wrapper.vm.handleOnSelectedAccount(account)
    
    expect(wrapper.vm.selectedAccount).toBe(account)
    expect(wrapper.vm.searchedCompanyText).toBe('Company C')
    expect(wrapper.vm.isSwitchAccountDisabled).toBe(false)
  })
*/

  it('handles confirm click', async () => {
    const wrapper = mountComponent()
    const account = { resourceId: '3', name: 'Company C', id: '3', label: 'Company C' }
    
    // Select account
    await wrapper.setData({ selectedAccount: account, isSwitchAccountDisabled: false })
    
    wrapper.vm.onClickSelectedAccount(account)
    
    expect(routerMock.go).toHaveBeenCalledWith(0)
    expect(window.localStorage.getItem('companyId')).toBe('3')
    expect(dashboardActions.setSwitchDialog).toHaveBeenCalledWith(expect.anything(), false)
  })

/*
  it('filters companies on search', async () => {
    const wrapper = mountComponent()
    
    // Mock debounce to execute immediately
    wrapper.vm.debounce = (fn) => fn()
    
    // Populate data
    await wrapper.vm.$nextTick()
    await Promise.resolve() 
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 0))
    
    // Ensure data loaded
    expect(wrapper.vm.orderedAccounts.length).toBe(2)
    
    wrapper.setData({ searchedCompanyText: 'Company A' })
    wrapper.vm.handleSearchText()
    
    // Wait for filtered update
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.orderedAccounts.length).toBe(1)
    expect(wrapper.vm.orderedAccounts[0].name).toBe('Company A')
  })
*/
})
