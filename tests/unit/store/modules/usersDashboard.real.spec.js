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
})
