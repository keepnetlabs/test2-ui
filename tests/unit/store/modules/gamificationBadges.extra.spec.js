jest.mock('@/api/reports', () => ({
  calculateGamificationBadges: jest.fn().mockResolvedValue({}),
  getGamificationBadgesCached: jest.fn().mockResolvedValue({ data: { data: [] } })
}))

import { getGamificationBadgesCached } from '@/api/reports'
import gamificationBadges from '@/store/modules/gamificationBadges'

const CACHE_TTL_MS = 15 * 60 * 1000

describe('gamificationBadges store (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getters branch coverage', () => {
    it('getBadgesForUser returns null when user not cached', () => {
      const state = { badgesByUserId: {} }
      expect(gamificationBadges.getters.getBadgesForUser(state)('user1')).toBeNull()
    })

    it('getBadgesForUser filters only earned badges', () => {
      const state = {
        badgesByUserId: {
          user1: {
            fetchedAt: Date.now(),
            badges: [{ earned: true, id: 1 }, { earned: false, id: 2 }]
          }
        }
      }
      const result = gamificationBadges.getters.getBadgesForUser(state)('user1')
      expect(result).toHaveLength(1)
      expect(result[0].earned).toBe(true)
    })

    it('getAllBadgesForUser returns all badges when cache valid', () => {
      const state = {
        badgesByUserId: {
          user1: {
            fetchedAt: Date.now(),
            badges: [{ earned: true }, { earned: false }]
          }
        }
      }
      const result = gamificationBadges.getters.getAllBadgesForUser(state)('user1')
      expect(result).toHaveLength(2)
    })

    it('hasValidCache returns true when cache fresh', () => {
      const state = {
        badgesByUserId: {
          user1: { fetchedAt: Date.now(), badges: [] }
        }
      }
      expect(gamificationBadges.getters.hasValidCache(state)('user1')).toBe(true)
    })
  })

  describe('mutations branch coverage', () => {
    it('SET_BADGES handles null badges', () => {
      const state = { badgesByUserId: {} }
      gamificationBadges.mutations.SET_BADGES(state, {
        targetUserResourceId: 'u1',
        badges: null
      })
      expect(state.badgesByUserId.u1.badges).toEqual([])
    })

    it('SET_CALCULATING and SET_FETCHING update state', () => {
      const state = JSON.parse(JSON.stringify(gamificationBadges.state))
      gamificationBadges.mutations.SET_CALCULATING(state, true)
      gamificationBadges.mutations.SET_FETCHING(state, true)
      expect(state.isCalculating).toBe(true)
      expect(state.isFetching).toBe(true)
    })
  })

  describe('actions branch coverage', () => {
    it('calculateBadges returns early when no ids', async () => {
      const commit = jest.fn()
      await gamificationBadges.actions.calculateBadges({ commit }, [])
      expect(commit).not.toHaveBeenCalled()
    })

    it('calculateBadges returns early when ids undefined', async () => {
      const commit = jest.fn()
      await gamificationBadges.actions.calculateBadges({ commit }, undefined)
      expect(commit).not.toHaveBeenCalled()
    })

    it('fetchBadgesForUser returns early when no targetUserResourceId', async () => {
      const commit = jest.fn()
      const getters = { hasValidCache: () => false }
      await gamificationBadges.actions.fetchBadgesForUser(
        { commit, getters },
        null
      )
      expect(getGamificationBadgesCached).not.toHaveBeenCalled()
    })

    it('fetchBadgesForUser skips when cache valid', async () => {
      const commit = jest.fn()
      const getters = { hasValidCache: () => true }
      await gamificationBadges.actions.fetchBadgesForUser(
        { commit, getters },
        'user1'
      )
      expect(getGamificationBadgesCached).not.toHaveBeenCalled()
    })

    it('fetchBadgesForUser handles response.data.badges shape', async () => {
      getGamificationBadgesCached.mockResolvedValueOnce({
        data: { badges: [{ earned: true }] }
      })
      const commit = jest.fn()
      const getters = { hasValidCache: () => false }
      await gamificationBadges.actions.fetchBadgesForUser(
        { commit, getters },
        'user1'
      )
      expect(commit).toHaveBeenCalledWith('SET_BADGES', {
        targetUserResourceId: 'user1',
        badges: [{ earned: true }]
      })
    })
  })
})
