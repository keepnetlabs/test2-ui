jest.mock('@/utils/functions', () => ({
  cancellableAxiosRequest: jest.fn((fn) => (...args) => fn(...args)),
  createRandomCryptStringNumber: jest.fn(() => '1'),
  getDefaultAxiosPayload: jest.fn((payload) => ({
    pageNumber: 1,
    pageSize: payload?.pageSize || 10,
    ascending: payload?.ascending,
    orderBy: payload?.orderBy,
    trainingSearchType: payload?.trainingSearchType,
    trainingType: payload?.trainingType ?? null,
    trainingId: payload?.trainingId || '',
    filter:
      payload?.filter || {
        Condition: 'AND',
        FilterGroups: [
          { Condition: 'AND', FilterItems: [], FilterGroups: [] },
          { Condition: 'OR', FilterItems: [], FilterGroups: [] }
        ]
      }
  }))
}))

jest.mock('@/api/awarenessEducator', () => ({
  searchTraining: jest.fn(),
  getTrainingTypeCount: jest.fn()
}))

import trainingLibrary from '@/store/modules/trainingLibrary'
import * as AwarenessEducatorService from '@/api/awarenessEducator'
import {
  TRAINING_LIBRARY_MAIN_TABS,
  TRAINING_LIBRARY_PAYLOAD_TYPES,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_SEARCH_TYPES } from '@/components/TrainingLibrary/utils'

const createState = () => JSON.parse(JSON.stringify(trainingLibrary.state))

describe('trainingLibrary store module (real)', () => {
  const flushPromises = () => new Promise((resolve) => setImmediate(resolve))
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('module structure', () => {
    it('should have mutations defined', () => {
      expect(trainingLibrary.mutations).toBeDefined()
    })

    it('should have actions defined', () => {
      expect(trainingLibrary.actions).toBeDefined()
    })

    it('should have state defined', () => {
      expect(trainingLibrary.state).toBeDefined()
    })

    it('should have getters defined', () => {
      expect(trainingLibrary.getters).toBeDefined()
    })
  })

  describe('mutations', () => {
    describe('list view mutations', () => {
      it('SET_LIST_VIEW updates page sizes and list view flag', () => {
      const state = createState()
      state.isListView = true
      state.serverSideProps.pageSize = 10
      state.axiosPayload.pageSize = 10

        trainingLibrary.mutations.SET_LIST_VIEW(state, false)

        expect(state.isListView).toBe(false)
        expect(state.serverSideProps.pageSize).toBe(9)
        expect(state.axiosPayload.pageSize).toBe(9)
      })
    })

    describe('table settings mutations', () => {
      it('SET_DEFAULT_TABLE_SETTINGS reads localStorage settings', () => {
        const state = createState()
        const storedColumns = [
          state.tableColumns[0].property,
          state.tableColumns[1].property
        ]
        const allColumns = state.tableColumns.map((c) => c.property)

        localStorage.setItem(
          'training-library-columns',
          JSON.stringify({
            renderedColumns: storedColumns,
            firstColFixed: true,
            lastColFixed: false
          })
        )

        trainingLibrary.mutations.SET_DEFAULT_TABLE_SETTINGS(state)

        const visibleCols = state.tableColumns.filter((c) => c.show).map((c) => c.property)
        expect(visibleCols).toEqual(allColumns)
        expect(state.renderedColumns).toEqual(allColumns)
        expect(state.firstColFixed).toBe(true)
        expect(state.lastColFixed).toBe(false)
      })
    })

    describe('search payload mutations', () => {
      it('SET_SEARCH_TO_PAYLOAD adds or updates search filter and resets page', () => {
        const state = createState()
        state.search = 'phishing'
        state.axiosPayload.pageNumber = 3
        state.serverSideProps.pageNumber = 2

        trainingLibrary.mutations.SET_SEARCH_TO_PAYLOAD(state)

        const items = state.axiosPayload.filter.FilterGroups[1].FilterItems
        expect(items).toEqual([
          { FieldName: 'trainingName', Value: 'phishing', Operator: 'Contains' }
        ])
        expect(state.axiosPayload.pageNumber).toBe(1)
        expect(state.serverSideProps.pageNumber).toBe(1)

        state.search = 'security'
        trainingLibrary.mutations.SET_SEARCH_TO_PAYLOAD(state)
        expect(items[0].Value).toBe('security')
      })
    })

    describe('filter payload mutations', () => {
      it('SET_FILTER_TO_PAYLOAD handles between operator and updates render key', () => {
        const state = createState()
        const payload = {
          key: 'dateCreated',
          activeValue: ['2025-01-01', '2025-01-31'],
          activeOperator: 'between'
        }

        trainingLibrary.mutations.SET_FILTER_TO_PAYLOAD(state, payload)

        const items = state.axiosPayload.filter.FilterGroups[0].FilterItems
        const betweenItems = items.filter((i) => i.FieldName === 'dateCreated')
        expect(betweenItems).toHaveLength(2)
        expect(betweenItems[0].Operator).toBe('>=')
        expect(betweenItems[1].Operator).toBe('<=')
        expect(state.tableFilterRenderKey.startsWith('table-filter-render-key-')).toBe(true)
      })

      it('REMOVE_FILTER_FROM_PAYLOAD removes between operator entries', () => {
        const state = createState()
        state.axiosPayload.filter.FilterGroups[0].FilterItems = [
          { FieldName: 'dateCreated', Value: '2025-01-01', Operator: '>=' },
          { FieldName: 'dateCreated', Value: '2025-01-31', Operator: '<=' }
        ]

        trainingLibrary.mutations.REMOVE_FILTER_FROM_PAYLOAD(state, {
          key: 'dateCreated',
          filterType: 'date',
          activeOperator: 'between'
        })

        const items = state.axiosPayload.filter.FilterGroups[0].FilterItems
        expect(items).toHaveLength(0)
      })

      it('SET_FILTER_TYPE_TO_PAYLOAD syncs condition', () => {
        const state = createState()
        state.filterType = 'AND'

        trainingLibrary.mutations.SET_FILTER_TYPE_TO_PAYLOAD(state)

        expect(state.axiosPayload.filter.FilterGroups[0].Condition).toBe('AND')
      })

      it('SET_DEFAULT_TABLE_FILTERS uses defaults when localStorage is empty', () => {
        const state = createState()
        state.filterType = 'AND'
        state.axiosPayload.filter.FilterGroups[0].Condition = 'AND'

        trainingLibrary.mutations.SET_DEFAULT_TABLE_FILTERS(state)

        expect(state.filterType).toBe('Or')
        expect(state.axiosPayload.filter.FilterGroups[0].Condition).toBe('Or')
      })
    })
  })

  describe('actions', () => {
    describe('data loading actions', () => {
      it('callForTableData enriches languages and targetAudience', async () => {
        const state = createState()
        const commit = jest.fn()
        const rootGetters = {
          'trainingLibraryHelpers/getLanguages': [
            { code: 'EN', isoFriendlyName: 'English' },
            { code: 'TR', isoFriendlyName: 'Turkish' }
          ]
        }

        AwarenessEducatorService.searchTraining.mockResolvedValue({
          data: {
            data: {
              results: [
                {
                  trainingId: 't1',
                  languages: ['EN', 'TR'],
                  trainingRoles: [{ roleName: 'Admins' }]
                }
              ],
              totalNumberOfRecords: 1,
              totalNumberOfPages: 1,
              pageNumber: 1
            }
          }
        })

        await trainingLibrary.actions.callForTableData({ commit, state, rootGetters })

        expect(commit).toHaveBeenCalledWith('SET_TABLE_DATA', [
          {
            trainingId: 't1',
            languages: ['English', 'Turkish'],
            languageCodes: ['EN', 'TR'],
            trainingRoles: [{ roleName: 'Admins' }],
            targetAudience: ['Admins']
          }
        ])
        expect(commit).toHaveBeenCalledWith('SET_SERVER_SIDE_PROPS', {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        })
      })

      it('callForSummary maps training counts to sub tabs', async () => {
        const state = createState()
        const commit = jest.fn()

        AwarenessEducatorService.getTrainingTypeCount.mockResolvedValue({
          data: {
            data: [
              { trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING, trainingCount: 2 },
              { trainingType: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER, trainingCount: 3 }
            ]
          }
        })

        await trainingLibrary.actions.callForSummary({ commit, state })

        expect(commit).toHaveBeenCalledWith('SET_TRAINING_SUB_TABS', [
          { name: TRAINING_LIBRARY_TYPES.ALL_TYPES, totalCount: 5 },
          { name: TRAINING_LIBRARY_TYPES.LEARNING_PATH, totalCount: 0 },
          { name: TRAINING_LIBRARY_TYPES.TRAINING, totalCount: 2 },
          { name: TRAINING_LIBRARY_TYPES.POSTER, totalCount: 3 },
          { name: TRAINING_LIBRARY_TYPES.INFOGRAPHIC, totalCount: 0 },
          { name: TRAINING_LIBRARY_TYPES.SCREENSAVER, totalCount: 0 },
          { name: TRAINING_LIBRARY_TYPES.SURVEY, totalCount: 0 }
        ])
      })

      it('callForTableData keeps loading true when request is aborted (empty response)', async () => {
        const state = createState()
        const commit = jest.fn()
        const rootGetters = { 'trainingLibraryHelpers/getLanguages': [] }

        AwarenessEducatorService.searchTraining.mockResolvedValue({})

        trainingLibrary.actions.callForTableData({ commit, state, rootGetters })
        await flushPromises()

        expect(commit).toHaveBeenCalledWith('SET_IS_LOADING', true)
        expect(commit).not.toHaveBeenCalledWith('SET_IS_LOADING', false)
        expect(commit).not.toHaveBeenCalledWith('SET_TABLE_DATA', expect.anything())
      })

      it('callForTableData falls back to language code and empty targetAudience', async () => {
        const state = createState()
        const commit = jest.fn()
        const rootGetters = {
          'trainingLibraryHelpers/getLanguages': [{ code: 'TR', isoFriendlyName: 'Turkish' }]
        }

        AwarenessEducatorService.searchTraining.mockResolvedValue({
          data: {
            data: {
              results: [{ trainingId: 'x1', languages: ['ZZ', 'TR'] }],
              totalNumberOfRecords: 1,
              totalNumberOfPages: 1,
              pageNumber: 1
            }
          }
        })

        trainingLibrary.actions.callForTableData({ commit, state, rootGetters })
        await flushPromises()

        expect(commit).toHaveBeenCalledWith('SET_TABLE_DATA', [
          {
            trainingId: 'x1',
            languages: ['ZZ', 'Turkish'],
            languageCodes: ['ZZ', 'TR'],
            targetAudience: []
          }
        ])
      })

      it('callForTableData handles item.languages undefined', async () => {
        const state = createState()
        const commit = jest.fn()
        const rootGetters = { 'trainingLibraryHelpers/getLanguages': [] }

        AwarenessEducatorService.searchTraining.mockResolvedValue({
          data: {
            data: {
              results: [{ trainingId: 't2', trainingRoles: [] }],
              totalNumberOfRecords: 1,
              totalNumberOfPages: 1,
              pageNumber: 1
            }
          }
        })

        trainingLibrary.actions.callForTableData({ commit, state, rootGetters })
        await flushPromises()

        expect(commit).toHaveBeenCalledWith('SET_TABLE_DATA', [
          expect.objectContaining({
            trainingId: 't2',
            languageCodes: [],
            languages: [],
            targetAudience: []
          })
        ])
      })
    })

    describe('view and selection actions', () => {
      it('setListView updates sort payload and triggers fetch', () => {
        const state = createState()
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setListView({ commit, dispatch, state }, false)

        expect(commit).toHaveBeenCalledWith('SET_LIST_VIEW', false)
        expect(commit).toHaveBeenCalledWith('SET_SORT_BY', 'Date Created - New to old')
        expect(commit).toHaveBeenCalledWith('SET_SORT_BY_TO_PAYLOAD', {
          ascending: false,
          orderBy: 'createTime'
        })
        expect(dispatch).toHaveBeenCalledWith('callForTableData')
      })

      it('setSelectedTrainingContent updates search type and reloads', () => {
        const state = createState()
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setSelectedTrainingContent(
          { commit, dispatch, state },
          { name: TRAINING_LIBRARY_MAIN_TABS.MOST_POPULAR }
        )

        expect(commit).toHaveBeenCalledWith(
          'SET_SELECTED_TRAINING_CONTENT',
          TRAINING_LIBRARY_MAIN_TABS.MOST_POPULAR
        )
        expect(commit).toHaveBeenCalledWith(
          'SET_TRAINING_SEARCH_TYPE',
          TRAINING_LIBRARY_SEARCH_TYPES.MostPopular
        )
        expect(commit).toHaveBeenCalledWith('RESET_PAGINATION')
        expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')
      })

      it('setSubSelectedTrainingContent updates type and reloads', () => {
        const state = createState()
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setSubSelectedTrainingContent(
          { commit, dispatch, state },
          { name: TRAINING_LIBRARY_TYPES.TRAINING }
        )

        expect(commit).toHaveBeenCalledWith(
          'SET_SUB_SELECTED_TRAINING_CONTENT',
          TRAINING_LIBRARY_TYPES.TRAINING
        )
        expect(commit).toHaveBeenCalledWith(
          'SET_TRAINING_TYPE',
          TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
        )
        expect(commit).toHaveBeenCalledWith('RESET_PAGINATION')
        expect(commit).toHaveBeenCalledWith('SET_SORT_BY', 'Date Created - New to old')
        expect(commit).toHaveBeenCalledWith('SET_SORT_BY_TO_PAYLOAD', {
          ascending: false,
          orderBy: 'createTime'
        })
        expect(dispatch).toHaveBeenCalledWith('callForTableData')
        expect(dispatch).toHaveBeenCalledWith('callForSummary', { hideLoader: true })
      })

      it('setListView returns early when value is unchanged', () => {
        const state = createState()
        state.isListView = true
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setListView({ commit, dispatch, state }, true)

        expect(commit).not.toHaveBeenCalled()
        expect(dispatch).not.toHaveBeenCalled()
      })

      it('setSelectedTrainingContent returns early when selected tab is unchanged', () => {
        const state = createState()
        state.selectedTrainingContent = TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setSelectedTrainingContent(
          { commit, dispatch, state },
          { name: TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS }
        )

        expect(commit).not.toHaveBeenCalled()
        expect(dispatch).not.toHaveBeenCalled()
      })

      it('setSubSelectedTrainingContent returns early when selected sub tab is unchanged', () => {
        const state = createState()
        state.selectedSubTrainingContent = TRAINING_LIBRARY_TYPES.ALL_TYPES
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setSubSelectedTrainingContent(
          { commit, dispatch, state },
          { name: TRAINING_LIBRARY_TYPES.ALL_TYPES }
        )

        expect(commit).not.toHaveBeenCalled()
        expect(dispatch).not.toHaveBeenCalled()
      })

      it('setSelectedTrainingContent covers all search type branches', () => {
        const state = createState()
        const commit = jest.fn()
        const dispatch = jest.fn()
        state.selectedTrainingContent = '__different__'

        trainingLibrary.actions.setSelectedTrainingContent(
          { commit, dispatch, state },
          { name: TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS }
        )
        expect(commit).toHaveBeenCalledWith(
          'SET_TRAINING_SEARCH_TYPE',
          TRAINING_LIBRARY_SEARCH_TYPES.All
        )

        commit.mockClear()
        state.selectedTrainingContent = 'Something Else'
        trainingLibrary.actions.setSelectedTrainingContent(
          { commit, dispatch, state },
          { name: TRAINING_LIBRARY_MAIN_TABS.FAVOURITES }
        )
        expect(commit).toHaveBeenCalledWith(
          'SET_TRAINING_SEARCH_TYPE',
          TRAINING_LIBRARY_SEARCH_TYPES.Favourites
        )

        commit.mockClear()
        state.selectedTrainingContent = 'Something Else Again'
        trainingLibrary.actions.setSelectedTrainingContent(
          { commit, dispatch, state },
          { name: 'Created By Me Tab' }
        )
        expect(commit).toHaveBeenCalledWith(
          'SET_TRAINING_SEARCH_TYPE',
          TRAINING_LIBRARY_SEARCH_TYPES.CreatedByMe
        )
      })

      it('setSortBy commits sort mapping and dispatches table data reload', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setSortBy(
          { commit, dispatch },
          {
            item: { text: 'Name', orderBy: 'name' },
            sort: { text: 'A-Z', ascending: true }
          }
        )

        expect(commit).toHaveBeenNthCalledWith(1, 'SET_SORT_BY', 'Name - A-Z')
        expect(commit).toHaveBeenNthCalledWith(2, 'SET_SORT_BY_TO_PAYLOAD', {
          ascending: true,
          orderBy: 'name'
        })
        expect(dispatch).toHaveBeenCalledWith('callForTableData')
      })

      it('setSubSelectedTrainingContent covers remaining type branches', () => {
        const state = createState()
        const commit = jest.fn()
        const dispatch = jest.fn()
        const cases = [
          [TRAINING_LIBRARY_TYPES.LEARNING_PATH, TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH],
          [TRAINING_LIBRARY_TYPES.POSTER, TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER],
          [TRAINING_LIBRARY_TYPES.INFOGRAPHIC, TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC],
          [TRAINING_LIBRARY_TYPES.SCREENSAVER, TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER],
          [TRAINING_LIBRARY_TYPES.SURVEY, TRAINING_LIBRARY_PAYLOAD_TYPES.SURVEY]
        ]

        cases.forEach(([name, expectedType]) => {
          state.selectedSubTrainingContent = '__different__'
          trainingLibrary.actions.setSubSelectedTrainingContent(
            { commit, dispatch, state },
            { name }
          )
          expect(commit).toHaveBeenCalledWith('SET_TRAINING_TYPE', expectedType)
          commit.mockClear()
        })
      })
    })

    describe('filter actions', () => {
      it('setFilterType updates payload, resets pagination and fetches', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setFilterType({ commit, dispatch }, 'AND')

        expect(commit).toHaveBeenCalledWith('SET_FILTER_TYPE', 'AND')
        expect(commit).toHaveBeenCalledWith('SET_FILTER_TYPE_TO_PAYLOAD')
        expect(commit).toHaveBeenCalledWith('RESET_PAGINATION')
        expect(dispatch).toHaveBeenCalledWith('callForTableData')
      })

      it('setFilterItemsShow forwards to learningPath module', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()
        const payload = { key: 'type', show: true }

        trainingLibrary.actions.setFilterItemsShow({ commit, dispatch }, payload)

        expect(commit).toHaveBeenCalledWith('SET_FILTER_ITEMS_SHOW', payload)
        expect(dispatch).toHaveBeenCalledWith(
          'learningPath/setLearningPathFilterItemsShow',
          payload,
          { root: true }
        )
      })

      it('restoreDefaultFilters uses saved filters when localStorage exists', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()
        localStorage.setItem('training-library-filters', JSON.stringify({ saved: true }))

        trainingLibrary.actions.restoreDefaultFilters({ commit, dispatch })

        expect(commit).toHaveBeenCalledWith('SET_DEFAULT_TABLE_FILTERS')
        expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')
      })

      it('clearAllFilters resets filters and reloads training library', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.clearAllFilters({ commit, dispatch })

        expect(commit).toHaveBeenCalledWith('RESET_FILTERS')
        expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')
      })

      it('resetState resets table params and filters', () => {
        const commit = jest.fn()

        trainingLibrary.actions.resetState({ commit })

        expect(commit).toHaveBeenNthCalledWith(1, 'RESET_TABLE_PARAMS')
        expect(commit).toHaveBeenNthCalledWith(2, 'RESET_FILTERS')
      })

      it('restoreDefaultFilters resets filters when localStorage is missing', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()
        localStorage.removeItem('training-library-filters')

        trainingLibrary.actions.restoreDefaultFilters({ commit, dispatch })

        expect(commit).toHaveBeenCalledWith('RESET_FILTERS')
        expect(dispatch).toHaveBeenCalledWith('callForTrainingLibrary')
      })
    })

    describe('modal management actions', () => {
      it('setNewLearningPathModal closes and resets learning path selection', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setNewLearningPathModal(
          { commit, dispatch },
          { status: false }
        )

        expect(commit).toHaveBeenCalledWith('SET_NEW_LEARNING_PATH_MODAL', { status: false })
        expect(dispatch).toHaveBeenCalledWith(
          'learningPath/resetSelectedLearningPathTrainings',
          undefined,
          { root: true }
        )
      })

      it('setNewLearningPathModal does not dispatch reset when status is true', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.setNewLearningPathModal(
          { commit, dispatch },
          { status: true }
        )

        expect(commit).toHaveBeenCalledWith('SET_NEW_LEARNING_PATH_MODAL', { status: true })
        expect(dispatch).not.toHaveBeenCalled()
      })

      it('resetAllModals resets all modal states', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        trainingLibrary.actions.resetAllModals({ commit, dispatch })

        expect(dispatch).toHaveBeenCalledWith(
          'learningPath/resetSelectedLearningPathTrainings',
          undefined,
          { root: true }
        )
        expect(commit).toHaveBeenCalledWith('SET_DELETE_DIALOG', expect.any(Object))
        expect(commit).toHaveBeenCalledWith('SET_TRAINING_PREVIEW_DIALOG', expect.any(Object))
        expect(commit).toHaveBeenCalledWith('SET_POSTER_PREVIEW_DIALOG', expect.any(Object))
      })
    })
  })
})
