const USERS_DASHBOARD_AUTH_KEY = 'usersDashboardAuth'

const usersDashboard = {
  namespaced: true,
  state: {
    token: null,
    expiredIn: null,
    status: null,
    companyEmail: '',
    loginMethod: null, // 'microsoft', 'google', 'magic-link'
    isAuthenticated: false,
    permissions: [],
    language: 'en-US', // Default language
    userInfo: {
      name: '',
      department: ''
    }
  },
  getters: {
    getToken: (state) => state.token,
    isAuthenticated: (state) => state.isAuthenticated,
    getCompanyEmail: (state) => state.companyEmail,
    getLoginMethod: (state) => state.loginMethod,
    getPermissions: (state) => state.permissions,
    getLanguage: (state) => state.language,
    getUserInfo: (state) => state.userInfo
  },
  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload.token
      state.expiredIn = payload.expiredIn
      state.status = payload.status
      state.isAuthenticated = true

      // Store token in localStorage with separate key
      localStorage.setItem(
        USERS_DASHBOARD_AUTH_KEY,
        JSON.stringify({
          token: payload.token,
          expired: payload.expiredIn,
          status: payload.status
        })
      )

      // Set login source flag
      localStorage.setItem('usersDashboardLoginSource', 'users-dashboard-login')
    },
    SET_COMPANY_EMAIL(state, payload) {
      state.companyEmail = payload
    },
    SET_LOGIN_METHOD(state, payload) {
      state.loginMethod = payload
    },
    SET_PERMISSIONS(state, payload) {
      state.permissions = payload || []
    },
    SET_LANGUAGE(state, payload) {
      state.language = payload
      // Store in localStorage
      localStorage.setItem('usersDashboardLanguage', payload)
    },
    SET_USER_INFO(state, payload) {
      state.userInfo = { ...state.userInfo, ...payload }
    },
    RESET_STATE(state) {
      state.token = null
      state.expiredIn = null
      state.status = null
      state.companyEmail = ''
      state.loginMethod = null
      state.isAuthenticated = false
      state.permissions = []
      state.language = 'en-US'
      state.userInfo = {
        name: '',
        department: ''
      }

      // Remove from localStorage
      localStorage.removeItem(USERS_DASHBOARD_AUTH_KEY)
      localStorage.removeItem('usersDashboardLoginSource')
      localStorage.removeItem('usersDashboardLanguage')
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
    login({ commit, dispatch }, payload) {
      // Set company email and login method
      commit('SET_COMPANY_EMAIL', payload.companyEmail)
      commit('SET_LOGIN_METHOD', payload.loginMethod)

      // TODO: Replace with actual API call
      // For now, simulate login
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockResponse = {
            data: {
              access_token: 'users-dashboard-token-' + Date.now(),
              expiredIn: Date.now() + 3600000, // 1 hour
              status: 1,
              permissions: []
            }
          }

          commit('SET_TOKEN', {
            token: mockResponse.data.access_token,
            expiredIn: mockResponse.data.expiredIn,
            status: mockResponse.data.status
          })

          if (mockResponse.data.permissions) {
            commit('SET_PERMISSIONS', mockResponse.data.permissions)
          }

          resolve(mockResponse)
        }, 1000)
      })

      // TODO: Uncomment when backend is ready
      // return loginAction(payload)
      //   .then((response) => {
      //     commit('SET_TOKEN', {
      //       token: response.data.access_token,
      //       expiredIn: response.data.expiredIn,
      //       status: response.data.status
      //     })
      //     if (response.data.permissions) {
      //       commit('SET_PERMISSIONS', response.data.permissions)
      //     }
      //     return response
      //   })
    },
    logout({ commit }) {
      commit('RESET_STATE')
    },
    initializeFromStorage({ commit }) {
      // Check if token exists in localStorage
      const tokenString = localStorage.getItem(USERS_DASHBOARD_AUTH_KEY)
      const loginSource = localStorage.getItem('usersDashboardLoginSource')
      const savedLanguage = localStorage.getItem('usersDashboardLanguage')

      if (tokenString && loginSource === 'users-dashboard-login') {
        try {
          const tokenModel = JSON.parse(tokenString)
          commit('SET_TOKEN', {
            token: tokenModel.token,
            expiredIn: tokenModel.expired,
            status: tokenModel.status
          })

          // Restore language if exists
          if (savedLanguage) {
            commit('SET_LANGUAGE', savedLanguage)
          }
        } catch (e) {
          // Invalid token, reset state
          commit('RESET_STATE')
        }
      }
    }
  }
}

export default usersDashboard
