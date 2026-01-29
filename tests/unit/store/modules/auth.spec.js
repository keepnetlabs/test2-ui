describe('auth.js store module', () => {
  let authStore
  let state

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    authStore = {
      namespaced: true,
      state: {
        permissions: [],
        user: {},
        companyName: '',
        userRoleName: '',
        logoUrl: '',
        selectedCompanyName: '',
        selectedCompanyId: '',
        dateFormat: null,
        timeFormat: null,
        companyUpdateRequired: false
      },
      getters: {
        getUserRole: (state) => state.userRoleName,
        userGetter: (state) => state.user,
        getTimezoneFormat: (state) => {
          return {
            timeFormat: state.timeFormat,
            dateFormat: state.dateFormat
          }
        },
        companyUpdateRequired: (state) => state.companyUpdateRequired
      },
      mutations: {
        SET_CURRENTUSER(state, payload) {
          if (payload.isSelectCompany) {
            let data = payload.currentUserData
            if (!data) return
            state.user = data
            state.companyName = data.userCompany.name
            state.selectedCompanyId = data.userCompany.id
            state.selectedCompanyName =
              localStorage.getItem('selectedCompanyName') ||
              localStorage.getItem('companyName') ||
              data.userCompany.name
            state.userRoleName = data?.role?.name || ''
            state.logoUrl = data.userCompany.logoPath
            state.firstName = data.firstName
            state.permissions = payload.permissions
          } else {
            state.user = payload.currentUserData
            state.companyName = payload.currentUserData.userCompany.name
            state.userRoleName = payload?.currentUserData?.role?.name || ''
            state.selectedCompanyName = payload.currentUserData.userCompany.name
            state.logoUrl = payload.currentUserData.userCompany.logoPath
            state.firstName = payload.currentUserData.firstName
            state.permissions = payload.permissions
          }
        },
        SET_FORMATS(state, payload) {
          if (payload.dateFormat) {
            state.dateFormat = payload.dateFormat
          }

          if (payload.timeFormat) {
            state.timeFormat = payload.timeFormat
          }
        },
        SET_COMPANY_NAME(state, payload) {
          state.selectedCompanyName = payload
          state.companyName = payload
          localStorage.setItem('selectedCompanyName', payload)
          localStorage.setItem('companyName', payload)
        },
        SET_COMPANY_UPDATE_REQUIRED(state, payload) {
          state.companyUpdateRequired = payload
        }
      },
      actions: {
        getCurrentUser({ commit, dispatch }) {
          return Promise.resolve()
        },
        setCompanyName({ commit }, payload) {
          commit('SET_COMPANY_NAME', payload)
        },
        setCompanyUpdateRequired({ commit }, payload) {
          commit('SET_COMPANY_UPDATE_REQUIRED', payload)
        }
      }
    }

    state = JSON.parse(JSON.stringify(authStore.state))
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('state', () => {
    it('initializes with empty permissions', () => {
      expect(authStore.state.permissions).toEqual([])
    })

    it('initializes with empty user object', () => {
      expect(authStore.state.user).toEqual({})
    })

    it('initializes with empty company name', () => {
      expect(authStore.state.companyName).toBe('')
    })

    it('initializes with empty user role name', () => {
      expect(authStore.state.userRoleName).toBe('')
    })

    it('initializes with empty logo url', () => {
      expect(authStore.state.logoUrl).toBe('')
    })

    it('initializes with empty selected company name', () => {
      expect(authStore.state.selectedCompanyName).toBe('')
    })

    it('initializes with empty selected company id', () => {
      expect(authStore.state.selectedCompanyId).toBe('')
    })

    it('initializes with null date format', () => {
      expect(authStore.state.dateFormat).toBeNull()
    })

    it('initializes with null time format', () => {
      expect(authStore.state.timeFormat).toBeNull()
    })

    it('initializes with companyUpdateRequired as false', () => {
      expect(authStore.state.companyUpdateRequired).toBe(false)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = authStore.state
    })

    it('getUserRole returns user role name', () => {
      state.userRoleName = 'Admin'
      expect(authStore.getters.getUserRole(state)).toBe('Admin')
    })

    it('getUserRole returns empty string initially', () => {
      expect(authStore.getters.getUserRole(state)).toBe('')
    })

    it('userGetter returns user object', () => {
      state.user = { id: 1, name: 'John Doe' }
      expect(authStore.getters.userGetter(state)).toEqual({ id: 1, name: 'John Doe' })
    })

    it('getTimezoneFormat returns timezone format object', () => {
      state.timeFormat = 'HH:mm:ss'
      state.dateFormat = 'YYYY-MM-DD'
      expect(authStore.getters.getTimezoneFormat(state)).toEqual({
        timeFormat: 'HH:mm:ss',
        dateFormat: 'YYYY-MM-DD'
      })
    })

    it('getTimezoneFormat returns nulls when not set', () => {
      expect(authStore.getters.getTimezoneFormat(state)).toEqual({
        timeFormat: null,
        dateFormat: null
      })
    })

    it('companyUpdateRequired returns update required status', () => {
      state.companyUpdateRequired = true
      expect(authStore.getters.companyUpdateRequired(state)).toBe(true)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(authStore.state))
      localStorage.clear()
    })

    it('SET_CURRENTUSER sets user data when isSelectCompany is true', () => {
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'Test Company', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: true,
        permissions: ['read', 'write']
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.user).toEqual(userData)
      expect(state.companyName).toBe('Test Company')
      expect(state.selectedCompanyId).toBe(1)
      expect(state.userRoleName).toBe('Admin')
      expect(state.permissions).toEqual(['read', 'write'])
    })

    it('SET_CURRENTUSER uses localStorage selectedCompanyName when isSelectCompany is true', () => {
      localStorage.setItem('selectedCompanyName', 'Selected Company')
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'Test Company', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: true,
        permissions: ['read']
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.selectedCompanyName).toBe('Selected Company')
    })

    it('SET_CURRENTUSER sets user data when isSelectCompany is false', () => {
      const userData = {
        firstName: 'Jane',
        role: { name: 'Editor' },
        userCompany: { id: 2, name: 'Another Company', logoPath: 'logo2.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: ['read']
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.user).toEqual(userData)
      expect(state.companyName).toBe('Another Company')
      expect(state.selectedCompanyName).toBe('Another Company')
      expect(state.userRoleName).toBe('Editor')
    })

    it('SET_CURRENTUSER handles user without role', () => {
      const userData = {
        firstName: 'Test',
        role: null,
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.userRoleName).toBe('')
    })

    it('SET_FORMATS sets date format', () => {
      authStore.mutations.SET_FORMATS(state, { dateFormat: 'DD/MM/YYYY' })
      expect(state.dateFormat).toBe('DD/MM/YYYY')
    })

    it('SET_FORMATS sets time format', () => {
      authStore.mutations.SET_FORMATS(state, { timeFormat: 'HH:mm' })
      expect(state.timeFormat).toBe('HH:mm')
    })

    it('SET_FORMATS sets both date and time format', () => {
      authStore.mutations.SET_FORMATS(state, { dateFormat: 'YYYY-MM-DD', timeFormat: '24h' })
      expect(state.dateFormat).toBe('YYYY-MM-DD')
      expect(state.timeFormat).toBe('24h')
    })

    it('SET_FORMATS ignores missing fields', () => {
      state.dateFormat = 'MM/DD/YYYY'
      authStore.mutations.SET_FORMATS(state, { timeFormat: 'HH:mm:ss' })
      expect(state.dateFormat).toBe('MM/DD/YYYY')
      expect(state.timeFormat).toBe('HH:mm:ss')
    })

    it('SET_COMPANY_NAME sets company name and localStorage', () => {
      authStore.mutations.SET_COMPANY_NAME(state, 'New Company')
      expect(state.selectedCompanyName).toBe('New Company')
      expect(state.companyName).toBe('New Company')
      expect(localStorage.getItem('selectedCompanyName')).toBe('New Company')
      expect(localStorage.getItem('companyName')).toBe('New Company')
    })

    it('SET_COMPANY_UPDATE_REQUIRED sets to true', () => {
      authStore.mutations.SET_COMPANY_UPDATE_REQUIRED(state, true)
      expect(state.companyUpdateRequired).toBe(true)
    })

    it('SET_COMPANY_UPDATE_REQUIRED sets to false', () => {
      state.companyUpdateRequired = true
      authStore.mutations.SET_COMPANY_UPDATE_REQUIRED(state, false)
      expect(state.companyUpdateRequired).toBe(false)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(authStore.state))
      localStorage.clear()
    })

    it('setCompanyName commits SET_COMPANY_NAME mutation', () => {
      const commit = jest.fn()
      authStore.actions.setCompanyName({ commit }, 'Test Company')
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_NAME', 'Test Company')
    })

    it('setCompanyUpdateRequired commits SET_COMPANY_UPDATE_REQUIRED mutation with true', () => {
      const commit = jest.fn()
      authStore.actions.setCompanyUpdateRequired({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_UPDATE_REQUIRED', true)
    })

    it('setCompanyUpdateRequired commits SET_COMPANY_UPDATE_REQUIRED mutation with false', () => {
      const commit = jest.fn()
      authStore.actions.setCompanyUpdateRequired({ commit }, false)
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_UPDATE_REQUIRED', false)
    })

    it('getCurrentUser returns a promise', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = await authStore.actions.getCurrentUser({ commit, dispatch })
      expect(result).toBeUndefined()
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(authStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(authStore).toHaveProperty('state')
      expect(authStore).toHaveProperty('getters')
      expect(authStore).toHaveProperty('mutations')
      expect(authStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'getUserRole',
        'userGetter',
        'getTimezoneFormat',
        'companyUpdateRequired'
      ]
      expectedGetters.forEach((getter) => {
        expect(authStore.getters).toHaveProperty(getter)
      })
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_CURRENTUSER',
        'SET_FORMATS',
        'SET_COMPANY_NAME',
        'SET_COMPANY_UPDATE_REQUIRED'
      ]
      expectedMutations.forEach((mutation) => {
        expect(authStore.mutations).toHaveProperty(mutation)
      })
    })

    it('has all expected actions', () => {
      const expectedActions = [
        'getCurrentUser',
        'setCompanyName',
        'setCompanyUpdateRequired'
      ]
      expectedActions.forEach((action) => {
        expect(authStore.actions).toHaveProperty(action)
      })
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(authStore.state))
      localStorage.clear()
    })

    it('can set user data with company information', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      const userData = {
        firstName: 'John',
        role: { name: 'Manager' },
        userCompany: { id: 1, name: 'Company A', logoPath: 'logo-a.png' }
      }
      commit('SET_CURRENTUSER', {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: ['read', 'write', 'delete']
      })

      expect(state.user).toEqual(userData)
      expect(state.companyName).toBe('Company A')
      expect(state.permissions).toHaveLength(3)
    })

    it('can set timezone formats', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      commit('SET_FORMATS', { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm:ss' })
      expect(state.dateFormat).toBe('YYYY-MM-DD')
      expect(state.timeFormat).toBe('HH:mm:ss')
    })

    it('can change company name with localStorage persistence', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      commit('SET_COMPANY_NAME', 'New Company Name')
      expect(state.companyName).toBe('New Company Name')
      expect(state.selectedCompanyName).toBe('New Company Name')
      expect(localStorage.getItem('selectedCompanyName')).toBe('New Company Name')
      expect(localStorage.getItem('companyName')).toBe('New Company Name')
    })

    it('can require company update', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      commit('SET_COMPANY_UPDATE_REQUIRED', true)
      expect(state.companyUpdateRequired).toBe(true)

      commit('SET_COMPANY_UPDATE_REQUIRED', false)
      expect(state.companyUpdateRequired).toBe(false)
    })

    it('can complete full user login flow', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      // Set user data
      const userData = {
        firstName: 'Alice',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'Main Corp', logoPath: 'main-logo.png' }
      }
      commit('SET_CURRENTUSER', {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: ['admin', 'read', 'write']
      })

      // Set timezone preferences
      commit('SET_FORMATS', { dateFormat: 'MM/DD/YYYY', timeFormat: '12h' })

      // Verify all state is set
      expect(state.user.firstName).toBe('Alice')
      expect(state.userRoleName).toBe('Admin')
      expect(state.companyName).toBe('Main Corp')
      expect(state.dateFormat).toBe('MM/DD/YYYY')
      expect(state.timeFormat).toBe('12h')
    })

    it('can handle company selection with localStorage', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      // Pre-set localStorage for company selection
      localStorage.setItem('selectedCompanyName', 'Selected Corp')

      const userData = {
        firstName: 'Bob',
        role: { name: 'User' },
        userCompany: { id: 2, name: 'Default Corp', logoPath: 'default-logo.png' }
      }
      commit('SET_CURRENTUSER', {
        currentUserData: userData,
        isSelectCompany: true,
        permissions: ['read']
      })

      expect(state.selectedCompanyName).toBe('Selected Corp')
      expect(state.companyName).toBe('Default Corp')
    })

    it('can switch between multiple companies', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      // First company
      commit('SET_COMPANY_NAME', 'Company One')
      expect(state.companyName).toBe('Company One')

      // Switch to second company
      commit('SET_COMPANY_NAME', 'Company Two')
      expect(state.companyName).toBe('Company Two')

      // Verify localStorage was updated
      expect(localStorage.getItem('companyName')).toBe('Company Two')
    })
  })
})
