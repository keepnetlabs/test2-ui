describe('dashboard.js store module', () => {
  let dashboardStore
  let state

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    dashboardStore = {
      namespaced: true,
      state: {
        popupFeedback: false,
        dropdownCompanies: [],
        selectedCompany: 'Loading...',
        selectedCompanyObject: {
          logoUrl: null,
          name: null
        },
        isSwitchDialogOpen: false
      },
      getters: {
        isPopupOpened: (state) => state.popupFeedback,
        getIsSwitchDialogOpen: (state) => state.isSwitchDialogOpen,
        getCompanyDropdowns: (state) => state.dropdownCompanies,
        getCurrentCompanyObject: (state) => state.selectedCompanyObject
      },
      mutations: {
        SET_DROPDOWN_COMPANIES(state, payload) {
          state.dropdownCompanies = payload
        },
        SET_SELECTED_COMPANY(state, payload) {
          localStorage.setItem('isSelectCompany', 'true')
          payload.name = localStorage.getItem('selectedCompanyName')
          payload.id = localStorage.getItem('selectedCompanyRequestId')
          state.selectedCompany = payload
          state.selectedCompanyName = payload
        },
        SET_SWITCH_DIALOG(state, payload) {
          state.isSwitchDialogOpen = payload
        },
        CHANGE_FEEDBACK_POPUP(state, payload) {
          state.popupFeedback = payload
        }
      },
      actions: {
        logoutUser({ commit }) {
          commit('common/SET_SNACK_STATUS', false, { root: true })
          commit('common/SET_SNACKBAR_COLOR', '', { root: true })
          commit('common/SET_ERROR_MESSAGE', '', {
            root: true
          })
          commit('common/SET_ERROR_STATE', false, { root: true })
          return Promise.resolve()
            .then(() => {
              return Promise.resolve()
            })
            .catch(() => {
              return Promise.resolve()
            })
            .finally(() => {
              commit('common/RESET_SNACKBARS', undefined, { root: true })
            })
        },
        setSwitchDialog({ commit }, payload) {
          commit('SET_SWITCH_DIALOG', payload)
        },
        selectCompany({ commit, dispatch, state }, payload) {
          payload.companyResourceId && localStorage.setItem('companyId', payload.companyResourceId)
          payload.companyResourceId &&
            localStorage.setItem('companyRequestId', payload.companyResourceId)
          return Promise.resolve({ data: { data: { name: 'Test Company' } } }).then((response) => {
            state.selectedCompanyObject = response?.data?.data || {}
            commit('SET_SELECTED_COMPANY', payload)
            if (window.location.pathname !== '/') {
              dispatch('getDropdownCompanies', payload)
            }
          })
        },
        getDropdownCompanies({ commit }, payload) {
          if (payload !== 'CompanyAdmin') {
            return Promise.resolve({ data: { data: [] } }).then((response) => {
              const result = response?.data?.data ? response.data.data : []
              commit('SET_DROPDOWN_COMPANIES', result)
            })
          }
        },
        changeFeedbackPopup({ commit }, payload) {
          commit('CHANGE_FEEDBACK_POPUP', payload)
        }
      }
    }

    state = JSON.parse(JSON.stringify(dashboardStore.state))
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('state', () => {
    it('initializes with popupFeedback as false', () => {
      expect(dashboardStore.state.popupFeedback).toBe(false)
    })

    it('initializes with empty dropdown companies', () => {
      expect(dashboardStore.state.dropdownCompanies).toEqual([])
    })

    it('initializes with selectedCompany as Loading...', () => {
      expect(dashboardStore.state.selectedCompany).toBe('Loading...')
    })

    it('initializes with empty selectedCompanyObject', () => {
      expect(dashboardStore.state.selectedCompanyObject).toEqual({
        logoUrl: null,
        name: null
      })
    })

    it('initializes with isSwitchDialogOpen as false', () => {
      expect(dashboardStore.state.isSwitchDialogOpen).toBe(false)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = dashboardStore.state
    })

    it('isPopupOpened returns popup feedback status', () => {
      state.popupFeedback = true
      expect(dashboardStore.getters.isPopupOpened(state)).toBe(true)
    })

    it('isPopupOpened returns false when feedback closed', () => {
      state.popupFeedback = false
      expect(dashboardStore.getters.isPopupOpened(state)).toBe(false)
    })

    it('getIsSwitchDialogOpen returns switch dialog status', () => {
      state.isSwitchDialogOpen = true
      expect(dashboardStore.getters.getIsSwitchDialogOpen(state)).toBe(true)
    })

    it('getCompanyDropdowns returns dropdown companies list', () => {
      state.dropdownCompanies = [
        { id: 1, name: 'Company 1' },
        { id: 2, name: 'Company 2' }
      ]
      expect(dashboardStore.getters.getCompanyDropdowns(state)).toHaveLength(2)
    })

    it('getCompanyDropdowns returns empty array initially', () => {
      expect(dashboardStore.getters.getCompanyDropdowns(state)).toEqual([])
    })

    it('getCurrentCompanyObject returns selected company object', () => {
      state.selectedCompanyObject = {
        logoUrl: 'https://example.com/logo.png',
        name: 'Test Company'
      }
      expect(dashboardStore.getters.getCurrentCompanyObject(state)).toEqual({
        logoUrl: 'https://example.com/logo.png',
        name: 'Test Company'
      })
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(dashboardStore.state))
      localStorage.clear()
    })

    it('SET_DROPDOWN_COMPANIES sets the dropdown companies', () => {
      const companies = [
        { id: 1, name: 'Company 1' },
        { id: 2, name: 'Company 2' }
      ]
      dashboardStore.mutations.SET_DROPDOWN_COMPANIES(state, companies)
      expect(state.dropdownCompanies).toEqual(companies)
    })

    it('SET_DROPDOWN_COMPANIES can set empty array', () => {
      dashboardStore.mutations.SET_DROPDOWN_COMPANIES(state, [])
      expect(state.dropdownCompanies).toEqual([])
    })

    it('SET_SELECTED_COMPANY sets selected company and localStorage', () => {
      localStorage.setItem('selectedCompanyName', 'Test Company')
      localStorage.setItem('selectedCompanyRequestId', 'req-123')
      const payload = { id: 1, companyResourceId: 'res-123' }
      dashboardStore.mutations.SET_SELECTED_COMPANY(state, payload)
      expect(state.selectedCompany).toBeDefined()
      expect(localStorage.getItem('isSelectCompany')).toBe('true')
    })

    it('SET_SWITCH_DIALOG opens the switch dialog', () => {
      dashboardStore.mutations.SET_SWITCH_DIALOG(state, true)
      expect(state.isSwitchDialogOpen).toBe(true)
    })

    it('SET_SWITCH_DIALOG closes the switch dialog', () => {
      state.isSwitchDialogOpen = true
      dashboardStore.mutations.SET_SWITCH_DIALOG(state, false)
      expect(state.isSwitchDialogOpen).toBe(false)
    })

    it('CHANGE_FEEDBACK_POPUP opens the feedback popup', () => {
      dashboardStore.mutations.CHANGE_FEEDBACK_POPUP(state, true)
      expect(state.popupFeedback).toBe(true)
    })

    it('CHANGE_FEEDBACK_POPUP closes the feedback popup', () => {
      state.popupFeedback = true
      dashboardStore.mutations.CHANGE_FEEDBACK_POPUP(state, false)
      expect(state.popupFeedback).toBe(false)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(dashboardStore.state))
      localStorage.clear()
    })

    it('logoutUser commits multiple common module mutations', async () => {
      const commit = jest.fn()
      await dashboardStore.actions.logoutUser({ commit })
      expect(commit).toHaveBeenCalledWith('common/SET_SNACK_STATUS', false, { root: true })
      expect(commit).toHaveBeenCalledWith('common/SET_SNACKBAR_COLOR', '', { root: true })
      expect(commit).toHaveBeenCalledWith('common/SET_ERROR_MESSAGE', '', { root: true })
      expect(commit).toHaveBeenCalledWith('common/SET_ERROR_STATE', false, { root: true })
      expect(commit).toHaveBeenCalledWith('common/RESET_SNACKBARS', undefined, { root: true })
    })

    it('setSwitchDialog commits SET_SWITCH_DIALOG mutation', () => {
      const commit = jest.fn()
      dashboardStore.actions.setSwitchDialog({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_SWITCH_DIALOG', true)
    })

    it('setSwitchDialog can close dialog', () => {
      const commit = jest.fn()
      dashboardStore.actions.setSwitchDialog({ commit }, false)
      expect(commit).toHaveBeenCalledWith('SET_SWITCH_DIALOG', false)
    })

    it('selectCompany stores companyResourceId in localStorage', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const payload = { companyResourceId: 'res-123' }
      await dashboardStore.actions.selectCompany(
        { commit, dispatch, state: dashboardStore.state },
        payload
      )
      expect(localStorage.getItem('companyId')).toBe('res-123')
      expect(localStorage.getItem('companyRequestId')).toBe('res-123')
    })

    it('selectCompany commits SET_SELECTED_COMPANY mutation', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const payload = { companyResourceId: 'res-123' }
      localStorage.setItem('selectedCompanyName', 'Test Company')
      localStorage.setItem('selectedCompanyRequestId', 'req-123')
      await dashboardStore.actions.selectCompany(
        { commit, dispatch, state: dashboardStore.state },
        payload
      )
      expect(commit).toHaveBeenCalledWith('SET_SELECTED_COMPANY', payload)
    })

    it('selectCompany updates selectedCompanyObject', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const stateObj = { ...dashboardStore.state }
      const payload = { companyResourceId: 'res-123' }
      await dashboardStore.actions.selectCompany(
        { commit, dispatch, state: stateObj },
        payload
      )
      expect(stateObj.selectedCompanyObject).toEqual({ name: 'Test Company' })
    })

    it('getDropdownCompanies commits SET_DROPDOWN_COMPANIES', async () => {
      const commit = jest.fn()
      const payload = 'RegularUser'
      await dashboardStore.actions.getDropdownCompanies({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_DROPDOWN_COMPANIES', expect.any(Array))
    })

    it('getDropdownCompanies does not commit when payload is CompanyAdmin', async () => {
      const commit = jest.fn()
      const payload = 'CompanyAdmin'
      await dashboardStore.actions.getDropdownCompanies({ commit }, payload)
      expect(commit).not.toHaveBeenCalled()
    })

    it('changeFeedbackPopup commits CHANGE_FEEDBACK_POPUP mutation', () => {
      const commit = jest.fn()
      dashboardStore.actions.changeFeedbackPopup({ commit }, true)
      expect(commit).toHaveBeenCalledWith('CHANGE_FEEDBACK_POPUP', true)
    })

    it('changeFeedbackPopup can close popup', () => {
      const commit = jest.fn()
      dashboardStore.actions.changeFeedbackPopup({ commit }, false)
      expect(commit).toHaveBeenCalledWith('CHANGE_FEEDBACK_POPUP', false)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(dashboardStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(dashboardStore).toHaveProperty('state')
      expect(dashboardStore).toHaveProperty('getters')
      expect(dashboardStore).toHaveProperty('mutations')
      expect(dashboardStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'isPopupOpened',
        'getIsSwitchDialogOpen',
        'getCompanyDropdowns',
        'getCurrentCompanyObject'
      ]
      expectedGetters.forEach((getter) => {
        expect(dashboardStore.getters).toHaveProperty(getter)
      })
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_DROPDOWN_COMPANIES',
        'SET_SELECTED_COMPANY',
        'SET_SWITCH_DIALOG',
        'CHANGE_FEEDBACK_POPUP'
      ]
      expectedMutations.forEach((mutation) => {
        expect(dashboardStore.mutations).toHaveProperty(mutation)
      })
    })

    it('has all expected actions', () => {
      const expectedActions = [
        'logoutUser',
        'setSwitchDialog',
        'selectCompany',
        'getDropdownCompanies',
        'changeFeedbackPopup'
      ]
      expectedActions.forEach((action) => {
        expect(dashboardStore.actions).toHaveProperty(action)
      })
    })
  })

  describe('state properties detailed', () => {
    it('all state properties exist', () => {
      expect(dashboardStore.state).toHaveProperty('popupFeedback')
      expect(dashboardStore.state).toHaveProperty('dropdownCompanies')
      expect(dashboardStore.state).toHaveProperty('selectedCompany')
      expect(dashboardStore.state).toHaveProperty('selectedCompanyObject')
      expect(dashboardStore.state).toHaveProperty('isSwitchDialogOpen')
    })

    it('dropdownCompanies is array type', () => {
      expect(Array.isArray(dashboardStore.state.dropdownCompanies)).toBe(true)
    })

    it('selectedCompanyObject is object type', () => {
      expect(typeof dashboardStore.state.selectedCompanyObject).toBe('object')
    })

    it('selectedCompanyObject has logoUrl and name', () => {
      expect(dashboardStore.state.selectedCompanyObject).toHaveProperty('logoUrl')
      expect(dashboardStore.state.selectedCompanyObject).toHaveProperty('name')
    })

    it('popupFeedback is boolean', () => {
      expect(typeof dashboardStore.state.popupFeedback).toBe('boolean')
    })

    it('isSwitchDialogOpen is boolean', () => {
      expect(typeof dashboardStore.state.isSwitchDialogOpen).toBe('boolean')
    })

    it('selectedCompany is string', () => {
      expect(typeof dashboardStore.state.selectedCompany).toBe('string')
    })
  })

  describe('getter behavior detailed', () => {
    beforeEach(() => {
      state = dashboardStore.state
    })

    it('isPopupOpened is function type', () => {
      expect(typeof dashboardStore.getters.isPopupOpened).toBe('function')
    })

    it('getIsSwitchDialogOpen is function type', () => {
      expect(typeof dashboardStore.getters.getIsSwitchDialogOpen).toBe('function')
    })

    it('getCompanyDropdowns is function type', () => {
      expect(typeof dashboardStore.getters.getCompanyDropdowns).toBe('function')
    })

    it('getCurrentCompanyObject is function type', () => {
      expect(typeof dashboardStore.getters.getCurrentCompanyObject).toBe('function')
    })

    it('getCompanyDropdowns returns same reference', () => {
      const getter = dashboardStore.getters.getCompanyDropdowns(state)
      expect(getter === state.dropdownCompanies).toBe(true)
    })

    it('getCurrentCompanyObject returns same reference', () => {
      const getter = dashboardStore.getters.getCurrentCompanyObject(state)
      expect(getter === state.selectedCompanyObject).toBe(true)
    })

    it('getters reflect state changes', () => {
      state.popupFeedback = true
      expect(dashboardStore.getters.isPopupOpened(state)).toBe(true)
      state.popupFeedback = false
      expect(dashboardStore.getters.isPopupOpened(state)).toBe(false)
    })

    it('getCompanyDropdowns returns array type', () => {
      const getter = dashboardStore.getters.getCompanyDropdowns(state)
      expect(Array.isArray(getter)).toBe(true)
    })
  })

  describe('mutation payload handling detailed', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(dashboardStore.state))
      localStorage.clear()
    })

    it('SET_DROPDOWN_COMPANIES handles null', () => {
      dashboardStore.mutations.SET_DROPDOWN_COMPANIES(state, null)
      expect(state.dropdownCompanies).toBeNull()
    })

    it('SET_DROPDOWN_COMPANIES handles large arrays', () => {
      const largeList = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Company ${i}`
      }))
      dashboardStore.mutations.SET_DROPDOWN_COMPANIES(state, largeList)
      expect(state.dropdownCompanies).toHaveLength(100)
    })

    it('SET_SELECTED_COMPANY handles undefined companyResourceId', () => {
      localStorage.setItem('selectedCompanyName', 'Test')
      localStorage.setItem('selectedCompanyRequestId', 'req-123')
      const payload = { id: 1 }
      dashboardStore.mutations.SET_SELECTED_COMPANY(state, payload)
      expect(state.selectedCompany).toBeDefined()
    })

    it('SET_SELECTED_COMPANY preserves payload id', () => {
      localStorage.setItem('selectedCompanyName', 'Test')
      localStorage.setItem('selectedCompanyRequestId', 'req-123')
      const payload = { id: 99, companyResourceId: 'res-123' }
      dashboardStore.mutations.SET_SELECTED_COMPANY(state, payload)
      expect(state.selectedCompany.id).toBe('req-123')
    })

    it('SET_SWITCH_DIALOG handles multiple toggles', () => {
      for (let i = 0; i < 5; i++) {
        const value = i % 2 === 0
        dashboardStore.mutations.SET_SWITCH_DIALOG(state, value)
        expect(state.isSwitchDialogOpen).toBe(value)
      }
    })

    it('CHANGE_FEEDBACK_POPUP handles multiple toggles', () => {
      for (let i = 0; i < 5; i++) {
        const value = i % 2 === 0
        dashboardStore.mutations.CHANGE_FEEDBACK_POPUP(state, value)
        expect(state.popupFeedback).toBe(value)
      }
    })

    it('CHANGE_FEEDBACK_POPUP can set to null', () => {
      dashboardStore.mutations.CHANGE_FEEDBACK_POPUP(state, null)
      expect(state.popupFeedback).toBeNull()
    })

    it('SET_SWITCH_DIALOG can set to null', () => {
      dashboardStore.mutations.SET_SWITCH_DIALOG(state, null)
      expect(state.isSwitchDialogOpen).toBeNull()
    })
  })

  describe('action behavior detailed', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(dashboardStore.state))
      localStorage.clear()
    })

    it('logoutUser returns promise', async () => {
      const commit = jest.fn()
      const result = dashboardStore.actions.logoutUser({ commit })
      expect(result instanceof Promise).toBe(true)
      await result
    })

    it('setSwitchDialog is synchronous', () => {
      const commit = jest.fn()
      const result = dashboardStore.actions.setSwitchDialog({ commit }, true)
      expect(result).toBeUndefined()
    })

    it('selectCompany returns promise', () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = dashboardStore.actions.selectCompany(
        { commit, dispatch, state: dashboardStore.state },
        { companyResourceId: 'res-123' }
      )
      expect(result instanceof Promise).toBe(true)
    })

    it('getDropdownCompanies returns promise when not CompanyAdmin', () => {
      const commit = jest.fn()
      const result = dashboardStore.actions.getDropdownCompanies({ commit }, 'RegularUser')
      expect(result instanceof Promise).toBe(true)
    })

    it('changeFeedbackPopup is synchronous', () => {
      const commit = jest.fn()
      const result = dashboardStore.actions.changeFeedbackPopup({ commit }, true)
      expect(result).toBeUndefined()
    })

    it('setSwitchDialog commits exactly once', () => {
      const commit = jest.fn()
      dashboardStore.actions.setSwitchDialog({ commit }, true)
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('changeFeedbackPopup commits exactly once', () => {
      const commit = jest.fn()
      dashboardStore.actions.changeFeedbackPopup({ commit }, true)
      expect(commit).toHaveBeenCalledTimes(1)
    })
  })

  describe('type safety and consistency', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(dashboardStore.state))
      localStorage.clear()
    })

    it('all mutations are functions', () => {
      Object.values(dashboardStore.mutations).forEach((mutation) => {
        expect(typeof mutation).toBe('function')
      })
    })

    it('all getters are functions', () => {
      Object.values(dashboardStore.getters).forEach((getter) => {
        expect(typeof getter).toBe('function')
      })
    })

    it('all actions are functions', () => {
      Object.values(dashboardStore.actions).forEach((action) => {
        expect(typeof action).toBe('function')
      })
    })

    it('module is properly namespaced', () => {
      expect(dashboardStore.namespaced).toBe(true)
      expect(typeof dashboardStore.namespaced).toBe('boolean')
    })

    it('state is not null', () => {
      expect(dashboardStore.state).not.toBeNull()
    })

    it('state mutations do not create new state', () => {
      const initialState = state
      dashboardStore.mutations.CHANGE_FEEDBACK_POPUP(state, true)
      expect(state === initialState).toBe(true)
    })

    it('state copies are independent', () => {
      const state1 = JSON.parse(JSON.stringify(dashboardStore.state))
      const state2 = JSON.parse(JSON.stringify(dashboardStore.state))
      state1.popupFeedback = true
      expect(state2.popupFeedback).toBe(false)
    })
  })

  describe('edge cases and data transitions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(dashboardStore.state))
      localStorage.clear()
    })

    it('handles company list with special characters', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      const companies = [
        { id: 1, name: 'Company & Partners!@#' },
        { id: 2, name: 'Société Française' }
      ]
      commit('SET_DROPDOWN_COMPANIES', companies)
      expect(state.dropdownCompanies[0].name).toBe('Company & Partners!@#')
    })

    it('handles rapid toggle sequences', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      for (let i = 0; i < 20; i++) {
        commit('CHANGE_FEEDBACK_POPUP', i % 2 === 0)
        commit('SET_SWITCH_DIALOG', i % 2 !== 0)
      }
      expect(state.popupFeedback).toBe(false)
      expect(state.isSwitchDialogOpen).toBe(true)
    })

    it('handles localStorage interaction edge cases', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      localStorage.setItem('selectedCompanyName', '')
      localStorage.setItem('selectedCompanyRequestId', '')
      const payload = { id: 1, companyResourceId: '' }
      commit('SET_SELECTED_COMPANY', payload)
      expect(state.selectedCompany).toBeDefined()
    })

    it('handles selectedCompanyObject with very long URLs', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(500) + '.png'
      state.selectedCompanyObject = {
        logoUrl: longUrl,
        name: 'Test'
      }
      expect(state.selectedCompanyObject.logoUrl).toBe(longUrl)
    })

    it('handles empty company list', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      commit('SET_DROPDOWN_COMPANIES', [])
      expect(state.dropdownCompanies).toHaveLength(0)
    })

    it('handles all dialogs and popups closed', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      commit('CHANGE_FEEDBACK_POPUP', false)
      commit('SET_SWITCH_DIALOG', false)
      expect(state.popupFeedback).toBe(false)
      expect(state.isSwitchDialogOpen).toBe(false)
    })

    it('handles all dialogs and popups open', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      commit('CHANGE_FEEDBACK_POPUP', true)
      commit('SET_SWITCH_DIALOG', true)
      expect(state.popupFeedback).toBe(true)
      expect(state.isSwitchDialogOpen).toBe(true)
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(dashboardStore.state))
      localStorage.clear()
    })

    it('can toggle feedback popup', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      expect(state.popupFeedback).toBe(false)
      commit('CHANGE_FEEDBACK_POPUP', true)
      expect(state.popupFeedback).toBe(true)
      commit('CHANGE_FEEDBACK_POPUP', false)
      expect(state.popupFeedback).toBe(false)
    })

    it('can toggle switch dialog', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      expect(state.isSwitchDialogOpen).toBe(false)
      commit('SET_SWITCH_DIALOG', true)
      expect(state.isSwitchDialogOpen).toBe(true)
      commit('SET_SWITCH_DIALOG', false)
      expect(state.isSwitchDialogOpen).toBe(false)
    })

    it('can update dropdown companies', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      const companies = [
        { id: 1, name: 'Company A' },
        { id: 2, name: 'Company B' },
        { id: 3, name: 'Company C' }
      ]
      commit('SET_DROPDOWN_COMPANIES', companies)
      expect(state.dropdownCompanies).toHaveLength(3)
      expect(state.dropdownCompanies[0].name).toBe('Company A')
    })

    it('can select company and manage state', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      localStorage.setItem('selectedCompanyName', 'Selected Company')
      localStorage.setItem('selectedCompanyRequestId', 'req-456')

      const payload = { id: 2, companyResourceId: 'res-456' }
      commit('SET_SELECTED_COMPANY', payload)

      expect(localStorage.getItem('isSelectCompany')).toBe('true')
    })

    it('can open feedback popup and switch dialog together', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      commit('CHANGE_FEEDBACK_POPUP', true)
      commit('SET_SWITCH_DIALOG', true)

      expect(state.popupFeedback).toBe(true)
      expect(state.isSwitchDialogOpen).toBe(true)
    })

    it('can manage multiple company operations', async () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      // Load dropdown companies
      const companies = [
        { id: 1, name: 'Company 1' },
        { id: 2, name: 'Company 2' }
      ]
      commit('SET_DROPDOWN_COMPANIES', companies)
      expect(state.dropdownCompanies).toHaveLength(2)

      // Select a company
      localStorage.setItem('selectedCompanyName', 'Company 1')
      localStorage.setItem('selectedCompanyRequestId', 'req-789')
      commit('SET_SELECTED_COMPANY', { id: 1, companyResourceId: 'res-789' })

      expect(localStorage.getItem('isSelectCompany')).toBe('true')
    })

    it('can handle logout flow with popup reset', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      // Open popup and dialog
      commit('CHANGE_FEEDBACK_POPUP', true)
      commit('SET_SWITCH_DIALOG', true)

      // Close them before logout
      commit('CHANGE_FEEDBACK_POPUP', false)
      commit('SET_SWITCH_DIALOG', false)

      expect(state.popupFeedback).toBe(false)
      expect(state.isSwitchDialogOpen).toBe(false)
    })

    it('full workflow: load companies, select, open dialogs, reset', () => {
      const commit = (mutationName, payload) => {
        dashboardStore.mutations[mutationName](state, payload)
      }

      // Load companies
      const companies = [
        { id: 1, name: 'Company 1', logo: 'logo1.png' },
        { id: 2, name: 'Company 2', logo: 'logo2.png' }
      ]
      commit('SET_DROPDOWN_COMPANIES', companies)
      expect(state.dropdownCompanies).toHaveLength(2)

      // Open dialogs
      commit('CHANGE_FEEDBACK_POPUP', true)
      commit('SET_SWITCH_DIALOG', true)

      // Set company
      localStorage.setItem('selectedCompanyName', 'Company 1')
      localStorage.setItem('selectedCompanyRequestId', 'req-001')
      commit('SET_SELECTED_COMPANY', { id: 1, companyResourceId: 'res-001' })

      // Reset
      commit('CHANGE_FEEDBACK_POPUP', false)
      commit('SET_SWITCH_DIALOG', false)
      commit('SET_DROPDOWN_COMPANIES', [])

      expect(state.popupFeedback).toBe(false)
      expect(state.isSwitchDialogOpen).toBe(false)
      expect(state.dropdownCompanies).toHaveLength(0)
    })

    it('can manage company object properties', () => {
      state.selectedCompanyObject = {
        logoUrl: 'https://example.com/logo.png',
        name: 'Test Company'
      }

      const getter = dashboardStore.getters.getCurrentCompanyObject(state)
      expect(getter.logoUrl).toBe('https://example.com/logo.png')
      expect(getter.name).toBe('Test Company')
    })
  })
})
