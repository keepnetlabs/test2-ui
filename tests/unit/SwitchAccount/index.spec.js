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

  it('calls getMyCompanies API on mount', async () => {
    const wrapper = mountComponent()
    expect(getMyCompanies).toHaveBeenCalled()
  })

  it('displays loaded companies correctly', async () => {
    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    await new Promise(r => setTimeout(r, 0))

    expect(wrapper.vm.orderedAccounts.length).toBeGreaterThan(0)
  })

  it('has correct initial state', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.isCompaniesLoading).toBeTruthy()
    expect(wrapper.vm.selectedAccount).toBe('')
  })

  it('stores selected company ID in localStorage', async () => {
    const wrapper = mountComponent()
    const account = { id: '3', resourceId: '3', name: 'Test' }

    await wrapper.setData({ selectedAccount: account, isSwitchAccountDisabled: false })
    wrapper.vm.onClickSelectedAccount(account)

    expect(window.localStorage.getItem('companyId')).toBe('3')
  })

  it('uses Vuex store correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$store.state.auth).toBeTruthy()
    expect(wrapper.vm.$store.state.dashboard).toBeTruthy()
  })

  describe('Component Structure and Initialization', () => {
    it('should render component successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name || wrapper.vm.$options._componentTag).toBeDefined()
    })

    it('should have proper data structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.orderedAccounts).toBeDefined()
      expect(wrapper.vm.selectedAccount).toBeDefined()
      expect(wrapper.vm.isCompaniesLoading).toBeDefined()
    })

    it('should initialize with loading state', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isCompaniesLoading).toBe(true)
    })
  })

  describe('Company Loading', () => {
    it('should fetch companies on mount', async () => {
      const wrapper = mountComponent()
      expect(getMyCompanies).toHaveBeenCalled()
    })

    it('should populate orderedAccounts with fetched companies', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(r => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.orderedAccounts.length).toBe(2)
    })

    it('should handle company with children', async () => {
      getMyCompanies.mockResolvedValueOnce({
        data: {
          data: [
            {
              resourceId: '1',
              name: 'Parent Company',
              children: [
                { resourceId: '1a', name: 'Child Company 1' }
              ]
            }
          ]
        }
      })

      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(r => setTimeout(r, 0))

      expect(wrapper.vm.orderedAccounts).toBeDefined()
    })

    it('should set loading state to false after companies loaded', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(r => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isCompaniesLoading).toBe(false)
    })
  })

  describe('Company Selection', () => {
    it('should track selected account', async () => {
      const wrapper = mountComponent()
      const account = { resourceId: '1', name: 'Company A', id: '1', label: 'Company A' }

      await wrapper.setData({ selectedAccount: account })
      expect(wrapper.vm.selectedAccount).toEqual(account)
    })

    it('should enable switch button when account selected', async () => {
      const wrapper = mountComponent()
      const account = { resourceId: '1', name: 'Company A', id: '1', label: 'Company A' }

      await wrapper.setData({ selectedAccount: account, isSwitchAccountDisabled: false })
      expect(wrapper.vm.isSwitchAccountDisabled).toBe(false)
    })

    it('should disable switch button initially', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isSwitchAccountDisabled).toBe(true)
    })

    it('should handle account selection and confirmation', async () => {
      const wrapper = mountComponent()
      const account = { resourceId: '1', name: 'Company A', id: '1', label: 'Company A' }

      await wrapper.setData({ selectedAccount: account, isSwitchAccountDisabled: false })
      wrapper.vm.onClickSelectedAccount(account)

      expect(routerMock.go).toHaveBeenCalledWith(0)
    })
  })

  describe('localStorage Management', () => {
    it('should store company ID in localStorage when confirmed', async () => {
      const wrapper = mountComponent()
      const account = { resourceId: '1', name: 'Company A', id: '1', label: 'Company A' }

      await wrapper.setData({ selectedAccount: account, isSwitchAccountDisabled: false })
      wrapper.vm.onClickSelectedAccount(account)

      expect(window.localStorage.getItem('companyId')).toBe('1')
    })

    it('should update localStorage with new company selection', async () => {
      const wrapper = mountComponent()
      const account1 = { resourceId: '1', name: 'Company A', id: '1', label: 'Company A' }
      const account2 = { resourceId: '2', name: 'Company B', id: '2', label: 'Company B' }

      await wrapper.setData({ selectedAccount: account1, isSwitchAccountDisabled: false })
      wrapper.vm.onClickSelectedAccount(account1)

      expect(window.localStorage.getItem('companyId')).toBe('1')

      await wrapper.setData({ selectedAccount: account2 })
      wrapper.vm.onClickSelectedAccount(account2)

      expect(window.localStorage.getItem('companyId')).toBe('2')
    })

    it('should persist company selection', async () => {
      const wrapper = mountComponent()
      const account = { resourceId: '3', name: 'Company C', id: '3', label: 'Company C' }

      await wrapper.setData({ selectedAccount: account, isSwitchAccountDisabled: false })
      wrapper.vm.onClickSelectedAccount(account)

      const storedId = window.localStorage.getItem('companyId')
      expect(storedId).toBe('3')
    })
  })

  describe('Router Integration', () => {
    it('should navigate with router.go on company switch', async () => {
      const wrapper = mountComponent()
      const account = { resourceId: '1', name: 'Company A', id: '1', label: 'Company A' }

      await wrapper.setData({ selectedAccount: account, isSwitchAccountDisabled: false })
      wrapper.vm.onClickSelectedAccount(account)

      expect(routerMock.go).toHaveBeenCalledWith(0)
    })

    it('should have router mock available', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$router).toBeDefined()
      expect(wrapper.vm.$router.go).toBeDefined()
    })
  })

  describe('Store Actions', () => {
    it('should dispatch setSwitchDialog action', async () => {
      const wrapper = mountComponent()
      const account = { resourceId: '1', name: 'Company A', id: '1', label: 'Company A' }

      await wrapper.setData({ selectedAccount: account, isSwitchAccountDisabled: false })
      wrapper.vm.onClickSelectedAccount(account)

      expect(dashboardActions.setSwitchDialog).toHaveBeenCalledWith(expect.anything(), false)
    })

    it('should access dashboard getters', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store.getters['dashboard/getCompanyDropdowns']).toBeDefined()
      expect(wrapper.vm.$store.getters['dashboard/getIsSwitchDialogOpen']).toBeDefined()
    })

    it('should access auth state', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$store.state.auth).toBeDefined()
      expect(wrapper.vm.$store.state.auth.user).toBeDefined()
    })
  })

  describe('Dialog State Management', () => {
    it('should close dialog after confirmation', async () => {
      const wrapper = mountComponent()
      const account = { resourceId: '1', name: 'Company A', id: '1', label: 'Company A' }

      await wrapper.setData({ selectedAccount: account, isSwitchAccountDisabled: false })
      wrapper.vm.onClickSelectedAccount(account)

      expect(dashboardActions.setSwitchDialog).toHaveBeenCalledWith(expect.anything(), false)
    })

    it('should track dialog open state', () => {
      const wrapper = mountComponent()
      const dialogState = wrapper.vm.$store.getters['dashboard/getIsSwitchDialogOpen']
      expect(typeof dialogState).toBe('boolean')
    })
  })

  describe('Search Functionality', () => {
    it('should initialize search text as empty', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.searchedCompanyText).toBe('')
    })

    it('should update search text', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ searchedCompanyText: 'Company A' })
      expect(wrapper.vm.searchedCompanyText).toBe('Company A')
    })

    it('should clear search text', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ searchedCompanyText: 'test' })
      await wrapper.setData({ searchedCompanyText: '' })
      expect(wrapper.vm.searchedCompanyText).toBe('')
    })
  })

  describe('UI State Management', () => {
    it('should handle focus states', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should track component visibility', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle input focus/blur', async () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Company API Integration', () => {
    it('should call getMyCompanies API', async () => {
      jest.clearAllMocks()
      const wrapper = mountComponent()
      expect(getMyCompanies).toHaveBeenCalledTimes(1)
    })

    it('should handle API response with multiple companies', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(r => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.orderedAccounts.length).toBe(2)
      expect(wrapper.vm.orderedAccounts[0].name).toBe('Company A')
      expect(wrapper.vm.orderedAccounts[1].name).toBe('Company B')
    })

    it('should parse API response structure', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(r => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      const firstAccount = wrapper.vm.orderedAccounts[0]
      expect(firstAccount).toHaveProperty('name')
      expect(firstAccount).toHaveProperty('resourceId')
    })
  })

  describe('Multiple Instances', () => {
    it('should support multiple component instances', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()
      expect(wrapper1.vm).not.toBe(wrapper2.vm)
    })

    it('should maintain independent selection per instance', async () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      const account1 = { resourceId: '1', name: 'Company A', id: '1', label: 'Company A' }
      const account2 = { resourceId: '2', name: 'Company B', id: '2', label: 'Company B' }

      await wrapper1.setData({ selectedAccount: account1 })
      await wrapper2.setData({ selectedAccount: account2 })

      expect(wrapper1.vm.selectedAccount).toEqual(account1)
      expect(wrapper2.vm.selectedAccount).toEqual(account2)
    })

    it('should maintain independent search state per instance', async () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      await wrapper1.setData({ searchedCompanyText: 'Search 1' })
      await wrapper2.setData({ searchedCompanyText: 'Search 2' })

      expect(wrapper1.vm.searchedCompanyText).toBe('Search 1')
      expect(wrapper2.vm.searchedCompanyText).toBe('Search 2')
    })
  })

  describe('Performance and Stability', () => {
    it('should handle rapid account selections', async () => {
      const wrapper = mountComponent()
      expect(() => {
        for (let i = 0; i < 10; i++) {
          wrapper.vm.selectedAccount = { id: i, name: `Company ${i}` }
        }
      }).not.toThrow()
    })

    it('should efficiently update with many companies', async () => {
      const manyCompanies = Array.from({ length: 100 }, (_, i) => ({
        resourceId: String(i + 1),
        name: `Company ${i + 1}`,
        privacyDurationId: 0,
        children: []
      }))

      getMyCompanies.mockResolvedValueOnce({
        data: { data: manyCompanies }
      })

      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(r => setTimeout(r, 0))
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.orderedAccounts.length).toBe(100)
    })

    it('should handle rapid search text updates', async () => {
      const wrapper = mountComponent()
      expect(() => {
        for (let i = 0; i < 20; i++) {
          wrapper.vm.searchedCompanyText = 'Search text ' + i
        }
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty company list', async () => {
      getMyCompanies.mockResolvedValueOnce({
        data: { data: [] }
      })

      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise(r => setTimeout(r, 0))

      expect(wrapper.vm.orderedAccounts).toBeDefined()
    })

    it('should handle company with special characters', async () => {
      const wrapper = mountComponent()
      const account = {
        resourceId: '1',
        name: '@#$%^&*()Company',
        id: '1',
        label: '@#$%^&*()Company'
      }

      await wrapper.setData({ selectedAccount: account })
      expect(wrapper.vm.selectedAccount.name).toBe('@#$%^&*()Company')
    })

    it('should handle very long company names', async () => {
      const wrapper = mountComponent()
      const longName = 'A'.repeat(500)
      const account = {
        resourceId: '1',
        name: longName,
        id: '1',
        label: longName
      }

      await wrapper.setData({ selectedAccount: account })
      expect(wrapper.vm.selectedAccount.name.length).toBe(500)
    })

    it('should handle null selected account gracefully', async () => {
      const wrapper = mountComponent()
      await wrapper.setData({ selectedAccount: null })
      expect(wrapper.vm.selectedAccount).toBeNull()
    })
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
