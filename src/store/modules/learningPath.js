import AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import {
  emptyLearningPathModalTrainingPreviewDialogObj,
  TRAINING_LIBRARY_SEARCH_TYPES,
  isInavailable
} from '@/components/TrainingLibrary/utils'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { trainingLibraryFilters } from '@/components/TrainingLibrary/TrainingLibraryFilters/utils'
const learningPath = {
  namespaced: true,
  state: {
    availableFor: [],
    learningPathTableData: [],
    selectedLearningPathTrainings: [],
    learningPathServerSideProps: new ServerSideProps(),
    learningPathAxiosPayload: getDefaultAxiosPayload({
      pageSize: 500,
      trainingSearchType: TRAINING_LIBRARY_SEARCH_TYPES.All,
      trainingType: null,
      trainingId: '',
      filter: {
        Condition: 'AND',
        FilterGroups: [
          {
            Condition: 'AND',
            FilterItems: [
              {
                FieldName: 'type',
                Value: '1,3,4',
                Operator: 'Include'
              }
            ],
            FilterGroups: []
          },
          {
            Condition: 'OR',
            FilterItems: [],
            FilterGroups: []
          }
        ]
      }
    }),
    learningPathFilterOptionsFilters: [
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
    learningPathSearch: '',
    learningPathSelectedTrainingContent: 'All Materials',
    learningPathSelectedSubTrainingContent: 'All Types',
    learningPathFilters: JSON.parse(JSON.stringify(trainingLibraryFilters)),
    learningPathFilterType: 'Or',
    learningPathSortBy: 'Date Created - New to old',
    learningPathModalTrainingPreviewDialog: emptyLearningPathModalTrainingPreviewDialogObj
  },
  getters: {
    getLearningPathFilterType: (state) => state.learningPathFilterType,
    getLearningPathSortBy: (state) => state.learningPathSortBy,
    getLearningPathSearch: (state) => state.learningPathSearch,
    getLearningPathFilters: (state) => state.learningPathFilters,
    getLearningPathTrainings: (state) => state.learningPathTableData,
    getSelectedLearningPathTrainings: (state) => state.selectedLearningPathTrainings,
    getLearningPathModalTrainingPreviewDialog: (state) =>
      state.learningPathModalTrainingPreviewDialog
  },
  mutations: {
    SET_LEARNING_PATH_SEARCH(state, payload) {
      state.learningPathSearch = payload
    },
    SET_LEARNING_PATH_SORT_BY(state, payload) {
      state.learningPathSortBy = payload
    },
    SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG(state, payload) {
      state.learningPathModalTrainingPreviewDialog = payload
    },
    APPEND_LEARNING_PATH_TABLE_DATA(state, payload) {
      const learningPathTrainingIds = state.selectedLearningPathTrainings.map(
        (t) => t.trainingId || t.detailTrainingId
      )
      const nonSelectedTrainings = payload.filter(
        (t) => !learningPathTrainingIds.includes(t.trainingId || t.detailTrainingId)
      )
      state.learningPathTableData = [...state.learningPathTableData, ...nonSelectedTrainings]
    },
    SET_LEARNING_PATH_TABLE_DATA(state, payload) {
      const learningPathTrainingIds = state.selectedLearningPathTrainings.map(
        (t) => t.trainingId || t.detailTrainingId
      )
      const nonSelectedTrainings = payload.filter(
        (t) => !learningPathTrainingIds.includes(t.trainingId || t.detailTrainingId)
      )
      state.learningPathTableData = [...nonSelectedTrainings]
    },
    SET_LEARNING_PATH_SERVER_SIDE_PROPS(state, payload) {
      state.learningPathServerSideProps.totalNumberOfRecords = payload.totalNumberOfRecords
      state.learningPathServerSideProps.totalNumberOfPages = payload.totalNumberOfPages
      state.learningPathServerSideProps.pageNumber = payload.pageNumber
    },
    SET_LEARNING_PATH_FILTER_ITEMS(state, payload) {
      const learningPathFilter = state.learningPathFilters.find((f) => f.key === payload.key)
      learningPathFilter.items = payload.items
    },
    SET_LEARNING_PATH_FILTER_ITEMS_SHOW(state, payload) {
      const learningPathFilter = state.learningPathFilters.find((f) => f.key === payload.key)
      learningPathFilter.show = payload.show
    },
    SET_SELECTED_LEARNING_PATH_TRAININGS(state, payload) {
      payload.sort((a, b) => (a.trainingOrder > b.trainingOrder ? 1 : -1))
      state.selectedLearningPathTrainings = payload
    },
    SELECT_LEARNING_PATH_TRAINING(state, { training = {}, index = 0 }) {
      state.learningPathTableData.splice(index, 1)
      state.selectedLearningPathTrainings.push(training)
    },
    REMOVE_TRAINING_FROM_LEARNING_PATH(state, { training = {}, index = 0 }) {
      state.learningPathTableData.splice(0, 0, training)
      state.selectedLearningPathTrainings.splice(index, 1)
    },
    RESET_LEARNING_PATH_FILTERS(state) {
      state.learningPathSelectedTrainingContent = 'All Materials'
      state.learningPathSelectedSubTrainingContent = 'All Types'
      state.learningPathAxiosPayload = getDefaultAxiosPayload({
        pageSize: 500,
        trainingSearchType: TRAINING_LIBRARY_SEARCH_TYPES.All,
        trainingType: null,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [
                {
                  FieldName: 'type',
                  Value: '1,3,4',
                  Operator: 'Include'
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      })
      state.learningPatghServerSideProps = new ServerSideProps()
      state.learningPatghFilterOptionsFilters = [
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
      state.learningPathSearch = ''
      state.learningPathFilters.forEach((f) => {
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
      state.learningPathFilterType = 'Or'
      state.learningPathSortBy = 'Date Created - New to old'
    },
    RESET_SELECTED_LEARNING_PATH_TRAININGS(state) {
      state.selectedLearningPathTrainings = []
    },
    ORDER_LEARNING_PATH_DATA(state, payload) {
      if (payload) {
        state.availableFor = payload
      }
      state.learningPathTableData.sort((a, b) => {
        return isInavailable(state.availableFor, a) === isInavailable(state.availableFor, b)
          ? 0
          : !isInavailable(state.availableFor, a)
          ? -1
          : 1
      })
    },
    RESET_LEARNING_PATH_DATA(state) {
      state.learningPathTableData = []
    },
    SET_LEARNING_PATH_SORT_BY_TO_PAYLOAD(state, payload) {
      state.learningPathAxiosPayload.ascending = payload.ascending
      state.learningPathAxiosPayload.orderBy = payload.orderBy
    },
    SET_LEARNING_PATH_SEARCH_TO_PAYLOAD(state) {
      const filterItems = state.learningPathAxiosPayload.filter.FilterGroups[1].FilterItems
      const fIndex = filterItems.findIndex((f) => f.FieldName === 'trainingName')
      state.learningPathServerSideProps.pageNumber = 1
      state.learningPathAxiosPayload.pageNumber = 1
      if (fIndex !== -1) {
        filterItems[fIndex].Value = state.learningPathSearch
      } else {
        filterItems.push({
          FieldName: 'trainingName',
          Value: state.learningPathSearch,
          Operator: 'Contains'
        })
      }
    },
    SET_LEARNING_PATH_FILTER_TO_PAYLOAD(state, payload) {
      const filterItems = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
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
    REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD(state, payload) {
      const filterItems = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
      if (payload.filterType === 'date' && payload.activeOperator === 'between') {
        const fIndex = filterItems.findIndex((f) => f.FieldName === payload.key)
        if (fIndex !== -1) filterItems.splice(fIndex, 2)
        return
      }
      const fIndex = filterItems.findIndex((f) => f.FieldName === payload.key)
      if (fIndex === -1) return
      if (payload.key === 'type' && payload?.activeValue?.length === 0) {
        filterItems[fIndex] = {
          FieldName: 'type',
          Value: '1,3,4',
          Operator: 'Include'
        }
        return
      }
      if (payload.filterType === 'search' || payload.filterType === 'longTextSearch') {
        if (!payload.activeValue.length) filterItems.splice(fIndex, 1)
        else filterItems[fIndex].Value = payload.activeValue.join(',')
      } else filterItems.splice(fIndex, 1)
    },
    RESET_LEARNING_PATH_PAGINATION(state) {
      state.learningPathAxiosPayload.pageNumber = 1
      state.learningPathServerSideProps.pageNumber = 1
    }
  },
  actions: {
    callForLearningPathTableData({ commit, state }, payload) {
      if (payload?.trainingId) {
        state.learningPathAxiosPayload.trainingId = payload.trainingId
      }
      AwarenessEducatorService.searchTraining(state.learningPathAxiosPayload).then((response) => {
        const {
          data: { data = {} }
        } = response
        const {
          results = [],
          totalNumberOfRecords = 0,
          totalNumberOfPages = 0,
          pageNumber = 1
        } = data
        if (payload?.isAppend) {
          commit('APPEND_LEARNING_PATH_TABLE_DATA', results)
          commit('ORDER_LEARNING_PATH_DATA')
        } else {
          commit('SET_LEARNING_PATH_TABLE_DATA', results)
          commit('ORDER_LEARNING_PATH_DATA')
        }
        commit('SET_LEARNING_PATH_SERVER_SIDE_PROPS', {
          totalNumberOfRecords,
          totalNumberOfPages,
          pageNumber
        })
      })
    },
    callForLearningPathTrainingLibrary({ dispatch }, payload) {
      dispatch('callForLearningPathTableData', payload)
    },
    setLearningPathSearch({ commit, dispatch }, payload) {
      commit('SET_LEARNING_PATH_SEARCH', payload)
      commit('SET_LEARNING_PATH_SEARCH_TO_PAYLOAD')
      dispatch('callForLearningPathTrainingLibrary')
    },
    setLearningPathSortBy({ commit, dispatch }, { item, sort }) {
      commit('SET_LEARNING_PATH_SORT_BY', `${item.text} - ${sort.text}`)
      commit('SET_LEARNING_PATH_SORT_BY_TO_PAYLOAD', {
        ascending: sort.ascending,
        orderBy: item.orderBy
      })
      dispatch('callForLearningPathTableData')
    },
    setLearningPathModalTrainingPreviewDialog({ commit }, payload) {
      commit('SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG', payload)
    },
    setLearningPathFilterItems({ commit }, payload) {
      commit('SET_LEARNING_PATH_FILTER_ITEMS', payload)
    },
    setLearningPathFilterToPayload({ commit, dispatch }, payload) {
      commit('SET_LEARNING_PATH_FILTER_TO_PAYLOAD', payload)
      commit('RESET_LEARNING_PATH_PAGINATION')
      dispatch('callForLearningPathTrainingLibrary')
    },
    removeLearningPathFilterFromPayload({ commit, dispatch }, payload) {
      commit('REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD', payload)
      commit('RESET_LEARNING_PATH_PAGINATION')
      dispatch('callForLearningPathTrainingLibrary')
    },
    learningPathClearAllFilters({ commit, dispatch }, { isFetch = false }) {
      commit('RESET_LEARNING_PATH_FILTERS')
      if (isFetch) dispatch('callForLearningPathTrainingLibrary')
    },
    resetSelectedLearningPathTrainings({ commit }) {
      commit('RESET_LEARNING_PATH_FILTERS')
      commit('RESET_SELECTED_LEARNING_PATH_TRAININGS')
      commit('RESET_LEARNING_PATH_DATA')
    },
    setSelectedLearningPathTrainings({ commit }, payload) {
      commit('SET_SELECTED_LEARNING_PATH_TRAININGS', payload)
    },
    selectLearningPathTraining({ commit }, payload) {
      commit('SELECT_LEARNING_PATH_TRAINING', payload)
    },
    removeTrainingFromLearningPath({ commit }, payload) {
      commit('REMOVE_TRAINING_FROM_LEARNING_PATH', payload)
    },
    orderLearningPathData({ commit }, payload) {
      commit('ORDER_LEARNING_PATH_DATA', payload)
    },
    getDataAfterValidScroll({ state, dispatch }) {
      if (
        state.learningPathAxiosPayload.pageNumber <
          state.learningPathServerSideProps.totalNumberOfPages &&
        !state.learningPathSearch
      ) {
        state.learningPathAxiosPayload.pageNumber += 1
        dispatch('callForLearningPathTrainingLibrary', { isAppend: true })
      }
    }
  }
}

export default learningPath
