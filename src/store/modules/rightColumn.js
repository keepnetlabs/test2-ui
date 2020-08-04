const rightColumn = {
  namespaced: true,
  state: {
    reloadRightColumnData: false
  },
  getters: {
    getReloadRightColumnData: (state) => state.reloadRightColumnData
  },
  mutations: {
    setReloadRightColumnData(state, payload) {
      state.reloadRightColumnData = payload
    }
  },
  actions: {
    changeReloadRightColumnData({ commit }, payload) {
      commit('setReloadRightColumnData', payload)
    }
  }
}

export default rightColumn
