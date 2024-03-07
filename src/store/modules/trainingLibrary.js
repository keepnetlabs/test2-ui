import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const trainingLibrary = {
  namespaced: true,
  state: {
    tableColumns: [],
    renderedColumns: [],
    trainingSubTabs: [
      { name: TRAINING_LIBRARY_TYPES.ALL_TYPES, totalCount: 3490 },
      { name: TRAINING_LIBRARY_TYPES.LEARNING_PATH, totalCount: 122 },
      { name: TRAINING_LIBRARY_TYPES.TRAINING, totalCount: 2220 },
      { name: TRAINING_LIBRARY_TYPES.POSTER, totalCount: 111 },
      { name: TRAINING_LIBRARY_TYPES.INFOGRAPHIC, totalCount: 33 },
      { name: TRAINING_LIBRARY_TYPES.SCREENSAVER, totalCount: 54 }
    ],
    search: '',
    searchPlaceholder: 'Search in 3490 training by name',
    firstColFixed: false,
    lastColFixed: false,
    isListView: true,
    selectedTrainingContent: 'All Materials',
    selectedSubTrainingContent: 'All Types',
    filters: [],
    sortBy: '',
    deleteDialog: {
      status: false,
      title: 'Delete Training Material?',
      body: 'Are you sure you want to delete this training material?',
      selectedRow: null,
      type: 'training',
      onClose: () => {}
    },
    trainingPreviewDialog: {
      status: false,
      selectedRow: null,
      onClose: () => {}
    },
    posterPreviewDialog: {
      status: false,
      title: '',
      subtitle: '',
      type: '',
      showDetails: true,
      showTabs: true,
      showPosterName: true,
      icon: 'mdi-eye',
      selectedRow: null,
      onClose: () => {}
    }
  },
  getters: {
    getTableColumns: (state) => state.tableColumns,
    getRenderedColumns: (state) => state.renderedColumns,
    getSearch: (state) => state.search,
    getSearchPlaceholder: (state) => state.searchPlaceholder,
    getFirstColFixed: (state) => state.firstColFixed,
    getLastColFixed: (state) => state.lastColFixed,
    getIsLastView: (state) => state.isListView,
    getSelectedTrainingContent: (state) => state.selectedTrainingContent,
    getSelectedSubTrainingContent: (state) => state.selectedSubTrainingContent,
    getTrainingSubTabs: (state) => state.trainingSubTabs,
    getDeleteDialog: (state) => state.deleteDialog,
    getTrainingPreviewDialog: (state) => state.trainingPreviewDialog,
    getPosterPreviewDialog: (state) => state.posterPreviewDialog
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
    },
    SET_SELECTED_TRAINING_CONTENT(state, payload) {
      if (state.selectedTrainingContent === payload) return
      state.selectedTrainingContent = payload
    },
    SET_SUB_SELECTED_TRAINING_CONTENT(state, payload) {
      if (state.selectedSubTrainingContent === payload) return
      state.selectedSubTrainingContent = payload
    },
    SET_SORT_BY(state, payload) {
      state.sortBy = payload
    },
    SET_DELETE_DIALOG(state, payload) {
      state.deleteDialog = payload
    },
    SET_TRAINING_PREVIEW_DIALOG(state, payload) {
      state.trainingPreviewDialog = payload
    },
    SET_POSTER_PREVIEW_DIALOG(state, payload) {
      state.posterPreviewDialog = payload
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
    },
    setSelectedTrainingContent({ commit }, payload) {
      commit('SET_SELECTED_TRAINING_CONTENT', payload.name)
    },
    setSubSelectedTrainingContent({ commit }, payload) {
      commit('SET_SUB_SELECTED_TRAINING_CONTENT', payload.name)
    },
    setSortBy({ commit }, payload) {
      commit('SET_SORT_BY', payload)
    },
    setDeleteDialog({ commit }, payload) {
      commit('SET_DELETE_DIALOG', payload)
    },
    setTrainingPreviewDialog({ commit }, payload) {
      commit('SET_TRAINING_PREVIEW_DIALOG', payload)
    },
    setPosterPreviewDialog({ commit }, payload) {
      commit('SET_POSTER_PREVIEW_DIALOG', payload)
    },
    callForLanguages({ commit }) {
      commit('SET_DEFAULT_TABLE_SETTINGS')
    }
  }
}

export default trainingLibrary
