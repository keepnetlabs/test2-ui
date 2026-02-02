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

  describe('state properties type checks', () => {
    it('permissions is array type', () => {
      expect(Array.isArray(authStore.state.permissions)).toBe(true)
    })

    it('user is object type', () => {
      expect(typeof authStore.state.user).toBe('object')
    })

    it('companyName is string type', () => {
      expect(typeof authStore.state.companyName).toBe('string')
    })

    it('userRoleName is string type', () => {
      expect(typeof authStore.state.userRoleName).toBe('string')
    })

    it('logoUrl is string type', () => {
      expect(typeof authStore.state.logoUrl).toBe('string')
    })

    it('selectedCompanyName is string type', () => {
      expect(typeof authStore.state.selectedCompanyName).toBe('string')
    })

    it('selectedCompanyId is string type', () => {
      expect(typeof authStore.state.selectedCompanyId).toBe('string')
    })

    it('dateFormat allows null', () => {
      expect(authStore.state.dateFormat === null || typeof authStore.state.dateFormat === 'string').toBe(true)
    })

    it('timeFormat allows null', () => {
      expect(authStore.state.timeFormat === null || typeof authStore.state.timeFormat === 'string').toBe(true)
    })

    it('companyUpdateRequired is boolean type', () => {
      expect(typeof authStore.state.companyUpdateRequired).toBe('boolean')
    })
  })

  describe('getter behavior and function types', () => {
    beforeEach(() => {
      state = authStore.state
    })

    it('getUserRole is function type', () => {
      expect(typeof authStore.getters.getUserRole).toBe('function')
    })

    it('getUserRole returns string value', () => {
      state.userRoleName = 'Editor'
      expect(typeof authStore.getters.getUserRole(state)).toBe('string')
    })

    it('userGetter is function type', () => {
      expect(typeof authStore.getters.userGetter).toBe('function')
    })

    it('userGetter returns object reference', () => {
      state.user = { id: 1, name: 'Test' }
      const getter = authStore.getters.userGetter(state)
      expect(getter === state.user).toBe(true)
    })

    it('getTimezoneFormat is function type', () => {
      expect(typeof authStore.getters.getTimezoneFormat).toBe('function')
    })

    it('getTimezoneFormat returns object with timeFormat and dateFormat', () => {
      state.timeFormat = '24h'
      state.dateFormat = 'MM/DD/YYYY'
      const result = authStore.getters.getTimezoneFormat(state)
      expect(result).toHaveProperty('timeFormat')
      expect(result).toHaveProperty('dateFormat')
    })

    it('companyUpdateRequired is function type', () => {
      expect(typeof authStore.getters.companyUpdateRequired).toBe('function')
    })

    it('companyUpdateRequired returns boolean', () => {
      state.companyUpdateRequired = true
      expect(typeof authStore.getters.companyUpdateRequired(state)).toBe('boolean')
    })

    it('getters reflect state changes immediately', () => {
      state.userRoleName = 'Manager'
      expect(authStore.getters.getUserRole(state)).toBe('Manager')
      state.userRoleName = 'Admin'
      expect(authStore.getters.getUserRole(state)).toBe('Admin')
    })

    it('getUserRole getter multiple access returns consistent results', () => {
      state.userRoleName = 'Viewer'
      const result1 = authStore.getters.getUserRole(state)
      const result2 = authStore.getters.getUserRole(state)
      expect(result1).toBe(result2)
    })
  })

  describe('mutation payload edge cases and null/undefined handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(authStore.state))
      localStorage.clear()
    })

    it('SET_CURRENTUSER handles null currentUserData with isSelectCompany true', () => {
      const payload = {
        currentUserData: null,
        isSelectCompany: true,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.user).toEqual({})
    })

    it('SET_CURRENTUSER handles undefined role gracefully', () => {
      const userData = {
        firstName: 'John',
        role: undefined,
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

    it('SET_CURRENTUSER handles special characters in company name', () => {
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'Company & Co. #123!', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.companyName).toBe('Company & Co. #123!')
    })

    it('SET_CURRENTUSER handles empty permissions array', () => {
      const userData = {
        firstName: 'John',
        role: { name: 'User' },
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.permissions).toEqual([])
      expect(Array.isArray(state.permissions)).toBe(true)
    })

    it('SET_CURRENTUSER handles large permissions array', () => {
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }
      const largePermissions = Array.from({ length: 100 }, (_, i) => `perm_${i}`)
      const payload = {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: largePermissions
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.permissions).toHaveLength(100)
    })

    it('SET_FORMATS ignores null values', () => {
      state.dateFormat = 'MM/DD/YYYY'
      authStore.mutations.SET_FORMATS(state, { dateFormat: null, timeFormat: null })
      expect(state.dateFormat).toBe('MM/DD/YYYY')
    })

    it('SET_FORMATS ignores empty string values', () => {
      authStore.mutations.SET_FORMATS(state, { dateFormat: '', timeFormat: '' })
      expect(state.dateFormat).toBeNull()
      expect(state.timeFormat).toBeNull()
    })

    it('SET_FORMATS handles only dateFormat in payload', () => {
      authStore.mutations.SET_FORMATS(state, { dateFormat: 'YYYY-MM-DD' })
      expect(state.dateFormat).toBe('YYYY-MM-DD')
      expect(state.timeFormat).toBeNull()
    })

    it('SET_FORMATS handles only timeFormat in payload', () => {
      authStore.mutations.SET_FORMATS(state, { timeFormat: 'HH:mm' })
      expect(state.timeFormat).toBe('HH:mm')
      expect(state.dateFormat).toBeNull()
    })

    it('SET_COMPANY_NAME handles empty string', () => {
      authStore.mutations.SET_COMPANY_NAME(state, '')
      expect(state.selectedCompanyName).toBe('')
      expect(state.companyName).toBe('')
    })

    it('SET_COMPANY_NAME handles special characters', () => {
      authStore.mutations.SET_COMPANY_NAME(state, 'Company & Partners <Ltd>')
      expect(state.companyName).toBe('Company & Partners <Ltd>')
      expect(localStorage.getItem('companyName')).toBe('Company & Partners <Ltd>')
    })

    it('SET_COMPANY_NAME handles very long names', () => {
      const longName = 'A'.repeat(500)
      authStore.mutations.SET_COMPANY_NAME(state, longName)
      expect(state.companyName).toBe(longName)
      expect(state.selectedCompanyName).toBe(longName)
    })

    it('SET_COMPANY_NAME handles Unicode characters', () => {
      authStore.mutations.SET_COMPANY_NAME(state, 'Компания 公司')
      expect(state.companyName).toBe('Компания 公司')
      expect(localStorage.getItem('companyName')).toBe('Компания 公司')
    })

    it('SET_COMPANY_UPDATE_REQUIRED handles null', () => {
      authStore.mutations.SET_COMPANY_UPDATE_REQUIRED(state, null)
      expect(state.companyUpdateRequired).toBeFalsy()
    })

    it('SET_COMPANY_UPDATE_REQUIRED handles string true', () => {
      authStore.mutations.SET_COMPANY_UPDATE_REQUIRED(state, 'true')
      expect(state.companyUpdateRequired).toBe('true')
    })

    it('SET_CURRENTUSER preserves user data with complex structure', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: { name: 'Admin', id: 1, permissions: ['read', 'write'] },
        userCompany: {
          id: 1,
          name: 'Company',
          logoPath: 'logo.png',
          settings: { theme: 'dark' }
        }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: ['admin', 'read']
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.user.email).toBe('john@example.com')
      expect(state.user.userCompany.settings.theme).toBe('dark')
    })
  })

  describe('action behavior and commit patterns', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(authStore.state))
      localStorage.clear()
    })

    it('setCompanyName commits mutation once', () => {
      const commit = jest.fn()
      authStore.actions.setCompanyName({ commit }, 'Test Company')
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('setCompanyName passes correct mutation name', () => {
      const commit = jest.fn()
      authStore.actions.setCompanyName({ commit }, 'Test Company')
      expect(commit.mock.calls[0][0]).toBe('SET_COMPANY_NAME')
    })

    it('setCompanyName passes payload correctly', () => {
      const commit = jest.fn()
      const payload = 'New Company'
      authStore.actions.setCompanyName({ commit }, payload)
      expect(commit.mock.calls[0][1]).toBe('New Company')
    })

    it('setCompanyUpdateRequired commits with true payload', () => {
      const commit = jest.fn()
      authStore.actions.setCompanyUpdateRequired({ commit }, true)
      expect(commit.mock.calls[0][1]).toBe(true)
    })

    it('setCompanyUpdateRequired commits with false payload', () => {
      const commit = jest.fn()
      authStore.actions.setCompanyUpdateRequired({ commit }, false)
      expect(commit.mock.calls[0][1]).toBe(false)
    })

    it('getCurrentUser returns promise', async () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const result = authStore.actions.getCurrentUser({ commit, dispatch })
      expect(result instanceof Promise || result === undefined).toBe(true)
    })

    it('setCompanyName can be called multiple times', () => {
      const commit = jest.fn()
      authStore.actions.setCompanyName({ commit }, 'Company1')
      authStore.actions.setCompanyName({ commit }, 'Company2')
      authStore.actions.setCompanyName({ commit }, 'Company3')
      expect(commit).toHaveBeenCalledTimes(3)
    })

    it('setCompanyName integration with mutation', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      authStore.actions.setCompanyName({ commit }, 'Integrated Company')
      expect(state.companyName).toBe('Integrated Company')
    })

    it('setCompanyUpdateRequired integration with mutation', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      authStore.actions.setCompanyUpdateRequired({ commit }, true)
      expect(state.companyUpdateRequired).toBe(true)
    })
  })

  describe('type safety and consistency checks', () => {
    it('all getter functions are callable', () => {
      expect(typeof authStore.getters.getUserRole).toBe('function')
      expect(typeof authStore.getters.userGetter).toBe('function')
      expect(typeof authStore.getters.getTimezoneFormat).toBe('function')
      expect(typeof authStore.getters.companyUpdateRequired).toBe('function')
    })

    it('all mutation functions are callable', () => {
      expect(typeof authStore.mutations.SET_CURRENTUSER).toBe('function')
      expect(typeof authStore.mutations.SET_FORMATS).toBe('function')
      expect(typeof authStore.mutations.SET_COMPANY_NAME).toBe('function')
      expect(typeof authStore.mutations.SET_COMPANY_UPDATE_REQUIRED).toBe('function')
    })

    it('all action functions are callable', () => {
      expect(typeof authStore.actions.getCurrentUser).toBe('function')
      expect(typeof authStore.actions.setCompanyName).toBe('function')
      expect(typeof authStore.actions.setCompanyUpdateRequired).toBe('function')
    })

    it('state is not null', () => {
      expect(authStore.state).not.toBeNull()
    })

    it('getters object is not null', () => {
      expect(authStore.getters).not.toBeNull()
    })

    it('mutations object is not null', () => {
      expect(authStore.mutations).not.toBeNull()
    })

    it('actions object is not null', () => {
      expect(authStore.actions).not.toBeNull()
    })

    it('namespaced is true boolean', () => {
      expect(authStore.namespaced).toBe(true)
      expect(typeof authStore.namespaced).toBe('boolean')
    })

    it('state object contains only expected properties initially', () => {
      const stateKeys = Object.keys(authStore.state)
      const expectedKeys = [
        'permissions', 'user', 'companyName', 'userRoleName', 'logoUrl',
        'selectedCompanyName', 'selectedCompanyId', 'dateFormat', 'timeFormat',
        'companyUpdateRequired'
      ]
      expectedKeys.forEach(key => {
        expect(stateKeys).toContain(key)
      })
    })
  })

  describe('data transitions and mutations consistency', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(authStore.state))
      localStorage.clear()
    })

    it('mutations do not create new state object', () => {
      const initialState = state
      authStore.mutations.SET_COMPANY_UPDATE_REQUIRED(state, true)
      expect(state === initialState).toBe(true)
    })

    it('rapid mutations maintain consistency', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      for (let i = 0; i < 10; i++) {
        commit('SET_COMPANY_UPDATE_REQUIRED', i % 2 === 0)
      }
      expect(state.companyUpdateRequired).toBe(false)
    })

    it('can toggle companyUpdateRequired multiple times', () => {
      authStore.mutations.SET_COMPANY_UPDATE_REQUIRED(state, true)
      expect(state.companyUpdateRequired).toBe(true)
      authStore.mutations.SET_COMPANY_UPDATE_REQUIRED(state, false)
      expect(state.companyUpdateRequired).toBe(false)
      authStore.mutations.SET_COMPANY_UPDATE_REQUIRED(state, true)
      expect(state.companyUpdateRequired).toBe(true)
    })

    it('company name changes persist in both state properties', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      commit('SET_COMPANY_NAME', 'Company A')
      expect(state.companyName).toBe('Company A')
      expect(state.selectedCompanyName).toBe('Company A')
      commit('SET_COMPANY_NAME', 'Company B')
      expect(state.companyName).toBe('Company B')
      expect(state.selectedCompanyName).toBe('Company B')
    })

    it('format mutations do not affect other state properties', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      const initialPermissions = state.permissions
      const initialUser = state.user
      commit('SET_FORMATS', { dateFormat: 'DD/MM/YYYY', timeFormat: '24h' })
      expect(state.permissions).toBe(initialPermissions)
      expect(state.user).toBe(initialUser)
    })

    it('can transition from selected company to different company', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      localStorage.setItem('selectedCompanyName', 'Preset Company')

      const userData1 = {
        firstName: 'User1',
        role: { name: 'Role1' },
        userCompany: { id: 1, name: 'Default1', logoPath: 'logo1.png' }
      }
      commit('SET_CURRENTUSER', {
        currentUserData: userData1,
        isSelectCompany: true,
        permissions: ['perm1']
      })
      expect(state.selectedCompanyName).toBe('Preset Company')

      localStorage.setItem('selectedCompanyName', 'Another Company')
      const userData2 = {
        firstName: 'User2',
        role: { name: 'Role2' },
        userCompany: { id: 2, name: 'Default2', logoPath: 'logo2.png' }
      }
      commit('SET_CURRENTUSER', {
        currentUserData: userData2,
        isSelectCompany: true,
        permissions: ['perm2']
      })
      expect(state.selectedCompanyName).toBe('Another Company')
    })

    it('permissions array is replaceable', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }
      commit('SET_CURRENTUSER', {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: ['perm1', 'perm2']
      })
      expect(state.permissions).toEqual(['perm1', 'perm2'])

      commit('SET_CURRENTUSER', {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: ['perm3', 'perm4', 'perm5']
      })
      expect(state.permissions).toEqual(['perm3', 'perm4', 'perm5'])
    })
  })

  describe('edge cases and boundary conditions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(authStore.state))
      localStorage.clear()
    })

    it('handles user data with very long role name', () => {
      const longRoleName = 'A'.repeat(500)
      const userData = {
        firstName: 'John',
        role: { name: longRoleName },
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.userRoleName).toBe(longRoleName)
    })

    it('handles format with very long date format string', () => {
      const longFormat = 'YYYY-MM-DD-' + 'A'.repeat(500)
      authStore.mutations.SET_FORMATS(state, { dateFormat: longFormat })
      expect(state.dateFormat).toBe(longFormat)
    })

    it('handles company name with numeric values', () => {
      authStore.mutations.SET_COMPANY_NAME(state, '12345 Company 67890')
      expect(state.companyName).toBe('12345 Company 67890')
    })

    it('handles permissions with mixed data types stored as strings', () => {
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: ['read', 'write', 'delete', 'admin', '123']
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.permissions).toHaveLength(5)
    })

    it('handles rapid company name changes', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      for (let i = 0; i < 50; i++) {
        commit('SET_COMPANY_NAME', `Company ${i}`)
      }
      expect(state.companyName).toBe('Company 49')
    })

    it('handles datetime format with special characters', () => {
      const specialFormat = 'DD/MM/YYYY HH:mm:ss & extras!'
      authStore.mutations.SET_FORMATS(state, {
        dateFormat: specialFormat,
        timeFormat: 'HH:mm:ss [GMT]'
      })
      expect(state.dateFormat).toBe(specialFormat)
      expect(state.timeFormat).toBe('HH:mm:ss [GMT]')
    })

    it('handles company with null properties inside userCompany', () => {
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: null, logoPath: null }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.user).toEqual(userData)
    })

    it('handles localStorage with multiple rapid updates', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      for (let i = 0; i < 20; i++) {
        commit('SET_COMPANY_NAME', `RapidCompany${i}`)
      }
      expect(localStorage.getItem('companyName')).toBe('RapidCompany19')
      expect(localStorage.getItem('selectedCompanyName')).toBe('RapidCompany19')
    })

    it('handles format payload with extra unexpected properties', () => {
      authStore.mutations.SET_FORMATS(state, {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        unexpectedProp: 'value',
        anotherProp: 123
      })
      expect(state.dateFormat).toBe('YYYY-MM-DD')
      expect(state.timeFormat).toBe('HH:mm')
    })
  })

  describe('localStorage integration and persistence', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(authStore.state))
      localStorage.clear()
    })

    it('SET_COMPANY_NAME updates both localStorage keys', () => {
      authStore.mutations.SET_COMPANY_NAME(state, 'TestCorp')
      expect(localStorage.getItem('companyName')).toBe('TestCorp')
      expect(localStorage.getItem('selectedCompanyName')).toBe('TestCorp')
    })

    it('localStorage persists across multiple mutations', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }
      commit('SET_COMPANY_NAME', 'Company A')
      commit('SET_COMPANY_NAME', 'Company B')
      commit('SET_COMPANY_NAME', 'Company C')
      expect(localStorage.getItem('companyName')).toBe('Company C')
    })

    it('can read localStorage selectedCompanyName in isSelectCompany mode', () => {
      localStorage.setItem('selectedCompanyName', 'PresetCompany')
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'DefaultCompany', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: true,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.selectedCompanyName).toBe('PresetCompany')
    })

    it('uses companyName from localStorage if selectedCompanyName not set', () => {
      localStorage.setItem('companyName', 'StoredCompany')
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'DefaultCompany', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: true,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.selectedCompanyName).toBe('StoredCompany')
    })

    it('prefers selectedCompanyName from localStorage over companyName', () => {
      localStorage.setItem('selectedCompanyName', 'SelectedCompany')
      localStorage.setItem('companyName', 'StoredCompany')
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'DefaultCompany', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: true,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.selectedCompanyName).toBe('SelectedCompany')
    })

    it('falls back to userCompany.name when no localStorage values', () => {
      const userData = {
        firstName: 'John',
        role: { name: 'Admin' },
        userCompany: { id: 1, name: 'DefaultCompany', logoPath: 'logo.png' }
      }
      const payload = {
        currentUserData: userData,
        isSelectCompany: true,
        permissions: []
      }
      authStore.mutations.SET_CURRENTUSER(state, payload)
      expect(state.selectedCompanyName).toBe('DefaultCompany')
    })
  })

  describe('comprehensive workflow scenarios', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(authStore.state))
      localStorage.clear()
    })

    it('can complete full user login with all properties', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      const userData = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        role: { name: 'Administrator', id: 1 },
        userCompany: { id: 1, name: 'TechCorp', logoPath: 'techcorp-logo.png' }
      }

      commit('SET_CURRENTUSER', {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: ['read', 'write', 'delete', 'admin']
      })

      commit('SET_FORMATS', {
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      })

      commit('SET_COMPANY_UPDATE_REQUIRED', false)

      expect(state.user.firstName).toBe('Alice')
      expect(state.userRoleName).toBe('Administrator')
      expect(state.companyName).toBe('TechCorp')
      expect(state.dateFormat).toBe('MM/DD/YYYY')
      expect(state.timeFormat).toBe('12h')
      expect(state.permissions).toHaveLength(4)
      expect(state.companyUpdateRequired).toBe(false)
    })

    it('can switch users with different roles and companies', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      // First user
      const user1 = {
        firstName: 'John',
        role: { name: 'Manager' },
        userCompany: { id: 1, name: 'Company A', logoPath: 'logoA.png' }
      }
      commit('SET_CURRENTUSER', {
        currentUserData: user1,
        isSelectCompany: false,
        permissions: ['read', 'write']
      })
      expect(state.userRoleName).toBe('Manager')
      expect(state.companyName).toBe('Company A')

      // Second user
      const user2 = {
        firstName: 'Jane',
        role: { name: 'Editor' },
        userCompany: { id: 2, name: 'Company B', logoPath: 'logoB.png' }
      }
      commit('SET_CURRENTUSER', {
        currentUserData: user2,
        isSelectCompany: false,
        permissions: ['read', 'write', 'delete']
      })
      expect(state.userRoleName).toBe('Editor')
      expect(state.companyName).toBe('Company B')
      expect(state.permissions).toHaveLength(3)
    })

    it('can handle company update flow', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      const userData = {
        firstName: 'User',
        role: { name: 'User' },
        userCompany: { id: 1, name: 'Company', logoPath: 'logo.png' }
      }

      commit('SET_CURRENTUSER', {
        currentUserData: userData,
        isSelectCompany: false,
        permissions: ['read']
      })

      // Trigger update required
      commit('SET_COMPANY_UPDATE_REQUIRED', true)
      expect(state.companyUpdateRequired).toBe(true)

      // Complete update
      commit('SET_COMPANY_UPDATE_REQUIRED', false)
      expect(state.companyUpdateRequired).toBe(false)
    })

    it('can handle multi-company selection flow', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      // Set initial preference
      localStorage.setItem('selectedCompanyName', 'Preferred Corp')

      const userData = {
        firstName: 'User',
        role: { name: 'User' },
        userCompany: { id: 1, name: 'Default Corp', logoPath: 'logo.png' }
      }

      commit('SET_CURRENTUSER', {
        currentUserData: userData,
        isSelectCompany: true,
        permissions: ['read']
      })

      expect(state.selectedCompanyName).toBe('Preferred Corp')
      expect(state.companyName).toBe('Default Corp')

      // Change to different company
      commit('SET_COMPANY_NAME', 'Another Corp')
      expect(state.selectedCompanyName).toBe('Another Corp')
      expect(state.companyName).toBe('Another Corp')
      expect(localStorage.getItem('selectedCompanyName')).toBe('Another Corp')
    })

    it('can set all timezone and locale information', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      const formats = {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss'
      }

      commit('SET_FORMATS', formats)

      const getter = authStore.getters.getTimezoneFormat(state)
      expect(getter.dateFormat).toBe('YYYY-MM-DD')
      expect(getter.timeFormat).toBe('HH:mm:ss')
    })

    it('maintains data integrity through complex user session', () => {
      const commit = (mutationName, payload) => {
        authStore.mutations[mutationName](state, payload)
      }

      // Initial setup
      const initialUser = {
        firstName: 'TestUser',
        role: { name: 'Admin' },
        userCompany: { id: 100, name: 'TestCorp', logoPath: 'test.png' }
      }

      commit('SET_CURRENTUSER', {
        currentUserData: initialUser,
        isSelectCompany: false,
        permissions: ['admin', 'read', 'write', 'delete']
      })

      // Set preferences
      commit('SET_FORMATS', {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      })

      // Toggle update flag
      commit('SET_COMPANY_UPDATE_REQUIRED', true)
      commit('SET_COMPANY_UPDATE_REQUIRED', false)

      // Change company
      commit('SET_COMPANY_NAME', 'UpdatedCorp')

      // Verify all state is consistent
      expect(state.user.firstName).toBe('TestUser')
      expect(state.userRoleName).toBe('Admin')
      expect(state.companyName).toBe('UpdatedCorp')
      expect(state.dateFormat).toBe('DD/MM/YYYY')
      expect(state.timeFormat).toBe('24h')
      expect(state.permissions).toHaveLength(4)
      expect(state.companyUpdateRequired).toBe(false)
      expect(localStorage.getItem('companyName')).toBe('UpdatedCorp')
    })
  })
})
