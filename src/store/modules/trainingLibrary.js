import {
  TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS,
  TRAINING_LIBRARY_SETTINGS_COLUMNS,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
import {
  emptyInfographicPreviewDialogObj,
  emptyLearningPathPreviewDialogObj,
  emptyNewInfographicModalObj,
  emptyNewLearningPathModalObj,
  emptyNewPosterModalObj,
  emptyNewTrainingModalObj,
  emptyPosterPreviewDialogObj,
  emptyScreensaverPreviewDialogObj,
  emptyTrainingDeleteDialogObj,
  emptyTrainingPreviewDialogObj,
  emptyNewScreensaverModalObj,
  emptyTrainingSendModalObj,
  emptyPosterSendModalObj,
  emptyInfographicSendModalObj,
  emptyScreensaverSendModalObj,
  emptyLearningPathSendModalObj
} from '@/components/TrainingLibrary/utils'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { trainingLibraryFilters } from '../../components/TrainingLibrary/TrainingLibraryFilters/utils'
const trainingLibrary = {
  namespaced: true,
  state: {
    isTabsLoading: false,
    isLoading: false,
    tableData: [],
    axiosPayload: getDefaultAxiosPayload(),
    serverSideProps: new ServerSideProps(),
    tableColumns: [
      TRAINING_LIBRARY_SETTINGS_COLUMNS.TYPE,
      TRAINING_LIBRARY_SETTINGS_COLUMNS.CATEGORY,
      TRAINING_LIBRARY_SETTINGS_COLUMNS.TARGET_AUDIENCE,
      TRAINING_LIBRARY_SETTINGS_COLUMNS.LANGUAGES,
      TRAINING_LIBRARY_SETTINGS_COLUMNS.CREATED_BY,
      TRAINING_LIBRARY_SETTINGS_COLUMNS.COMPLIANCE,
      TRAINING_LIBRARY_SETTINGS_COLUMNS.TAGS,
      TRAINING_LIBRARY_SETTINGS_COLUMNS.VENDOR,
      TRAINING_LIBRARY_SETTINGS_COLUMNS.DATE_CREATED
    ],
    filterOptionsFilters: [
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.BEHAVIOURS,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TYPE,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.CATEGORY,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.LANGUAGES,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.CREATED_BY,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TARGET_AUDIENCE,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.COMPLIANCE,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.VENDOR,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.MATERIAL_NAME,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.DESCRIPTION,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TAGS,
      TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.DATE_CREATED
    ],
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
    filterItems: trainingLibraryFilters,
    filters: [],
    filterType: 'OR',
    sortBy: '',
    deleteDialog: emptyTrainingDeleteDialogObj,
    trainingPreviewDialog: emptyTrainingPreviewDialogObj,
    learningPathPreviewDialog: emptyLearningPathPreviewDialogObj,
    posterPreviewDialog: emptyPosterPreviewDialogObj,
    infographicPreviewDialog: emptyInfographicPreviewDialogObj,
    screensaverPreviewDialog: emptyScreensaverPreviewDialogObj,
    newTrainingModal: emptyNewTrainingModalObj,
    newLearningPathModal: emptyNewLearningPathModalObj,
    newPosterModal: emptyNewPosterModalObj,
    newInfographicModal: emptyNewInfographicModalObj,
    newScreensaverModal: emptyNewScreensaverModalObj,
    trainingSendModal: emptyTrainingSendModalObj,
    posterSendModal: emptyPosterSendModalObj,
    infographicSendModal: emptyInfographicSendModalObj,
    screensaverSendModal: emptyScreensaverSendModalObj,
    learningPathSendModal: emptyLearningPathSendModalObj
  },
  getters: {
    getIsLoading: (state) => state.isLoading,
    getTableColumns: (state) => state.tableColumns,
    getRenderedColumns: (state) => state.renderedColumns,
    getSearch: (state) => state.search,
    getSearchPlaceholder: (state) =>
      `Search in ${state.trainingSubTabs[0].totalCount} training by name`,
    getFirstColFixed: (state) => state.firstColFixed,
    getLastColFixed: (state) => state.lastColFixed,
    getIsLastView: (state) => state.isListView,
    getSelectedTrainingContent: (state) => state.selectedTrainingContent,
    getSelectedSubTrainingContent: (state) => state.selectedSubTrainingContent,
    getTrainingSubTabs: (state) => state.trainingSubTabs,
    getDeleteDialog: (state) => state.deleteDialog,
    getTrainingPreviewDialog: (state) => state.trainingPreviewDialog,
    getLearningPathPreviewDialog: (state) => state.learningPathPreviewDialog,
    getPosterPreviewDialog: (state) => state.posterPreviewDialog,
    getInfographicPreviewDialog: (state) => state.infographicPreviewDialog,
    getScreensaverPreviewDialog: (state) => state.screensaverPreviewDialog,
    getTableData: (state) => state.tableData,
    getServerSideProps: (state) => state.serverSideProps,
    getAxiosPayload: (state) => state.axiosPayload,
    getFilterType: (state) => state.filterType,
    getSortBy: (state) => state.sortBy,
    getTabsLoading: (state) => state.isTabsLoading,
    getFilterOptionsFilters: (state) => state.filterOptionsFilters,
    getNewTrainingModal: (state) => state.newTrainingModal,
    getNewLearningPathModal: (state) => state.newLearningPathModal,
    getNewPosterModal: (state) => state.newPosterModal,
    getNewInfographicModal: (state) => state.newInfographicModal,
    getNewScreensaverModal: (state) => state.newScreensaverModal,
    getTrainingSendModal: (state) => state.trainingSendModal,
    getPosterSendModal: (state) => state.posterSendModal,
    getInfographicSendModal: (state) => state.infographicSendModal,
    getScreensaverSendModal: (state) => state.screensaverSendModal,
    getLearningPathSendModal: (state) => state.learningPathSendModal,
    getFilterItems: (state) => state.filterItems
  },
  mutations: {
    SET_IS_LOADING(state, payload) {
      state.isLoading = payload
    },
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
      console.log('renderedColumns', renderedColumns)
      state.tableColumns.forEach((col) => (col.show = renderedColumns.includes(col.property)))
      state.renderedColumns = renderedColumns || []
      state.firstColFixed = firstColFixed
      state.lastColFixed = lastColFixed
      console.log('state', state)
    },
    SET_TRAINING_SUB_TABS(state, payload) {
      state.trainingSubTabs = payload
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
    SET_LEARNING_PATH_PREVIEW_DIALOG(state, payload) {
      state.learningPathPreviewDialog = payload
    },
    SET_POSTER_PREVIEW_DIALOG(state, payload) {
      state.posterPreviewDialog = payload
      console.log(state.posterPreviewDialog)
    },
    SET_INFO_GRAPHIC_PREVIEW_DIALOG(state, payload) {
      state.infographicPreviewDialog = payload
    },
    SET_SCREENSAVER_PREVIEW_DIALOG(state, payload) {
      state.screensaverPreviewDialog = payload
    },
    SET_TABLE_DATA(state, payload) {
      state.tableData = payload
    },
    SET_SERVER_SIDE_PROPS(state, payload) {
      state.serverSideProps.totalNumberOfRecords = payload.totalNumberOfRecords
      state.serverSideProps.totalNumberOfPages = payload.totalNumberOfPages
      state.serverSideProps.pageNumber = payload.pageNumber
    },
    SET_TABS_LOADING(state, payload) {
      state.isTabsLoading = payload
    },
    SET_NEW_TRAINING_MODAL(state, payload) {
      state.newTrainingModal = payload
    },
    SET_NEW_LEARNING_PATH_MODAL(state, payload) {
      state.newLearningPathModal = payload
    },
    SET_NEW_POSTER_MODAL(state, payload) {
      state.newPosterModal = payload
    },
    SET_NEW_INFOGRAPHIC_MODAL(state, payload) {
      state.newInfographicModal = payload
    },
    SET_NEW_SCREENSAVER_MODAL(state, payload) {
      state.newScreensaverModal = payload
    },
    SET_TRAINING_SEND_MODAL(state, payload) {
      state.trainingSendModal = payload
    },
    SET_POSTER_SEND_MODAL(state, payload) {
      state.posterSendModal = payload
    },
    SET_INFOGRAPHIC_SEND_MODAL(state, payload) {
      state.infographicSendModal = payload
    },
    SET_SCREENSAVER_SEND_MODAL(state, payload) {
      state.screensaverSendModal = payload
    },
    SET_AXIOS_PAYLOAD(state, payload) {
      state.axiosPayload = payload
    },
    SET_FILTER_TYPE(state, payload) {
      state.filterType = payload
    },
    SET_LEARNING_PATH_SEND_MODAL(state, payload) {
      state.learningPathSendModal = payload
    },
    SET_FILTER_ITEMS(state, payload) {
      const filter = state.filterItems.find((f) => f.key === payload.key)
      filter.items = payload.items
    }
  },
  actions: {
    callForTableData({ commit, state }) {
      commit('SET_IS_LOADING', true)
      AwarenessEducatorService.searchTraining(state.axiosPayload)
        .then((response) => {
          const {
            data: { data = {} }
          } = response
          const {
            results = [],
            totalNumberOfRecords = 0,
            totalNumberOfPages = 0,
            pageNumber = 1
          } = data
          commit('SET_TABLE_DATA', results)
          commit('SET_SERVER_SIDE_PROPS', {
            totalNumberOfRecords,
            totalNumberOfPages,
            pageNumber
          })
        })
        .finally(() => {
          commit('SET_IS_LOADING', false)
        })
    },
    callForTrainingLibrary({ commit, dispatch }) {
      dispatch('callForSummary')
      dispatch('callForTableData')
    },
    callForSummary({ commit }) {
      commit('SET_TABS_LOADING', true)
      setTimeout(() => {
        commit('SET_TRAINING_SUB_TABS', [
          { name: TRAINING_LIBRARY_TYPES.ALL_TYPES, totalCount: 3600 },
          { name: TRAINING_LIBRARY_TYPES.LEARNING_PATH, totalCount: 50 },
          { name: TRAINING_LIBRARY_TYPES.TRAINING, totalCount: 1212 },
          { name: TRAINING_LIBRARY_TYPES.POSTER, totalCount: 111 },
          { name: TRAINING_LIBRARY_TYPES.INFOGRAPHIC, totalCount: 1111 },
          { name: TRAINING_LIBRARY_TYPES.SCREENSAVER, totalCount: 111 }
        ])
        commit('SET_TABS_LOADING', false)
      }, 1000)
    },
    setChangeVisibilityOfColumn({ commit }) {
      commit('SET_RENDERED_COLUMNS')
      commit('SET_TABLE_SETTINGS_CHANGE')
    },
    setColFixedChange({ commit }, payload) {
      commit('SET_FIXED_COL', payload)
      commit('SET_TABLE_SETTINGS_CHANGE')
    },
    setSearch({ commit, dispatch }, payload) {
      commit('SET_SEARCH', payload)
      dispatch('callForTrainingLibrary')
    },
    setListView({ commit }, payload) {
      commit('SET_LIST_VIEW', payload)
    },
    initDefaultTableSettings({ commit }) {
      commit('SET_DEFAULT_TABLE_SETTINGS')
    },
    setSelectedTrainingContent({ commit, dispatch }, payload) {
      commit('SET_SELECTED_TRAINING_CONTENT', payload.name)
      dispatch('callForTrainingLibrary')
    },
    setSubSelectedTrainingContent({ commit, dispatch }, payload) {
      commit('SET_SUB_SELECTED_TRAINING_CONTENT', payload.name)
      dispatch('callForTableData')
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
    setLearningPathPreviewDialog({ commit }, payload) {
      commit('SET_LEARNING_PATH_PREVIEW_DIALOG', payload)
    },
    setPosterPreviewDialog({ commit }, payload) {
      commit('SET_POSTER_PREVIEW_DIALOG', payload)
    },
    setInfographicPreviewDialog({ commit }, payload) {
      commit('SET_INFO_GRAPHIC_PREVIEW_DIALOG', payload)
    },
    setScreenSaverPreviewDialog({ commit }, payload) {
      commit('SET_SCREENSAVER_PREVIEW_DIALOG', payload)
    },
    setNewTrainingModal({ commit }, payload) {
      commit('SET_NEW_TRAINING_MODAL', payload)
    },
    setNewLearningPathModal({ commit }, payload) {
      commit('SET_NEW_LEARNING_PATH_MODAL', payload)
    },
    setNewPosterModal({ commit }, payload) {
      commit('SET_NEW_POSTER_MODAL', payload)
    },
    setNewInfographicModal({ commit }, payload) {
      commit('SET_NEW_INFOGRAPHIC_MODAL', payload)
    },
    setNewScreensaverModal({ commit }, payload) {
      commit('SET_NEW_SCREENSAVER_MODAL', payload)
    },
    setTrainingSendModal({ commit }, payload) {
      commit('SET_TRAINING_SEND_MODAL', payload)
    },
    setPosterSendModal({ commit }, payload) {
      commit('SET_POSTER_SEND_MODAL', payload)
    },
    setInfographicSendModal({ commit }, payload) {
      commit('SET_INFOGRAPHIC_SEND_MODAL', payload)
    },
    setScreensaverSendModal({ commit }, payload) {
      commit('SET_SCREENSAVER_SEND_MODAL', payload)
    },
    setLearningPathSendModal({ commit }, payload) {
      commit('SET_LEARNING_PATH_SEND_MODAL', payload)
    },
    setAxiosPayload({ commit }, payload) {
      commit('SET_AXIOS_PAYLOAD', payload)
    },
    setFilterType({ commit }, payload) {
      commit('SET_FILTER_TYPE', payload)
    },
    setFilterItems({ commit }, payload) {
      commit('SET_FILTER_ITEMS', payload)
    }
  }
}

export default trainingLibrary
