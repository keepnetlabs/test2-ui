const incidentsStore = {
  namespaced: true,
  state: {
    incidents: {}
  },
  getters: {},
  mutations: {
    setIncidents(state, payload) {
      state.incidents = payload
    }
  },
  actions: {
    setIncidents({ commit }, payload = {}) {
      commit('setIncidents', payload)
    }
  }
}

export default incidentsStore
