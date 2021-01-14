const tableStore = {
  namespaced: true,
  state: {
    tables: {}
  },
  getters: {},
  mutations: {
    setTable(state, payload) {
      const tableKey = payload.key
      delete payload.key
      state.tables[tableKey] = payload
    }
  },
  actions: {
    setTable({ commit }, payload = {}) {
      commit('setTable', payload)
    }
  }
}

export default tableStore
