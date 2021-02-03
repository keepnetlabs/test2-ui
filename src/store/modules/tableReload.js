const tableReloadStore = {
  namespaced: true,
  state: {
    tableReload: false
  },
  getters: {},
  mutations: {
    setTableReload(state, payload) {
      state.tableReload = payload
    }
  },
  actions: {
    setTableReload({ commit }, payload = {}) {
      commit('setTableReload', payload)
    }
  }
}

export default tableReloadStore
