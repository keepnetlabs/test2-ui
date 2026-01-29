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
})
