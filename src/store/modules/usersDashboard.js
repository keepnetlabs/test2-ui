import { getUsersDashboardLabel } from '@/model/constants/usersDashboardLabels'
import usersDashboardLabels from '@/model/constants/usersDashboardLabels'
import {
  login as loginAPI,
  getTopPerformance,
  getMyLearning,
  getPhishingResult,
  getUserInfo,
  getMyCertificates
} from '@/api/usersDashboard'

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
    language: 'en-GB', // Default language
    samlProvider: null, // 'google', 'microsoft', null
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
      isLoading: true, // Start as true to show loading initially
      error: null
    },
    myLearning: {
      data: [],
      isLoading: false,
      error: null
    },
    myLearningLoading: true, // Start as true to show loading initially
    myCertificates: {
      data: [],
      isLoading: false,
      error: null
    },
    myCertificatesLoading: true, // Start as true to show loading initially
    phishingResult: {
      data: null,
      isLoading: true, // Start as true to show loading initially
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
    getMyLearningLoading: (state) => state.myLearningLoading, // Use separate loading state
    getMyLearningError: (state) => state.myLearning.error,
    getMyCertificates: (state) => state.myCertificates.data,
    getMyCertificatesLoading: (state) => state.myCertificatesLoading, // Use separate loading state
    getMyCertificatesError: (state) => state.myCertificates.error,
    getPhishingResult: (state) => state.phishingResult.data,
    getPhishingResultLoading: (state) => state.phishingResult.isLoading,
    getPhishingResultError: (state) => state.phishingResult.error,
    getLabels: (state) => {
      return new Proxy(
        {},
        {
          get(target, key) {
            // Get the label value to check if it's a function or string
            const langLabels = usersDashboardLabels[state.language] || usersDashboardLabels['en-GB']
            const label = langLabels[key]

            // If label is a function, return a callable function
            if (typeof label === 'function') {
              return (...args) => getUsersDashboardLabel(state.language, key, ...args)
            }
            // If label is a string, return it directly
            return label || key
          }
        }
      )
    }
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
    SET_SAML_INFO(state, payload) {
      state.samlProvider = payload.provider || null
      state.samlRedirectUrl = payload.redirectUrl || null
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
      // Note: Don't reset isLoading state here, let the SET_TOP_PERFORMANCE mutation handle it
    },
    SET_MY_LEARNING(state, payload) {
      state.myLearning.data = payload || []
      state.myLearning.isLoading = false
      state.myLearningLoading = false // Update separate loading state
      state.myLearning.error = null
    },
    SET_MY_LEARNING_LOADING(state, payload) {
      state.myLearning.isLoading = payload
      state.myLearningLoading = payload // Update separate loading state
    },
    SET_MY_LEARNING_ERROR(state, payload) {
      state.myLearning.error = payload
      state.myLearning.isLoading = false
    },
    SET_MY_CERTIFICATES(state, payload) {
      state.myCertificates.data = payload || []
      state.myCertificates.isLoading = false
      state.myCertificatesLoading = false // Update separate loading state
      state.myCertificates.error = null
    },
    SET_MY_CERTIFICATES_LOADING(state, payload) {
      state.myCertificates.isLoading = payload
      state.myCertificatesLoading = payload // Update separate loading state
    },
    SET_MY_CERTIFICATES_ERROR(state, payload) {
      state.myCertificates.error = payload
      state.myCertificates.isLoading = false
      // Note: Don't reset loading state here, let the action handle it
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
      // Note: Don't reset isLoading state here, let the SET_PHISHING_RESULT mutation handle it
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
      state.topPerformance = {
        data: [],
        isLoading: true, // Reset to initial loading state
        error: null
      }
      state.myLearning = {
        data: [],
        isLoading: false,
        error: null
      }
      state.myLearningLoading = true // Reset to initial loading state
      state.myCertificates = {
        data: [],
        isLoading: false,
        error: null
      }
      state.myCertificatesLoading = true // Reset to initial loading state
      state.phishingResult = {
        data: null,
        isLoading: true, // Reset to initial loading state
        error: null
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
    async fetchTopPerformance({ commit, getters }) {
      commit('SET_TOP_PERFORMANCE_LOADING', true)
      commit('SET_TOP_PERFORMANCE_ERROR', null)

      try {
        const response = await getTopPerformance()
        // Minimum 800ms loading duration for better UX
        await new Promise((resolve) => setTimeout(resolve, 800))
        if (response && response.data && response.data.data) {
          const topPerformanceData = response.data.data
          commit('SET_TOP_PERFORMANCE', topPerformanceData)

          // Find current user in the response and update userInfo
          // Try to find user by email from userInfo, or use first user if not found
          const userInfo = getters.getUserInfo
          const currentUser =
            topPerformanceData.find((user) => user.email === userInfo?.email) ||
            topPerformanceData[0]

          if (currentUser) {
            commit('SET_USER_INFO', {
              name: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
              email: currentUser.email || '',
              department: currentUser.department || ''
            })
          }
        } else {
          // Set empty array on invalid response instead of error
          commit('SET_TOP_PERFORMANCE', [])
        }
        return response
      } catch (error) {
        // On error, set empty array instead of throwing
        // This prevents component from breaking when API fails
        commit('SET_TOP_PERFORMANCE', [])
        commit('SET_TOP_PERFORMANCE_ERROR', error.message || 'Failed to fetch top performance data')
        console.error('Error fetching top performance:', error)
        return null
      }
    },
    async fetchMyLearning({ commit }) {
      commit('SET_MY_LEARNING_LOADING', true)
      commit('SET_MY_LEARNING_ERROR', null)

      try {
        const response = await getMyLearning()
        // Minimum 800ms loading duration for better UX
        await new Promise((resolve) => setTimeout(resolve, 800))
        if (response && response.data && response.data.data && response.data.data.results) {
          commit('SET_MY_LEARNING', response.data.data.results)
        } else {
          // Set empty array on invalid response instead of error
          commit('SET_MY_LEARNING', [])
        }
        return response
      } catch (error) {
        // On error, set empty array instead of throwing
        // This prevents component from breaking when API fails
        commit('SET_MY_LEARNING', [])
        commit('SET_MY_LEARNING_ERROR', error.message || 'Failed to fetch my learning data')
        console.error('Error fetching my learning:', error)
        return null
      }
    },
    async fetchMyCertificates({ commit }) {
      commit('SET_MY_CERTIFICATES_LOADING', true)
      commit('SET_MY_CERTIFICATES_ERROR', null)

      try {
        const response = await getMyCertificates()
        // Minimum 800ms loading duration for better UX
        await new Promise((resolve) => setTimeout(resolve, 800))
        if (response && response.data && response.data.data && response.data.data.results) {
          commit('SET_MY_CERTIFICATES', response.data.data.results)
        } else {
          // Set empty array on invalid response instead of error
          commit('SET_MY_CERTIFICATES', [])
        }
        return response
      } catch (error) {
        // On error, set empty array instead of throwing
        // This prevents component from breaking when API fails
        commit('SET_MY_CERTIFICATES', [])
        commit('SET_MY_CERTIFICATES_ERROR', error.message || 'Failed to fetch my certificates data')
        console.error('Error fetching my certificates:', error)
        return null
      }
    },
    async fetchPhishingResult({ commit }) {
      commit('SET_PHISHING_RESULT_LOADING', true)
      commit('SET_PHISHING_RESULT_ERROR', null)

      try {
        const response = await getPhishingResult()
        // Minimum 800ms loading duration for better UX
        await new Promise((resolve) => setTimeout(resolve, 800))
        if (response && response.data && response.data.data) {
          commit('SET_PHISHING_RESULT', response.data.data)
        } else {
          // Set null on invalid response instead of error
          commit('SET_PHISHING_RESULT', null)
        }
        return response
      } catch (error) {
        // On error, set null instead of throwing
        // This prevents component from breaking when API fails
        commit('SET_PHISHING_RESULT', null)
        commit('SET_PHISHING_RESULT_ERROR', error.message || 'Failed to fetch phishing result data')
        console.error('Error fetching phishing result:', error)
        return null
      }
    },
    async fetchUserInfo({ commit }) {
      try {
        const response = await getUserInfo()
        if (response && response.data && response.data.data) {
          const userData = response.data.data
          commit('SET_USER_INFO', {
            email: userData.email || '',
            department: userData.department || '',
            phoneNumber: userData.phoneNumber || '',
            preferredLanguage: userData.preferredLanguage || '',
            preferredLanguageResourceId: userData.preferredLanguageResourceId || ''
          })
        }
        return response
      } catch (error) {
        console.error('Error fetching user info:', error)
        return null
      }
    },
    async login({ commit, dispatch }, payload) {
      // Set company email and login method
      commit('SET_COMPANY_EMAIL', payload.companyEmail)
      commit('SET_LOGIN_METHOD', payload.loginMethod)

      try {
        // Call the actual login API
        const response = await loginAPI(payload.companyEmail)

        if (response && response.data && response.data.data) {
          const { email, saml } = response.data.data

          // Update email in userInfo if provided
          if (email) {
            commit('SET_USER_INFO', { email })
          }

          // Store SAML info (provider and redirectUrl)
          if (saml) {
            commit('SET_SAML_INFO', {
              provider: saml.provider,
              redirectUrl: saml.redirectUrl
            })
          }
        }

        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
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
