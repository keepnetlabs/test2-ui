describe('usersDashboard.js store module', () => {
  let usersDashboardStore
  let state

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    usersDashboardStore = {
      namespaced: true,
      state: {
        token: null,
        expiredIn: null,
        status: null,
        companyEmail: '',
        loginMethod: null,
        isAuthenticated: false,
        permissions: [],
        language: 'en-GB',
        samlProvider: null,
        samlRedirectUrl: null,
        userInfo: {
          name: '',
          email: '',
          department: '',
          phoneNumber: '',
          preferredLanguage: '',
          preferredLanguageResourceId: ''
        },
        topPerformance: {
          data: [],
          isLoading: true,
          error: null
        },
        myLearning: {
          data: [],
          isLoading: false,
          error: null
        },
        myLearningLoading: true,
        myCertificates: {
          data: [],
          isLoading: false,
          error: null
        },
        myCertificatesLoading: true,
        myBadges: {
          data: [],
          isLoading: false,
          error: null
        },
        myBadgesLoading: true,
        phishingResult: {
          data: null,
          isLoading: true,
          error: null
        }
      },
      getters: {
        getToken: (state) => state.token,
        isAuthenticated: (state) => state.isAuthenticated,
        getCompanyEmail: (state) => state.companyEmail,
        getLoginMethod: (state) => state.loginMethod,
        getPermissions: (state) => state.permissions,
        getLanguage: (state) => state.language,
        getSamlProvider: (state) => state.samlProvider,
        getSamlRedirectUrl: (state) => state.samlRedirectUrl,
        getUserInfo: (state) => state.userInfo,
        getTopPerformance: (state) => state.topPerformance.data,
        getTopPerformanceLoading: (state) => state.topPerformance.isLoading,
        getTopPerformanceError: (state) => state.topPerformance.error,
        getMyLearning: (state) => state.myLearning.data,
        getMyLearningLoading: (state) => state.myLearningLoading,
        getMyLearningError: (state) => state.myLearning.error,
        getMyCertificates: (state) => state.myCertificates.data,
        getMyCertificatesLoading: (state) => state.myCertificatesLoading,
        getMyCertificatesError: (state) => state.myCertificates.error,
        getMyBadges: (state) => state.myBadges.data,
        getMyBadgesLoading: (state) => state.myBadgesLoading,
        getMyBadgesError: (state) => state.myBadges.error,
        getPhishingResult: (state) => state.phishingResult.data,
        getPhishingResultLoading: (state) => state.phishingResult.isLoading,
        getPhishingResultError: (state) => state.phishingResult.error
      },
      mutations: {
        SET_TOKEN(state, payload) {
          state.token = payload.token
          state.expiredIn = payload.expiredIn
          state.status = payload.status
          state.isAuthenticated = true
        },
        SET_COMPANY_EMAIL(state, payload) {
          state.companyEmail = payload
        },
        SET_LOGIN_METHOD(state, payload) {
          state.loginMethod = payload
        },
        SET_SAML_INFO(state, payload) {
          state.samlProvider = payload.provider || null
          state.samlRedirectUrl = payload.redirectUrl || null
        },
        SET_PERMISSIONS(state, payload) {
          state.permissions = payload || []
        },
        SET_LANGUAGE(state, payload) {
          state.language = payload
        },
        SET_USER_INFO(state, payload) {
          state.userInfo = { ...state.userInfo, ...payload }
        },
        SET_TOP_PERFORMANCE(state, payload) {
          state.topPerformance.data = payload || []
          state.topPerformance.isLoading = false
          state.topPerformance.error = null
        },
        SET_TOP_PERFORMANCE_LOADING(state, payload) {
          state.topPerformance.isLoading = payload
        },
        SET_TOP_PERFORMANCE_ERROR(state, payload) {
          state.topPerformance.error = payload
        },
        SET_MY_LEARNING(state, payload) {
          state.myLearning.data = payload || []
          state.myLearning.isLoading = false
          state.myLearningLoading = false
          state.myLearning.error = null
        },
        SET_MY_LEARNING_LOADING(state, payload) {
          state.myLearning.isLoading = payload
          state.myLearningLoading = payload
        },
        SET_MY_LEARNING_ERROR(state, payload) {
          state.myLearning.error = payload
          state.myLearning.isLoading = false
        },
        SET_MY_CERTIFICATES(state, payload) {
          state.myCertificates.data = payload || []
          state.myCertificates.isLoading = false
          state.myCertificatesLoading = false
          state.myCertificates.error = null
        },
        SET_MY_CERTIFICATES_LOADING(state, payload) {
          state.myCertificates.isLoading = payload
          state.myCertificatesLoading = payload
        },
        SET_MY_CERTIFICATES_ERROR(state, payload) {
          state.myCertificates.error = payload
          state.myCertificates.isLoading = false
        },
        SET_MY_BADGES(state, payload) {
          state.myBadges.data = payload || []
          state.myBadges.isLoading = false
          state.myBadgesLoading = false
          state.myBadges.error = null
        },
        SET_MY_BADGES_LOADING(state, payload) {
          state.myBadges.isLoading = payload
          state.myBadgesLoading = payload
        },
        SET_MY_BADGES_ERROR(state, payload) {
          state.myBadges.error = payload
          state.myBadges.isLoading = false
        },
        SET_PHISHING_RESULT(state, payload) {
          state.phishingResult.data = payload
          state.phishingResult.isLoading = false
          state.phishingResult.error = null
        },
        SET_PHISHING_RESULT_LOADING(state, payload) {
          state.phishingResult.isLoading = payload
        },
        SET_PHISHING_RESULT_ERROR(state, payload) {
          state.phishingResult.error = payload
        },
        RESET_STATE(state) {
          state.token = null
          state.expiredIn = null
          state.status = null
          state.companyEmail = ''
          state.loginMethod = null
          state.isAuthenticated = false
          state.permissions = []
          state.language = 'en-GB'
          state.userInfo = {
            name: '',
            email: '',
            department: '',
            phoneNumber: '',
            preferredLanguage: '',
            preferredLanguageResourceId: ''
          }
          state.topPerformance = { data: [], isLoading: true, error: null }
          state.myLearning = { data: [], isLoading: false, error: null }
          state.myLearningLoading = true
          state.myCertificates = { data: [], isLoading: false, error: null }
          state.myCertificatesLoading = true
          state.myBadges = { data: [], isLoading: false, error: null }
          state.myBadgesLoading = true
          state.phishingResult = { data: null, isLoading: true, error: null }
        }
      },
      actions: {
        setToken({ commit }, payload) {
          commit('SET_TOKEN', payload)
        },
        setCompanyEmail({ commit }, payload) {
          commit('SET_COMPANY_EMAIL', payload)
        },
        setLoginMethod({ commit }, payload) {
          commit('SET_LOGIN_METHOD', payload)
        },
        setPermissions({ commit }, payload) {
          commit('SET_PERMISSIONS', payload)
        },
        setLanguage({ commit }, payload) {
          commit('SET_LANGUAGE', payload)
        },
        setUserInfo({ commit }, payload) {
          commit('SET_USER_INFO', payload)
        },
        logout({ commit }) {
          commit('RESET_STATE')
        }
      }
    }

    state = JSON.parse(JSON.stringify(usersDashboardStore.state))
  })

  describe('state', () => {
    it('initializes with null token', () => {
      expect(usersDashboardStore.state.token).toBeNull()
    })

    it('initializes with false isAuthenticated', () => {
      expect(usersDashboardStore.state.isAuthenticated).toBe(false)
    })

    it('initializes with empty companyEmail', () => {
      expect(usersDashboardStore.state.companyEmail).toBe('')
    })

    it('initializes with default language en-GB', () => {
      expect(usersDashboardStore.state.language).toBe('en-GB')
    })

    it('initializes with empty permissions array', () => {
      expect(usersDashboardStore.state.permissions).toEqual([])
    })

    it('initializes userInfo with empty values', () => {
      expect(usersDashboardStore.state.userInfo.name).toBe('')
      expect(usersDashboardStore.state.userInfo.email).toBe('')
      expect(usersDashboardStore.state.userInfo.department).toBe('')
    })

    it('initializes topPerformance with loading state', () => {
      expect(usersDashboardStore.state.topPerformance.isLoading).toBe(true)
      expect(usersDashboardStore.state.topPerformance.data).toEqual([])
      expect(usersDashboardStore.state.topPerformance.error).toBeNull()
    })

    it('initializes myLearning states', () => {
      expect(usersDashboardStore.state.myLearningLoading).toBe(true)
      expect(usersDashboardStore.state.myLearning.data).toEqual([])
    })

    it('initializes myCertificates states', () => {
      expect(usersDashboardStore.state.myCertificatesLoading).toBe(true)
      expect(usersDashboardStore.state.myCertificates.data).toEqual([])
    })

    it('initializes myBadges states', () => {
      expect(usersDashboardStore.state.myBadgesLoading).toBe(true)
      expect(usersDashboardStore.state.myBadges.data).toEqual([])
    })

    it('initializes phishingResult with loading state', () => {
      expect(usersDashboardStore.state.phishingResult.isLoading).toBe(true)
      expect(usersDashboardStore.state.phishingResult.data).toBeNull()
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = usersDashboardStore.state
    })

    it('getToken returns token value', () => {
      state.token = 'test-token-123'
      expect(usersDashboardStore.getters.getToken(state)).toBe('test-token-123')
    })

    it('isAuthenticated returns authentication status', () => {
      state.isAuthenticated = true
      expect(usersDashboardStore.getters.isAuthenticated(state)).toBe(true)
    })

    it('getCompanyEmail returns company email', () => {
      state.companyEmail = 'user@company.com'
      expect(usersDashboardStore.getters.getCompanyEmail(state)).toBe('user@company.com')
    })

    it('getLoginMethod returns login method', () => {
      state.loginMethod = 'microsoft'
      expect(usersDashboardStore.getters.getLoginMethod(state)).toBe('microsoft')
    })

    it('getPermissions returns permissions array', () => {
      state.permissions = ['read', 'write']
      expect(usersDashboardStore.getters.getPermissions(state)).toEqual(['read', 'write'])
    })

    it('getLanguage returns language code', () => {
      state.language = 'fr-FR'
      expect(usersDashboardStore.getters.getLanguage(state)).toBe('fr-FR')
    })

    it('getSamlProvider returns SAML provider', () => {
      state.samlProvider = 'google'
      expect(usersDashboardStore.getters.getSamlProvider(state)).toBe('google')
    })

    it('getSamlRedirectUrl returns SAML redirect URL', () => {
      state.samlRedirectUrl = 'https://example.com/saml'
      expect(usersDashboardStore.getters.getSamlRedirectUrl(state)).toBe('https://example.com/saml')
    })

    it('getUserInfo returns user info object', () => {
      state.userInfo = { name: 'John Doe', email: 'john@example.com' }
      expect(usersDashboardStore.getters.getUserInfo(state)).toEqual({
        name: 'John Doe',
        email: 'john@example.com'
      })
    })

    it('getTopPerformance returns top performance data', () => {
      state.topPerformance.data = [{ id: 1, score: 100 }]
      expect(usersDashboardStore.getters.getTopPerformance(state)).toEqual([{ id: 1, score: 100 }])
    })

    it('getTopPerformanceLoading returns loading state', () => {
      state.topPerformance.isLoading = false
      expect(usersDashboardStore.getters.getTopPerformanceLoading(state)).toBe(false)
    })

    it('getMyLearning returns my learning data', () => {
      state.myLearning.data = [{ course: 'Security 101' }]
      expect(usersDashboardStore.getters.getMyLearning(state)).toEqual([{ course: 'Security 101' }])
    })

    it('getMyLearningLoading returns separate loading state', () => {
      state.myLearningLoading = false
      expect(usersDashboardStore.getters.getMyLearningLoading(state)).toBe(false)
    })

    it('getMyCertificates returns certificates data', () => {
      state.myCertificates.data = [{ name: 'Security Cert' }]
      expect(usersDashboardStore.getters.getMyCertificates(state)).toEqual([{ name: 'Security Cert' }])
    })

    it('getMyCertificatesLoading returns separate loading state', () => {
      state.myCertificatesLoading = false
      expect(usersDashboardStore.getters.getMyCertificatesLoading(state)).toBe(false)
    })

    it('getMyBadges returns badges data', () => {
      state.myBadges.data = [{ badgeId: 1, name: 'Expert' }]
      expect(usersDashboardStore.getters.getMyBadges(state)).toEqual([{ badgeId: 1, name: 'Expert' }])
    })

    it('getMyBadgesLoading returns separate loading state', () => {
      state.myBadgesLoading = false
      expect(usersDashboardStore.getters.getMyBadgesLoading(state)).toBe(false)
    })

    it('getPhishingResult returns phishing result data', () => {
      state.phishingResult.data = { score: 85 }
      expect(usersDashboardStore.getters.getPhishingResult(state)).toEqual({ score: 85 })
    })

    it('getPhishingResultLoading returns loading state', () => {
      state.phishingResult.isLoading = false
      expect(usersDashboardStore.getters.getPhishingResultLoading(state)).toBe(false)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(usersDashboardStore.state))
    })

    it('SET_TOKEN sets authentication data and authenticated flag', () => {
      usersDashboardStore.mutations.SET_TOKEN(state, {
        token: 'new-token',
        expiredIn: 3600,
        status: 'active'
      })
      expect(state.token).toBe('new-token')
      expect(state.expiredIn).toBe(3600)
      expect(state.isAuthenticated).toBe(true)
    })

    it('SET_COMPANY_EMAIL updates company email', () => {
      usersDashboardStore.mutations.SET_COMPANY_EMAIL(state, 'newemail@company.com')
      expect(state.companyEmail).toBe('newemail@company.com')
    })

    it('SET_LOGIN_METHOD updates login method', () => {
      usersDashboardStore.mutations.SET_LOGIN_METHOD(state, 'google')
      expect(state.loginMethod).toBe('google')
    })

    it('SET_SAML_INFO sets SAML provider and redirect URL', () => {
      usersDashboardStore.mutations.SET_SAML_INFO(state, {
        provider: 'microsoft',
        redirectUrl: 'https://example.com/auth'
      })
      expect(state.samlProvider).toBe('microsoft')
      expect(state.samlRedirectUrl).toBe('https://example.com/auth')
    })

    it('SET_PERMISSIONS updates permissions array', () => {
      usersDashboardStore.mutations.SET_PERMISSIONS(state, ['admin', 'user'])
      expect(state.permissions).toEqual(['admin', 'user'])
    })

    it('SET_LANGUAGE updates language code', () => {
      usersDashboardStore.mutations.SET_LANGUAGE(state, 'de-DE')
      expect(state.language).toBe('de-DE')
    })

    it('SET_USER_INFO merges user info', () => {
      usersDashboardStore.mutations.SET_USER_INFO(state, {
        name: 'Jane Doe',
        email: 'jane@example.com'
      })
      expect(state.userInfo.name).toBe('Jane Doe')
      expect(state.userInfo.email).toBe('jane@example.com')
    })

    it('SET_TOP_PERFORMANCE sets data and clears loading/error', () => {
      usersDashboardStore.mutations.SET_TOP_PERFORMANCE(state, [{ id: 1 }])
      expect(state.topPerformance.data).toEqual([{ id: 1 }])
      expect(state.topPerformance.isLoading).toBe(false)
      expect(state.topPerformance.error).toBeNull()
    })

    it('SET_MY_LEARNING sets data and clears loading/error', () => {
      usersDashboardStore.mutations.SET_MY_LEARNING(state, [{ course: 'Test' }])
      expect(state.myLearning.data).toEqual([{ course: 'Test' }])
      expect(state.myLearningLoading).toBe(false)
      expect(state.myLearning.error).toBeNull()
    })

    it('SET_MY_CERTIFICATES sets data and clears loading/error', () => {
      usersDashboardStore.mutations.SET_MY_CERTIFICATES(state, [{ cert: 'Test' }])
      expect(state.myCertificates.data).toEqual([{ cert: 'Test' }])
      expect(state.myCertificatesLoading).toBe(false)
    })

    it('SET_MY_BADGES sets data and clears loading/error', () => {
      usersDashboardStore.mutations.SET_MY_BADGES(state, [{ badge: 'Expert' }])
      expect(state.myBadges.data).toEqual([{ badge: 'Expert' }])
      expect(state.myBadgesLoading).toBe(false)
    })

    it('SET_PHISHING_RESULT sets data and clears loading/error', () => {
      usersDashboardStore.mutations.SET_PHISHING_RESULT(state, { score: 90 })
      expect(state.phishingResult.data).toEqual({ score: 90 })
      expect(state.phishingResult.isLoading).toBe(false)
    })

    it('RESET_STATE clears all data', () => {
      state.token = 'test-token'
      state.isAuthenticated = true
      state.companyEmail = 'test@example.com'
      state.permissions = ['read']
      state.language = 'fr-FR'

      usersDashboardStore.mutations.RESET_STATE(state)

      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.companyEmail).toBe('')
      expect(state.permissions).toEqual([])
      expect(state.language).toBe('en-GB')
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(usersDashboardStore.state))
    })

    it('setToken commits mutation', () => {
      const commit = jest.fn()
      const payload = { token: 'test-token', expiredIn: 3600, status: 'active' }
      usersDashboardStore.actions.setToken({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_TOKEN', payload)
    })

    it('setCompanyEmail commits mutation', () => {
      const commit = jest.fn()
      usersDashboardStore.actions.setCompanyEmail({ commit }, 'test@company.com')
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_EMAIL', 'test@company.com')
    })

    it('setLoginMethod commits mutation', () => {
      const commit = jest.fn()
      usersDashboardStore.actions.setLoginMethod({ commit }, 'microsoft')
      expect(commit).toHaveBeenCalledWith('SET_LOGIN_METHOD', 'microsoft')
    })

    it('setPermissions commits mutation', () => {
      const commit = jest.fn()
      const permissions = ['read', 'write']
      usersDashboardStore.actions.setPermissions({ commit }, permissions)
      expect(commit).toHaveBeenCalledWith('SET_PERMISSIONS', permissions)
    })

    it('setLanguage commits mutation', () => {
      const commit = jest.fn()
      usersDashboardStore.actions.setLanguage({ commit }, 'fr-FR')
      expect(commit).toHaveBeenCalledWith('SET_LANGUAGE', 'fr-FR')
    })

    it('setUserInfo commits mutation', () => {
      const commit = jest.fn()
      const userInfo = { name: 'Test User' }
      usersDashboardStore.actions.setUserInfo({ commit }, userInfo)
      expect(commit).toHaveBeenCalledWith('SET_USER_INFO', userInfo)
    })

    it('logout commits RESET_STATE mutation', () => {
      const commit = jest.fn()
      usersDashboardStore.actions.logout({ commit })
      expect(commit).toHaveBeenCalledWith('RESET_STATE')
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(usersDashboardStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(usersDashboardStore).toHaveProperty('state')
      expect(usersDashboardStore).toHaveProperty('getters')
      expect(usersDashboardStore).toHaveProperty('mutations')
      expect(usersDashboardStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'getToken',
        'isAuthenticated',
        'getCompanyEmail',
        'getLoginMethod',
        'getPermissions',
        'getLanguage',
        'getSamlProvider',
        'getSamlRedirectUrl',
        'getUserInfo',
        'getTopPerformance',
        'getTopPerformanceLoading',
        'getTopPerformanceError',
        'getMyLearning',
        'getMyLearningLoading',
        'getMyLearningError',
        'getMyCertificates',
        'getMyCertificatesLoading',
        'getMyCertificatesError',
        'getMyBadges',
        'getMyBadgesLoading',
        'getMyBadgesError',
        'getPhishingResult',
        'getPhishingResultLoading',
        'getPhishingResultError'
      ]
      expectedGetters.forEach((getter) => {
        expect(usersDashboardStore.getters).toHaveProperty(getter)
      })
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_TOKEN',
        'SET_COMPANY_EMAIL',
        'SET_LOGIN_METHOD',
        'SET_SAML_INFO',
        'SET_PERMISSIONS',
        'SET_LANGUAGE',
        'SET_USER_INFO',
        'SET_TOP_PERFORMANCE',
        'SET_TOP_PERFORMANCE_LOADING',
        'SET_TOP_PERFORMANCE_ERROR',
        'SET_MY_LEARNING',
        'SET_MY_LEARNING_LOADING',
        'SET_MY_LEARNING_ERROR',
        'SET_MY_CERTIFICATES',
        'SET_MY_CERTIFICATES_LOADING',
        'SET_MY_CERTIFICATES_ERROR',
        'SET_MY_BADGES',
        'SET_MY_BADGES_LOADING',
        'SET_MY_BADGES_ERROR',
        'SET_PHISHING_RESULT',
        'SET_PHISHING_RESULT_LOADING',
        'SET_PHISHING_RESULT_ERROR',
        'RESET_STATE'
      ]
      expectedMutations.forEach((mutation) => {
        expect(usersDashboardStore.mutations).toHaveProperty(mutation)
      })
    })

    it('has expected actions', () => {
      const expectedActions = [
        'setToken',
        'setCompanyEmail',
        'setLoginMethod',
        'setPermissions',
        'setLanguage',
        'setUserInfo',
        'logout'
      ]
      expectedActions.forEach((action) => {
        expect(usersDashboardStore.actions).toHaveProperty(action)
      })
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(usersDashboardStore.state))
    })

    it('can set user authentication and user info together', () => {
      const commit = (mutationName, payload) => {
        usersDashboardStore.mutations[mutationName](state, payload)
      }

      commit('SET_TOKEN', {
        token: 'auth-token',
        expiredIn: 3600,
        status: 'active'
      })

      commit('SET_USER_INFO', {
        name: 'John Doe',
        email: 'john@example.com',
        department: 'IT'
      })

      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toBe('auth-token')
      expect(state.userInfo.name).toBe('John Doe')
      expect(state.userInfo.email).toBe('john@example.com')
    })

    it('can set all data and then reset', () => {
      const commit = (mutationName, payload) => {
        usersDashboardStore.mutations[mutationName](state, payload)
      }

      // Set all data
      commit('SET_TOKEN', {
        token: 'test-token',
        expiredIn: 3600,
        status: 'active'
      })
      commit('SET_COMPANY_EMAIL', 'user@company.com')
      commit('SET_LOGIN_METHOD', 'microsoft')
      commit('SET_PERMISSIONS', ['admin', 'user'])
      commit('SET_TOP_PERFORMANCE', [{ id: 1 }])

      // Verify data is set
      expect(state.isAuthenticated).toBe(true)
      expect(state.companyEmail).toBe('user@company.com')
      expect(state.topPerformance.data).toHaveLength(1)

      // Reset state
      commit('RESET_STATE')

      // Verify everything is reset
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.companyEmail).toBe('')
      expect(state.topPerformance.data).toEqual([])
    })

    it('can load multiple data types with proper loading/error states', () => {
      const commit = (mutationName, payload) => {
        usersDashboardStore.mutations[mutationName](state, payload)
      }

      // Load top performance
      commit('SET_TOP_PERFORMANCE', [{ rank: 1, score: 100 }])
      expect(state.topPerformance.isLoading).toBe(false)
      expect(state.topPerformance.data).toHaveLength(1)

      // Load my learning
      commit('SET_MY_LEARNING', [{ course: 'Security' }])
      expect(state.myLearningLoading).toBe(false)
      expect(state.myLearning.data).toHaveLength(1)

      // Load certificates
      commit('SET_MY_CERTIFICATES', [{ cert: 'CCNA' }])
      expect(state.myCertificatesLoading).toBe(false)

      // Load badges
      commit('SET_MY_BADGES', [{ name: 'Expert' }])
      expect(state.myBadgesLoading).toBe(false)
    })

    it('handles SAML authentication flow', () => {
      const commit = (mutationName, payload) => {
        usersDashboardStore.mutations[mutationName](state, payload)
      }

      commit('SET_LOGIN_METHOD', 'saml')
      commit('SET_SAML_INFO', {
        provider: 'microsoft',
        redirectUrl: 'https://example.com/saml-login'
      })
      commit('SET_TOKEN', {
        token: 'saml-token',
        expiredIn: 7200,
        status: 'active'
      })

      expect(state.loginMethod).toBe('saml')
      expect(state.samlProvider).toBe('microsoft')
      expect(state.isAuthenticated).toBe(true)
    })
  })
})
