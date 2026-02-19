jest.mock('@/api/reports', () => ({
  calculateGamificationBadges: jest.fn().mockResolvedValue({}),
  getGamificationBadgesCached: jest.fn().mockResolvedValue({ data: [] })
}))

import { calculateGamificationBadges, getGamificationBadgesCached } from '@/api/reports'
import gamificationBadges from '@/store/modules/gamificationBadges'

describe('store/modules/gamificationBadges', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getters', () => {
    it('returns only earned badges for valid cache', () => {
      const now = Date.now()
      const state = {
        badgesByUserId: {
          user1: {
            fetchedAt: now,
            badges: [{ earned: true }, { earned: false }, { earned: true }]
          }
        }
      }

      const result = gamificationBadges.getters.getBadgesForUser(state)('user1')
      expect(result).toHaveLength(2)
    })

    it('returns null when cache is expired', () => {
      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000_000)
      const state = {
        badgesByUserId: {
          user1: {
            fetchedAt: 1,
            badges: [{ earned: true }]
          }
        }
      }

      const result = gamificationBadges.getters.getBadgesForUser(state)('user1')
      expect(result).toBeNull()
      nowSpy.mockRestore()
    })

    it('hasValidCache returns false for missing user', () => {
      const state = { badgesByUserId: {} }
      expect(gamificationBadges.getters.hasValidCache(state)('missing')).toBe(false)
    })
  })

  describe('mutations', () => {
    it('SET_BADGES stores badges by user id', () => {
      const state = { badgesByUserId: {} }
      gamificationBadges.mutations.SET_BADGES(state, {
        targetUserResourceId: 'user1',
        badges: [{ earned: true }]
      })

      expect(state.badgesByUserId.user1.badges).toEqual([{ earned: true }])
      expect(typeof state.badgesByUserId.user1.fetchedAt).toBe('number')
    })

    it('CLEAR_BADGES resets cache object', () => {
      const state = { badgesByUserId: { user1: { badges: [] } } }
      gamificationBadges.mutations.CLEAR_BADGES(state)
      expect(state.badgesByUserId).toEqual({})
    })
  })

  describe('actions', () => {
    it('calculateBadges commits loading states and calls api', async () => {
      const commit = jest.fn()

      await gamificationBadges.actions.calculateBadges(
        { commit },
        ['u1', 'u2']
      )

      expect(commit).toHaveBeenNthCalledWith(1, 'SET_CALCULATING', true)
      expect(calculateGamificationBadges).toHaveBeenCalledWith({
        targetUserResourceIds: ['u1', 'u2']
      })
      expect(commit).toHaveBeenLastCalledWith('SET_CALCULATING', false)
    })

    it('calculateBadges resets loading state even when api fails', async () => {
      const commit = jest.fn()
      calculateGamificationBadges.mockRejectedValueOnce(new Error('boom'))

      await expect(
        gamificationBadges.actions.calculateBadges({ commit }, ['u1'])
      ).rejects.toThrow('boom')

      expect(commit).toHaveBeenNthCalledWith(1, 'SET_CALCULATING', true)
      expect(commit).toHaveBeenLastCalledWith('SET_CALCULATING', false)
    })

    it('fetchBadgesForUser does nothing for empty id', async () => {
      const commit = jest.fn()
      const getters = { hasValidCache: jest.fn().mockReturnValue(false) }

      await gamificationBadges.actions.fetchBadgesForUser({ commit, getters }, '')

      expect(getGamificationBadgesCached).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
    })

    it('fetchBadgesForUser skips api when cache is valid', async () => {
      const commit = jest.fn()
      const getters = { hasValidCache: jest.fn().mockReturnValue(true) }

      await gamificationBadges.actions.fetchBadgesForUser({ commit, getters }, 'u1')

      expect(getGamificationBadgesCached).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
    })

    it('fetchBadgesForUser commits parsed badges', async () => {
      const commit = jest.fn()
      const getters = { hasValidCache: jest.fn().mockReturnValue(false) }
      getGamificationBadgesCached.mockResolvedValueOnce({
        data: { data: { badges: [{ earned: true }] } }
      })

      await gamificationBadges.actions.fetchBadgesForUser({ commit, getters }, 'u1')

      expect(getGamificationBadgesCached).toHaveBeenCalledWith('u1')
      expect(commit).toHaveBeenCalledWith('SET_BADGES', {
        targetUserResourceId: 'u1',
        badges: [{ earned: true }]
      })
    })

    it('fetchBadgesForUser handles api errors without throwing', async () => {
      const commit = jest.fn()
      const getters = { hasValidCache: jest.fn().mockReturnValue(false) }
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      getGamificationBadgesCached.mockRejectedValueOnce(new Error('fetch failed'))

      await expect(
        gamificationBadges.actions.fetchBadgesForUser({ commit, getters }, 'u1')
      ).resolves.toBeUndefined()

      expect(commit).not.toHaveBeenCalledWith('SET_BADGES', expect.anything())
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('fetchBadgesForTable dispatches calculate and per-user fetch for uncached users', async () => {
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
        fn()
        return 0
      })
      const commit = jest.fn()
      const getters = {
        hasValidCache: jest.fn((id) => id === 'cached')
      }
      const dispatch = jest.fn().mockResolvedValue(undefined)

      await gamificationBadges.actions.fetchBadgesForTable(
        { commit, dispatch, getters },
        ['cached', 'u1', 'u2']
      )

      expect(commit).toHaveBeenNthCalledWith(1, 'SET_FETCHING', true)
      expect(dispatch).toHaveBeenCalledWith('calculateBadges', ['u1', 'u2'])
      expect(dispatch).toHaveBeenCalledWith('fetchBadgesForUser', 'u1')
      expect(dispatch).toHaveBeenCalledWith('fetchBadgesForUser', 'u2')
      expect(commit).toHaveBeenLastCalledWith('SET_FETCHING', false)
      setTimeoutSpy.mockRestore()
    })

    it('fetchBadgesForTable returns early for empty input', async () => {
      const commit = jest.fn()
      const getters = { hasValidCache: jest.fn() }
      const dispatch = jest.fn()

      await gamificationBadges.actions.fetchBadgesForTable(
        { commit, dispatch, getters },
        []
      )

      expect(commit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()
    })

    it('fetchBadgesForTable returns early when all ids are cached', async () => {
      const commit = jest.fn()
      const getters = { hasValidCache: jest.fn().mockReturnValue(true) }
      const dispatch = jest.fn()

      await gamificationBadges.actions.fetchBadgesForTable(
        { commit, dispatch, getters },
        ['u1', 'u2']
      )

      expect(commit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()
    })
  })
})
