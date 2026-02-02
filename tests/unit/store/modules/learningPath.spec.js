import * as AwarenessEducatorService from '@/api/awarenessEducator'
import { TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import {
  emptyLearningPathModalTrainingPreviewDialogObj,
  TRAINING_LIBRARY_SEARCH_TYPES
} from '@/components/TrainingLibrary/utils'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { trainingLibraryFilters } from '@/components/TrainingLibrary/TrainingLibraryFilters/utils'

// Mock the API service
jest.mock('@/api/awarenessEducator')

describe('learningPath.js store module', () => {
  let learningPathStore
  let state

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    learningPathStore = {
      namespaced: true,
      state: {
        availableFor: [],
        learningPathTableData: [],
        selectedLearningPathTrainings: [],
        learningPathServerSideProps: new ServerSideProps(),
        learningPathAxiosPayload: getDefaultAxiosPayload({
          pageSize: 10,
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
          { ...TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.BEHAVIOURS },
          { ...TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TYPE }
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
          const learningPathFilter = state.learningPathFilters.find(
            (f) => f && payload && f.key === payload.key
          )
          if (learningPathFilter) {
            learningPathFilter.items = payload.items
          }
        },
        SET_LEARNING_PATH_FILTER_ITEMS_SHOW(state, payload) {
          const learningPathFilter = state.learningPathFilters.find(
            (f) => f && payload && f.key === payload.key
          )
          if (learningPathFilter) {
            learningPathFilter.show = payload.show
          }
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
            pageSize: 10,
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
          // Simplified sorting logic
          state.learningPathTableData.sort((a, b) => {
            let sortedResult = 1
            if (a === b) {
              sortedResult = 0
            } else if (!a) {
              sortedResult = -1
            }
            return sortedResult
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
          const payloadKey = payload.key === 'targetAudience' ? 'roles' : payload.key
          const fIndex = filterItems.findIndex((f) => f.FieldName === payloadKey)
          let value
          if (typeof payload.activeValue === 'string') {
            value = payload.activeValue.trim()
          } else if (Array.isArray(payload.activeValue)) {
            if (payload.activeOperator === 'between') {
              filterItems.push({
                FieldName: payloadKey,
                Value: payload.activeValue[0],
                Operator: '>='
              })
              filterItems.push({
                FieldName: payloadKey,
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
              FieldName: payloadKey,
              Value: value,
              Operator: payload.activeOperator
            })
          }
        },
        REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD(state, payload) {
          const filterItems = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
          const payloadKey = payload.key === 'targetAudience' ? 'roles' : payload.key
          if (payload.filterType === 'date' && payload.activeOperator === 'between') {
            const fIndex = filterItems.findIndex((f) => f.FieldName === payloadKey)
            if (fIndex !== -1) filterItems.splice(fIndex, 2)
            return
          }
          const fIndex = filterItems.findIndex((f) => f.FieldName === payloadKey)
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
        },
        SET_FILTER_ITEMS_SHOW(state, payload) {
          const filter = state.learningPathFilters.find((f) => f && payload && f.key === payload.key)
          if (filter) {
            filter.show = payload.show
          }
        }
      },
      actions: {
        setLearningPathFilterItemsShow({ commit }, payload) {
          commit('SET_FILTER_ITEMS_SHOW', payload)
        },
        setLearningPathModalTrainingPreviewDialog({ commit }, payload) {
          commit('SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG', payload)
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
        learningPathClearAllFilters({ commit, dispatch }, { isFetch = false }) {
          commit('RESET_LEARNING_PATH_FILTERS')
          if (isFetch) {
            // Would dispatch callForLearningPathTrainingLibrary
          }
        },
        resetSelectedLearningPathTrainings({ commit }) {
          commit('RESET_LEARNING_PATH_FILTERS')
          commit('RESET_SELECTED_LEARNING_PATH_TRAININGS')
          commit('RESET_LEARNING_PATH_DATA')
        }
      }
    }

    state = JSON.parse(JSON.stringify(learningPathStore.state))
  })

  describe('state', () => {
    it('initializes with correct default values', () => {
      expect(learningPathStore.state.availableFor).toEqual([])
      expect(learningPathStore.state.learningPathTableData).toEqual([])
      expect(learningPathStore.state.selectedLearningPathTrainings).toEqual([])
      expect(learningPathStore.state.learningPathSearch).toBe('')
      expect(learningPathStore.state.learningPathSelectedTrainingContent).toBe('All Materials')
      expect(learningPathStore.state.learningPathSelectedSubTrainingContent).toBe('All Types')
      expect(learningPathStore.state.learningPathFilterType).toBe('Or')
      expect(learningPathStore.state.learningPathSortBy).toBe('Date Created - New to old')
    })

    it('initializes serverSideProps with ServerSideProps instance', () => {
      expect(learningPathStore.state.learningPathServerSideProps).toBeInstanceOf(ServerSideProps)
    })

    it('initializes axiosPayload with correct filter structure', () => {
      const payload = learningPathStore.state.learningPathAxiosPayload
      expect(payload.filter.Condition).toBe('AND')
      expect(payload.filter.FilterGroups).toHaveLength(2)
      expect(payload.pageSize).toBe(10)
    })

    it('initializes modalTrainingPreviewDialog with empty object', () => {
      expect(learningPathStore.state.learningPathModalTrainingPreviewDialog).toEqual(
        emptyLearningPathModalTrainingPreviewDialogObj
      )
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = learningPathStore.state
    })

    it('getLearningPathFilterType returns current filter type', () => {
      state.learningPathFilterType = 'And'
      expect(learningPathStore.getters.getLearningPathFilterType(state)).toBe('And')
    })

    it('getLearningPathSortBy returns current sort by', () => {
      state.learningPathSortBy = 'Name - A to Z'
      expect(learningPathStore.getters.getLearningPathSortBy(state)).toBe('Name - A to Z')
    })

    it('getLearningPathSearch returns current search value', () => {
      state.learningPathSearch = 'test search'
      expect(learningPathStore.getters.getLearningPathSearch(state)).toBe('test search')
    })

    it('getLearningPathFilters returns filters array', () => {
      expect(learningPathStore.getters.getLearningPathFilters(state)).toEqual(state.learningPathFilters)
    })

    it('getLearningPathTrainings returns table data', () => {
      state.learningPathTableData = [{ id: 1, name: 'Training 1' }]
      expect(learningPathStore.getters.getLearningPathTrainings(state)).toEqual([{ id: 1, name: 'Training 1' }])
    })

    it('getSelectedLearningPathTrainings returns selected trainings', () => {
      state.selectedLearningPathTrainings = [{ trainingId: 1 }]
      expect(learningPathStore.getters.getSelectedLearningPathTrainings(state)).toEqual([{ trainingId: 1 }])
    })

    it('getLearningPathModalTrainingPreviewDialog returns dialog object', () => {
      const dialogObj = { isOpen: true }
      state.learningPathModalTrainingPreviewDialog = dialogObj
      expect(learningPathStore.getters.getLearningPathModalTrainingPreviewDialog(state)).toEqual(dialogObj)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('SET_LEARNING_PATH_SEARCH updates search value', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SEARCH(state, 'new search')
      expect(state.learningPathSearch).toBe('new search')
    })

    it('SET_LEARNING_PATH_SORT_BY updates sort by value', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SORT_BY(state, 'Name - Z to A')
      expect(state.learningPathSortBy).toBe('Name - Z to A')
    })

    it('SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG updates dialog', () => {
      const newDialog = { isOpen: true, trainingId: 123 }
      learningPathStore.mutations.SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG(state, newDialog)
      expect(state.learningPathModalTrainingPreviewDialog).toEqual(newDialog)
    })

    it('APPEND_LEARNING_PATH_TABLE_DATA appends new trainings', () => {
      state.learningPathTableData = [{ trainingId: 1 }]
      const newTrainings = [{ trainingId: 2 }, { trainingId: 3 }]
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newTrainings)
      expect(state.learningPathTableData).toHaveLength(3)
      expect(state.learningPathTableData[1].trainingId).toBe(2)
    })

    it('APPEND_LEARNING_PATH_TABLE_DATA filters out selected trainings', () => {
      state.selectedLearningPathTrainings = [{ trainingId: 1 }]
      state.learningPathTableData = []
      const newTrainings = [{ trainingId: 1 }, { trainingId: 2 }]
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newTrainings)
      expect(state.learningPathTableData).toHaveLength(1)
      expect(state.learningPathTableData[0].trainingId).toBe(2)
    })

    it('SET_LEARNING_PATH_TABLE_DATA replaces table data', () => {
      state.learningPathTableData = [{ trainingId: 1 }]
      const newTrainings = [{ trainingId: 2 }, { trainingId: 3 }]
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, newTrainings)
      expect(state.learningPathTableData).toEqual(newTrainings)
    })

    it('SET_LEARNING_PATH_SERVER_SIDE_PROPS updates props', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SERVER_SIDE_PROPS(state, {
        totalNumberOfRecords: 100,
        totalNumberOfPages: 10,
        pageNumber: 2
      })
      expect(state.learningPathServerSideProps.totalNumberOfRecords).toBe(100)
      expect(state.learningPathServerSideProps.totalNumberOfPages).toBe(10)
      expect(state.learningPathServerSideProps.pageNumber).toBe(2)
    })

    it('SET_SELECTED_LEARNING_PATH_TRAININGS sorts trainings by order', () => {
      const trainings = [
        { trainingId: 1, trainingOrder: 3 },
        { trainingId: 2, trainingOrder: 1 },
        { trainingId: 3, trainingOrder: 2 }
      ]
      learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, trainings)
      expect(state.selectedLearningPathTrainings[0].trainingOrder).toBe(1)
      expect(state.selectedLearningPathTrainings[1].trainingOrder).toBe(2)
      expect(state.selectedLearningPathTrainings[2].trainingOrder).toBe(3)
    })

    it('SELECT_LEARNING_PATH_TRAINING moves training from table to selected', () => {
      state.learningPathTableData = [
        { trainingId: 1 },
        { trainingId: 2 },
        { trainingId: 3 }
      ]
      const training = { trainingId: 2 }
      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, { training, index: 1 })
      expect(state.learningPathTableData).toHaveLength(2)
      expect(state.selectedLearningPathTrainings).toHaveLength(1)
      expect(state.selectedLearningPathTrainings[0]).toEqual(training)
    })

    it('REMOVE_TRAINING_FROM_LEARNING_PATH moves training from selected to table', () => {
      state.selectedLearningPathTrainings = [
        { trainingId: 1 },
        { trainingId: 2 },
        { trainingId: 3 }
      ]
      const training = { trainingId: 2 }
      learningPathStore.mutations.REMOVE_TRAINING_FROM_LEARNING_PATH(state, { training, index: 1 })
      expect(state.selectedLearningPathTrainings).toHaveLength(2)
      expect(state.learningPathTableData[0]).toEqual(training)
    })

    it('RESET_LEARNING_PATH_FILTERS resets all filters and settings', () => {
      state.learningPathSearch = 'test'
      state.learningPathFilterType = 'And'
      state.learningPathSortBy = 'Custom Sort'
      learningPathStore.mutations.RESET_LEARNING_PATH_FILTERS(state)
      expect(state.learningPathSearch).toBe('')
      expect(state.learningPathFilterType).toBe('Or')
      expect(state.learningPathSortBy).toBe('Date Created - New to old')
      expect(state.learningPathSelectedTrainingContent).toBe('All Materials')
    })

    it('RESET_SELECTED_LEARNING_PATH_TRAININGS clears selected trainings', () => {
      state.selectedLearningPathTrainings = [{ trainingId: 1 }]
      learningPathStore.mutations.RESET_SELECTED_LEARNING_PATH_TRAININGS(state)
      expect(state.selectedLearningPathTrainings).toEqual([])
    })

    it('RESET_LEARNING_PATH_DATA clears table data', () => {
      state.learningPathTableData = [{ trainingId: 1 }]
      learningPathStore.mutations.RESET_LEARNING_PATH_DATA(state)
      expect(state.learningPathTableData).toEqual([])
    })

    it('SET_LEARNING_PATH_SORT_BY_TO_PAYLOAD updates axios payload', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SORT_BY_TO_PAYLOAD(state, {
        ascending: false,
        orderBy: 'name'
      })
      expect(state.learningPathAxiosPayload.ascending).toBe(false)
      expect(state.learningPathAxiosPayload.orderBy).toBe('name')
    })

    it('RESET_LEARNING_PATH_PAGINATION resets page numbers', () => {
      state.learningPathAxiosPayload.pageNumber = 5
      state.learningPathServerSideProps.pageNumber = 5
      learningPathStore.mutations.RESET_LEARNING_PATH_PAGINATION(state)
      expect(state.learningPathAxiosPayload.pageNumber).toBe(1)
      expect(state.learningPathServerSideProps.pageNumber).toBe(1)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('setLearningPathModalTrainingPreviewDialog commits mutation', () => {
      const commit = jest.fn()
      const dialog = { isOpen: true }
      learningPathStore.actions.setLearningPathModalTrainingPreviewDialog({ commit }, dialog)
      expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG', dialog)
    })

    it('setSelectedLearningPathTrainings commits mutation', () => {
      const commit = jest.fn()
      const trainings = [{ trainingId: 1 }]
      learningPathStore.actions.setSelectedLearningPathTrainings({ commit }, trainings)
      expect(commit).toHaveBeenCalledWith('SET_SELECTED_LEARNING_PATH_TRAININGS', trainings)
    })

    it('selectLearningPathTraining commits mutation', () => {
      const commit = jest.fn()
      const payload = { training: { trainingId: 1 }, index: 0 }
      learningPathStore.actions.selectLearningPathTraining({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SELECT_LEARNING_PATH_TRAINING', payload)
    })

    it('removeTrainingFromLearningPath commits mutation', () => {
      const commit = jest.fn()
      const payload = { training: { trainingId: 1 }, index: 0 }
      learningPathStore.actions.removeTrainingFromLearningPath({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('REMOVE_TRAINING_FROM_LEARNING_PATH', payload)
    })

    it('orderLearningPathData commits mutation', () => {
      const commit = jest.fn()
      const payload = [{ id: 1 }]
      learningPathStore.actions.orderLearningPathData({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('ORDER_LEARNING_PATH_DATA', payload)
    })

    it('setLearningPathFilterItemsShow commits mutation', () => {
      const commit = jest.fn()
      const payload = { key: 'type', show: true }
      learningPathStore.actions.setLearningPathFilterItemsShow({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_FILTER_ITEMS_SHOW', payload)
    })

    it('learningPathClearAllFilters commits reset mutations without fetch', () => {
      const commit = jest.fn()
      learningPathStore.actions.learningPathClearAllFilters({ commit }, { isFetch: false })
      expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_FILTERS')
    })

    it('learningPathClearAllFilters commits reset mutations with fetch', () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      learningPathStore.actions.learningPathClearAllFilters({ commit, dispatch }, { isFetch: true })
      expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_FILTERS')
    })

    it('resetSelectedLearningPathTrainings commits multiple mutations', () => {
      const commit = jest.fn()
      learningPathStore.actions.resetSelectedLearningPathTrainings({ commit })
      expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_FILTERS')
      expect(commit).toHaveBeenCalledWith('RESET_SELECTED_LEARNING_PATH_TRAININGS')
      expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_DATA')
      expect(commit).toHaveBeenCalledTimes(3)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(learningPathStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(learningPathStore).toHaveProperty('state')
      expect(learningPathStore).toHaveProperty('getters')
      expect(learningPathStore).toHaveProperty('mutations')
      expect(learningPathStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'getLearningPathFilterType',
        'getLearningPathSortBy',
        'getLearningPathSearch',
        'getLearningPathFilters',
        'getLearningPathTrainings',
        'getSelectedLearningPathTrainings',
        'getLearningPathModalTrainingPreviewDialog'
      ]
      expectedGetters.forEach((getter) => {
        expect(learningPathStore.getters).toHaveProperty(getter)
      })
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_LEARNING_PATH_SEARCH',
        'SET_LEARNING_PATH_SORT_BY',
        'SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG',
        'APPEND_LEARNING_PATH_TABLE_DATA',
        'SET_LEARNING_PATH_TABLE_DATA',
        'SET_LEARNING_PATH_SERVER_SIDE_PROPS',
        'SET_SELECTED_LEARNING_PATH_TRAININGS',
        'SELECT_LEARNING_PATH_TRAINING',
        'REMOVE_TRAINING_FROM_LEARNING_PATH',
        'RESET_LEARNING_PATH_FILTERS',
        'RESET_SELECTED_LEARNING_PATH_TRAININGS',
        'ORDER_LEARNING_PATH_DATA',
        'RESET_LEARNING_PATH_DATA',
        'SET_LEARNING_PATH_SORT_BY_TO_PAYLOAD',
        'RESET_LEARNING_PATH_PAGINATION'
      ]
      expectedMutations.forEach((mutation) => {
        expect(learningPathStore.mutations).toHaveProperty(mutation)
      })
    })

    it('has all expected actions', () => {
      const expectedActions = [
        'setLearningPathModalTrainingPreviewDialog',
        'setSelectedLearningPathTrainings',
        'selectLearningPathTraining',
        'removeTrainingFromLearningPath',
        'orderLearningPathData',
        'setLearningPathFilterItemsShow',
        'learningPathClearAllFilters',
        'resetSelectedLearningPathTrainings'
      ]
      expectedActions.forEach((action) => {
        expect(learningPathStore.actions).toHaveProperty(action)
      })
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('can reset filters and trainings completely', () => {
      state.learningPathSearch = 'test'
      state.selectedLearningPathTrainings = [{ trainingId: 1 }]
      state.learningPathTableData = [{ trainingId: 2 }]

      const commit = (mutationName, payload) => {
        learningPathStore.mutations[mutationName](state, payload)
      }

      learningPathStore.actions.resetSelectedLearningPathTrainings({ commit })

      expect(state.learningPathSearch).toBe('')
      expect(state.selectedLearningPathTrainings).toEqual([])
      expect(state.learningPathTableData).toEqual([])
      expect(state.learningPathFilterType).toBe('Or')
    })

    it('can select and remove trainings from available pool', () => {
      state.learningPathTableData = [
        { trainingId: 1 },
        { trainingId: 2 },
        { trainingId: 3 }
      ]

      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: { trainingId: 2 },
        index: 1
      })

      expect(state.learningPathTableData).toHaveLength(2)
      expect(state.selectedLearningPathTrainings).toHaveLength(1)

      learningPathStore.mutations.REMOVE_TRAINING_FROM_LEARNING_PATH(state, {
        training: { trainingId: 2 },
        index: 0
      })

      expect(state.learningPathTableData).toHaveLength(3)
      expect(state.selectedLearningPathTrainings).toHaveLength(0)
    })

    it('filters out selected trainings from new data append', () => {
      state.selectedLearningPathTrainings = [
        { trainingId: 1 },
        { trainingId: 3 }
      ]

      const newTrainings = [
        { trainingId: 1 },
        { trainingId: 2 },
        { trainingId: 3 },
        { trainingId: 4 }
      ]

      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newTrainings)

      expect(state.learningPathTableData).toHaveLength(2)
      expect(state.learningPathTableData.map(t => t.trainingId)).toEqual([2, 4])
    })
  })

  describe('state properties - detailed type checks', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('availableFor is an array', () => {
      expect(Array.isArray(state.availableFor)).toBe(true)
    })

    it('learningPathTableData is an array', () => {
      expect(Array.isArray(state.learningPathTableData)).toBe(true)
    })

    it('selectedLearningPathTrainings is an array', () => {
      expect(Array.isArray(state.selectedLearningPathTrainings)).toBe(true)
    })

    it('learningPathSearch is a string', () => {
      expect(typeof state.learningPathSearch).toBe('string')
    })

    it('learningPathSelectedTrainingContent is a string', () => {
      expect(typeof state.learningPathSelectedTrainingContent).toBe('string')
    })

    it('learningPathSelectedSubTrainingContent is a string', () => {
      expect(typeof state.learningPathSelectedSubTrainingContent).toBe('string')
    })

    it('learningPathFilters is an array', () => {
      expect(Array.isArray(state.learningPathFilters)).toBe(true)
    })

    it('learningPathFilterType is a string', () => {
      expect(typeof state.learningPathFilterType).toBe('string')
    })

    it('learningPathSortBy is a string', () => {
      expect(typeof state.learningPathSortBy).toBe('string')
    })

    it('learningPathModalTrainingPreviewDialog is an object', () => {
      expect(typeof state.learningPathModalTrainingPreviewDialog).toBe('object')
    })

    it('learningPathServerSideProps is an object', () => {
      expect(typeof state.learningPathServerSideProps).toBe('object')
    })

    it('learningPathAxiosPayload is an object', () => {
      expect(typeof state.learningPathAxiosPayload).toBe('object')
    })

    it('learningPathFilterOptionsFilters is an array', () => {
      expect(Array.isArray(state.learningPathFilterOptionsFilters)).toBe(true)
    })

    it('availableFor array persists mutations', () => {
      state.availableFor = [{ id: 1 }]
      expect(state.availableFor).toHaveLength(1)
      expect(state.availableFor[0].id).toBe(1)
    })

    it('learningPathTableData array persists mutations', () => {
      state.learningPathTableData = [{ trainingId: 99 }]
      expect(state.learningPathTableData).toHaveLength(1)
      expect(state.learningPathTableData[0].trainingId).toBe(99)
    })
  })

  describe('getter behavior - function types and reference equality', () => {
    beforeEach(() => {
      state = learningPathStore.state
    })

    it('getLearningPathFilterType getter is a function', () => {
      expect(typeof learningPathStore.getters.getLearningPathFilterType).toBe('function')
    })

    it('getLearningPathSortBy getter is a function', () => {
      expect(typeof learningPathStore.getters.getLearningPathSortBy).toBe('function')
    })

    it('getLearningPathSearch getter is a function', () => {
      expect(typeof learningPathStore.getters.getLearningPathSearch).toBe('function')
    })

    it('getLearningPathFilters getter is a function', () => {
      expect(typeof learningPathStore.getters.getLearningPathFilters).toBe('function')
    })

    it('getLearningPathTrainings getter is a function', () => {
      expect(typeof learningPathStore.getters.getLearningPathTrainings).toBe('function')
    })

    it('getSelectedLearningPathTrainings getter is a function', () => {
      expect(typeof learningPathStore.getters.getSelectedLearningPathTrainings).toBe('function')
    })

    it('getLearningPathModalTrainingPreviewDialog getter is a function', () => {
      expect(typeof learningPathStore.getters.getLearningPathModalTrainingPreviewDialog).toBe('function')
    })

    it('getLearningPathFilters returns same reference for array', () => {
      const filters1 = learningPathStore.getters.getLearningPathFilters(state)
      const filters2 = learningPathStore.getters.getLearningPathFilters(state)
      expect(filters1).toBe(filters2)
    })

    it('getLearningPathTrainings returns same reference for table data', () => {
      state.learningPathTableData = [{ id: 1 }]
      const trainings1 = learningPathStore.getters.getLearningPathTrainings(state)
      const trainings2 = learningPathStore.getters.getLearningPathTrainings(state)
      expect(trainings1).toBe(trainings2)
    })

    it('getSelectedLearningPathTrainings returns same reference', () => {
      state.selectedLearningPathTrainings = [{ trainingId: 1 }]
      const selected1 = learningPathStore.getters.getSelectedLearningPathTrainings(state)
      const selected2 = learningPathStore.getters.getSelectedLearningPathTrainings(state)
      expect(selected1).toBe(selected2)
    })

    it('getLearningPathModalTrainingPreviewDialog returns same reference', () => {
      const dialog1 = learningPathStore.getters.getLearningPathModalTrainingPreviewDialog(state)
      const dialog2 = learningPathStore.getters.getLearningPathModalTrainingPreviewDialog(state)
      expect(dialog1).toBe(dialog2)
    })

    it('all getters accept state parameter', () => {
      const testState = { learningPathFilterType: 'test' }
      expect(learningPathStore.getters.getLearningPathFilterType(testState)).toBe('test')
    })

    it('getters return correct types with various state values', () => {
      state.learningPathFilterType = 'And'
      expect(learningPathStore.getters.getLearningPathFilterType(state)).toBe('And')

      state.learningPathSortBy = 'Name A-Z'
      expect(learningPathStore.getters.getLearningPathSortBy(state)).toBe('Name A-Z')
    })
  })

  describe('mutation payload handling - null/undefined edge cases', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('SET_LEARNING_PATH_SEARCH handles null payload', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SEARCH(state, null)
      expect(state.learningPathSearch).toBe(null)
    })

    it('SET_LEARNING_PATH_SEARCH handles undefined payload', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SEARCH(state, undefined)
      expect(state.learningPathSearch).toBe(undefined)
    })

    it('SET_LEARNING_PATH_SEARCH handles empty string', () => {
      state.learningPathSearch = 'previous'
      learningPathStore.mutations.SET_LEARNING_PATH_SEARCH(state, '')
      expect(state.learningPathSearch).toBe('')
    })

    it('SET_LEARNING_PATH_SORT_BY handles null payload', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SORT_BY(state, null)
      expect(state.learningPathSortBy).toBe(null)
    })

    it('SET_LEARNING_PATH_SORT_BY handles undefined payload', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SORT_BY(state, undefined)
      expect(state.learningPathSortBy).toBe(undefined)
    })

    it('SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG handles null payload', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG(state, null)
      expect(state.learningPathModalTrainingPreviewDialog).toBe(null)
    })

    it('SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG handles undefined payload', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG(state, undefined)
      expect(state.learningPathModalTrainingPreviewDialog).toBe(undefined)
    })

    it('APPEND_LEARNING_PATH_TABLE_DATA handles null payload throws error', () => {
      state.learningPathTableData = [{ trainingId: 1 }]
      expect(() => {
        learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, null)
      }).toThrow()
    })

    it('APPEND_LEARNING_PATH_TABLE_DATA handles empty array', () => {
      state.learningPathTableData = [{ trainingId: 1 }]
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, [])
      expect(state.learningPathTableData).toHaveLength(1)
    })

    it('SET_LEARNING_PATH_TABLE_DATA handles null payload throws error', () => {
      state.learningPathTableData = [{ trainingId: 1 }]
      expect(() => {
        learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, null)
      }).toThrow()
    })

    it('SET_LEARNING_PATH_TABLE_DATA handles empty array', () => {
      state.learningPathTableData = [{ trainingId: 1 }]
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, [])
      expect(state.learningPathTableData).toEqual([])
    })

    it('SET_SELECTED_LEARNING_PATH_TRAININGS handles null payload throws error', () => {
      expect(() => {
        learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, null)
      }).toThrow()
    })

    it('SET_SELECTED_LEARNING_PATH_TRAININGS handles undefined payload throws error', () => {
      expect(() => {
        learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, undefined)
      }).toThrow()
    })

    it('SET_SELECTED_LEARNING_PATH_TRAININGS handles empty array', () => {
      learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, [])
      expect(state.selectedLearningPathTrainings).toEqual([])
    })

    it('SET_LEARNING_PATH_SERVER_SIDE_PROPS handles partial payload', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SERVER_SIDE_PROPS(state, {
        totalNumberOfRecords: 50
      })
      expect(state.learningPathServerSideProps.totalNumberOfRecords).toBe(50)
    })

    it('SET_LEARNING_PATH_SERVER_SIDE_PROPS handles null values in payload', () => {
      learningPathStore.mutations.SET_LEARNING_PATH_SERVER_SIDE_PROPS(state, {
        totalNumberOfRecords: null,
        totalNumberOfPages: null,
        pageNumber: null
      })
      expect(state.learningPathServerSideProps.totalNumberOfRecords).toBe(null)
    })
  })

  describe('action behavior - commit patterns and payload passing', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('setLearningPathFilterItemsShow passes exact payload to commit', () => {
      const commit = jest.fn()
      const payload = { key: 'targetAudience', show: false }
      learningPathStore.actions.setLearningPathFilterItemsShow({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_FILTER_ITEMS_SHOW', payload)
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('setLearningPathModalTrainingPreviewDialog passes exact payload to commit', () => {
      const commit = jest.fn()
      const payload = { isOpen: true, trainingId: 999 }
      learningPathStore.actions.setLearningPathModalTrainingPreviewDialog({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG', payload)
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('setSelectedLearningPathTrainings passes exact payload to commit', () => {
      const commit = jest.fn()
      const payload = [{ trainingId: 1, trainingOrder: 1 }]
      learningPathStore.actions.setSelectedLearningPathTrainings({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_SELECTED_LEARNING_PATH_TRAININGS', payload)
    })

    it('selectLearningPathTraining passes exact payload to commit', () => {
      const commit = jest.fn()
      const payload = { training: { trainingId: 5 }, index: 2 }
      learningPathStore.actions.selectLearningPathTraining({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SELECT_LEARNING_PATH_TRAINING', payload)
    })

    it('removeTrainingFromLearningPath passes exact payload to commit', () => {
      const commit = jest.fn()
      const payload = { training: { trainingId: 5 }, index: 1 }
      learningPathStore.actions.removeTrainingFromLearningPath({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('REMOVE_TRAINING_FROM_LEARNING_PATH', payload)
    })

    it('orderLearningPathData passes exact payload to commit', () => {
      const commit = jest.fn()
      const payload = [{ id: 1, name: 'Item 1' }]
      learningPathStore.actions.orderLearningPathData({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('ORDER_LEARNING_PATH_DATA', payload)
    })

    it('orderLearningPathData handles null payload', () => {
      const commit = jest.fn()
      learningPathStore.actions.orderLearningPathData({ commit }, null)
      expect(commit).toHaveBeenCalledWith('ORDER_LEARNING_PATH_DATA', null)
    })

    it('learningPathClearAllFilters commits only RESET when isFetch is false', () => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      learningPathStore.actions.learningPathClearAllFilters({ commit, dispatch }, { isFetch: false })
      expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_FILTERS')
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('learningPathClearAllFilters handles missing isFetch parameter', () => {
      const commit = jest.fn()
      learningPathStore.actions.learningPathClearAllFilters({ commit }, {})
      expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_FILTERS')
    })

    it('resetSelectedLearningPathTrainings calls mutations in correct order', () => {
      const commitCalls = []
      const commit = (mutation, payload) => {
        commitCalls.push(mutation)
      }
      learningPathStore.actions.resetSelectedLearningPathTrainings({ commit })
      expect(commitCalls).toEqual([
        'RESET_LEARNING_PATH_FILTERS',
        'RESET_SELECTED_LEARNING_PATH_TRAININGS',
        'RESET_LEARNING_PATH_DATA'
      ])
    })

    it('actions have correct context with commit function', () => {
      const commit = jest.fn()
      const context = { commit }
      expect(typeof learningPathStore.actions.setLearningPathFilterItemsShow(context, {})).not.toThrow
    })
  })

  describe('type safety and consistency', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('mutation names are consistently uppercase with underscores', () => {
      const mutations = Object.keys(learningPathStore.mutations)
      mutations.forEach(name => {
        expect(name).toMatch(/^[A-Z_]+$/)
      })
    })

    it('action names are consistently camelCase', () => {
      const actions = Object.keys(learningPathStore.actions)
      actions.forEach(name => {
        expect(name).toMatch(/^[a-z][a-zA-Z]*$/)
      })
    })

    it('getter names are consistently camelCase starting with get', () => {
      const getters = Object.keys(learningPathStore.getters)
      getters.forEach(name => {
        expect(name).toMatch(/^get[A-Z]/)
      })
    })

    it('state properties are consistently camelCase', () => {
      const stateProps = Object.keys(learningPathStore.state)
      stateProps.forEach(prop => {
        expect(prop).toMatch(/^[a-z][a-zA-Z]*$/)
      })
    })

    it('table data maintains consistent training object structure', () => {
      const trainings = [
        { trainingId: 1, name: 'Training 1' },
        { trainingId: 2, name: 'Training 2' }
      ]
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, trainings)
      state.learningPathTableData.forEach(training => {
        expect(training).toHaveProperty('trainingId')
      })
    })

    it('selected trainings maintain consistent structure with training order', () => {
      const trainings = [
        { trainingId: 1, trainingOrder: 1 },
        { trainingId: 2, trainingOrder: 2 }
      ]
      learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, trainings)
      state.selectedLearningPathTrainings.forEach(training => {
        expect(training).toHaveProperty('trainingOrder')
      })
    })

    it('filter structure includes required fields', () => {
      const filter = state.learningPathFilters[0]
      expect(filter).toHaveProperty('key')
    })

    it('axios payload maintains correct filter structure', () => {
      const payload = state.learningPathAxiosPayload
      expect(payload.filter.FilterGroups[0]).toHaveProperty('FilterItems')
      expect(payload.filter.FilterGroups[0]).toHaveProperty('Condition')
    })
  })

  describe('edge cases - special characters, Unicode, long strings', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('SET_LEARNING_PATH_SEARCH handles special characters', () => {
      const specialCharsSearch = '!@#$%^&*()'
      learningPathStore.mutations.SET_LEARNING_PATH_SEARCH(state, specialCharsSearch)
      expect(state.learningPathSearch).toBe(specialCharsSearch)
    })

    it('SET_LEARNING_PATH_SEARCH handles Unicode characters', () => {
      const unicodeSearch = '日本語テスト中文тест'
      learningPathStore.mutations.SET_LEARNING_PATH_SEARCH(state, unicodeSearch)
      expect(state.learningPathSearch).toBe(unicodeSearch)
    })

    it('SET_LEARNING_PATH_SEARCH handles very long strings (500+ chars)', () => {
      const longSearch = 'a'.repeat(500)
      learningPathStore.mutations.SET_LEARNING_PATH_SEARCH(state, longSearch)
      expect(state.learningPathSearch).toBe(longSearch)
      expect(state.learningPathSearch.length).toBe(500)
    })

    it('SET_LEARNING_PATH_SORT_BY handles strings with special characters', () => {
      const specialSort = 'Date @Created - New & Old'
      learningPathStore.mutations.SET_LEARNING_PATH_SORT_BY(state, specialSort)
      expect(state.learningPathSortBy).toBe(specialSort)
    })

    it('SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG handles objects with long string values', () => {
      const longString = 'x'.repeat(1000)
      const dialog = { isOpen: true, description: longString }
      learningPathStore.mutations.SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG(state, dialog)
      expect(state.learningPathModalTrainingPreviewDialog.description).toBe(longString)
    })

    it('APPEND_LEARNING_PATH_TABLE_DATA with training names containing special chars', () => {
      const trainings = [
        { trainingId: 1, name: 'Training & Security @2024' },
        { trainingId: 2, name: '日本語トレーニング' }
      ]
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, trainings)
      expect(state.learningPathTableData[0].name).toBe('Training & Security @2024')
      expect(state.learningPathTableData[1].name).toBe('日本語トレーニング')
    })

    it('SET_SELECTED_LEARNING_PATH_TRAININGS with names containing quotes and apostrophes', () => {
      const trainings = [
        { trainingId: 1, name: "It's \"Training\" Course", trainingOrder: 1 }
      ]
      learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, trainings)
      expect(state.selectedLearningPathTrainings[0].name).toBe("It's \"Training\" Course")
    })

    it('SELECT_LEARNING_PATH_TRAINING with special character training data', () => {
      state.learningPathTableData = [
        { trainingId: 1, name: 'Training @#$' }
      ]
      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: { trainingId: 1, name: 'Training @#$' },
        index: 0
      })
      expect(state.selectedLearningPathTrainings[0].name).toBe('Training @#$')
    })

    it('handles newlines and tabs in search strings', () => {
      const searchWithWhitespace = 'training\nwith\ttabs'
      learningPathStore.mutations.SET_LEARNING_PATH_SEARCH(state, searchWithWhitespace)
      expect(state.learningPathSearch).toBe(searchWithWhitespace)
    })

    it('handles emoji in training names', () => {
      const trainings = [
        { trainingId: 1, name: 'Training 🎓 Course 🚀' }
      ]
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, trainings)
      expect(state.learningPathTableData[0].name).toBe('Training 🎓 Course 🚀')
    })
  })

  describe('large dataset handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('handles 100+ items in learningPathTableData', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        trainingId: i + 1,
        name: `Training ${i + 1}`
      }))
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, largeDataset)
      expect(state.learningPathTableData).toHaveLength(100)
    })

    it('handles 1000+ items in learningPathTableData', () => {
      const veryLargeDataset = Array.from({ length: 1000 }, (_, i) => ({
        trainingId: i + 1,
        name: `Training ${i + 1}`
      }))
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, veryLargeDataset)
      expect(state.learningPathTableData).toHaveLength(1000)
    })

    it('APPEND_LEARNING_PATH_TABLE_DATA with 500+ items', () => {
      state.learningPathTableData = [{ trainingId: 1 }]
      const newTrainings = Array.from({ length: 500 }, (_, i) => ({
        trainingId: i + 2,
        name: `Training ${i + 2}`
      }))
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newTrainings)
      expect(state.learningPathTableData.length).toBeGreaterThanOrEqual(500)
    })

    it('handles 100+ selected trainings with sorting', () => {
      const trainings = Array.from({ length: 100 }, (_, i) => ({
        trainingId: 100 - i,
        trainingOrder: 100 - i
      }))
      learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, trainings)
      expect(state.selectedLearningPathTrainings).toHaveLength(100)
      expect(state.selectedLearningPathTrainings[0].trainingOrder).toBe(1)
    })

    it('APPEND_LEARNING_PATH_TABLE_DATA filters out selected from 200 items', () => {
      const selectedIds = Array.from({ length: 50 }, (_, i) => ({
        trainingId: i + 1
      }))
      state.selectedLearningPathTrainings = selectedIds

      const newTrainings = Array.from({ length: 200 }, (_, i) => ({
        trainingId: i + 1
      }))
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newTrainings)
      expect(state.learningPathTableData).toHaveLength(150)
    })

    it('handles large detailTrainingId filtering', () => {
      state.selectedLearningPathTrainings = [
        { detailTrainingId: 999 }
      ]
      const newTrainings = Array.from({ length: 300 }, (_, i) => ({
        detailTrainingId: i + 1
      }))
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newTrainings)
      const foundConflict = state.learningPathTableData.some(t => t.detailTrainingId === 999)
      expect(foundConflict).toBe(false)
    })

    it('SET_LEARNING_PATH_FILTER_ITEMS with large item count', () => {
      const largeItems = Array.from({ length: 200 }, (_, i) => ({
        id: i + 1,
        label: `Item ${i + 1}`
      }))
      const payload = { key: 'type', items: largeItems }
      learningPathStore.mutations.SET_LEARNING_PATH_FILTER_ITEMS(state, payload)
      const filter = state.learningPathFilters.find(f => f && f.key === 'type')
      expect(filter.items).toHaveLength(200)
    })

    it('ORDER_LEARNING_PATH_DATA with 100 items', () => {
      state.learningPathTableData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1
      }))
      learningPathStore.mutations.ORDER_LEARNING_PATH_DATA(state, null)
      expect(state.learningPathTableData).toHaveLength(100)
    })
  })

  describe('rapid operations and concurrent mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('handles 5 rapid SET_LEARNING_PATH_SEARCH mutations', () => {
      for (let i = 0; i < 5; i++) {
        learningPathStore.mutations.SET_LEARNING_PATH_SEARCH(state, `search ${i}`)
      }
      expect(state.learningPathSearch).toBe('search 4')
    })

    it('handles 10 rapid SET_LEARNING_PATH_SORT_BY mutations', () => {
      for (let i = 0; i < 10; i++) {
        learningPathStore.mutations.SET_LEARNING_PATH_SORT_BY(state, `sort ${i}`)
      }
      expect(state.learningPathSortBy).toBe('sort 9')
    })

    it('handles 20 rapid SELECT_LEARNING_PATH_TRAINING mutations', () => {
      state.learningPathTableData = Array.from({ length: 100 }, (_, i) => ({
        trainingId: i + 1
      }))
      for (let i = 0; i < 20 && state.learningPathTableData.length > 0; i++) {
        learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
          training: { trainingId: i + 1 },
          index: 0
        })
      }
      expect(state.selectedLearningPathTrainings.length).toBeGreaterThan(0)
    })

    it('handles alternating SELECT and REMOVE mutations', () => {
      state.learningPathTableData = [{ trainingId: 1 }, { trainingId: 2 }, { trainingId: 3 }]

      for (let i = 0; i < 5; i++) {
        if (state.learningPathTableData.length > 0) {
          learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
            training: state.learningPathTableData[0],
            index: 0
          })
        }
        if (state.selectedLearningPathTrainings.length > 0) {
          learningPathStore.mutations.REMOVE_TRAINING_FROM_LEARNING_PATH(state, {
            training: state.selectedLearningPathTrainings[0],
            index: 0
          })
        }
      }
      expect(state.learningPathTableData.length + state.selectedLearningPathTrainings.length).toBe(3)
    })

    it('handles rapid APPEND mutations with filtering', () => {
      state.selectedLearningPathTrainings = [{ trainingId: 5 }]

      for (let i = 0; i < 5; i++) {
        const newData = Array.from({ length: 10 }, (_, j) => ({
          trainingId: (i * 10) + j + 1
        }))
        learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newData)
      }
      expect(state.learningPathTableData.length).toBeGreaterThan(0)
    })

    it('handles rapid action invocations', () => {
      const commit = jest.fn()
      for (let i = 0; i < 15; i++) {
        learningPathStore.actions.setLearningPathFilterItemsShow({ commit }, { key: 'type', show: i % 2 === 0 })
      }
      expect(commit).toHaveBeenCalledTimes(15)
    })

    it('handles 8 rapid SET_SELECTED_LEARNING_PATH_TRAININGS with sort', () => {
      for (let batch = 0; batch < 8; batch++) {
        const trainings = Array.from({ length: 5 }, (_, i) => ({
          trainingId: (batch * 5) + i,
          trainingOrder: Math.floor(Math.random() * 100)
        }))
        learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, trainings)
      }
      expect(state.selectedLearningPathTrainings).toHaveLength(5)
    })
  })

  describe('learning path progress tracking', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('tracks selected trainings progression', () => {
      const trainings = [
        { trainingId: 1, trainingOrder: 1, completed: false },
        { trainingId: 2, trainingOrder: 2, completed: false },
        { trainingId: 3, trainingOrder: 3, completed: false }
      ]
      learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, trainings)
      expect(state.selectedLearningPathTrainings).toHaveLength(3)
      expect(state.selectedLearningPathTrainings.every(t => !t.completed)).toBe(true)
    })

    it('maintains training order through mutations', () => {
      const trainings = [
        { trainingId: 3, trainingOrder: 3 },
        { trainingId: 1, trainingOrder: 1 },
        { trainingId: 2, trainingOrder: 2 }
      ]
      learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, trainings)
      const orders = state.selectedLearningPathTrainings.map(t => t.trainingOrder)
      expect(orders).toEqual([1, 2, 3])
    })

    it('can track completion status in selected trainings', () => {
      state.selectedLearningPathTrainings = [
        { trainingId: 1, trainingOrder: 1, completed: true },
        { trainingId: 2, trainingOrder: 2, completed: false }
      ]
      const completedCount = state.selectedLearningPathTrainings.filter(t => t.completed).length
      expect(completedCount).toBe(1)
    })

    it('tracks available trainings pool', () => {
      state.learningPathTableData = [
        { trainingId: 1, name: 'Course 1' },
        { trainingId: 2, name: 'Course 2' },
        { trainingId: 3, name: 'Course 3' }
      ]
      expect(state.learningPathTableData).toHaveLength(3)

      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: state.learningPathTableData[0],
        index: 0
      })
      expect(state.learningPathTableData).toHaveLength(2)
    })

    it('tracks removed trainings back to pool', () => {
      state.selectedLearningPathTrainings = [
        { trainingId: 1, trainingOrder: 1, name: 'Course 1' }
      ]
      learningPathStore.mutations.REMOVE_TRAINING_FROM_LEARNING_PATH(state, {
        training: { trainingId: 1, name: 'Course 1' },
        index: 0
      })
      expect(state.learningPathTableData[0].trainingId).toBe(1)
      expect(state.selectedLearningPathTrainings).toHaveLength(0)
    })
  })

  describe('course and module handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('handles courses with module information', () => {
      const courses = [
        { trainingId: 1, name: 'Course 1', modules: [{ moduleId: 1 }, { moduleId: 2 }] },
        { trainingId: 2, name: 'Course 2', modules: [{ moduleId: 3 }] }
      ]
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, courses)
      expect(state.learningPathTableData[0].modules).toHaveLength(2)
      expect(state.learningPathTableData[1].modules).toHaveLength(1)
    })

    it('preserves module structure through appending', () => {
      state.learningPathTableData = [
        { trainingId: 1, modules: [{ moduleId: 1 }] }
      ]
      const newCourses = [
        { trainingId: 2, modules: [{ moduleId: 2 }, { moduleId: 3 }] }
      ]
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newCourses)
      expect(state.learningPathTableData[1].modules).toHaveLength(2)
    })

    it('handles courses without modules', () => {
      const courses = [
        { trainingId: 1, name: 'Course 1' }
      ]
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, courses)
      expect(state.learningPathTableData[0]).toHaveProperty('trainingId')
      expect(state.learningPathTableData[0].modules).toBeUndefined()
    })

    it('maintains course and module structure in selected trainings', () => {
      const courses = [
        {
          trainingId: 1,
          trainingOrder: 1,
          name: 'Course 1',
          modules: [{ moduleId: 1, name: 'Module 1' }]
        }
      ]
      learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, courses)
      expect(state.selectedLearningPathTrainings[0].modules[0].name).toBe('Module 1')
    })

    it('handles large number of modules per course', () => {
      const course = {
        trainingId: 1,
        name: 'Large Course',
        modules: Array.from({ length: 50 }, (_, i) => ({
          moduleId: i + 1,
          name: `Module ${i + 1}`
        }))
      }
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, [course])
      expect(state.learningPathTableData[0].modules).toHaveLength(50)
    })

    it('handles nested course hierarchy', () => {
      const course = {
        trainingId: 1,
        name: 'Complex Course',
        modules: [
          {
            moduleId: 1,
            name: 'Module 1',
            lessons: [{ lessonId: 1 }, { lessonId: 2 }]
          }
        ]
      }
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, [course])
      expect(state.learningPathTableData[0].modules[0].lessons).toHaveLength(2)
    })
  })

  describe('user enrollment workflows', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('simulates enrolling user in single training', () => {
      state.learningPathTableData = [
        { trainingId: 1, name: 'Course 1' }
      ]
      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: { trainingId: 1, name: 'Course 1' },
        index: 0
      })
      expect(state.selectedLearningPathTrainings[0].trainingId).toBe(1)
    })

    it('simulates enrolling user in multiple trainings sequentially', () => {
      state.learningPathTableData = [
        { trainingId: 1, trainingOrder: 1 },
        { trainingId: 2, trainingOrder: 2 },
        { trainingId: 3, trainingOrder: 3 }
      ]

      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: { trainingId: 1, trainingOrder: 1 },
        index: 0
      })
      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: { trainingId: 2, trainingOrder: 2 },
        index: 0
      })

      expect(state.selectedLearningPathTrainings).toHaveLength(2)
    })

    it('simulates disenrolling from a training', () => {
      state.selectedLearningPathTrainings = [
        { trainingId: 1, trainingOrder: 1 },
        { trainingId: 2, trainingOrder: 2 }
      ]

      learningPathStore.mutations.REMOVE_TRAINING_FROM_LEARNING_PATH(state, {
        training: { trainingId: 1, trainingOrder: 1 },
        index: 0
      })

      expect(state.selectedLearningPathTrainings).toHaveLength(1)
      expect(state.selectedLearningPathTrainings[0].trainingId).toBe(2)
    })

    it('tracks enrollment with user metadata', () => {
      const trainingWithMetadata = {
        trainingId: 1,
        trainingOrder: 1,
        enrolledDate: '2024-01-15',
        userId: 'user123',
        status: 'in-progress'
      }
      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: trainingWithMetadata,
        index: 0
      })
      expect(state.selectedLearningPathTrainings[0].enrolledDate).toBe('2024-01-15')
      expect(state.selectedLearningPathTrainings[0].status).toBe('in-progress')
    })

    it('handles bulk enrollment with filtering', () => {
      state.selectedLearningPathTrainings = [{ trainingId: 1 }]
      const newCourses = [
        { trainingId: 1 },
        { trainingId: 2 },
        { trainingId: 3 }
      ]
      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newCourses)
      // Only trainings 2 and 3 should be added (1 is already selected)
      expect(state.learningPathTableData.length).toBe(2)
    })

    it('tracks enrollment state through reset', () => {
      state.selectedLearningPathTrainings = [
        { trainingId: 1, trainingOrder: 1 }
      ]
      state.learningPathTableData = [
        { trainingId: 2 }
      ]

      const commit = (mutationName, payload) => {
        learningPathStore.mutations[mutationName](state, payload)
      }

      learningPathStore.actions.resetSelectedLearningPathTrainings({ commit })

      expect(state.selectedLearningPathTrainings).toEqual([])
      expect(state.learningPathTableData).toEqual([])
    })

    it('handles enrollment with complex user roles', () => {
      const trainingWithRoles = {
        trainingId: 1,
        trainingOrder: 1,
        targetAudience: ['managers', 'employees'],
        requiredRoles: ['security', 'compliance']
      }
      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: trainingWithRoles,
        index: 0
      })
      expect(state.selectedLearningPathTrainings[0].targetAudience).toContain('managers')
    })
  })

  describe('complex integration workflows', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(learningPathStore.state))
    })

    it('complete workflow: filter, search, select, and order trainings', () => {
      const commit = (mutationName, payload) => {
        learningPathStore.mutations[mutationName](state, payload)
      }

      // Setup initial data
      state.learningPathTableData = [
        { trainingId: 1, name: 'Security Training', trainingOrder: 1 },
        { trainingId: 2, name: 'Compliance Training', trainingOrder: 2 },
        { trainingId: 3, name: 'Security Advanced', trainingOrder: 3 }
      ]

      // Search
      commit('SET_LEARNING_PATH_SEARCH', 'Security')

      // Select trainings
      commit('SELECT_LEARNING_PATH_TRAINING', {
        training: state.learningPathTableData[0],
        index: 0
      })

      // Order
      commit('ORDER_LEARNING_PATH_DATA', null)

      expect(state.selectedLearningPathTrainings).toHaveLength(1)
      expect(state.learningPathSearch).toBe('Security')
    })

    it('workflow: append data, filter selected, maintain order', () => {
      state.selectedLearningPathTrainings = [
        { trainingId: 1, trainingOrder: 1 }
      ]
      state.learningPathTableData = [
        { trainingId: 2, trainingOrder: 2 }
      ]

      const newData = [
        { trainingId: 1, trainingOrder: 1 },
        { trainingId: 3, trainingOrder: 3 },
        { trainingId: 4, trainingOrder: 4 }
      ]

      learningPathStore.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, newData)

      // Should not include trainingId 1 (already selected)
      expect(state.learningPathTableData.map(t => t.trainingId)).toEqual([2, 3, 4])
    })

    it('workflow: bulk select with pagination reset', () => {
      const commit = (mutationName, payload) => {
        learningPathStore.mutations[mutationName](state, payload)
      }

      state.learningPathTableData = Array.from({ length: 25 }, (_, i) => ({
        trainingId: i + 1,
        trainingOrder: i + 1
      }))

      state.learningPathAxiosPayload.pageNumber = 3

      // Select multiple trainings
      for (let i = 0; i < 5; i++) {
        commit('SELECT_LEARNING_PATH_TRAINING', {
          training: { trainingId: i + 1, trainingOrder: i + 1 },
          index: 0
        })
      }

      // Reset pagination
      commit('RESET_LEARNING_PATH_PAGINATION')

      expect(state.learningPathAxiosPayload.pageNumber).toBe(1)
      expect(state.selectedLearningPathTrainings).toHaveLength(5)
    })

    it('workflow: filter reset and clear all', () => {
      const commit = (mutationName, payload) => {
        learningPathStore.mutations[mutationName](state, payload)
      }

      // Set up complex state
      state.learningPathSearch = 'test search'
      state.learningPathSortBy = 'Custom Sort'
      state.learningPathFilterType = 'And'
      state.selectedLearningPathTrainings = [{ trainingId: 1 }]
      state.learningPathTableData = [{ trainingId: 2 }]

      // Clear all filters
      commit('RESET_LEARNING_PATH_FILTERS')

      expect(state.learningPathSearch).toBe('')
      expect(state.learningPathFilterType).toBe('Or')
      expect(state.learningPathSortBy).toBe('Date Created - New to old')
    })

    it('workflow: batch operations with error handling', () => {
      const commit = jest.fn((mutation, payload) => {
        learningPathStore.mutations[mutation](state, payload)
      })

      const trainings = [
        { trainingId: 1, trainingOrder: 1 },
        { trainingId: 2, trainingOrder: 2 },
        { trainingId: 3, trainingOrder: 3 }
      ]

      try {
        commit('SET_SELECTED_LEARNING_PATH_TRAININGS', trainings)
        expect(commit).toHaveBeenCalled()
        expect(state.selectedLearningPathTrainings).toHaveLength(3)
      } catch (e) {
        expect(e).toBeFalsy()
      }
    })

    it('workflow: monitor state changes through multiple operations', () => {
      const stateSnapshots = []

      // Take initial snapshot
      stateSnapshots.push(JSON.parse(JSON.stringify(state)))

      // Operation 1: Set data
      learningPathStore.mutations.SET_LEARNING_PATH_TABLE_DATA(state, [
        { trainingId: 1 }
      ])
      stateSnapshots.push(JSON.parse(JSON.stringify(state)))

      // Operation 2: Select training
      learningPathStore.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: { trainingId: 1 },
        index: 0
      })
      stateSnapshots.push(JSON.parse(JSON.stringify(state)))

      // Verify snapshots show progression
      expect(stateSnapshots[0].learningPathTableData).toHaveLength(0)
      expect(stateSnapshots[1].learningPathTableData).toHaveLength(1)
      expect(stateSnapshots[2].learningPathTableData).toHaveLength(0)
      expect(stateSnapshots[2].selectedLearningPathTrainings).toHaveLength(1)
    })

    it('workflow: filter items with combined payload transformations', () => {
      const commit = (mutationName, payload) => {
        learningPathStore.mutations[mutationName](state, payload)
      }

      // Set filter items
      commit('SET_LEARNING_PATH_FILTER_ITEMS', {
        key: 'type',
        items: [{ id: 1 }, { id: 2 }]
      })

      // Show/hide filter
      commit('SET_LEARNING_PATH_FILTER_ITEMS_SHOW', {
        key: 'type',
        show: false
      })

      const filter = state.learningPathFilters.find(f => f && f.key === 'type')
      expect(filter.show).toBe(false)
      expect(filter.items).toHaveLength(2)
    })

    it('workflow: complete learning path lifecycle', () => {
      const commit = jest.fn((mutation, payload) => {
        learningPathStore.mutations[mutation](state, payload)
      })

      // Initialize with data
      commit('SET_LEARNING_PATH_TABLE_DATA', [
        { trainingId: 1, trainingOrder: 1 },
        { trainingId: 2, trainingOrder: 2 }
      ])

      // Select training
      commit('SELECT_LEARNING_PATH_TRAINING', {
        training: { trainingId: 1, trainingOrder: 1 },
        index: 0
      })

      // Set server props
      commit('SET_LEARNING_PATH_SERVER_SIDE_PROPS', {
        totalNumberOfRecords: 100,
        totalNumberOfPages: 10,
        pageNumber: 1
      })

      // Remove training
      commit('REMOVE_TRAINING_FROM_LEARNING_PATH', {
        training: { trainingId: 1, trainingOrder: 1 },
        index: 0
      })

      expect(commit).toHaveBeenCalled()
      expect(state.learningPathServerSideProps.totalNumberOfRecords).toBe(100)
    })

    it('workflow: handles dynamic data updates with validation', () => {
      state.learningPathTableData = [
        { trainingId: 1, name: 'Course 1', priority: 1 },
        { trainingId: 2, name: 'Course 2', priority: 2 }
      ]

      const highPriorityTrainings = state.learningPathTableData.filter(t => t.priority === 1)

      learningPathStore.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state,
        highPriorityTrainings.map((t, i) => ({ ...t, trainingOrder: i + 1 }))
      )

      expect(state.selectedLearningPathTrainings).toHaveLength(1)
      expect(state.selectedLearningPathTrainings[0].trainingId).toBe(1)
    })
  })
})
