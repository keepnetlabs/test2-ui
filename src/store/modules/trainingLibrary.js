import {
  TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS,
  TRAINING_LIBRARY_MAIN_TABS,
  TRAINING_LIBRARY_PAYLOAD_TYPES,
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
  emptyLearningPathSendModalObj,
  TRAINING_LIBRARY_SEARCH_TYPES
} from '@/components/TrainingLibrary/utils'
import {
  cancellableAxiosRequest,
  createRandomCryptStringNumber,
  getDefaultAxiosPayload
} from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { trainingLibraryFilters } from '@/components/TrainingLibrary/TrainingLibraryFilters/utils'
const cancellableSummaryRequest = cancellableAxiosRequest(
  AwarenessEducatorService.getTrainingTypeCount
)
const cancellableDataRequest = cancellableAxiosRequest(AwarenessEducatorService.searchTraining)
const trainingLibrary = {
  namespaced: true,
  state: {
    isTabsLoading: false,
    isLoading: false,
    tableData: [],
    axiosPayload: getDefaultAxiosPayload({
      trainingSearchType: TRAINING_LIBRARY_SEARCH_TYPES.All,
      trainingType: null
    }),
    serverSideProps: new ServerSideProps(),
    tableColumns: [
      Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.TYPE),
      Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.CATEGORY),
      Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.TARGET_AUDIENCE),
      Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.LANGUAGES),
      Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.CREATED_BY),
      Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.COMPLIANCE),
      Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.TAGS),
      Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.VENDOR),
      Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.DATE_CREATED)
    ],
    filterOptionsFilters: [
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.BEHAVIOURS),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TYPE),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.CATEGORY),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.LANGUAGES),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.CREATED_BY),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TARGET_AUDIENCE),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.COMPLIANCE),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.VENDOR),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.MATERIAL_NAME),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.DESCRIPTION),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TAGS),
      Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.DATE_CREATED)
    ],
    renderedColumns: [],
    trainingSubTabs: [
      { name: TRAINING_LIBRARY_TYPES.ALL_TYPES, totalCount: 0 },
      { name: TRAINING_LIBRARY_TYPES.LEARNING_PATH, totalCount: 0 },
      { name: TRAINING_LIBRARY_TYPES.TRAINING, totalCount: 0 },
      { name: TRAINING_LIBRARY_TYPES.POSTER, totalCount: 0 },
      { name: TRAINING_LIBRARY_TYPES.INFOGRAPHIC, totalCount: 0 },
      { name: TRAINING_LIBRARY_TYPES.SCREENSAVER, totalCount: 0 }
    ],
    search: '',
    searchPlaceholder: 'Search in 3490 training by name',
    firstColFixed: true,
    lastColFixed: true,
    isListView: true,
    selectedTrainingContent: 'All Materials',
    selectedSubTrainingContent: 'All Types',
    filters: JSON.parse(JSON.stringify(trainingLibraryFilters)),
    filtersRenderKey: `filters-key-${createRandomCryptStringNumber()}`,
    filterType: 'Or',
    sortBy: 'Date Created - New to old',
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
    getSearchPlaceholder: (state) => {
      if (state.isTabsLoading) return 'Loading...'
      return `Search in ${state.trainingSubTabs[0].totalCount} training by name`
    },
    getFirstColFixed: (state) => state.firstColFixed,
    getLastColFixed: (state) => state.lastColFixed,
    getIsListView: (state) => state.isListView,
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
    getFilters: (state) => state.filters,
    getFiltersRenderKey: (state) => state.filtersRenderKey
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
          firstColFixed: state.firstColFixed || false,
          lastColFixed: state.lastColFixed || false
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
      if (state.isListView === payload) return
      state.axiosPayload.pageNumber = 1
      state.serverSideProps.pageNumber = 1
      if (payload) {
        state.serverSideProps.pageSize = 10
        state.axiosPayload.pageSize = 10
      } else {
        state.serverSideProps.pageSize = 9
        state.axiosPayload.pageSize = 9
      }
      state.isListView = payload
    },
    SET_DEFAULT_TABLE_SETTINGS(state) {
      const tableSettings = localStorage.getItem('training-library-columns')
      if (!tableSettings) return
      const { renderedColumns, firstColFixed, lastColFixed } = JSON.parse(tableSettings)
      state.tableColumns.forEach((col) => (col.show = renderedColumns.includes(col.property)))
      if (renderedColumns) state.renderedColumns = renderedColumns
      state.firstColFixed = !!firstColFixed
      state.lastColFixed = !!lastColFixed
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
      const filter = state.filters.find((f) => f && payload && f.key === payload.key)
      filter.items = payload.items
    },
    SET_FILTER_ITEMS_SHOW(state, payload) {
      const filter = state.filters.find((f) => f && payload && f.key === payload.key)
      filter.show = payload.show
    },
    SET_DEFAULT_TABLE_FILTERS(state) {
      const filters = localStorage.getItem('training-library-filters')
      if (!filters) {
        state.axiosPayload.filter.FilterGroups[0].Condition = state.filterType = 'Or'
        return
      }
      const {
        filters: savedFilters = {},
        filterOptionsFilters = [],
        filterType = 'Or',
        sortBy = 'Date Created - New to old',
        search = '',
        axiosPayload = getDefaultAxiosPayload({
          trainingSearchType: TRAINING_LIBRARY_SEARCH_TYPES.All,
          trainingType: null
        }),
        selectedTrainingContent = 'All Materials',
        selectedSubTrainingContent = 'All Types'
      } = JSON.parse(filters)
      state.filters = savedFilters
      state.filterOptionsFilters = filterOptionsFilters
      state.filterType = filterType
      state.sortBy = sortBy
      state.search = search
      state.axiosPayload = axiosPayload
      state.selectedTrainingContent = selectedTrainingContent
      state.selectedSubTrainingContent = selectedSubTrainingContent
      setTimeout(() => {
        state.filtersRenderKey = `filters-key-${createRandomCryptStringNumber()}`
      }, 500)
    },
    SET_FILTERS_TO_LOCAL_STORAGE(state) {
      localStorage.setItem(
        'training-library-filters',
        JSON.stringify({
          filterType: state.filterType,
          filters: state.filters,
          filterOptionsFilters: state.filterOptionsFilters,
          sortBy: state.sortBy,
          search: state.search,
          axiosPayload: state.axiosPayload,
          selectedTrainingContent: state.selectedTrainingContent,
          selectedSubTrainingContent: state.selectedSubTrainingContent
        })
      )
    },
    RESET_TABLE_PARAMS(state) {
      state.isTabsLoading = false
      state.isLoading = false
      state.tableData = []
      state.tableColumns = [
        Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.TYPE),
        Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.CATEGORY),
        Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.TARGET_AUDIENCE),
        Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.LANGUAGES),
        Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.CREATED_BY),
        Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.COMPLIANCE),
        Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.TAGS),
        Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.VENDOR),
        Object.assign({}, TRAINING_LIBRARY_SETTINGS_COLUMNS.DATE_CREATED)
      ]
      state.renderedColumns = []
    },
    RESET_FILTERS(state) {
      state.selectedTrainingContent = 'All Materials'
      state.selectedSubTrainingContent = 'All Types'
      state.axiosPayload = getDefaultAxiosPayload({
        trainingSearchType: TRAINING_LIBRARY_SEARCH_TYPES.All,
        trainingType: null
      })
      const oldPageSize = state.serverSideProps.pageSize
      state.serverSideProps = new ServerSideProps()
      state.axiosPayload.pageSize = oldPageSize
      state.serverSideProps.pageSize = oldPageSize
      state.filterOptionsFilters = [
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.BEHAVIOURS),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TYPE),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.CATEGORY),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.LANGUAGES),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.CREATED_BY),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TARGET_AUDIENCE),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.COMPLIANCE),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.VENDOR),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.MATERIAL_NAME),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.DESCRIPTION),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TAGS),
        Object.assign({}, TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.DATE_CREATED)
      ]
      state.search = ''
      state.filters.forEach((f) => {
        if (f.filterType === 'search' || f.filterType === 'longTextSearch') {
          f.value = []
          f.activeValue = []
          f.operator = 'Include'
          f.activeOperator = 'Include'
        } else if (f.filterType === 'select') {
          f.value = ''
          f.activeValue = ''
          f.operator = 'Contains'
          f.activeOperator = 'Contains'
        } else {
          f.value = ''
          f.activeValue = ''
          f.operator = '='
          f.activeOperator = '='
        }
        f.isFilterActive = false
      })
      state.filterType = 'Or'
      state.sortBy = 'Date Created - New to old'
      state.filtersRenderKey = `filters-key-${createRandomCryptStringNumber()}`
    },
    SET_SORT_BY_TO_PAYLOAD(state, payload) {
      state.axiosPayload.ascending = payload.ascending
      state.axiosPayload.orderBy = payload.orderBy
    },
    SET_SEARCH_TO_PAYLOAD(state) {
      const filterItems = state.axiosPayload.filter.FilterGroups[1].FilterItems
      const fIndex = filterItems.findIndex((f) => f.FieldName === 'trainingName')
      state.serverSideProps.pageNumber = 1
      state.axiosPayload.pageNumber = 1
      if (fIndex !== -1) {
        filterItems[fIndex].Value = state.search
      } else {
        filterItems.push({
          FieldName: 'trainingName',
          Value: state.search,
          Operator: 'Contains'
        })
      }
    },
    SET_FILTER_TO_PAYLOAD(state, payload) {
      const filterItems = state.axiosPayload.filter.FilterGroups[0].FilterItems
      const fIndex = filterItems.findIndex((f) => f.FieldName === payload.key)
      let value
      if (typeof payload.activeValue === 'string') {
        value = payload.activeValue.trim()
      } else if (Array.isArray(payload.activeValue)) {
        if (payload.activeOperator === 'between') {
          filterItems.push({
            FieldName: payload.key,
            Value: payload.activeValue[0],
            Operator: '>='
          })
          filterItems.push({
            FieldName: payload.key,
            Value: payload.activeValue[1],
            Operator: '<='
          })
          return
        }
        value = payload.activeValue.join(',')
      }
      if (fIndex !== -1) {
        filterItems[fIndex].Value = value
      } else {
        filterItems.push({
          FieldName: payload.key,
          Value: value,
          Operator: payload.activeOperator
        })
      }
    },
    SET_FILTER_TYPE_TO_PAYLOAD(state) {
      state.axiosPayload.filter.FilterGroups[0].Condition = state.filterType
    },
    REMOVE_FILTER_FROM_PAYLOAD(state, payload) {
      const filterItems = state.axiosPayload.filter.FilterGroups[0].FilterItems
      if (payload.filterType === 'date' && payload.activeOperator === 'between') {
        const fIndex = filterItems.findIndex((f) => f.FieldName === payload.key)
        if (fIndex !== -1) filterItems.splice(fIndex, 2)
        return
      }
      const fIndex = filterItems.findIndex((f) => f.FieldName === payload.key)
      if (fIndex === -1) return
      if (payload.filterType === 'search' || payload.filterType === 'longTextSearch') {
        if (!payload.activeValue.length) filterItems.splice(fIndex, 1)
        else filterItems[fIndex].Value = payload.activeValue.join(',')
      } else filterItems.splice(fIndex, 1)
    },
    RESET_PAGINATION(state) {
      state.axiosPayload.pageNumber = 1
      state.serverSideProps.pageNumber = 1
    },
    SET_TRAINING_SEARCH_TYPE(state, payload) {
      state.axiosPayload.trainingSearchType = payload
    },
    SET_TRAINING_TYPE(state, payload) {
      if (payload === TRAINING_LIBRARY_PAYLOAD_TYPES.ALL_TYPES) {
        state.axiosPayload.trainingType = null
      } else {
        state.axiosPayload.trainingType = payload
      }
    }
  },
  actions: {
    callForTableData({ commit, state }) {
      commit('SET_IS_LOADING', true)
      let isAborted = false
      cancellableDataRequest(state.axiosPayload)
        .then((response) => {
          if (!Object.keys(response).length) {
            isAborted = true
            return
          }
          isAborted = false
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
          if (!isAborted) commit('SET_IS_LOADING', false)
        })
    },
    callForTrainingLibrary({ dispatch }) {
      dispatch('callForSummary')
      dispatch('callForTableData')
    },
    callForSummary({ commit, state }, payload) {
      if (payload?.hideLoader) commit('SET_TABS_LOADING', false)
      else commit('SET_TABS_LOADING', true)
      const copyOfPayload = JSON.parse(JSON.stringify(state.axiosPayload))
      copyOfPayload.pageNumber = 1
      let isAborted = false
      cancellableSummaryRequest(copyOfPayload)
        .then((response) => {
          if (!Object.keys(response).length) {
            isAborted = true
            return
          }
          isAborted = false
          const { data: { data } = {} } = response || {}
          commit('SET_TRAINING_SUB_TABS', [
            {
              name: TRAINING_LIBRARY_TYPES.ALL_TYPES,
              totalCount: data.reduce((acc, item) => {
                return acc + item.trainingCount
              }, 0)
            },
            {
              name: TRAINING_LIBRARY_TYPES.LEARNING_PATH,
              totalCount: getTotalCountByType(data, TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH)
            },
            {
              name: TRAINING_LIBRARY_TYPES.TRAINING,
              totalCount: getTotalCountByType(data, TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING)
            },
            {
              name: TRAINING_LIBRARY_TYPES.POSTER,
              totalCount: getTotalCountByType(data, TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
            },
            {
              name: TRAINING_LIBRARY_TYPES.INFOGRAPHIC,
              totalCount: getTotalCountByType(data, TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
            },
            {
              name: TRAINING_LIBRARY_TYPES.SCREENSAVER,
              totalCount: getTotalCountByType(data, TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER)
            }
          ])
        })
        .finally(() => {
          if (!isAborted) commit('SET_TABS_LOADING', false)
        })
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
      commit('SET_SEARCH_TO_PAYLOAD')
      dispatch('callForTrainingLibrary')
    },
    setListView({ commit, dispatch, state }, payload) {
      if (state.isListView === payload) return
      commit('SET_LIST_VIEW', payload)
      dispatch('callForTableData')
    },
    initDefaultTableSettings({ commit }) {
      commit('SET_RENDERED_COLUMNS')
      commit('SET_DEFAULT_TABLE_SETTINGS')
    },
    setSelectedTrainingContent({ commit, dispatch, state }, payload) {
      if (state.selectedTrainingContent === payload.name) return
      let trainingSearchType = getTrainingSearchType(payload.name)
      commit('SET_SELECTED_TRAINING_CONTENT', payload.name)
      commit('SET_TRAINING_SEARCH_TYPE', trainingSearchType)
      commit('RESET_PAGINATION')
      dispatch('callForTrainingLibrary')
    },
    setSubSelectedTrainingContent({ commit, dispatch, state }, payload) {
      if (state.selectedSubTrainingContent === payload.name) return
      let trainingType = getTrainingType(payload.name)
      commit('SET_SUB_SELECTED_TRAINING_CONTENT', payload.name)
      commit('SET_TRAINING_TYPE', trainingType)
      commit('RESET_PAGINATION')
      dispatch('callForTableData')
      dispatch('callForSummary', { hideLoader: true })
    },
    setSortBy({ commit, dispatch }, { item, sort }) {
      commit('SET_SORT_BY', `${item.text} - ${sort.text}`)
      commit('SET_SORT_BY_TO_PAYLOAD', { ascending: sort.ascending, orderBy: item.orderBy })
      dispatch('callForTableData')
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
    setNewLearningPathModal({ commit, dispatch }, payload) {
      commit('SET_NEW_LEARNING_PATH_MODAL', payload)
      if (payload.status === false) {
        dispatch('learningPath/resetSelectedLearningPathTrainings', undefined, { root: true })
      }
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
    setFilterType({ commit, dispatch }, payload) {
      commit('SET_FILTER_TYPE', payload)
      commit('SET_FILTER_TYPE_TO_PAYLOAD')
      commit('RESET_PAGINATION')
      dispatch('callForTableData')
    },
    setFilterItems({ commit }, payload) {
      commit('SET_FILTER_ITEMS', payload)
    },
    setFilterItemsShow({ commit, dispatch }, payload) {
      commit('SET_FILTER_ITEMS_SHOW', payload)
      dispatch('learningPath/setLearningPathFilterItemsShow', payload, { root: true })
    },
    initDefaultTableFilters({ commit }) {
      commit('SET_DEFAULT_TABLE_FILTERS')
    },
    restoreDefaultFilters({ commit, dispatch }) {
      const filters = localStorage.getItem('training-library-filters')
      if (!filters) commit('RESET_FILTERS')
      else commit('SET_DEFAULT_TABLE_FILTERS')
      dispatch('callForTrainingLibrary')
    },
    writeFiltersToLocalStorage({ commit }) {
      commit('SET_FILTERS_TO_LOCAL_STORAGE')
    },
    resetState({ commit }) {
      commit('RESET_TABLE_PARAMS')
      commit('RESET_FILTERS')
    },
    setFilterToPayload({ commit, dispatch }, payload) {
      commit('SET_FILTER_TO_PAYLOAD', payload)
      commit('RESET_PAGINATION')
      dispatch('callForTrainingLibrary')
    },
    removeFilterFromPayload({ commit, dispatch }, payload) {
      commit('REMOVE_FILTER_FROM_PAYLOAD', payload)
      commit('RESET_PAGINATION')
      dispatch('callForTrainingLibrary')
    },
    clearAllFilters({ commit, dispatch }) {
      commit('RESET_FILTERS')
      dispatch('callForTrainingLibrary')
    },
    resetAllModals({ commit, dispatch }) {
      dispatch('learningPath/resetSelectedLearningPathTrainings', undefined, { root: true })
      commit('SET_NEW_LEARNING_PATH_MODAL', emptyNewLearningPathModalObj)
      commit('SET_NEW_INFOGRAPHIC_MODAL', emptyNewInfographicModalObj)
      commit('SET_NEW_TRAINING_MODAL', emptyNewTrainingModalObj)
      commit('SET_NEW_SCREENSAVER_MODAL', emptyNewScreensaverModalObj)
      commit('SET_NEW_POSTER_MODAL', emptyNewPosterModalObj)
      commit('SET_LEARNING_PATH_SEND_MODAL', emptyLearningPathSendModalObj)
      commit('SET_INFOGRAPHIC_SEND_MODAL', emptyInfographicSendModalObj)
      commit('SET_TRAINING_SEND_MODAL', emptyTrainingSendModalObj)
      commit('SET_SCREENSAVER_SEND_MODAL', emptyScreensaverSendModalObj)
      commit('SET_POSTER_SEND_MODAL', emptyPosterSendModalObj)
      commit('SET_LEARNING_PATH_PREVIEW_DIALOG', emptyLearningPathPreviewDialogObj)
      commit('SET_INFO_GRAPHIC_PREVIEW_DIALOG', emptyInfographicPreviewDialogObj)
      commit('SET_TRAINING_PREVIEW_DIALOG', emptyTrainingPreviewDialogObj)
      commit('SET_SCREENSAVER_PREVIEW_DIALOG', emptyScreensaverPreviewDialogObj)
      commit('SET_POSTER_PREVIEW_DIALOG', emptyPosterPreviewDialogObj)
      commit('SET_DELETE_DIALOG', emptyTrainingDeleteDialogObj)
    }
  }
}
const getTotalCountByType = (data, key) => {
  return data.find((item) => item.trainingType === key)?.trainingCount
}
const getTrainingSearchType = (name) => {
  let trainingSearchType
  if (name === TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS) {
    trainingSearchType = TRAINING_LIBRARY_SEARCH_TYPES.All
  } else if (name === TRAINING_LIBRARY_MAIN_TABS.MOST_POPULAR) {
    trainingSearchType = TRAINING_LIBRARY_SEARCH_TYPES.MostPopular
  } else if (name === TRAINING_LIBRARY_MAIN_TABS.FAVOURITES) {
    trainingSearchType = TRAINING_LIBRARY_SEARCH_TYPES.Favourites
  } else trainingSearchType = TRAINING_LIBRARY_SEARCH_TYPES.CreatedByMe
  return trainingSearchType
}
const getTrainingType = (name) => {
  let trainingType
  if (name === TRAINING_LIBRARY_TYPES.ALL_TYPES)
    trainingType = TRAINING_LIBRARY_PAYLOAD_TYPES.ALL_TYPES
  else if (name === TRAINING_LIBRARY_TYPES.LEARNING_PATH)
    trainingType = TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
  else if (name === TRAINING_LIBRARY_TYPES.TRAINING)
    trainingType = TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
  else if (name === TRAINING_LIBRARY_TYPES.POSTER)
    trainingType = TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
  else if (name === TRAINING_LIBRARY_TYPES.INFOGRAPHIC)
    trainingType = TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
  else if (name === TRAINING_LIBRARY_TYPES.SCREENSAVER)
    trainingType = TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER
  return trainingType
}

export default trainingLibrary
