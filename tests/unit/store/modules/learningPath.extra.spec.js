jest.mock('@/utils/functions', () => ({
  getDefaultAxiosPayload: jest.fn((payload) => ({
    pageNumber: 1,
    pageSize: payload?.pageSize || 10,
    filter: payload?.filter || { Condition: 'AND', FilterGroups: [] },
    trainingSearchType: payload?.trainingSearchType,
    trainingType: payload?.trainingType,
    trainingId: payload?.trainingId || ''
  }))
}))

jest.mock('@/api/awarenessEducator', () => ({
  searchTraining: jest.fn()
}))

import learningPath from '@/store/modules/learningPath'
import * as AwarenessEducatorService from '@/api/awarenessEducator'

const createState = () => JSON.parse(JSON.stringify(learningPath.state))

describe('learningPath store module (real)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('module structure', () => {
    it('should have mutations defined', () => {
      expect(learningPath.mutations).toBeDefined()
    })
    it('should have actions defined', () => {
      expect(learningPath.actions).toBeDefined()
    })
    it('should have state defined', () => {
      expect(learningPath.state).toBeDefined()
    })
  })

  describe('getters', () => {
    it('getLearningPathFilterType returns filterType', () => {
      const state = createState()
      state.learningPathFilterType = 'And'
      expect(learningPath.getters.getLearningPathFilterType(state)).toBe('And')
    })
    it('getLearningPathSortBy returns sortBy', () => {
      const state = createState()
      state.learningPathSortBy = 'Name - A-Z'
      expect(learningPath.getters.getLearningPathSortBy(state)).toBe('Name - A-Z')
    })
    it('getLearningPathSearch returns search', () => {
      const state = createState()
      state.learningPathSearch = 'test'
      expect(learningPath.getters.getLearningPathSearch(state)).toBe('test')
    })
    it('getLearningPathFilters returns filters array', () => {
      const state = createState()
      expect(learningPath.getters.getLearningPathFilters(state)).toEqual(state.learningPathFilters)
    })
    it('getLearningPathTrainings returns table data', () => {
      const state = createState()
      state.learningPathTableData = [{ trainingId: 't1' }]
      expect(learningPath.getters.getLearningPathTrainings(state)).toEqual([{ trainingId: 't1' }])
    })
    it('getSelectedLearningPathTrainings returns selected', () => {
      const state = createState()
      state.selectedLearningPathTrainings = [{ trainingId: 's1' }]
      expect(learningPath.getters.getSelectedLearningPathTrainings(state)).toEqual([
        { trainingId: 's1' }
      ])
    })
  })

  describe('mutations', () => {
    describe('data ordering and search mutations', () => {
      it('ORDER_LEARNING_PATH_DATA sorts unavailable trainings to the end', () => {
      const state = createState()
      state.learningPathTableData = [
        { trainingId: 1, availableFor: ['SomeOtherCompany'] },
        { trainingId: 2, availableFor: ['MyCompanyOnly'] }
      ]

        learningPath.mutations.ORDER_LEARNING_PATH_DATA(state, ['MyCompanyOnly'])

        expect(state.learningPathTableData[0].trainingId).toBe(2)
        expect(state.learningPathTableData[1].trainingId).toBe(1)
      })
    })

    describe('filter payload mutations', () => {
      it('SET_LEARNING_PATH_FILTER_TO_PAYLOAD handles between operator', () => {
      const state = createState()
      const payload = {
        key: 'dateCreated',
        activeValue: ['2025-01-01', '2025-01-31'],
        activeOperator: 'between',
        filterType: 'date'
      }

      learningPath.mutations.SET_LEARNING_PATH_FILTER_TO_PAYLOAD(state, payload)

      const items = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
      const betweenItems = items.filter((item) => item.FieldName === 'dateCreated')
      expect(betweenItems).toHaveLength(2)
      expect(betweenItems[0].Operator).toBe('>=')
      expect(betweenItems[1].Operator).toBe('<=')
    })

    it('REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD removes between operator entries', () => {
      const state = createState()
      state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems = [
        { FieldName: 'dateCreated', Value: '2025-01-01', Operator: '>=' },
        { FieldName: 'dateCreated', Value: '2025-01-31', Operator: '<=' }
      ]

      learningPath.mutations.REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD(state, {
        key: 'dateCreated',
        filterType: 'date',
        activeOperator: 'between'
      })

      const items = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
      expect(items).toHaveLength(0)
    })

    it('SET_LEARNING_PATH_SEARCH_TO_PAYLOAD updates existing search filter and resets page', () => {
      const state = createState()
      state.learningPathSearch = 'new term'
      state.learningPathAxiosPayload.filter.FilterGroups[1].FilterItems = [
        { FieldName: 'trainingName', Value: 'old term', Operator: 'Contains' }
      ]
      state.learningPathAxiosPayload.pageNumber = 2
      state.learningPathServerSideProps.pageNumber = 3

      learningPath.mutations.SET_LEARNING_PATH_SEARCH_TO_PAYLOAD(state)

      const items = state.learningPathAxiosPayload.filter.FilterGroups[1].FilterItems
      expect(items).toHaveLength(1)
      expect(items[0].Value).toBe('new term')
      expect(state.learningPathAxiosPayload.pageNumber).toBe(1)
      expect(state.learningPathServerSideProps.pageNumber).toBe(1)
    })

    it('SET_LEARNING_PATH_SEARCH_TO_PAYLOAD adds search filter when missing', () => {
      const state = createState()
      state.learningPathSearch = 'added'
      state.learningPathAxiosPayload.filter.FilterGroups[1].FilterItems = []

      learningPath.mutations.SET_LEARNING_PATH_SEARCH_TO_PAYLOAD(state)

      const items = state.learningPathAxiosPayload.filter.FilterGroups[1].FilterItems
      expect(items).toEqual([
        { FieldName: 'trainingName', Value: 'added', Operator: 'Contains' }
      ])
    })

    it('SET_LEARNING_PATH_FILTER_TO_PAYLOAD trims string values and maps targetAudience to roles', () => {
      const state = createState()
      const payload = {
        key: 'targetAudience',
        activeValue: '  Admin ',
        activeOperator: 'Include'
      }

      learningPath.mutations.SET_LEARNING_PATH_FILTER_TO_PAYLOAD(state, payload)

      const items = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
      const item = items.find((f) => f.FieldName === 'roles')
      expect(item).toEqual({ FieldName: 'roles', Value: 'Admin', Operator: 'Include' })
    })

    it('SET_LEARNING_PATH_FILTER_TO_PAYLOAD joins array values', () => {
      const state = createState()
      const payload = {
        key: 'vendor',
        activeValue: ['A', 'B'],
        activeOperator: 'Contains'
      }

      learningPath.mutations.SET_LEARNING_PATH_FILTER_TO_PAYLOAD(state, payload)

      const items = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
      const item = items.find((f) => f.FieldName === 'vendor')
      expect(item.Value).toBe('A,B')
    })

    it('REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD resets type filter when activeValue is empty', () => {
      const state = createState()
      state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems = [
        { FieldName: 'type', Value: '2', Operator: 'Include' }
      ]

      learningPath.mutations.REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD(state, {
        key: 'type',
        activeValue: []
      })

      const items = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
      expect(items[0]).toEqual({
        FieldName: 'type',
        Value: '1,3,4',
        Operator: 'Include'
      })
    })

    it('REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD removes search filter when activeValue empty', () => {
      const state = createState()
      state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems = [
        { FieldName: 'vendor', Value: 'A', Operator: 'Include' }
      ]

      learningPath.mutations.REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD(state, {
        key: 'vendor',
        filterType: 'search',
        activeValue: []
      })

      const items = state.learningPathAxiosPayload.filter.FilterGroups[0].FilterItems
      expect(items).toHaveLength(0)
    })

    it('SET_LEARNING_PATH_FILTER_ITEMS updates filter items by key', () => {
      const state = createState()
      const payload = { key: 'type', items: [{ text: 'Training', value: '1' }] }

      learningPath.mutations.SET_LEARNING_PATH_FILTER_ITEMS(state, payload)

      const filter = state.learningPathFilters.find((f) => f.key === 'type')
      expect(filter.items).toEqual([{ text: 'Training', value: '1' }])
    })

    it('SET_LEARNING_PATH_FILTER_ITEMS does not throw when filter key is not found', () => {
      const state = createState()
      const payload = { key: 'nonExistentFilterKey', items: [{ text: 'Item', value: '1' }] }

      expect(() => {
        learningPath.mutations.SET_LEARNING_PATH_FILTER_ITEMS(state, payload)
      }).not.toThrow()
    })

    it('SET_LEARNING_PATH_FILTER_ITEMS does not throw when payload is null', () => {
      const state = createState()
      expect(() => {
        learningPath.mutations.SET_LEARNING_PATH_FILTER_ITEMS(state, null)
      }).not.toThrow()
    })

    it('SET_LEARNING_PATH_FILTER_ITEMS does not throw when learningPathFilters is empty', () => {
      const state = createState()
      state.learningPathFilters = []
      const payload = { key: 'type', items: [{ text: 'Training', value: '1' }] }

      expect(() => {
        learningPath.mutations.SET_LEARNING_PATH_FILTER_ITEMS(state, payload)
      }).not.toThrow()
    })

    it('SET_LEARNING_PATH_FILTER_ITEMS assigns undefined items when payload.items is undefined', () => {
      const state = createState()
      const payload = { key: 'type', items: undefined }

      learningPath.mutations.SET_LEARNING_PATH_FILTER_ITEMS(state, payload)

      const filter = state.learningPathFilters.find((f) => f.key === 'type')
      expect(filter.items).toBeUndefined()
    })

    it('SET_LEARNING_PATH_FILTER_ITEMS_SHOW updates filter show by key', () => {
      const state = createState()
      const payload = { key: 'type', show: true }

      learningPath.mutations.SET_LEARNING_PATH_FILTER_ITEMS_SHOW(state, payload)

      const filter = state.learningPathFilters.find((f) => f.key === 'type')
      expect(filter.show).toBe(true)
    })

    it('SET_LEARNING_PATH_FILTER_ITEMS_SHOW does not throw when filter key is not found', () => {
      const state = createState()
      const payload = { key: 'nonExistentFilterKey', show: true }

      expect(() => {
        learningPath.mutations.SET_LEARNING_PATH_FILTER_ITEMS_SHOW(state, payload)
      }).not.toThrow()
    })

    it('SET_LEARNING_PATH_FILTER_ITEMS_SHOW does not throw when payload is null', () => {
      const state = createState()
      expect(() => {
        learningPath.mutations.SET_LEARNING_PATH_FILTER_ITEMS_SHOW(state, null)
      }).not.toThrow()
    })

    it('SET_FILTER_ITEMS_SHOW does not throw when filter key is not found', () => {
      const state = createState()
      const payload = { key: 'nonExistentFilterKey', show: true }

      expect(() => {
        learningPath.mutations.SET_FILTER_ITEMS_SHOW(state, payload)
      }).not.toThrow()
    })

    it('SET_FILTER_ITEMS_SHOW does not throw when payload is null', () => {
      const state = createState()
      expect(() => {
        learningPath.mutations.SET_FILTER_ITEMS_SHOW(state, null)
      }).not.toThrow()
    })

    it('RESET_SELECTED_LEARNING_PATH_TRAININGS clears selected trainings', () => {
      const state = createState()
      state.selectedLearningPathTrainings = [{ trainingId: 't1' }]

      learningPath.mutations.RESET_SELECTED_LEARNING_PATH_TRAININGS(state)

      expect(state.selectedLearningPathTrainings).toEqual([])
    })

    it('RESET_LEARNING_PATH_DATA clears table data', () => {
      const state = createState()
      state.learningPathTableData = [{ trainingId: 't1' }]

      learningPath.mutations.RESET_LEARNING_PATH_DATA(state)

      expect(state.learningPathTableData).toEqual([])
    })

    it('SET_SELECTED_LEARNING_PATH_TRAININGS sorts by trainingOrder', () => {
      const state = createState()
      const payload = [
        { trainingOrder: 2, trainingId: 't2' },
        { trainingOrder: 1, trainingId: 't1' }
      ]

      learningPath.mutations.SET_SELECTED_LEARNING_PATH_TRAININGS(state, payload)

      expect(state.selectedLearningPathTrainings[0].trainingId).toBe('t1')
      expect(state.selectedLearningPathTrainings[1].trainingId).toBe('t2')
    })

    it('SELECT_LEARNING_PATH_TRAINING moves item from table to selected', () => {
      const state = createState()
      state.learningPathTableData = [{ trainingId: 't1' }, { trainingId: 't2' }]

      learningPath.mutations.SELECT_LEARNING_PATH_TRAINING(state, {
        training: { trainingId: 't2' },
        index: 1
      })

      expect(state.learningPathTableData).toEqual([{ trainingId: 't1' }])
      expect(state.selectedLearningPathTrainings).toEqual([{ trainingId: 't2' }])
    })

    it('SELECT_LEARNING_PATH_TRAINING uses default training and index 0 when not provided', () => {
      const state = createState()
      state.learningPathTableData = [{ trainingId: 't1' }]

      learningPath.mutations.SELECT_LEARNING_PATH_TRAINING(state, {})

      expect(state.learningPathTableData).toHaveLength(0)
      expect(state.selectedLearningPathTrainings).toHaveLength(1)
    })

    it('REMOVE_TRAINING_FROM_LEARNING_PATH moves item back to table', () => {
      const state = createState()
      state.learningPathTableData = [{ trainingId: 't1' }]
      state.selectedLearningPathTrainings = [{ trainingId: 't2' }]

      learningPath.mutations.REMOVE_TRAINING_FROM_LEARNING_PATH(state, {
        training: { trainingId: 't2' },
        index: 0
      })

      expect(state.learningPathTableData[0].trainingId).toBe('t2')
      expect(state.selectedLearningPathTrainings).toEqual([])
    })

    it('REMOVE_TRAINING_FROM_LEARNING_PATH uses default params when not provided', () => {
      const state = createState()
      state.learningPathTableData = []
      state.selectedLearningPathTrainings = [{ trainingId: 't1' }]

      learningPath.mutations.REMOVE_TRAINING_FROM_LEARNING_PATH(state, {})

      expect(state.learningPathTableData).toHaveLength(1)
      expect(state.selectedLearningPathTrainings).toHaveLength(0)
    })

    it('SET_LEARNING_PATH_TABLE_DATA excludes already selected trainings', () => {
      const state = createState()
      state.selectedLearningPathTrainings = [{ trainingId: 't1' }]

      learningPath.mutations.SET_LEARNING_PATH_TABLE_DATA(state, [
        { trainingId: 't1' },
        { trainingId: 't2' }
      ])

      expect(state.learningPathTableData).toEqual([{ trainingId: 't2' }])
    })

      it('APPEND_LEARNING_PATH_TABLE_DATA excludes already selected trainings', () => {
        const state = createState()
        state.learningPathTableData = [{ trainingId: 't0' }]
        state.selectedLearningPathTrainings = [{ trainingId: 't1' }]

        learningPath.mutations.APPEND_LEARNING_PATH_TABLE_DATA(state, [
          { trainingId: 't1' },
          { trainingId: 't2' }
        ])

        expect(state.learningPathTableData).toEqual([{ trainingId: 't0' }, { trainingId: 't2' }])
      })
    })
  })

  describe('actions', () => {
    describe('data loading actions', () => {
    it('callForLearningPathTableData sets trainingIds from payload and commits data', async () => {
      const state = createState()
      const commit = jest.fn()

      AwarenessEducatorService.searchTraining.mockResolvedValue({
        data: {
          data: {
            results: [{ trainingId: 't1' }],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })

      await learningPath.actions.callForLearningPathTableData(
        { commit, state },
        { trainingIds: ['t1'] }
      )

      expect(state.learningPathAxiosPayload.trainingIds).toEqual(['t1'])
      expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_TABLE_DATA', [{ trainingId: 't1' }])
      expect(commit).toHaveBeenCalledWith('ORDER_LEARNING_PATH_DATA')
      expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_SERVER_SIDE_PROPS', {
        totalNumberOfRecords: 1,
        totalNumberOfPages: 1,
        pageNumber: 1
      })
    })

    it('callForLearningPathTableData appends when isAppend is true', async () => {
      const state = createState()
      const commit = jest.fn()

      AwarenessEducatorService.searchTraining.mockResolvedValue({
        data: {
          data: {
            results: [{ trainingId: 't2' }],
            totalNumberOfRecords: 2,
            totalNumberOfPages: 2,
            pageNumber: 2
          }
        }
      })

      await learningPath.actions.callForLearningPathTableData(
        { commit, state },
        { isAppend: true }
      )

      expect(commit).toHaveBeenCalledWith('APPEND_LEARNING_PATH_TABLE_DATA', [{ trainingId: 't2' }])
      expect(commit).toHaveBeenCalledWith('ORDER_LEARNING_PATH_DATA')
    })

    it('callForLearningPathTableData uses selectedLearningPathTrainings when no payload trainingIds', async () => {
      const state = createState()
      state.selectedLearningPathTrainings = [
        { trainingId: 't1', trainingOrder: 1 },
        { detailTrainingId: 't2', trainingOrder: 2 }
      ]
      const commit = jest.fn()

      AwarenessEducatorService.searchTraining.mockResolvedValue({
        data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 1, pageNumber: 1 } }
      })

      await learningPath.actions.callForLearningPathTableData({ commit, state }, {})

      expect(state.learningPathAxiosPayload.trainingIds).toEqual(['t1', 't2'])
    })

    it('callForLearningPathTableData handles empty or malformed API response', async () => {
      const state = createState()
      const commit = jest.fn()

      AwarenessEducatorService.searchTraining.mockResolvedValue({ data: {} })

      await learningPath.actions.callForLearningPathTableData({ commit, state }, {})

      expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_TABLE_DATA', [])
      expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_SERVER_SIDE_PROPS', {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      })
    })
  })

    describe('search, sort and filter actions', () => {
      it('callForLearningPathTrainingLibrary dispatches callForLearningPathTableData', () => {
        const dispatch = jest.fn()

        learningPath.actions.callForLearningPathTrainingLibrary({ dispatch }, { page: 1 })

        expect(dispatch).toHaveBeenCalledWith('callForLearningPathTableData', { page: 1 })
      })

      it('setLearningPathSearch commits search and dispatches reload', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        learningPath.actions.setLearningPathSearch({ commit, dispatch }, 'security')

        expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_SEARCH', 'security')
        expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_SEARCH_TO_PAYLOAD')
        expect(dispatch).toHaveBeenCalledWith('callForLearningPathTrainingLibrary')
      })

      it('getDataAfterValidScroll increments page and dispatches append', () => {
        const state = createState()
        const dispatch = jest.fn()
        state.learningPathAxiosPayload.pageNumber = 1
        state.learningPathServerSideProps.totalNumberOfPages = 3
        state.learningPathSearch = ''

        learningPath.actions.getDataAfterValidScroll({ state, dispatch })

        expect(state.learningPathAxiosPayload.pageNumber).toBe(2)
        expect(dispatch).toHaveBeenCalledWith('callForLearningPathTrainingLibrary', { isAppend: true })
      })

      it('getDataAfterValidScroll does not dispatch when already at last page', () => {
        const state = createState()
        const dispatch = jest.fn()
        state.learningPathAxiosPayload.pageNumber = 3
        state.learningPathServerSideProps.totalNumberOfPages = 3
        state.learningPathSearch = ''

        learningPath.actions.getDataAfterValidScroll({ state, dispatch })

        expect(dispatch).not.toHaveBeenCalled()
        expect(state.learningPathAxiosPayload.pageNumber).toBe(3)
      })

      it('getDataAfterValidScroll does not dispatch when search is active', () => {
        const state = createState()
        const dispatch = jest.fn()
        state.learningPathAxiosPayload.pageNumber = 1
        state.learningPathServerSideProps.totalNumberOfPages = 3
        state.learningPathSearch = 'security'

        learningPath.actions.getDataAfterValidScroll({ state, dispatch })

        expect(dispatch).not.toHaveBeenCalled()
      })

      it('setLearningPathSortBy commits sort payload and dispatches fetch', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        learningPath.actions.setLearningPathSortBy(
          { commit, dispatch },
          { item: { text: 'Name', orderBy: 'trainingName' }, sort: { text: 'A-Z', ascending: true } }
        )

        expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_SORT_BY', 'Name - A-Z')
        expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_SORT_BY_TO_PAYLOAD', {
          ascending: true,
          orderBy: 'trainingName'
        })
        expect(dispatch).toHaveBeenCalledWith('callForLearningPathTableData')
      })

      it('setLearningPathFilterToPayload commits and triggers reload', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        learningPath.actions.setLearningPathFilterToPayload(
          { commit, dispatch },
          { key: 'category', activeValue: ['SocialEngineering'], activeOperator: 'Include' }
        )

        expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_FILTER_TO_PAYLOAD', {
          key: 'category',
          activeValue: ['SocialEngineering'],
          activeOperator: 'Include'
        })
        expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_PAGINATION')
        expect(dispatch).toHaveBeenCalledWith('callForLearningPathTrainingLibrary')
      })

      it('removeLearningPathFilterFromPayload commits and triggers reload', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        learningPath.actions.removeLearningPathFilterFromPayload(
          { commit, dispatch },
          { key: 'vendor', filterType: 'search', activeValue: [] }
        )

        expect(commit).toHaveBeenCalledWith('REMOVE_LEARNING_PATH_FILTER_FROM_PAYLOAD', {
          key: 'vendor',
          filterType: 'search',
          activeValue: []
        })
        expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_PAGINATION')
        expect(dispatch).toHaveBeenCalledWith('callForLearningPathTrainingLibrary')
      })
    })

    describe('reset and management actions', () => {
      it('learningPathClearAllFilters optionally dispatches fetch', () => {
        const commit = jest.fn()
        const dispatch = jest.fn()

        learningPath.actions.learningPathClearAllFilters({ commit, dispatch }, { isFetch: true })

        expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_FILTERS')
        expect(dispatch).toHaveBeenCalledWith('callForLearningPathTrainingLibrary')
      })

      it('resetSelectedLearningPathTrainings resets filters, selections, and data', () => {
        const commit = jest.fn()

        learningPath.actions.resetSelectedLearningPathTrainings({ commit })

        expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_FILTERS')
        expect(commit).toHaveBeenCalledWith('RESET_SELECTED_LEARNING_PATH_TRAININGS')
        expect(commit).toHaveBeenCalledWith('RESET_LEARNING_PATH_DATA')
      })

      it('selectLearningPathTraining commits select mutation', () => {
        const commit = jest.fn()

        learningPath.actions.selectLearningPathTraining({ commit }, { training: { trainingId: 't1' } })

        expect(commit).toHaveBeenCalledWith('SELECT_LEARNING_PATH_TRAINING', {
          training: { trainingId: 't1' }
        })
      })

      it('wrapper actions commit expected mutations', () => {
        const commit = jest.fn()

        learningPath.actions.setLearningPathFilterItemsShow(
          { commit },
          { key: 'vendor', show: true }
        )
        expect(commit).toHaveBeenCalledWith('SET_FILTER_ITEMS_SHOW', {
          key: 'vendor',
          show: true
        })

        commit.mockClear()
        learningPath.actions.setLearningPathModalTrainingPreviewDialog(
          { commit },
          { status: true }
        )
        expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_MODAL_TRAINING_PREVIEW_DIALOG', {
          status: true
        })

        commit.mockClear()
        learningPath.actions.setLearningPathFilterItems(
          { commit },
          { key: 'type', items: [{ text: 'Training', value: 1 }] }
        )
        expect(commit).toHaveBeenCalledWith('SET_LEARNING_PATH_FILTER_ITEMS', {
          key: 'type',
          items: [{ text: 'Training', value: 1 }]
        })

        commit.mockClear()
        learningPath.actions.setSelectedLearningPathTrainings(
          { commit },
          [{ trainingId: 't1', trainingOrder: 1 }]
        )
        expect(commit).toHaveBeenCalledWith('SET_SELECTED_LEARNING_PATH_TRAININGS', [
          { trainingId: 't1', trainingOrder: 1 }
        ])

        commit.mockClear()
        learningPath.actions.removeTrainingFromLearningPath(
          { commit },
          { training: { trainingId: 't1' }, index: 0 }
        )
        expect(commit).toHaveBeenCalledWith('REMOVE_TRAINING_FROM_LEARNING_PATH', {
          training: { trainingId: 't1' },
          index: 0
        })
      })

      it('orderLearningPathData forwards payload to mutation', () => {
        const commit = jest.fn()
        learningPath.actions.orderLearningPathData({ commit }, ['CompanyA'])
        expect(commit).toHaveBeenCalledWith('ORDER_LEARNING_PATH_DATA', ['CompanyA'])
      })
    })
  })
})
