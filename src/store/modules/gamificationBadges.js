import {
  calculateGamificationBadges,
  getGamificationBadgesCached
} from '@/api/reports'

const CACHE_TTL_MS = 15 * 60 * 1000 // 15 dakika - backend cache ile uyumlu
const CALCULATE_DELAY_MS = 5000 // Backend hesaplama süresi

const gamificationBadges = {
  namespaced: true,
  state: {
    /** { [targetUserResourceId]: { badges: [], fetchedAt: timestamp } } */
    badgesByUserId: {},
    isCalculating: false,
    isFetching: false
  },
  getters: {
    getBadgesForUser: (state) => (targetUserResourceId) => {
      const cached = state.badgesByUserId[targetUserResourceId]
      if (!cached) return null
      const isExpired = Date.now() - cached.fetchedAt > CACHE_TTL_MS
      if (isExpired) return null
      return (cached.badges || []).filter((b) => b.earned === true)
    },
    getAllBadgesForUser: (state) => (targetUserResourceId) => {
      const cached = state.badgesByUserId[targetUserResourceId]
      if (!cached) return null
      const isExpired = Date.now() - cached.fetchedAt > CACHE_TTL_MS
      return isExpired ? null : (cached.badges || [])
    },
    hasValidCache: (state) => (targetUserResourceId) => {
      const cached = state.badgesByUserId[targetUserResourceId]
      if (!cached) return false
      return Date.now() - cached.fetchedAt <= CACHE_TTL_MS
    },
    isCalculating: (state) => state.isCalculating,
    isFetching: (state) => state.isFetching
  },
  mutations: {
    SET_BADGES(state, { targetUserResourceId, badges }) {
      state.badgesByUserId = {
        ...state.badgesByUserId,
        [targetUserResourceId]: {
          badges: badges || [],
          fetchedAt: Date.now()
        }
      }
    },
    SET_CALCULATING(state, value) {
      state.isCalculating = value
    },
    SET_FETCHING(state, value) {
      state.isFetching = value
    },
    CLEAR_BADGES(state) {
      state.badgesByUserId = {}
    }
  },
  actions: {
    async calculateBadges({ commit }, targetUserResourceIds) {
      if (!targetUserResourceIds?.length) return
      commit('SET_CALCULATING', true)
      try {
        await calculateGamificationBadges({
          targetUserResourceIds: [...targetUserResourceIds]
        })
      } finally {
        commit('SET_CALCULATING', false)
      }
    },
    async fetchBadgesForUser({ commit, getters }, targetUserResourceId) {
      if (!targetUserResourceId) return
      if (getters.hasValidCache(targetUserResourceId)) return
      try {
        const response = await getGamificationBadgesCached(targetUserResourceId)
        const raw = response?.data?.data ?? response?.data
        const allBadges = Array.isArray(raw) ? raw : raw?.badges ?? []
        commit('SET_BADGES', { targetUserResourceId, badges: allBadges })
      } catch (error) {
        console.warn('[gamificationBadges] Fetch failed for', targetUserResourceId, error)
      }
    },
    async fetchBadgesForTable(
      { commit, dispatch, getters },
      targetUserResourceIds
    ) {
      if (!targetUserResourceIds?.length) return
      const idsToFetch = targetUserResourceIds.filter(
        (id) => !getters.hasValidCache(id)
      )
      if (!idsToFetch.length) return

      commit('SET_FETCHING', true)
      try {
        await dispatch('calculateBadges', idsToFetch)
        await new Promise((resolve) => setTimeout(resolve, CALCULATE_DELAY_MS))
        await Promise.all(
          idsToFetch.map((id) => dispatch('fetchBadgesForUser', id))
        )
      } finally {
        commit('SET_FETCHING', false)
      }
    }
  }
}

export default gamificationBadges
