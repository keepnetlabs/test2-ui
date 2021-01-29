const communitiesStore = {
  namespaced: true,
  state: {
    communities: {}
  },
  getters: {},
  mutations: {
    setCommunities(state, payload) {
      state.communities = payload
    }
  },
  actions: {
    setCommunities({ commit }, payload = {}) {
      commit('setCommunities', payload)
    }
  }
}

export default communitiesStore
