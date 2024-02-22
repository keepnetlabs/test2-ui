const trainingLibrary = {
  namespaced: true,
  state: {
    tableColumns: [],
    renderedColumns: [],
    search: '',
    searchPlaceholder: 'Search in 3490 training by name',
    firstColFixed: false,
    lastColFixed: false,
    isListView: true
  },
  getters: {
    getTableColumns: (state) => state.tableColumns,
    getRenderedColumns: (state) => state.renderedColumns,
    getSearch: (state) => state.search,
    getSearchPlaceholder: (state) => state.searchPlaceholder,
    getFirstColFixed: (state) => state.firstColFixed,
    getLastColFixed: (state) => state.lastColFixed,
    getIsLastView: (state) => state.isListView
  },
  mutations: {
    SET_RENDERED_COLUMNS(state) {
      state.renderedColumns = state.tableColumns
        .filter((item) => item && item.show)
        .map((i) => i && i.property)
    },
    SET_TABLE_SETTINGS_CHANGE(state) {
      localStorage.setItem(
        'training-library-columns',
        JSON.stringify({
          renderedColumns: state.renderedColumns,
          firstColFixed: state.firstColFixed,
          lastColFixed: state.lastColFixed
        })
      )
    },
    SET_FIXED_COL(state, payload) {
      state[payload.key] = payload.value
    },
    SET_SEARCH(state, payload) {
      state.search = payload
    },
    SET_LIST_VIEW(state, payload) {
      state.isListView = payload
    },
    SET_DEFAULT_TABLE_SETTINGS(state) {
      const tableSettings = localStorage.getItem('training-library-columns')
      if (!tableSettings) return
      const { renderedColumns, firstColFixed, lastColFixed } = JSON.parse(tableSettings)
      state.renderedColumns = renderedColumns || []
      state.firstColFixed = firstColFixed
      state.lastColFixed = lastColFixed
      console.log('state', state)
    }
  },
  actions: {
    setChangeVisibilityOfColumn({ commit }) {
      commit('SET_RENDERED_COLUMNS')
      commit('SET_TABLE_SETTINGS_CHANGE')
    },
    setColFixedChange({ commit }, payload) {
      commit('SET_FIXED_COL', payload)
      commit('SET_TABLE_SETTINGS_CHANGE')
    },
    setSearch({ commit }, payload) {
      commit('SET_SEARCH', payload)
    },
    setListView({ commit }, payload) {
      commit('SET_LIST_VIEW', payload)
    },
    initDefaultTableSettings({ commit }) {
      commit('SET_DEFAULT_TABLE_SETTINGS')
    }
  }
}

export default trainingLibrary
