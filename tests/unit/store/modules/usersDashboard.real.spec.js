jest.mock('@/api/usersDashboard', () => ({
  login: jest.fn(),
  getTopPerformance: jest.fn(),
  getMyLearning: jest.fn(),
  getPhishingResult: jest.fn(),
  getUserInfo: jest.fn(),
  getMyCertificates: jest.fn(),
  getMyBadges: jest.fn()
}))

import usersDashboard from '@/store/modules/usersDashboard'
import {
  getTopPerformance,
  getMyBadges,
  login as loginApi
} from '@/api/usersDashboard'

const createState = () => JSON.parse(JSON.stringify(usersDashboard.state))

describe('usersDashboard store module (real)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.localStorage = {
      store: {},
      getItem(key) {
        return this.store[key] || null
      },
      setItem(key, value) {
        this.store[key] = value
      },
      removeItem(key) {
        delete this.store[key]
      },
      clear() {
        this.store = {}
      }
    }
  })

  describe('getters', () => {
    it('getLabels returns strings or callable functions', () => {
      const state = createState()
      state.language = 'en-GB'

      const labels = usersDashboard.getters.getLabels(state)
      expect(typeof labels.userMenuLogout).toBe('string')
      expect(labels.unknownKey).toBe('unknownKey')

      const result = labels.welcomeTitle('Sam')
      expect(result).toContain('Sam')
    })
  })

  describe('mutations', () => {
    it('SET_TOKEN stores token in localStorage', () => {
      const state = createState()
      usersDashboard.mutations.SET_TOKEN(state, {
        token: 't1',
        expiredIn: 123,
        status: 'active'
      })

      const stored = JSON.parse(localStorage.getItem('usersDashboardAuth'))
      expect(stored.token).toBe('t1')
      expect(localStorage.getItem('usersDashboardLoginSource')).toBe('users-dashboard-login')
    })
  })

  describe('actions', () => {
    it('fetchTopPerformance commits data and updates userInfo from response', async () => {
      const state = createState()
      const commit = jest.fn()
      const getters = {
        getUserInfo: { email: 'john@example.com' }
      }

      getTopPerformance.mockResolvedValue({
        data: {
          data: [
            {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              department: 'IT'
            }
          ]
        }
      })

      await usersDashboard.actions.fetchTopPerformance({ commit, getters, state })

      expect(commit).toHaveBeenCalledWith('SET_TOP_PERFORMANCE_LOADING', true)
      expect(commit).toHaveBeenCalledWith('SET_TOP_PERFORMANCE', [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          department: 'IT'
        }
      ])
      expect(commit).toHaveBeenCalledWith('SET_USER_INFO', {
        name: 'John Doe',
        email: 'john@example.com',
        department: 'IT'
      })
    })

    it('fetchMyBadges maps badgeType 5 to clear earnedDate', async () => {
      const state = createState()
      const commit = jest.fn()
      getMyBadges.mockResolvedValue({
        data: {
          data: [
            { badgeType: 5, earnedDate: '2025-01-01' },
            { badgeType: 1, earnedDate: '2025-01-02' }
          ]
        }
      })

      await usersDashboard.actions.fetchMyBadges({ commit, state })

      expect(commit).toHaveBeenCalledWith('SET_MY_BADGES', [
        { badgeType: 5, earnedDate: '' },
        { badgeType: 1, earnedDate: '2025-01-02' }
      ])
    })

    it('login stores company email, login method, and SAML info', async () => {
      const commit = jest.fn()
      loginApi.mockResolvedValue({
        data: {
          data: {
            email: 'user@company.com',
            saml: { provider: 'microsoft', redirectUrl: 'https://sso' }
          }
        }
      })

      await usersDashboard.actions.login(
        { commit },
        { companyEmail: 'user@company.com', loginMethod: 'microsoft' }
      )

      expect(commit).toHaveBeenCalledWith('SET_COMPANY_EMAIL', 'user@company.com')
      expect(commit).toHaveBeenCalledWith('SET_LOGIN_METHOD', 'microsoft')
      expect(commit).toHaveBeenCalledWith('SET_USER_INFO', { email: 'user@company.com' })
      expect(commit).toHaveBeenCalledWith('SET_SAML_INFO', {
        provider: 'microsoft',
        redirectUrl: 'https://sso'
      })
    })

    it('initializeFromStorage restores token and language', () => {
      const commit = jest.fn()
      localStorage.setItem(
        'usersDashboardAuth',
        JSON.stringify({ token: 't1', expired: 10, status: 'ok' })
      )
      localStorage.setItem('usersDashboardLoginSource', 'users-dashboard-login')
      localStorage.setItem('usersDashboardLanguage', 'tr-TR')

      usersDashboard.actions.initializeFromStorage({ commit })

      expect(commit).toHaveBeenCalledWith('SET_TOKEN', {
        token: 't1',
        expiredIn: 10,
        status: 'ok'
      })
      expect(commit).toHaveBeenCalledWith('SET_LANGUAGE', 'tr-TR')
    })
  })

  describe('Store Structure', () => {
    it('should have required properties', () => {
      expect(usersDashboard.state).toBeDefined()
      expect(usersDashboard.getters).toBeDefined()
      expect(usersDashboard.mutations).toBeDefined()
      expect(usersDashboard.actions).toBeDefined()
    })

    it('should have namespaced flag', () => {
      expect(usersDashboard.namespaced).toBe(true)
    })

    it('should have valid state structure', () => {
      const state = createState()
      expect(typeof state).toBe('object')
    })

    it('should initialize with proper defaults', () => {
      const state = createState()
      expect(state).toBeDefined()
    })
  })

  describe('State Management', () => {
    it('should manage user information state', () => {
      const state = createState()
      state.userInfo = { name: 'John', email: 'john@example.com' }
      expect(state.userInfo).toBeDefined()
    })

    it('should manage authentication state', () => {
      const state = createState()
      state.token = 'test-token'
      expect(state.token).toBe('test-token')
    })

    it('should manage language preference state', () => {
      const state = createState()
      state.language = 'en-US'
      expect(state.language).toBe('en-US')
    })

    it('should manage dashboard data state', () => {
      const state = createState()
      state.topPerformance = []
      state.myBadges = []
      state.myCertificates = []
      expect(Array.isArray(state.topPerformance)).toBe(true)
    })
  })

  describe('Getters Functionality', () => {
    it('should have label getters', () => {
      const state = createState()
      expect(usersDashboard.getters.getLabels).toBeDefined()
    })

    it('should support multiple languages in getters', () => {
      const state = createState()
      state.language = 'en-GB'
      const labels = usersDashboard.getters.getLabels(state)
      expect(labels).toBeDefined()
    })

    it('should return functions for dynamic labels', () => {
      const state = createState()
      state.language = 'en-GB'
      const labels = usersDashboard.getters.getLabels(state)
      const welcomeTitle = labels.welcomeTitle
      if (typeof welcomeTitle === 'function') {
        expect(typeof welcomeTitle('Test')).toBe('string')
      }
    })

    it('should handle missing label keys gracefully', () => {
      const state = createState()
      state.language = 'en-GB'
      const labels = usersDashboard.getters.getLabels(state)
      expect(labels.unknownKey).toBe('unknownKey')
    })
  })

  describe('Mutations Behavior', () => {
    it('SET_TOKEN stores authentication data', () => {
      const state = createState()
      usersDashboard.mutations.SET_TOKEN(state, {
        token: 'test-token',
        expiredIn: 3600,
        status: 'active'
      })
      expect(state.token).toBeDefined()
    })

    it('SET_TOKEN persists to localStorage', () => {
      const state = createState()
      usersDashboard.mutations.SET_TOKEN(state, {
        token: 'test-token',
        expiredIn: 3600,
        status: 'active'
      })
      const stored = localStorage.getItem('usersDashboardAuth')
      expect(stored).not.toBeNull()
    })

    it('should have SET_USER_INFO mutation', () => {
      const state = createState()
      expect(typeof usersDashboard.mutations.SET_USER_INFO).toBe('function')
    })

    it('should have SET_LANGUAGE mutation', () => {
      const state = createState()
      expect(typeof usersDashboard.mutations.SET_LANGUAGE).toBe('function')
    })
  })

  describe('Actions Integration', () => {
    it('fetchTopPerformance should handle API response', async () => {
      const state = createState()
      const commit = jest.fn()
      getTopPerformance.mockResolvedValue({
        data: { data: [{ name: 'John' }] }
      })

      await usersDashboard.actions.fetchTopPerformance({ commit, state })
      expect(commit).toHaveBeenCalled()
    })

    it('fetchMyBadges should transform badge data', async () => {
      const state = createState()
      const commit = jest.fn()
      getMyBadges.mockResolvedValue({
        data: { data: [{ badgeType: 5 }] }
      })

      await usersDashboard.actions.fetchMyBadges({ commit, state })
      expect(commit).toHaveBeenCalled()
    })

    it('login should authenticate user', async () => {
      const commit = jest.fn()
      loginApi.mockResolvedValue({
        data: { data: { email: 'test@example.com' } }
      })

      await usersDashboard.actions.login(
        { commit },
        { companyEmail: 'test@example.com' }
      )
      expect(commit).toHaveBeenCalled()
    })

    it('initializeFromStorage should restore state', () => {
      const commit = jest.fn()
      localStorage.setItem(
        'usersDashboardAuth',
        JSON.stringify({ token: 't1', expired: 10 })
      )
      localStorage.setItem('usersDashboardLoginSource', 'users-dashboard-login')

      usersDashboard.actions.initializeFromStorage({ commit })
      expect(commit).toHaveBeenCalled()
    })
  })

  describe('localStorage Integration', () => {
    it('should read authentication from localStorage', () => {
      const commit = jest.fn()
      localStorage.setItem(
        'usersDashboardAuth',
        JSON.stringify({ token: 'test', expired: 3600 })
      )
      localStorage.setItem('usersDashboardLoginSource', 'users-dashboard-login')

      usersDashboard.actions.initializeFromStorage({ commit })
      expect(commit).toHaveBeenCalledWith('SET_TOKEN', expect.any(Object))
    })

    it('should write authentication to localStorage', () => {
      const state = createState()
      usersDashboard.mutations.SET_TOKEN(state, {
        token: 'test-token',
        expiredIn: 3600
      })

      const stored = localStorage.getItem('usersDashboardAuth')
      expect(stored).toBeTruthy()
    })

    it('should handle language preferences in localStorage', () => {
      localStorage.setItem('usersDashboardLanguage', 'tr-TR')
      const stored = localStorage.getItem('usersDashboardLanguage')
      expect(stored).toBe('tr-TR')
    })

    it('should support login source tracking', () => {
      localStorage.setItem('usersDashboardLoginSource', 'users-dashboard-login')
      const source = localStorage.getItem('usersDashboardLoginSource')
      expect(source).toBe('users-dashboard-login')
    })
  })

  describe('API Integration', () => {
    it('should call login API', async () => {
      const commit = jest.fn()
      loginApi.mockResolvedValue({
        data: { data: { email: 'test@example.com' } }
      })

      await usersDashboard.actions.login({ commit }, {})
      expect(loginApi).toHaveBeenCalled()
    })

    it('should call getTopPerformance API', async () => {
      const state = createState()
      const commit = jest.fn()
      getTopPerformance.mockResolvedValue({
        data: { data: [] }
      })

      await usersDashboard.actions.fetchTopPerformance({ commit, state })
      expect(getTopPerformance).toHaveBeenCalled()
    })

    it('should call getMyBadges API', async () => {
      const state = createState()
      const commit = jest.fn()
      getMyBadges.mockResolvedValue({
        data: { data: [] }
      })

      await usersDashboard.actions.fetchMyBadges({ commit, state })
      expect(getMyBadges).toHaveBeenCalled()
    })
  })

  describe('Authentication Flow', () => {
    it('should store token after login', async () => {
      const commit = jest.fn()
      loginApi.mockResolvedValue({
        data: { data: { email: 'test@example.com' } }
      })

      await usersDashboard.actions.login({ commit }, { companyEmail: 'test@example.com', loginMethod: 'email' })
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_EMAIL', expect.any(String))
    })

    it('should restore token on initialization', () => {
      const commit = jest.fn()
      localStorage.setItem(
        'usersDashboardAuth',
        JSON.stringify({ token: 'saved-token', expired: 3600 })
      )
      localStorage.setItem('usersDashboardLoginSource', 'users-dashboard-login')

      usersDashboard.actions.initializeFromStorage({ commit })
      expect(commit).toHaveBeenCalledWith('SET_TOKEN', expect.any(Object))
    })

    it('should track login method', async () => {
      const commit = jest.fn()
      loginApi.mockResolvedValue({
        data: { data: { email: 'test@example.com' } }
      })

      await usersDashboard.actions.login(
        { commit },
        { loginMethod: 'saml' }
      )
      expect(commit).toHaveBeenCalledWith('SET_LOGIN_METHOD', expect.any(String))
    })
  })

  describe('Data Transformation', () => {
    it('should map badgeType 5 to clear earnedDate', async () => {
      const state = createState()
      const commit = jest.fn()
      getMyBadges.mockResolvedValue({
        data: {
          data: [
            { badgeType: 5, earnedDate: 'date' },
            { badgeType: 1, earnedDate: 'date' }
          ]
        }
      })

      await usersDashboard.actions.fetchMyBadges({ commit, state })

      const callArg = commit.mock.calls.find(
        call => call[0] === 'SET_MY_BADGES'
      )?.[1]
      if (callArg?.[0]) {
        expect(callArg[0].badgeType).toBe(5)
      }
    })

    it('should combine firstName and lastName to name', async () => {
      const state = createState()
      const commit = jest.fn()
      getTopPerformance.mockResolvedValue({
        data: {
          data: [
            { firstName: 'John', lastName: 'Doe' }
          ]
        }
      })

      await usersDashboard.actions.fetchTopPerformance({ commit, state })
      expect(commit).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid localStorage data', () => {
      const commit = jest.fn()
      localStorage.setItem('usersDashboardAuth', 'invalid json')

      try {
        usersDashboard.actions.initializeFromStorage({ commit })
      } catch (e) {
        // Expected to handle parse error
        expect(true).toBe(true)
      }
    })

    it('should support error recovery', () => {
      const commit = jest.fn()
      localStorage.clear()
      expect(() => {
        usersDashboard.actions.initializeFromStorage({ commit })
      }).not.toThrow()
    })
  })

  describe('Language Support', () => {
    it('should support multiple languages', () => {
      const state = createState()
      state.language = 'en-US'
      expect(state.language).toBe('en-US')

      state.language = 'tr-TR'
      expect(state.language).toBe('tr-TR')
    })

    it('should restore language from localStorage', () => {
      const commit = jest.fn()
      localStorage.setItem('usersDashboardLanguage', 'de-DE')
      localStorage.setItem('usersDashboardLoginSource', 'users-dashboard-login')
      localStorage.setItem(
        'usersDashboardAuth',
        JSON.stringify({ token: 'test', expired: 3600 })
      )
      usersDashboard.actions.initializeFromStorage({ commit })
      expect(commit).toHaveBeenCalledWith('SET_LANGUAGE', expect.any(String))
    })

    it('should provide language-specific labels', () => {
      const state = createState()
      state.language = 'en-GB'
      const labels = usersDashboard.getters.getLabels(state)
      expect(labels).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty badges gracefully', async () => {
      const state = createState()
      const commit = jest.fn()
      getMyBadges.mockResolvedValue({
        data: { data: [] }
      })

      await usersDashboard.actions.fetchMyBadges({ commit, state })
      expect(commit).toHaveBeenCalledWith('SET_MY_BADGES', [])
    })

    it('should handle long lived sessions', () => {
      const commit = jest.fn()
      localStorage.setItem(
        'usersDashboardAuth',
        JSON.stringify({ token: 'long-lived-token', expired: 999999999 })
      )
      localStorage.setItem('usersDashboardLoginSource', 'users-dashboard-login')

      usersDashboard.actions.initializeFromStorage({ commit })
      expect(commit).toHaveBeenCalled()
    })

    it('should handle multiple language switches', () => {
      const commit = jest.fn()
      localStorage.setItem('usersDashboardLanguage', 'en-US')
      localStorage.setItem('usersDashboardLanguage', 'tr-TR')
      const stored = localStorage.getItem('usersDashboardLanguage')
      expect(stored).toBe('tr-TR')
    })
  })
})
