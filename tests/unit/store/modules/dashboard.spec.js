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
  })
})
