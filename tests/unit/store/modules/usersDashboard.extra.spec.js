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
  getMyLearning,
  getMyCertificates,
  getPhishingResult,
  getUserInfo,
  login as loginApi
} from '@/api/usersDashboard'

const createState = () => JSON.parse(JSON.stringify(usersDashboard.state))

describe('usersDashboard store module (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
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

  afterEach(() => {
    console.error.mockRestore()
  })

  describe('fetchMyLearning', () => {
    it('commits results on success', async () => {
      const commit = jest.fn()
      getMyLearning.mockResolvedValue({
        data: { data: { results: [{ course: 'Security 101' }] } }
      })

      await usersDashboard.actions.fetchMyLearning({ commit })

      expect(commit).toHaveBeenCalledWith('SET_MY_LEARNING_LOADING', true)
      expect(commit).toHaveBeenCalledWith('SET_MY_LEARNING', [{ course: 'Security 101' }])
    })

    it('commits empty array when response has no results', async () => {
      const commit = jest.fn()
      getMyLearning.mockResolvedValue({ data: { data: {} } })

      await usersDashboard.actions.fetchMyLearning({ commit })

      expect(commit).toHaveBeenCalledWith('SET_MY_LEARNING', [])
    })

    it('commits empty array and error on catch', async () => {
      const commit = jest.fn()
      getMyLearning.mockRejectedValue(new Error('Network error'))

      const result = await usersDashboard.actions.fetchMyLearning({ commit })

      expect(commit).toHaveBeenCalledWith('SET_MY_LEARNING', [])
      expect(commit).toHaveBeenCalledWith('SET_MY_LEARNING_ERROR', 'Network error')
      expect(result).toBeNull()
    })
  })

  describe('fetchMyCertificates', () => {
    it('commits results on success', async () => {
      const commit = jest.fn()
      getMyCertificates.mockResolvedValue({
        data: { data: { results: [{ name: 'Cert 1' }] } }
      })

      await usersDashboard.actions.fetchMyCertificates({ commit })

      expect(commit).toHaveBeenCalledWith('SET_MY_CERTIFICATES_LOADING', true)
      expect(commit).toHaveBeenCalledWith('SET_MY_CERTIFICATES', [{ name: 'Cert 1' }])
    })

    it('commits empty array when response has no results', async () => {
      const commit = jest.fn()
      getMyCertificates.mockResolvedValue({ data: { data: {} } })

      await usersDashboard.actions.fetchMyCertificates({ commit })

      expect(commit).toHaveBeenCalledWith('SET_MY_CERTIFICATES', [])
    })

    it('commits empty array and error on catch', async () => {
      const commit = jest.fn()
      getMyCertificates.mockRejectedValue(new Error('API error'))

      const result = await usersDashboard.actions.fetchMyCertificates({ commit })

      expect(commit).toHaveBeenCalledWith('SET_MY_CERTIFICATES', [])
      expect(commit).toHaveBeenCalledWith('SET_MY_CERTIFICATES_ERROR', 'API error')
      expect(result).toBeNull()
    })
  })

  describe('fetchPhishingResult', () => {
    it('commits data on success', async () => {
      const commit = jest.fn()
      getPhishingResult.mockResolvedValue({
        data: { data: { score: 85 } }
      })

      await usersDashboard.actions.fetchPhishingResult({ commit })

      expect(commit).toHaveBeenCalledWith('SET_PHISHING_RESULT_LOADING', true)
      expect(commit).toHaveBeenCalledWith('SET_PHISHING_RESULT', { score: 85 })
    })

    it('commits null when response has no data', async () => {
      const commit = jest.fn()
      getPhishingResult.mockResolvedValue({ data: {} })

      await usersDashboard.actions.fetchPhishingResult({ commit })

      expect(commit).toHaveBeenCalledWith('SET_PHISHING_RESULT', null)
    })

    it('commits null and error on catch', async () => {
      const commit = jest.fn()
      getPhishingResult.mockRejectedValue(new Error('Failed'))

      const result = await usersDashboard.actions.fetchPhishingResult({ commit })

      expect(commit).toHaveBeenCalledWith('SET_PHISHING_RESULT', null)
      expect(commit).toHaveBeenCalledWith('SET_PHISHING_RESULT_ERROR', 'Failed')
      expect(result).toBeNull()
    })
  })

  describe('fetchUserInfo', () => {
    it('commits user info on success', async () => {
      const commit = jest.fn()
      getUserInfo.mockResolvedValue({
        data: {
          data: {
            email: 'user@test.com',
            department: 'IT',
            phoneNumber: '123',
            preferredLanguage: 'en',
            preferredLanguageResourceId: 'r1'
          }
        }
      })

      await usersDashboard.actions.fetchUserInfo({ commit })

      expect(commit).toHaveBeenCalledWith('SET_USER_INFO', {
        email: 'user@test.com',
        department: 'IT',
        phoneNumber: '123',
        preferredLanguage: 'en',
        preferredLanguageResourceId: 'r1'
      })
    })

    it('returns null on catch', async () => {
      const commit = jest.fn()
      getUserInfo.mockRejectedValue(new Error('Failed'))

      const result = await usersDashboard.actions.fetchUserInfo({ commit })

      expect(result).toBeNull()
      expect(commit).not.toHaveBeenCalledWith('SET_USER_INFO', expect.any(Object))
    })
  })

  describe('fetchTopPerformance', () => {
    it('commits empty array when response has no data', async () => {
      const commit = jest.fn()
      const getters = { getUserInfo: {} }
      getTopPerformance.mockResolvedValue({ data: {} })

      await usersDashboard.actions.fetchTopPerformance({ commit, getters })

      expect(commit).toHaveBeenCalledWith('SET_TOP_PERFORMANCE', [])
    })

    it('commits empty array and error on catch', async () => {
      const commit = jest.fn()
      const getters = { getUserInfo: {} }
      getTopPerformance.mockRejectedValue(new Error('Network error'))

      const result = await usersDashboard.actions.fetchTopPerformance({ commit, getters })

      expect(commit).toHaveBeenCalledWith('SET_TOP_PERFORMANCE', [])
      expect(commit).toHaveBeenCalledWith('SET_TOP_PERFORMANCE_ERROR', 'Network error')
      expect(result).toBeNull()
    })
  })

  describe('login', () => {
    it('throws on API error', async () => {
      const commit = jest.fn()
      loginApi.mockRejectedValue(new Error('Login failed'))

      await expect(
        usersDashboard.actions.login(
          { commit },
          { companyEmail: 'user@test.com', loginMethod: 'email' }
        )
      ).rejects.toThrow('Login failed')
    })
  })

  describe('mutations', () => {
    it('SET_TOP_PERFORMANCE_LOADING', () => {
      const state = createState()
      usersDashboard.mutations.SET_TOP_PERFORMANCE_LOADING(state, true)
      expect(state.topPerformance.isLoading).toBe(true)
    })

    it('SET_TOP_PERFORMANCE_ERROR', () => {
      const state = createState()
      usersDashboard.mutations.SET_TOP_PERFORMANCE_ERROR(state, 'Error message')
      expect(state.topPerformance.error).toBe('Error message')
    })

    it('SET_MY_LEARNING_LOADING', () => {
      const state = createState()
      usersDashboard.mutations.SET_MY_LEARNING_LOADING(state, true)
      expect(state.myLearning.isLoading).toBe(true)
      expect(state.myLearningLoading).toBe(true)
    })

    it('SET_MY_LEARNING_ERROR', () => {
      const state = createState()
      usersDashboard.mutations.SET_MY_LEARNING_ERROR(state, 'Error')
      expect(state.myLearning.error).toBe('Error')
      expect(state.myLearning.isLoading).toBe(false)
    })

    it('SET_MY_CERTIFICATES_LOADING', () => {
      const state = createState()
      usersDashboard.mutations.SET_MY_CERTIFICATES_LOADING(state, true)
      expect(state.myCertificates.isLoading).toBe(true)
      expect(state.myCertificatesLoading).toBe(true)
    })

    it('SET_MY_CERTIFICATES_ERROR', () => {
      const state = createState()
      usersDashboard.mutations.SET_MY_CERTIFICATES_ERROR(state, 'Error')
      expect(state.myCertificates.error).toBe('Error')
      expect(state.myCertificates.isLoading).toBe(false)
    })

    it('SET_MY_BADGES_LOADING', () => {
      const state = createState()
      usersDashboard.mutations.SET_MY_BADGES_LOADING(state, true)
      expect(state.myBadges.isLoading).toBe(true)
      expect(state.myBadgesLoading).toBe(true)
    })

    it('SET_MY_BADGES_ERROR', () => {
      const state = createState()
      usersDashboard.mutations.SET_MY_BADGES_ERROR(state, 'Error')
      expect(state.myBadges.error).toBe('Error')
      expect(state.myBadges.isLoading).toBe(false)
    })

    it('SET_PHISHING_RESULT_LOADING', () => {
      const state = createState()
      usersDashboard.mutations.SET_PHISHING_RESULT_LOADING(state, true)
      expect(state.phishingResult.isLoading).toBe(true)
    })

    it('SET_PHISHING_RESULT_ERROR', () => {
      const state = createState()
      usersDashboard.mutations.SET_PHISHING_RESULT_ERROR(state, 'Error')
      expect(state.phishingResult.error).toBe('Error')
    })

    it('RESET_STATE clears localStorage', () => {
      const state = createState()
      state.token = 't1'
      localStorage.setItem('usersDashboardAuth', '{}')
      localStorage.setItem('usersDashboardLoginSource', 'x')
      localStorage.setItem('usersDashboardLanguage', 'en')

      usersDashboard.mutations.RESET_STATE(state)

      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(localStorage.getItem('usersDashboardAuth')).toBeNull()
      expect(localStorage.getItem('usersDashboardLoginSource')).toBeNull()
      expect(localStorage.getItem('usersDashboardLanguage')).toBeNull()
    })
  })

  describe('getters', () => {
    it('getTopPerformanceError', () => {
      const state = createState()
      state.topPerformance.error = 'err'
      expect(usersDashboard.getters.getTopPerformanceError(state)).toBe('err')
    })

    it('getMyLearningError', () => {
      const state = createState()
      state.myLearning.error = 'err'
      expect(usersDashboard.getters.getMyLearningError(state)).toBe('err')
    })

    it('getMyCertificatesError', () => {
      const state = createState()
      state.myCertificates.error = 'err'
      expect(usersDashboard.getters.getMyCertificatesError(state)).toBe('err')
    })

    it('getMyBadgesError', () => {
      const state = createState()
      state.myBadges.error = 'err'
      expect(usersDashboard.getters.getMyBadgesError(state)).toBe('err')
    })

    it('getPhishingResultError', () => {
      const state = createState()
      state.phishingResult.error = 'err'
      expect(usersDashboard.getters.getPhishingResultError(state)).toBe('err')
    })

    it('getLabels with unsupported language falls back to en-GB', () => {
      const state = createState()
      state.language = 'xx-XX'
      const labels = usersDashboard.getters.getLabels(state)
      expect(labels.leaderboardTitle).toBeDefined()
    })
  })
})
